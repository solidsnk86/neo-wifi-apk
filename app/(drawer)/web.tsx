import { ThemedView } from '@/components/themed-view'
import { Colors } from '@/constants/theme'
import { useAppTheme } from '@/hooks/use-app-theme'
import { MediaAsset, useFileSystem } from '@/hooks/use-file-system'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import { LinearGradient } from 'expo-linear-gradient'
import * as MediaLibrary from 'expo-media-library'
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
  const { theme } = useAppTheme()
  const colors = Colors[theme]
  const headerHeight = useHeaderHeight()
  const { loading, getMediaAssets, getAudioAlbums, getAssetsByAlbum } = useFileSystem()

  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([])
  const [queue, setQueue] = useState<MediaAsset[]>([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  // 'home' | 'folders' | 'tracks'
  const [view, setView] = useState<'home' | 'folders' | 'tracks'>('home')
  const [selectedAlbum, setSelectedAlbum] = useState<MediaLibrary.Album | null>(null)

  const current = queue[queueIndex] ?? null

  const player = useAudioPlayer(current ? { uri: current.uri } : '')
  const status = useAudioPlayerStatus(player)

  const duration = status.duration ?? 0
  const position = status.currentTime ?? 0
  const progress = duration > 0 ? position / duration : 0

  // Abrir selector de carpetas
  const openFolderPicker = async () => {
    const list = await getAudioAlbums()
    setAlbums(list)
    setView('folders')
  }

  // Cargar canciones de una carpeta seleccionada
  const loadFromAlbum = async (album: MediaLibrary.Album) => {
    setSelectedAlbum(album)
    const assets = await getAssetsByAlbum(album)
    setQueue(assets)
    setQueueIndex(0)
    setView('tracks')
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
    <ThemedView style={[styles.screen, { paddingTop: headerHeight + 8, backgroundColor: colors.background }]}>

      {/* ── Player card ── */}
      <LinearGradient
        colors={theme === 'dark' ? ['#1a1a2e', '#121212'] : ['#e8efe8', '#d5ddd5']}
        style={styles.playerCard}
      >
        {/* Album art */}
        <View style={styles.artWrapper}>
          <AlbumArt size={200} />
        </View>

        {/* Info */}
        <View style={styles.songInfo}>
          <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
            {current ? current.filename.replace(/\.[^.]+$/, '') : 'Sin canción'}
          </Text>
          <Text style={[styles.songArtist, { color: colors.secondaryText }]} numberOfLines={1}>
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
            <Ionicons name="play-skip-back" size={28} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
            <Ionicons
              name={status.playing ? 'pause' : 'play'}
              size={30}
              color="#000"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={playNext} style={styles.controlBtn}>
            <Ionicons name="play-skip-forward" size={28} color={colors.text} />
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
      {view === 'home' && (
        <TouchableOpacity style={[styles.openLibBtn, { backgroundColor: colors.card, borderColor: colors.accent + '40' }]} onPress={openFolderPicker}>
          <MaterialCommunityIcons name="folder-music" size={22} color="#1DB954" />
          <Text style={[styles.openLibText, { color: colors.text }]}>Elegir carpeta de música</Text>
        </TouchableOpacity>
      )}

      {view === 'folders' && (
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 84 }}
          ListHeaderComponent={
            <Text style={[styles.listHeader, { color: colors.secondaryText }]}>CARPETAS · {albums.length} encontradas</Text>
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>No se encontraron carpetas con audio.</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.folderRow, { borderBottomColor: colors.border }]}
              onPress={() => loadFromAlbum(item)}
            >
              <MaterialCommunityIcons name="folder-music-outline" size={22} color="#1DB954" />
              <View style={styles.folderInfo}>
                <Text style={[styles.folderName, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.folderCount, { color: colors.secondaryText }]}>{item.assetCount} canciones</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          )}
        />
      )}

      {view === 'tracks' && (
        <FlatList
          data={queue}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 84 }}
          style={styles.list}
          ListHeaderComponent={
            <View style={styles.tracksHeader}>
              <TouchableOpacity onPress={() => setView('folders')} style={styles.backBtn}>
                <MaterialCommunityIcons name="arrow-left" size={18} color={colors.text} />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={[styles.listHeader, { color: colors.secondaryText, marginBottom: 0 }]}>
                  {selectedAlbum?.title ?? 'Carpeta'} · {queue.length} canciones
                </Text>
              </View>
            </View>
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
                    <Text style={[styles.trackNumText, { color: colors.secondaryText }, isActive && { color: '#1DB954' }]}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[styles.trackName, { color: colors.text }, isActive && { color: '#1DB954' }]}
                  numberOfLines={1}
                >
                  {item.filename.replace(/\.[^.]+$/, '')}
                </Text>
                <Text style={[styles.trackDuration, { color: colors.secondaryText }]}>{formatTime(item.duration)}</Text>
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
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  folderInfo: {
    flex: 1,
    minWidth: 0,
  },
  folderName: {
    fontSize: 14,
    fontWeight: '600',
  },
  folderCount: {
    fontSize: 12,
    marginTop: 2,
  },
  tracksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    marginTop: 4,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
  },
  list: {
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  listHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 4,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
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
    fontSize: 12,
  },
})