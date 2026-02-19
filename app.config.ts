import "dotenv/config";
import { ConfigContext, ExpoConfig } from "expo/config";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? "";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "neo-wifi-apk",
  slug: "neo-wifi-apk",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/neo-wifi-logo.png",
  scheme: "neowifiapk",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.neocalcagni.neowifi",
    adaptiveIcon: {
      backgroundColor: "#171717",
      foregroundImage: "./assets/images/neo-wifi-logo.png",
    },
    config: {
      googleMaps: {
        apiKey: GOOGLE_MAPS_API_KEY,
      },
    },
    edgeToEdgeEnabled: true,
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
    ],
  },
  web: {
    output: "static" as const,
    favicon: "./assets/images/neo-wifi-logo-comp.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/neo-wifi-logo.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#171717",
        dark: {
          backgroundColor: "#171717",
        },
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Neo WiFi necesita tu ubicación para encontrar antenas WiFi cercanas.",
        locationWhenInUsePermission:
          "Neo WiFi necesita tu ubicación para encontrar antenas WiFi cercanas.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "2fa30e72-b2ad-4e86-8169-485c675d89df",
    },
  },
  owner: "solidsnk86",
});
