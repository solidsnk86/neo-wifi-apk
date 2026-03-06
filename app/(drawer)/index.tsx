import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { useRef, useState } from 'react'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import { WifiAntenna } from '@/app/types/definitions'
import Map from '@/components/Map'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useAppTheme } from '@/hooks/use-app-theme'
import { useLocation } from '@/hooks/use-location'
import { useNearbyAntennas } from '@/hooks/use-nearby-antennas'
import { useWifiLocation } from '@/hooks/use-wifi-location'

const ANTENNA_COLORS = ['#10b981', '#f59e0b', '#ef4444']
const ANTENNA_LABELS = ['Más cercana', '2ª más cercana', '3ª más cercana']

function AntennaCard({
  antenna,
  index,
  colors,
}: {
  antenna: WifiAntenna
  index: number
  colors: (typeof Colors)['dark'] | (typeof Colors)['light']
}) {
  const accentColor = ANTENNA_COLORS[index]

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.antennaContent}>
        {/* Badge de prioridad */}
        <View style={[styles.badge, { backgroundColor: accentColor + '22' }]}>
          <MaterialCommunityIcons name="wifi" size={13} color={accentColor} />
          <ThemedText style={[styles.badgeText, { color: accentColor }]}>
            {ANTENNA_LABELS[index]}
          </ThemedText>
        </View>

        {/* Nombre de la antena */}
        <ThemedText style={[styles.antennaName, { color: colors.text }]} numberOfLines={2}>
          {antenna.antenna}
        </ThemedText>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIconBox, { backgroundColor: colors.border }]}>
              <MaterialCommunityIcons name="map-marker-distance" size={16} color={accentColor} />
            </View>
            <View style={styles.statTextBox}>
              <ThemedText style={[styles.statLabel, { color: colors.secondaryText }]}>Distancia</ThemedText>
              <ThemedText style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>{antenna.distance}</ThemedText>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIconBox, { backgroundColor: colors.border }]}>
              <MaterialCommunityIcons name="antenna" size={16} color={accentColor} />
            </View>
            <View style={styles.statTextBox}>
              <ThemedText style={[styles.statLabel, { color: colors.secondaryText }]}>Tipo</ThemedText>
              <ThemedText style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>{antenna.type}</ThemedText>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIconBox, { backgroundColor: colors.border }]}>
              <MaterialCommunityIcons name="account-group" size={16} color={accentColor} />
            </View>
            <View style={styles.statTextBox}>
              <ThemedText style={[styles.statLabel, { color: colors.secondaryText }]}>Usuarios</ThemedText>
              <ThemedText style={[styles.statValue, { color: colors.text }]} numberOfLines={1}>{antenna.users}</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default function HomeScreen() {
  const { theme } = useAppTheme()
  const colors = Colors[theme]
  const headerHeight = useHeaderHeight()
  const { coords, error } = useLocation()
  const location = useWifiLocation(coords)
  const nearbyAntennas = useNearbyAntennas(coords)
  const [mapTouched, setMapTouched] = useState(false)
  const scrollRef = useRef<ScrollView>(null)

  const antennas = [
    location?.closest_wifi,
    location?.second_closest_wifi,
    location?.third_closest_wifi,
  ].filter(Boolean) as WifiAntenna[]

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.screen, { paddingTop: headerHeight + 12, backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 200 : 100 }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={!mapTouched}
      nestedScrollEnabled
    >
      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={16}
            color="#ef4444"
          />
          <ThemedText style={styles.errorText}>{error.message}</ThemedText>
        </View>
      )}

      <View
        onTouchStart={() => setMapTouched(true)}
        onTouchEnd={() => setMapTouched(false)}
        onTouchCancel={() => setMapTouched(false)}
      >
        <Map
          userCoords={coords}
          wifiData={location}
          localAntennas={nearbyAntennas}
        />
      </View>

      {/* Tarjeta de ubicación */}
      {location && (
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.locationRow}>
            <View style={styles.locationIconBox}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color="#fff"
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.locationTitle, { color: colors.text }]}>
                {location.city}, {location.state}
              </ThemedText>
              <ThemedText style={[styles.secondaryText, { color: colors.secondaryText }]}>
                {location.country} · {location.departament}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.coordsRow, { backgroundColor: colors.border }]}>
            <View style={styles.coordItem}>
              <ThemedText style={styles.coordLabel}>Latitud</ThemedText>
              <ThemedText style={[styles.coordValue, { color: colors.text }]}>
                {location.current_position?.latitude?.toFixed(4) ?? '—'}
              </ThemedText>
            </View>
            <View style={styles.coordItem}>
              <ThemedText style={styles.coordLabel}>Longitud</ThemedText>
              <ThemedText style={[styles.coordValue, { color: colors.text }]}>
                {location.current_position?.longitude?.toFixed(4) ?? '—'}
              </ThemedText>
            </View>
            <View style={styles.coordItem}>
              <ThemedText style={styles.coordLabel}>Al centro</ThemedText>
              <ThemedText style={[styles.coordValue, { color: colors.text }]}>
                {location.center_distance}
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      {/* Aeropuerto más cercano */}
      {location?.airport_location && (
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.locationRow}>
            <View
              style={[styles.locationIconBox, { backgroundColor: '#FF9800' }]}
            >
              <MaterialCommunityIcons name="airplane" size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.chipLabel, { color: colors.secondaryText }]}>
                Aeropuerto más cercano
              </ThemedText>
              <ThemedText style={styles.antennaName}>
                {location.airport_location.closest_airport.airport}
              </ThemedText>
              <ThemedText style={[styles.secondaryText, { color: colors.secondaryText }]}>
                {location.airport_location.city},{' '}
                {location.airport_location.country} ·{' '}
                {location.airport_location.closest_airport.distance}
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      {/* Lista de antenas */}
      {antennas.length > 0 && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Antenas detectadas
          </ThemedText>
          {antennas.map((antenna, index) => (
            <AntennaCard key={index} antenna={antenna} index={index} colors={colors} />
          ))}
        </View>
      )}

      {/* Loading state */}
      {!location && !error && (
        <View style={styles.loadingCard}>
          <MaterialCommunityIcons
            name="wifi-strength-1"
            size={24}
            color="#10a37f"
          />
          <View>
            <ThemedText style={styles.loadingTitle}>
              Buscando señal...
            </ThemedText>
            <ThemedText style={[styles.secondaryText, { color: colors.secondaryText }]}>
              Obteniendo tu ubicación y antenas cercanas
            </ThemedText>
          </View>
        </View>
      )}

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239,68,68,0.1)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    flex: 1,
  },
  infoCard: {
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
  },
  card: {
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 4,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  divider: {
    height: 1,
    marginVertical: 12,
    borderRadius: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  statIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
    marginHorizontal: 4,
  },
  statTextBox: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#10a37f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryText: {
    fontSize: 12,
    marginTop: 2,
  },
  coordsRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 12,
    borderRadius: 10,
  },
  coordItem: {
    flex: 1,
    alignItems: 'center',
  },
  coordLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#565869',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  coordValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  chipLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  antennaContent: {
    flex: 1,
    padding: 16,
  },
  antennaName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 0,
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 20,
    borderRadius: 14,
    backgroundColor: 'rgba(16,163,127,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16,163,127,0.15)',
    marginTop: 16,
  },
  loadingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
})
