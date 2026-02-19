import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

const StyleDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#10a37f",
    background: "#171717",
    card: "#212121",
    text: "#ececf1",
    border: "rgba(255,255,255,0.06)",
    notification: "#10a37f",
  },
};

export const unstable_settings = {
  anchor: "(drawer)",
};

export default function RootLayout() {
  return (
    <ThemeProvider value={StyleDark}>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
