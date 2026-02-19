// Tipado de la API de geolocalización
// Endpoint: https://calcagni-gabriel.vercel.app/api/geolocation?lat={lat}&lon={lon}

/** Coordenadas genéricas (lat/lon) */
export interface Coords {
  latitude: number;
  longitude: number;
}

/** Coordenadas usadas en las antenas WiFi */
export interface WifiCoords {
  lat: number;
  lon: number;
}

/** Información de una antena WiFi */
export interface WifiAntenna {
  antenna: string;
  name: string;
  distance: string;
  type: string;
  MAC: string;
  MAC5G: string;
  coords: WifiCoords;
  users: number;
}

/** Antena local del JSON (wifi-v15.json) */
export interface LocalAntenna {
  name: string;
  MAC?: string;
  name5g?: string;
  MAC5g?: string | null;
  lat: number;
  lon: number;
  type: string;
  users: number;
  location: string;
}

/** Aeropuerto más cercano */
export interface ClosestAirport {
  airport: string;
  distance: string;
}

/** Información del aeropuerto */
export interface AirportLocation {
  city: string;
  country: string;
  closest_airport: ClosestAirport;
}

/** Respuesta completa de la API de geolocalización */
export interface GeolocationResponse {
  ip: string;
  city: string;
  state: string;
  country: string;
  departament: string;
  city_coords: Coords;
  center_distance: string;
  current_position: Coords;
  closest_wifi: WifiAntenna;
  second_closest_wifi: WifiAntenna;
  third_closest_wifi: WifiAntenna;
  airport_location: AirportLocation;
}
