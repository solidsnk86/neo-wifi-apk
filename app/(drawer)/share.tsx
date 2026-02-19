import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    Alert,
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { WifiAntenna } from "@/app/types/definitions";
import { ThemedText } from "@/components/themed-text";
import { useLocation } from "@/hooks/use-location";
import { useWifiLocation } from "@/hooks/use-wifi-location";

export default function ShareScreen() {
  const { coords } = useLocation();
  const location = useWifiLocation(coords);

  const shareLocation = async () => {
    if (!location || !coords) {
      Alert.alert("Sin datos", "Aún no se cargó la ubicación.");
      return;
    }

    const message = [
      "📡 Neo WiFi — Mi ubicación",
      "",
      `📍 ${location.city}, ${location.state}, ${location.country}`,
      `🌐 Lat: ${coords.latitude.toFixed(5)}, Lon: ${coords.longitude.toFixed(5)}`,
      "",
      "📶 Antenas WiFi cercanas:",
      ...[
        location.closest_wifi,
        location.second_closest_wifi,
        location.third_closest_wifi,
      ]
        .filter(Boolean)
        .map((a, i) => `  ${i + 1}. ${a.antenna} — ${a.distance} (${a.type})`),
      "",
      "Enviado desde Neo WiFi 🛜",
    ].join("\n");

    try {
      await Share.share({
        message,
        title: "Mi ubicación WiFi — Neo WiFi",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const shareAntenna = async (index: number) => {
    const antennas = [
      location?.closest_wifi,
      location?.second_closest_wifi,
      location?.third_closest_wifi,
    ].filter(Boolean);

    const antenna = antennas[index];
    if (!antenna) return;

    const message = [
      `📶 Antena WiFi: ${antenna.antenna}`,
      "",
      `📏 Distancia: ${antenna.distance}`,
      `📡 Tipo: ${antenna.type}`,
      `👥 Usuarios: ${antenna.users}`,
      antenna.MAC !== "No disponible" ? `🔗 MAC: ${antenna.MAC}` : "",
      "",
      `📍 Coordenadas: ${antenna.coords.lat}, ${antenna.coords.lon}`,
      "",
      "Enviado desde Neo WiFi 🛜",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await Share.share({ message, title: `Antena: ${antenna.antenna}` });
    } catch (err) {
      console.error(err);
    }
  };

  const shareGoogleMapsLink = async () => {
    if (!coords) {
      Alert.alert("Sin datos", "Aún no se cargó la ubicación.");
      return;
    }

    const url = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
    const message = `📍 Mi ubicación actual:\n${url}\n\nEnviado desde Neo WiFi 🛜`;

    try {
      await Share.share({ message, title: "Mi ubicación" });
    } catch (err) {
      console.error(err);
    }
  };

  const antennas = [
    location?.closest_wifi,
    location?.second_closest_wifi,
    location?.third_closest_wifi,
  ].filter(Boolean) as WifiAntenna[];

  const ANTENNA_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <MaterialCommunityIcons name="share-variant" size={28} color="#fff" />
        </View>
        <ThemedText style={styles.heroTitle}>Compartir</ThemedText>
        <ThemedText style={styles.heroSubtitle}>
          Envía tu ubicación y datos de antenas WiFi a tus contactos
        </ThemedText>
      </View>

      {/* Compartir ubicación completa */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={shareLocation}
        activeOpacity={0.7}
      >
        <View style={[styles.shareIconBox, { backgroundColor: "#10a37f" }]}>
          <MaterialCommunityIcons name="wifi" size={20} color="#fff" />
        </View>
        <View style={styles.shareTextBox}>
          <ThemedText style={styles.shareTitle}>
            Ubicación + Antenas WiFi
          </ThemedText>
          <ThemedText style={styles.shareDesc}>
            Comparte tu ubicación con las 3 antenas más cercanas
          </ThemedText>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color="#565869"
        />
      </TouchableOpacity>

      {/* Compartir link Google Maps */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={shareGoogleMapsLink}
        activeOpacity={0.7}
      >
        <View style={[styles.shareIconBox, { backgroundColor: "#10b981" }]}>
          <MaterialCommunityIcons name="google-maps" size={20} color="#fff" />
        </View>
        <View style={styles.shareTextBox}>
          <ThemedText style={styles.shareTitle}>Link de Google Maps</ThemedText>
          <ThemedText style={styles.shareDesc}>
            Envía un link directo a tu ubicación en el mapa
          </ThemedText>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color="#565869"
        />
      </TouchableOpacity>

      {/* Compartir antenas individuales */}
      {antennas.length > 0 && (
        <>
          <ThemedText style={styles.sectionTitle}>
            Compartir antena individual
          </ThemedText>
          {antennas.map((antenna, index) => (
            <TouchableOpacity
              key={index}
              style={styles.shareButton}
              onPress={() => shareAntenna(index)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.shareIconBox,
                  { backgroundColor: ANTENNA_COLORS[index] },
                ]}
              >
                <MaterialCommunityIcons name="antenna" size={20} color="#fff" />
              </View>
              <View style={styles.shareTextBox}>
                <ThemedText style={styles.shareTitle} numberOfLines={1}>
                  {antenna.antenna}
                </ThemedText>
                <ThemedText style={styles.shareDesc}>
                  {antenna.distance} · {antenna.type}
                </ThemedText>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#565869"
              />
            </TouchableOpacity>
          ))}
        </>
      )}

      {!location && (
        <View style={styles.loadingCard}>
          <MaterialCommunityIcons name="loading" size={22} color="#10a37f" />
          <ThemedText style={styles.loadingText}>
            Cargando datos de ubicación...
          </ThemedText>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#212121",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroCard: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: "rgba(16,163,127,0.08)",
    borderWidth: 1,
    borderColor: "rgba(16,163,127,0.15)",
    marginBottom: 20,
  },
  heroIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#10a37f",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
    color: "#ececf1",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#8e8ea0",
    textAlign: "center",
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#2f2f2f",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 10,
    gap: 12,
  },
  shareIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  shareTextBox: {
    flex: 1,
  },
  shareTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ececf1",
  },
  shareDesc: {
    fontSize: 12,
    color: "#8e8ea0",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 10,
    marginLeft: 4,
    color: "#ececf1",
  },
  loadingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    borderRadius: 14,
    backgroundColor: "rgba(16,163,127,0.08)",
    borderWidth: 1,
    borderColor: "rgba(16,163,127,0.15)",
    marginTop: 10,
  },
  loadingText: {
    fontSize: 13,
    color: "#8e8ea0",
  },
});
