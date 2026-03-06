import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Colors } from '@/constants/theme'
import { useAppTheme } from '@/hooks/use-app-theme'

// ─── Custom Bottom Tab Bar ─────────────────────────────────────────────────────
const TAB_ICONS: Record<string, string> = {
  index: 'home',
  explore: 'information',
  share: 'share-variant',
  web: 'music',
}

const TAB_LABELS: Record<string, string> = {
  index: 'Inicio',
  explore: 'Info',
  share: 'Compartir',
  web: 'Música',
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useAppTheme()
  const colors = Colors[theme]

  return (
    <View style={styles.tabBarOuter}>
      <BlurView
        tint={colors.blurTint}
        intensity={Platform.OS === 'ios' ? 80 : 100}
        style={[
          styles.tabBarBlur,
          {
            backgroundColor: colors.tabBarBg,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index
            const iconName = TAB_ICONS[route.name] ?? 'circle'
            const label = TAB_LABELS[route.name] ?? route.name

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                {isFocused && <View style={styles.activePill} />}
                <MaterialCommunityIcons
                  name={iconName as any}
                  size={24}
                  color={isFocused ? colors.accent : colors.tabInactive}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? colors.accent : colors.tabInactive },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </BlurView>
    </View>
  )
}

// ─── Layout ────────────────────────────────────────────────────────────────────
export default function TabLayout() {
  const { theme, isDark, toggleTheme } = useAppTheme()
  const colors = Colors[theme]

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
          color: colors.text,
        },
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerBackground: () => (
          <BlurView
            tint={colors.blurTint}
            intensity={Platform.OS === 'ios' ? 80 : 100}
            style={[
              StyleSheet.absoluteFill,
              styles.headerBlur,
              { borderBottomColor: colors.border },
            ]}
          />
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.themeToggle}
            activeOpacity={0.6}
          >
            <MaterialCommunityIcons
              name={isDark ? 'weather-sunny' : 'weather-night'}
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen name="index"   options={{ title: 'Neo WiFi' }} />
      <Tabs.Screen name="explore" options={{ title: 'Acerca de' }} />
      <Tabs.Screen name="share"   options={{ title: 'Compartir' }} />
      <Tabs.Screen name="web"     options={{ title: 'Reproductor' }} />
    </Tabs>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  headerBlur: {
    borderBottomWidth: 1,
  },
  tabBarOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarBlur: {
    overflow: 'hidden',
    borderTopWidth: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 12 : 28,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
    gap: 3,
  },
  activePill: {
    position: 'absolute',
    width: 56,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(16,163,127,0.12)',
    
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  themeToggle: {
    marginRight: 16,
    padding: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(128,128,128,0.15)',
  },
})

