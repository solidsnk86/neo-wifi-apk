import { GestureHandlerRootView } from "react-native-gesture-handler";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

import {
    DrawerContentScrollView,
    DrawerItemList,
    type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { StyleSheet, Text, View } from "react-native";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawerScroll}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      {/* Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.drawerIconBox}>
          <MaterialCommunityIcons name="wifi-marker" size={32} color="#fff" />
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
        <Text style={styles.footerText}>v1.0.0 · Gabriel Calcagni</Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          headerTintColor: "#ececf1",
          headerStyle: {
            backgroundColor: "#212121",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255,255,255,0.06)",
          },
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 17,
            color: "#ececf1",
          },
          drawerActiveTintColor: "#10a37f",
          drawerInactiveTintColor: "#8e8ea0",
          drawerActiveBackgroundColor: "rgba(16,163,127,0.12)",
          drawerLabelStyle: {
            fontSize: 15,
            fontWeight: "500",
            marginLeft: -8,
          },
          drawerItemStyle: {
            borderRadius: 10,
            paddingVertical: 2,
            marginHorizontal: 8,
          },
          drawerStyle: {
            backgroundColor: "#171717",
            width: 280,
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Inicio",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="explore"
          options={{
            title: "Acerca de",
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
            title: "Compartir",
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="share-variant"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerScroll: {
    flex: 1,
    backgroundColor: "#171717",
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  drawerIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#10a37f",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ececf1",
    letterSpacing: 0.3,
  },
  drawerSubtitle: {
    fontSize: 12,
    color: "#8e8ea0",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  drawerFooter: {
    marginTop: "auto",
    paddingBottom: 20,
    paddingTop: 12,
  },
  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: "#565869",
    marginTop: 12,
  },
});
