<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Neo WiFi APK

## Proyecto

Aplicación React Native (Expo SDK 54) para localizar antenas WiFi públicas cercanas.

## Stack

- **Framework:** Expo SDK 54 + React Native 0.81.5 + React 19.1
- **Lenguaje:** TypeScript 5.9 (strict)
- **Routing:** expo-router (file-based, drawer layout)
- **Navegación:** @react-navigation/drawer
- **Mapa:** react-native-maps (Google Maps, nativo)
- **Ubicación:** expo-location
- **Package manager:** pnpm
- **Tema:** Dark-first (estilo ChatGPT) — colores base: #171717, #212121, #2f2f2f, accent #10a37f

## Estructura

```
app/
  _layout.tsx          — Root layout (tema oscuro forzado)
  (drawer)/
    _layout.tsx        — Drawer nav con 3 pantallas
    index.tsx          — Home: mapa + tarjetas info + antenas
    explore.tsx        — Acerca de
    share.tsx          — Compartir datos via Share API
  types/
    definitions.d.ts   — Interfaces TypeScript
components/
  Map.tsx              — Mapa con antenas API (3) + JSON locales (~50)
  themed-text.tsx      — Texto con color del tema
  themed-view.tsx      — View con background del tema
hooks/
  use-location.ts      — GPS del dispositivo
  use-wifi-location.ts — Fetch API geolocalización
  use-nearby-antennas.ts — Filtra 50 antenas más cercanas del JSON (Haversine)
data/
  wifi-v15.json        — Base de datos 5080 antenas WiFi
constants/
  theme.ts             — Colores dark-first
```

## API

- Endpoint: `https://calcagni-gabriel.vercel.app/api/geolocation?lat={lat}&lon={lon}`
- Retorna: IP, ciudad, estado, país, 3 antenas cercanas, aeropuerto

## Comandos

- `pnpm start` — Iniciar Expo
- `pnpm android` — Abrir en Android
- `npx tsc --noEmit` — Verificar tipos
