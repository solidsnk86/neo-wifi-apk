import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Drawer } from 'expo-router/drawer'

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer'
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawerScroll}
      contentContainerStyle={{ paddingTop: 50 }}
    >
      {/* Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.drawerIconBox}>
          <Image
            source={require('../../assets/images/neo-wifi-logo.png')}
            style={{ width: 45, height: 45 }}
          />
        </View>
        <View>
          <Text style={styles.drawerTitle}>Neo WiFi</Text>
          <Text style={styles.drawerSubtitle}>Localizador de antenas</Text>
        </View>
      </View>

      <View style={styles.separator} />

      <DrawerItemList {...props} />

      {/* Footer */}
      <View style={styles.drawerFooter}>
        <View style={styles.separator} />
        <Text style={styles.footerText}>v1.0.0 · Neo WiFi</Text>
      </View>
    </DrawerContentScrollView>
  )
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#ececf1',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
            color: '#ececf1',
          },
          // Fondo con efecto Blur (vidrio esmerilado)
          headerBackground: () =>
            Platform.OS === 'ios' ? (
              <BlurView
                tint="dark"
                intensity={60}
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <BlurView
                tint="dark"
                intensity={80}
                style={StyleSheet.absoluteFill}
              />
            ),
          // Icono del menú personalizado
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{ marginLeft: 16 }}
            >
              <MaterialCommunityIcons name="text" size={28} color="#ececf1" />
            </TouchableOpacity>
          ),
          drawerActiveTintColor: '#175fb2ff',
          drawerInactiveTintColor: '#8e8ea0',
          drawerActiveBackgroundColor: 'rgba(24, 51, 184, 0.12)',
          drawerLabelStyle: {
            fontSize: 15,
            fontWeight: '500',
            marginLeft: -8,
          },
          drawerItemStyle: {
            borderRadius: 10,
            paddingVertical: 2,
            marginHorizontal: 8,
          },
          drawerStyle: {
            backgroundColor: '#171717',
            width: 280,
          },
        })}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Inicio',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="explore"
          options={{
            title: 'Acerca de',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="information"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="share"
          options={{
            title: 'Compartir',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="share-variant"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="web"
          options={{
            title: 'Sitio Web',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="earth" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  drawerScroll: {
    flex: 1,
    backgroundColor: '#171717',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  drawerIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#1059a3ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ececf1',
    letterSpacing: 0.3,
  },
  drawerSubtitle: {
    fontSize: 12,
    color: '#8e8ea0',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  drawerFooter: {
    marginTop: 'auto',
    paddingBottom: 20,
    paddingTop: 12,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#565869',
    marginTop: 12,
  },
})
