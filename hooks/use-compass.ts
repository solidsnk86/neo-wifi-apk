import { Magnetometer } from 'expo-sensors'
import { useEffect, useState } from 'react'

/**
 * Hook que retorna el heading (0-360°) y el punto cardinal.
 * 0° = Norte, 90° = Este, 180° = Sur, 270° = Oeste.
 */
export function useCompass() {
  const [heading, setHeading] = useState(0)
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    let subscription: ReturnType<typeof Magnetometer.addListener> | null = null

    const start = async () => {
      const isAvailable = await Magnetometer.isAvailableAsync()
      setAvailable(isAvailable)
      if (!isAvailable) return

      Magnetometer.setUpdateInterval(200)

      subscription = Magnetometer.addListener((data) => {
        const { x, y } = data
        // atan2 devuelve radianes, convertir a grados
        let angle = Math.atan2(y, x) * (180 / Math.PI)
        // Normalizar a 0-360
        angle = (angle + 360) % 360
        // Invertir para que 0 sea Norte (depende de la orientación del sensor)
        angle = (360 - angle) % 360
        setHeading(Math.round(angle))
      })
    }

    start()

    return () => {
      subscription?.remove()
    }
  }, [])

  const getCardinal = (deg: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
    const index = Math.round(deg / 45) % 8
    return directions[index]
  }

  return {
    heading,
    cardinal: getCardinal(heading),
    available,
  }
}
