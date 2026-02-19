import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

export default function AboutScreen() {
  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="wifi-marker" size={44} color="#fff" />
        </View>
        <ThemedText style={styles.appName}>Neo WiFi</ThemedText>
        <ThemedText style={styles.version}>Versión 1.0.0</ThemedText>
      </View>

      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>¿Qué es Neo WiFi?</ThemedText>
        <ThemedText style={styles.cardText}>
          Neo WiFi es una aplicación que detecta tu ubicación y te muestra las
          tres antenas WiFi públicas más cercanas utilizando el cálculo de
          distancia Haversine. Visualiza las antenas en un mapa interactivo con
          líneas de distancia en tiempo real.
        </ThemedText>
      </View>

      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Funcionalidades</ThemedText>
        {[
          {
            icon: "crosshairs-gps" as const,
            color: "#10b981",
            text: "Geolocalización automática del dispositivo",
          },
          {
            icon: "wifi" as const,
            color: "#f59e0b",
            text: "Detección de las 3 antenas WiFi más cercanas",
          },
          {
            icon: "map-marker-distance" as const,
            color: "#ef4444",
            text: "Cálculo de distancia Haversine",
          },
          {
            icon: "map" as const,
            color: "#6366f1",
            text: "Mapa interactivo con marcadores y líneas",
          },
          {
            icon: "airplane" as const,
            color: "#8b5cf6",
            text: "Aeropuerto más cercano a tu ubicación",
          },
          {
            icon: "share-variant" as const,
            color: "#10a37f",
            text: "Compartir ubicación y datos de antenas",
          },
          {
            icon: "database" as const,
            color: "#06b6d4",
            text: "Base de datos local con 5080 antenas WiFi",
          },
        ].map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <View
              style={[styles.featureIcon, { backgroundColor: feature.color }]}
            >
              <MaterialCommunityIcons
                name={feature.icon}
                size={15}
                color="#fff"
              />
            </View>
            <ThemedText style={styles.featureText}>{feature.text}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Tecnologías</ThemedText>
        <View style={styles.techGrid}>
          {[
            "React Native",
            "Expo SDK 54",
            "TypeScript",
            "Google Maps",
            "expo-location",
            "expo-router",
            "Haversine",
          ].map((tech, i) => (
            <View key={i} style={styles.techChip}>
              <ThemedText style={styles.techText}>{tech}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Aviso legal</ThemedText>
        <ThemedText style={styles.cardText}>
          Esta aplicación utiliza datos de geolocalización del dispositivo
          exclusivamente para mostrar las antenas WiFi más cercanas. No se
          almacena ni se comparte información personal del usuario.
        </ThemedText>
        <ThemedText style={[styles.cardText, { marginTop: 8 }]}>
          Los datos de antenas WiFi son proporcionados por una API personal y
          pueden no reflejar la cantidad de usuarios en tiempo real.
        </ThemedText>
      </View>

      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Créditos</ThemedText>
        <ThemedText style={styles.cardText}>
          Desarrollado por Gabriel Calcagni.
        </ThemedText>
      </View>

      <ThemedText style={styles.footer}>
        © {new Date().getFullYear()} Neo WiFi. Todos los derechos reservados.
      </ThemedText>
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
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#10a37f",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: "#ececf1",
  },
  version: {
    fontSize: 13,
    color: "#565869",
    marginTop: 4,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#2f2f2f",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    color: "#ececf1",
  },
  cardText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#8e8ea0",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 7,
  },
  featureIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: 13,
    flex: 1,
    fontWeight: "500",
    color: "#d1d5db",
  },
  techGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  techChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(16,163,127,0.1)",
  },
  techText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10a37f",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#565869",
    marginTop: 20,
  },
});
