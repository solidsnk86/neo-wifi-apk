import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'

// ─── Custom Bottom Tab Bar ─────────────────────────────────────────────────────
const TAB_ICONS: Record<string, string> = {
  index: 'home',
  explore: 'information',
  share: 'share-variant',
  web: 'music',
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBarWrapper}>
      <BlurView
        tint="dark"
        intensity={Platform.OS === 'ios' ? 60 : 90}
        style={styles.tabBar}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index
          const iconName = TAB_ICONS[route.name] ?? 'circle'

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
              {/* Píldora activa */}
              {isFocused && <View style={styles.activePill} />}

              <MaterialCommunityIcons
                name={iconName as any}
                size={26}
                color={isFocused ? '#fff' : '#555'}
              />
            </TouchableOpacity>
          )
        })}
      </BlurView>
    </View>
  )
}

// ─── Layout ────────────────────────────────────────────────────────────────────
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ navigation: _nav }) => ({
        headerShown: false,
        headerTransparent: true,
        headerTintColor: '#ececf1',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
          color: '#ececf1',
        },
        headerBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFill} />
          ) : (
            <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFill} />
          ),
      })}
    >
      <Tabs.Screen name="index"   options={{ title: 'Inicio' }} />
      <Tabs.Screen name="explore" options={{ title: 'Acerca de' }} />
      <Tabs.Screen name="share"   options={{ title: 'Compartir' }} />
      <Tabs.Screen name="web"     options={{ title: 'Reproductor' }} />
    </Tabs>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 240
  },
  tabBar: {
    flexDirection: 'row',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(18,18,18,0.6)',
    width: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
})

