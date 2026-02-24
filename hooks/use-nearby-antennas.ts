import { useMemo } from 'react'

import { Coords, LocalAntenna } from '@/app/types/definitions'
import allAntennas from '@/data/wifi-v15.json'

const MAX_NEARBY = 50

/**
 * Fórmula de Haversine: distancia en km entre dos puntos (lat, lon).
 */
function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371 // Radio de la Tierra en km
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Hook que devuelve las `MAX_NEARBY` antenas más cercanas al usuario
 * del dataset local (wifi-v15.json).
 *
 * Usa un filtro rápido por bounding-box (~1° lat/lon ≈ 111 km) para
 * descartar la mayoría sin calcular Haversine, y luego ordena por
 * distancia real solo las candidatas.
 */
export function useNearbyAntennas(coords?: Coords): LocalAntenna[] {
  return useMemo(() => {
    if (!coords) return []

    const { latitude, longitude } = coords

    // Bounding-box rápido: ±1° ≈ 111 km
    const delta = 1
    const candidates = (allAntennas as LocalAntenna[]).filter(
      (a) =>
        a.lat >= latitude - delta &&
        a.lat <= latitude + delta &&
        a.lon >= longitude - delta &&
        a.lon <= longitude + delta,
    )

    // Si hay pocas candidatas en 1°, expandimos a 3° (~333 km)
    const pool =
      candidates.length < MAX_NEARBY
        ? (allAntennas as LocalAntenna[]).filter(
            (a) =>
              a.lat >= latitude - 3 &&
              a.lat <= latitude + 3 &&
              a.lon >= longitude - 3 &&
              a.lon <= longitude + 3,
          )
        : candidates

    // Calcular distancia real y ordenar
    return pool
      .map((a) => ({
        ...a,
        _dist: haversineKm(latitude, longitude, a.lat, a.lon),
      }))
      .sort((a, b) => a._dist - b._dist)
      .slice(0, MAX_NEARBY)
      .map(({ _dist, ...antenna }) => antenna)
  }, [coords])
}
