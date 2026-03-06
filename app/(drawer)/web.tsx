import { ThemedView } from '@/components/themed-view'
import { MediaAsset, useFileSystem } from '@/hooks/use-file-system'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import {
  FlatList,
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(secs: number): string {
  if (!isFinite(secs) || isNaN(secs)) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// ─── Mini album art placeholder ────────────────────────────────────────────────
function AlbumArt({ size = 220 }: { size?: number }) {
  return (
    <LinearGradient
      colors={['#1DB954', '#191414']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.albumArt, { width: size, height: size, borderRadius: size * 0.06 }]}
    >
      <Ionicons name="musical-notes" size={size * 0.38} color="rgba(255,255,255,0.18)" />
    </LinearGradient>
  )
}

// ─── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({
  progress,
  onSeek,
}: {
  progress: number
  onSeek: (ratio: number) => void
}) {
  const [width, setWidth] = useState(0)

  const handleLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)

  const handlePress = (e: GestureResponderEvent) => {
    if (width === 0) return
    const ratio = e.nativeEvent.locationX / width
    onSeek(Math.max(0, Math.min(1, ratio)))
  }

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.progressHitbox}>
      <View style={styles.progressTrack} onLayout={handleLayout}>
        <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
        <View style={[styles.progressThumb, { left: `${Math.min(progress * 100, 100)}%` }]} />
      </View>
    </TouchableOpacity>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function MusicPlayer() {
  const headerHeight = useHeaderHeight()
  const { loading, getMediaAssets } = useFileSystem()

  const [queue, setQueue] = useState<MediaAsset[]>([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [showLibrary, setShowLibrary] = useState(true)

  const current = queue[queueIndex] ?? null

  const player = useAudioPlayer(current ? { uri: current.uri } : '')
  const status = useAudioPlayerStatus(player)

  const duration = status.duration ?? 0
  const position = status.currentTime ?? 0
  const progress = duration > 0 ? position / duration : 0

  // Cargar biblioteca
  const loadLibrary = async () => {
    const assets = await getMediaAssets('audio', 100)
    setQueue(assets)
    setShowLibrary(false)
  }

  // Reproducir canción por índice
  const playIndex = (idx: number) => {
    setQueueIndex(idx)
    player.replace({ uri: queue[idx].uri })
    player.play()
  }

  // Siguiente
  const playNext = () => {
    if (queue.length === 0) return
    let next: number
    if (shuffle) {
      next = Math.floor(Math.random() * queue.length)
    } else {
      next = (queueIndex + 1) % queue.length
    }
    playIndex(next)
  }

  // Anterior
  const playPrev = () => {
    if (queue.length === 0) return
    const prev = (queueIndex - 1 + queue.length) % queue.length
    playIndex(prev)
  }

  // Play / Pause
  const togglePlay = () => {
    if (!current) return
    status.playing ? player.pause() : player.play()
  }

  // Seek
  const handleSeek = (ratio: number) => {
    if (duration > 0) player.seekTo(ratio * duration)
  }

  return (
    <ThemedView style={[styles.screen, { paddingTop: headerHeight }]}>

      {/* ── Player card ── */}
      <LinearGradient colors={['#1a1a2e', '#121212']} style={styles.playerCard}>
        {/* Album art */}
        <View style={styles.artWrapper}>
          <AlbumArt size={200} />
        </View>

        {/* Info */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {current ? current.filename.replace(/\.[^.]+$/, '') : 'Sin canción'}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {current ? 'Música local' : 'Abrí tu biblioteca'}
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <ProgressBar progress={progress} onSeek={handleSeek} />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setShuffle(!shuffle)} style={styles.controlBtn}>
            <Ionicons
              name="shuffle"
              size={22}
              color={shuffle ? '#1DB954' : '#b3b3b3'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={playPrev} style={styles.controlBtn}>
            <Ionicons name="play-skip-back" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
            <Ionicons
              name={status.playing ? 'pause' : 'play'}
              size={30}
              color="#000"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={playNext} style={styles.controlBtn}>
            <Ionicons name="play-skip-forward" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setRepeat(!repeat)} style={styles.controlBtn}>
            <Ionicons
              name="repeat"
              size={22}
              color={repeat ? '#1DB954' : '#b3b3b3'}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── Library ── */}
      {showLibrary ? (
        <TouchableOpacity style={styles.openLibBtn} onPress={loadLibrary}>
          <MaterialCommunityIcons name="music-box-multiple" size={20} color="#1DB954" />
          <Text style={styles.openLibText}>Abrir biblioteca de audio</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 64 }}
          style={styles.list}
          ListHeaderComponent={
            <Text style={styles.listHeader}>BIBLIOTECA · {queue.length} canciones</Text>
          }
          renderItem={({ item, index }) => {
            const isActive = index === queueIndex
            return (
              <TouchableOpacity
                style={[styles.trackRow, isActive && styles.trackRowActive]}
                onPress={() => playIndex(index)}
              >
                <View style={styles.trackNum}>
                  {isActive && status.playing ? (
                    <Ionicons name="volume-high" size={14} color="#1DB954" />
                  ) : (
                    <Text style={[styles.trackNumText, isActive && { color: '#1DB954' }]}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[styles.trackName, isActive && { color: '#1DB954' }]}
                  numberOfLines={1}
                >
                  {item.filename.replace(/\.[^.]+$/, '')}
                </Text>
                <Text style={styles.trackDuration}>{formatTime(item.duration)}</Text>
              </TouchableOpacity>
            )
          }}
        />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121212',
  },

  // Player
  playerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  artWrapper: {
    shadowColor: '#1DB954',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  albumArt: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  songInfo: {
    width: '100%',
    gap: 4,
  },
  songTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  songArtist: {
    color: '#b3b3b3',
    fontSize: 14,
    fontWeight: '400',
  },

  // Progress
  progressSection: {
    width: '100%',
    gap: 6,
  },
  progressHitbox: {
    paddingVertical: 10,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#535353',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  progressFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1DB954',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginLeft: -6,
    top: -4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#b3b3b3',
    fontSize: 11,
  },

  // Controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  controlBtn: {
    padding: 8,
  },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1DB954',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  // Library
  openLibBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 16,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1DB95440',
  },
  openLibText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  list: {
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  listHeader: {
    color: '#b3b3b3',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 4,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
    gap: 12,
  },
  trackRowActive: {
    backgroundColor: 'rgba(29,185,84,0.08)',
  },
  trackNum: {
    width: 20,
    alignItems: 'center',
  },
  trackNumText: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  trackName: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  trackDuration: {
    color: '#b3b3b3',
    fontSize: 12,
  },
})