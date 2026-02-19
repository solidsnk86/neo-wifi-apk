import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";

import { WifiAntenna } from "@/app/types/definitions";
import Map from "@/components/Map";
import { ThemedText } from "@/components/themed-text";
import { useLocation } from "@/hooks/use-location";
import { useNearbyAntennas } from "@/hooks/use-nearby-antennas";
import { useWifiLocation } from "@/hooks/use-wifi-location";

const ANTENNA_COLORS = ["#10b981", "#f59e0b", "#ef4444"];
const ANTENNA_LABELS = ["Más cercana", "2ª más cercana", "3ª más cercana"];

function AntennaCard({
  antenna,
  index,
}: {
  antenna: WifiAntenna;
  index: number;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.antennaContent}>
        <View style={styles.antennaHeader}>
          <MaterialCommunityIcons
            name="wifi"
            size={14}
            color={ANTENNA_COLORS[index]}
          />
          <ThemedText style={styles.antennaLabel}>
            {ANTENNA_LABELS[index]}
          </ThemedText>
        </View>
        <ThemedText style={styles.antennaName}>{antenna.antenna}</ThemedText>
        <View style={styles.antennaDetails}>
          <View style={styles.detailChip}>
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={11}
              color="#8e8ea0"
            />
            <ThemedText style={styles.detailText}>
              {antenna.distance}
            </ThemedText>
          </View>
          <View style={styles.detailChip}>
            <MaterialCommunityIcons name="antenna" size={11} color="#8e8ea0" />
            <ThemedText style={styles.detailText}>{antenna.type}</ThemedText>
          </View>
          <View style={styles.detailChip}>
            <MaterialCommunityIcons
              name="account-group"
              size={11}
              color="#8e8ea0"
            />
            <ThemedText style={styles.detailText}>
              {antenna.users} usuarios
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { coords, error } = useLocation();
  const location = useWifiLocation(coords);
  const nearbyAntennas = useNearbyAntennas(coords);

  const antennas = [
    location?.closest_wifi,
    location?.second_closest_wifi,
    location?.third_closest_wifi,
  ].filter(Boolean) as WifiAntenna[];

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
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

      <Map
        userCoords={coords}
        wifiData={location}
        localAntennas={nearbyAntennas}
      />

      {/* Tarjeta de ubicación */}
      {location && (
        <View style={styles.infoCard}>
          <View style={styles.locationRow}>
            <View style={styles.locationIconBox}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color="#fff"
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.locationTitle}>
                {location.city}, {location.state}
              </ThemedText>
              <ThemedText style={styles.secondaryText}>
                {location.country} · {location.departament}
              </ThemedText>
            </View>
          </View>

          <View style={styles.coordsRow}>
            <View style={styles.coordItem}>
              <ThemedText style={styles.coordLabel}>Latitud</ThemedText>
              <ThemedText style={styles.coordValue}>
                {location.current_position?.latitude?.toFixed(4) ?? "—"}
              </ThemedText>
            </View>
            <View style={styles.coordItem}>
              <ThemedText style={styles.coordLabel}>Longitud</ThemedText>
              <ThemedText style={styles.coordValue}>
                {location.current_position?.longitude?.toFixed(4) ?? "—"}
              </ThemedText>
            </View>
            <View style={styles.coordItem}>
              <ThemedText style={styles.coordLabel}>Al centro</ThemedText>
              <ThemedText style={styles.coordValue}>
                {location.center_distance}
              </ThemedText>
            </View>
          </View>
        </View>
      )}

      {/* Aeropuerto más cercano */}
      {location?.airport_location && (
        <View style={styles.infoCard}>
          <View style={styles.locationRow}>
            <View
              style={[styles.locationIconBox, { backgroundColor: "#FF9800" }]}
            >
              <MaterialCommunityIcons name="airplane" size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.chipLabel}>
                Aeropuerto más cercano
              </ThemedText>
              <ThemedText style={styles.antennaName}>
                {location.airport_location.closest_airport.airport}
              </ThemedText>
              <ThemedText style={styles.secondaryText}>
                {location.airport_location.city},{" "}
                {location.airport_location.country} ·{" "}
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
            <AntennaCard key={index} antenna={antenna} index={index} />
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
            <ThemedText style={styles.secondaryText}>
              Obteniendo tu ubicación y antenas cercanas
            </ThemedText>
          </View>
        </View>
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#212121",
    paddingHorizontal: 16,
    paddingTop: 8,
    marginTop: 120,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.1)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    flex: 1,
  },
  infoCard: {
    backgroundColor: "#2f2f2f",
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  card: {
    backgroundColor: "#2f2f2f",
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    overflow: "hidden",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#10a37f",
    alignItems: "center",
    justifyContent: "center",
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ececf1",
  },
  secondaryText: {
    fontSize: 12,
    color: "#8e8ea0",
    marginTop: 2,
  },
  coordsRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 12,
    borderRadius: 10,
  },
  coordItem: {
    flex: 1,
    alignItems: "center",
  },
  coordLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#565869",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  coordValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
    color: "#ececf1",
  },
  chipLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#8e8ea0",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    color: "#ececf1",
  },
  antennaContent: {
    flex: 1,
    padding: 14,
  },
  antennaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  antennaLabel: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    color: "#8e8ea0",
    letterSpacing: 0.5,
  },
  antennaName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#ececf1",
  },
  antennaDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  detailChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  detailText: {
    fontSize: 11,
    color: "#8e8ea0",
    fontWeight: "500",
  },
  loadingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 20,
    borderRadius: 14,
    backgroundColor: "rgba(16,163,127,0.08)",
    borderWidth: 1,
    borderColor: "rgba(16,163,127,0.15)",
    marginTop: 16,
  },
  loadingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ececf1",
  },
});
