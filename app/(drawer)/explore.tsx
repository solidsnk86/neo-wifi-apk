import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useAppTheme } from '@/hooks/use-app-theme'
import { LinearGradient } from 'expo-linear-gradient'

export default function AboutScreen() {
  const { theme } = useAppTheme()
  const colors = Colors[theme]
  const headerHeight = useHeaderHeight()
  const [legalOpen, setLegalOpen] = useState(false)

  return (
    <ScrollView
      style={[styles.screen, { paddingTop: headerHeight + 12, backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 200 }}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/neo-wifi-logo-comp.png')}
            style={{ width: 120, height: 100 }}
          />
        </View>
        <ThemedText style={styles.version}>Versión 1.0.0</ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ThemedText style={styles.cardTitle}>¿Qué es Neo WiFi?</ThemedText>
        <ThemedText style={[styles.cardText, { color: colors.secondaryText }]}>
          Neo WiFi es una aplicación que detecta tu ubicación y te muestra las
          tres antenas WiFi públicas más cercanas utilizando el cálculo de
          distancia Haversine. Visualiza las antenas en un mapa interactivo con
          líneas de distancia en tiempo real.
        </ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ThemedText style={styles.cardTitle}>Funcionalidades</ThemedText>
        {[
          {
            icon: 'crosshairs-gps' as const,
            color: '#10b981',
            text: 'Geolocalización automática del dispositivo',
          },
          {
            icon: 'wifi' as const,
            color: '#f59e0b',
            text: 'Detección de las 3 antenas WiFi más cercanas',
          },
          {
            icon: 'map-marker-distance' as const,
            color: '#ef4444',
            text: 'Cálculo de distancia Haversine',
          },
          {
            icon: 'map' as const,
            color: '#6366f1',
            text: 'Mapa interactivo con marcadores y líneas',
          },
          {
            icon: 'airplane' as const,
            color: '#8b5cf6',
            text: 'Aeropuerto más cercano a tu ubicación',
          },
          {
            icon: 'share-variant' as const,
            color: '#10a37f',
            text: 'Compartir ubicación y datos de antenas',
          },
          {
            icon: 'database' as const,
            color: '#06b6d4',
            text: 'Base de datos local con 5080 antenas WiFi',
          },
          {
            icon: 'music' as const,
            color: '#2f06d4',
            text: 'Reproductor de música mp3 local',
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
            <ThemedText style={[styles.featureText, { color: colors.text }]}>{feature.text}</ThemedText>
          </View>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable
          onPress={() => setLegalOpen((v) => !v)}
          style={styles.accordionHeader}
        >
          <ThemedText style={styles.cardTitle}>Aviso legal</ThemedText>
          <MaterialCommunityIcons
            name={legalOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.secondaryText}
          />
        </Pressable>
        {legalOpen && (
          <View style={styles.accordionBody}>
            <ThemedText style={[styles.cardText, { color: colors.secondaryText }]}>
              Esta aplicación utiliza datos de geolocalización del dispositivo
              exclusivamente para mostrar las antenas WiFi más cercanas. No se
              almacena ni se comparte información personal del usuario.
            </ThemedText>
            <ThemedText style={[styles.cardText, { marginTop: 8, color: colors.secondaryText }]}>
              Los datos de antenas WiFi son proporcionados por una API personal y
              pueden no reflejar la cantidad de usuarios en tiempo real.
            </ThemedText>
          </View>
        )}
      </View>

      <LinearGradient colors={theme === 'dark' ? ['#2f2f2f', '#1c1c1c'] : ['#e8e8e8', '#ddd']} style={[styles.card, { borderColor: colors.border }]}>
        <View style={styles.effect}></View>
        <ThemedText style={styles.cardTitle}>Créditos</ThemedText>
        <ThemedText style={[styles.cardText, { color: colors.secondaryText }]}>
          Desarrollador Gabriel Calcagni @solidsnk86.
        </ThemedText>
      </LinearGradient>

      <ThemedText style={styles.footer}>
        © {new Date().getFullYear()} Neo WiFi. Todos los derechos reservados.
      </ThemedText>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBlock: 24
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 92,
    height: 92,
    borderRadius: 20,
    backgroundColor: '#1059a3ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: '#ececf1',
  },
  version: {
    fontSize: 13,
    color: '#565869',
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden"
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionBody: {
    marginTop: 8,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#8e8ea0',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 7,
  },
  featureIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 13,
    flex: 1,
    fontWeight: '500',
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(16,163,127,0.1)',
  },
  techText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10a37f',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#565869',
    marginTop: 20,
  },
  effect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
})
