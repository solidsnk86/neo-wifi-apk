import { Coords, GeolocationResponse } from '@/app/types/definitions'
import { useCallback, useEffect, useState } from 'react'

export const useWifiLocation = (coords?: Coords) => {
  const [location, setLocation] = useState<GeolocationResponse>()

  const getWifiLocation = useCallback(async () => {
    if (!coords) return
    try {
      const response = await fetch(
        `https://calcagni-gabriel.vercel.app/api/geolocation?lat=${coords.latitude}&lon=${coords.longitude}`,
      )
      const dataLocation = await response.json()
      setLocation(dataLocation)
    } catch (error) {
      console.error(error)
    }
  }, [coords])

  useEffect(() => {
    getWifiLocation()
  }, [getWifiLocation])

  return location
}
