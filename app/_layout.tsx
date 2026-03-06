import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'

import { ThemeProviderCustom, useAppTheme } from '@/hooks/use-app-theme'

const StyleDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#10a37f',
    background: '#171717',
    card: '#212121',
    text: '#ececf1',
    border: 'rgba(255,255,255,0.06)',
    notification: '#10a37f',
  },
}

const StyleLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#10a37f',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#1a1a1a',
    border: 'rgba(0,0,0,0.08)',
    notification: '#10a37f',
  },
}

export const unstable_settings = {
  anchor: '(drawer)',
}

function InnerLayout() {
  const { isDark } = useAppTheme()

  return (
    <ThemeProvider value={isDark ? StyleDark : StyleLight}>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProviderCustom>
        <InnerLayout />
      </ThemeProviderCustom>
    </GestureHandlerRootView>
  )
}
