import {
  Coords,
  GeolocationResponse,
  LocalAntenna,
  WifiAntenna,
} from '@/app/types/definitions'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps'

// Colores para las 3 antenas de la API
const API_COLORS = ['#10b981', '#f59e0b', '#ef4444']
const API_LABELS = ['Más cercana', '2ª más cercana', '3ª más cercana']

// Color para las antenas locales del JSON
const LOCAL_COLOR = '#6366f1'

// Región inicial amplia (vista de Argentina) antes del "vuelo"
const INITIAL_REGION = {
  latitude: -38.5,
  longitude: -63.5,
  latitudeDelta: 30,
  longitudeDelta: 30,
}
const MAP_TILER_KEY = process.env.EXPO_PUBLIC_MAP_TILER_KEY

 const MAPS = {
    calles:
      'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key='+MAP_TILER_KEY,
    satelite:
      'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key='+MAP_TILER_KEY,
    hibrido:
      'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key='+MAP_TILER_KEY,
    dark:
      'https://api.maptiler.com/maps/darkmatter/{z}/{x}/{y}.png?key='+MAP_TILER_KEY,
    light:
      'https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key='+MAP_TILER_KEY,
    topo:
      'https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key='+MAP_TILER_KEY,
  }

// Zoom destino al llegar a la ubicación del usuario
const TARGET_DELTA = 0.015

interface MapProps {
  userCoords?: Coords
  wifiData?: GeolocationResponse
  localAntennas?: LocalAntenna[]
}

/**
 * Marcador para antenas del JSON local.
 * Icono de antena violeta + popup nativo title/description.
 * tracksViewChanges=true al inicio para que Android renderice el custom View,
 * luego se apaga para performance.
 */
const LocalMarker = memo(
  function LocalMarker({ antenna }: { antenna: LocalAntenna }) {
    const [tracked, setTracked] = useState(true)

    useEffect(() => {
      // Tras el primer render, apagar tracksViewChanges para performance
      const timer = setTimeout(() => setTracked(false), 500)
      return () => clearTimeout(timer)
    }, [])

    const desc = [
      `📍 ${antenna.location}`,
      `📡 ${antenna.type}`,
      `👥 ${antenna.users} usuarios`,
      antenna.MAC ? `🔗 MAC: ${antenna.MAC}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    return (
      <Marker
        coordinate={{ latitude: antenna.lat, longitude: antenna.lon }}
        title={antenna.name}
        description={desc}
        tracksViewChanges={tracked}
        anchor={{ x: 0.5, y: 0.5 }}
        zIndex={5}
      >
        <View style={styles.localMarker}>
          <MaterialCommunityIcons name="antenna" size={14} color="#fff" />
        </View>
      </Marker>
    )
  },
  (prev, next) =>
    prev.antenna.lat === next.antenna.lat &&
    prev.antenna.lon === next.antenna.lon,
)

export default function Map({
  userCoords,
  wifiData,
  localAntennas = [],
}: MapProps) {
  const mapRef = useRef<MapView>(null)
  const hasFlown = useRef(false)
  const [mapStyle, setMapStyle] = useState<keyof typeof MAPS>("calles")

  const apiAntennas = useMemo(
    () =>
      [
        wifiData?.closest_wifi,
        wifiData?.second_closest_wifi,
        wifiData?.third_closest_wifi,
      ].filter(Boolean) as WifiAntenna[],
    [wifiData],
  )

  const filteredLocal = useMemo(() => {
    if (apiAntennas.length === 0) return localAntennas
    const apiCoords = new Set(
      apiAntennas.map(
        (a) => `${a.coords.lat.toFixed(5)},${a.coords.lon.toFixed(5)}`,
      ),
    )
    return localAntennas.filter(
      (a) => !apiCoords.has(`${a.lat.toFixed(5)},${a.lon.toFixed(5)}`),
    )
  }, [localAntennas, apiAntennas])

  // ── Efecto de vuelo: cuando llegan las coordenadas del usuario,
  //    anima el mapa desde la vista amplia hasta su ubicación ──
  useEffect(() => {
    if (!userCoords || hasFlown.current || !mapRef.current) return
    hasFlown.current = true

    // Pequeño delay para que el mapa se monte primero
    const timer = setTimeout(() => {
      mapRef.current?.animateToRegion(
        {
          latitude: userCoords.latitude,
          longitude: userCoords.longitude,
          latitudeDelta: TARGET_DELTA,
          longitudeDelta: TARGET_DELTA,
        },
        2500, // 2.5 segundos de animación (efecto vuelo)
      )
    }, 400)

    return () => clearTimeout(timer)
  }, [userCoords])

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        mapType="none"
      >
      <UrlTile
        urlTemplate={MAPS[mapStyle]}
        maximumZ={19}
      />
        {/* ── Antenas locales del JSON (íconos de antena) ── */}
        {filteredLocal.map((antenna, i) => (
          <LocalMarker key={`local-${i}`} antenna={antenna} />
        ))}

        {/* ── 3 Antenas de la API (marcadores grandes + popup nativo) ── */}
        {apiAntennas.map((antenna, index) => {
          const desc = [
            `📏 ${antenna.distance}`,
            `📡 ${antenna.type}`,
            `👥 ${antenna.users} usuarios`,
            antenna.MAC !== 'No disponible' ? `🔗 MAC: ${antenna.MAC}` : '',
          ]
            .filter(Boolean)
            .join('\n')

          return (
            <Marker
              key={`api-${index}`}
              coordinate={{
                latitude: antenna.coords.lat,
                longitude: antenna.coords.lon,
              }}
              title={`${API_LABELS[index]} — ${antenna.antenna}`}
              description={desc}
              anchor={{ x: 0.5, y: 0.5 }}
              zIndex={10}
            >
              <View
                style={[
                  styles.apiMarker,
                  { backgroundColor: API_COLORS[index] },
                ]}
              >
                <MaterialCommunityIcons name="wifi" size={16} color="#fff" />
              </View>
            </Marker>
          )
        })}

        {/* ── Polylines de las 3 de la API ── */}
        {userCoords &&
          apiAntennas.map((antenna, index) => (
            <Polyline
              key={`line-${index}`}
              coordinates={[
                {
                  latitude: userCoords.latitude,
                  longitude: userCoords.longitude,
                },
                {
                  latitude: antenna.coords.lat,
                  longitude: antenna.coords.lon,
                },
              ]}
              strokeColor={API_COLORS[index]}
              strokeWidth={2}
              lineDashPattern={[8, 4]}
            />
          ))}

        {/* ── Etiquetas de distancia ── */}
        {userCoords &&
          apiAntennas.map((antenna, index) => {
            const midLat = (userCoords.latitude + antenna.coords.lat) / 2
            const midLon = (userCoords.longitude + antenna.coords.lon) / 2
            return (
              <Marker
                key={`label-${index}`}
                coordinate={{ latitude: midLat, longitude: midLon }}
                anchor={{ x: 0.5, y: 0.5 }}
                tracksViewChanges={false}
                zIndex={20}
              >
                <View
                  style={[
                    styles.distanceLabel,
                    { backgroundColor: API_COLORS[index] },
                  ]}
                >
                  <Text style={styles.distanceLabelText}>
                    {antenna.distance}
                  </Text>
                </View>
              </Marker>
            )
          })}
      </MapView>

      <View style={styles.mapSwitcher}>
        {(['calles', 'satelite', 'hibrido'] as const).map((k) => (
          <Pressable
            key={k}
            onPress={() => setMapStyle(k)}
            style={[
              styles.swswitchBtn,
              mapStyle === k && styles.switchBtnActive,
            ]}
          >
            <Text style={[styles.switchText, mapStyle === k && styles.switchTextActive]}>{k}</Text>
          </Pressable>
        ))}
      </View>

      {/* Leyenda flotante */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: LOCAL_COLOR }]} />
          <Text style={styles.legendText}>
            Antenas zona ({filteredLocal.length})
          </Text>
        </View>
        {API_LABELS.map((label, i) => (
          <View key={i} style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: API_COLORS[i] }]}
            />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 420,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 20,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  map: {
    width: '100%',
    height: '100%',
  },

  // ── Marcadores locales (ícono antena violeta) ──
  localMarker: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: LOCAL_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },

  // ── Marcadores API (más grandes) ──
  apiMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // ── Distancia ──
  distanceLabel: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  distanceLabelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  // ── Leyenda flotante ──
  legend: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.93)',
    borderRadius: 10,
    padding: 8,
    gap: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#555',
    fontWeight: '500',
  },
  mapSwitcher: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 8,
    zIndex: 30,
  },
  swswitchBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchBtnActive: {
    backgroundColor: '#111',
  },
  switchText: {
    fontSize: 12,
    color: '#111',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  switchTextActive: {
    color: '#fff',
  },
})
