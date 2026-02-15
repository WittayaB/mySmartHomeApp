import * as React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import SettingScreen from "./screens/SettingsScreen";
import NotificationScreen from "./screens/NotificationsScreen";

const Tab = createBottomTabNavigator();

// 🌿 ธีมสีเขียวอ่อน
const GreenTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#E9F7EF", // เขียวอ่อนสบายตา
  },
};

export default function App() {
  return (
    <NavigationContainer theme={GreenTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            if (route.name === "หน้าหลัก") iconName = focused ? "home" : "home-outline";
            else if (route.name === "ตั้งค่า") iconName = focused ? "settings" : "settings-outline";
            else if (route.name === "แจ้งเตือน")
              iconName = focused ? "notifications" : "notifications-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#2E8B57", // สีเขียวเข้มเมื่อเลือก
          tabBarInactiveTintColor: "#7FB77E", // สีเขียวอ่อนเมื่อไม่ได้เลือก
          
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: "600",
            marginBottom: 5,
          },
        })}
      >
        <Tab.Screen name="หน้าหลัก" component={HomeScreen} />
        <Tab.Screen name="ตั้งค่า" component={SettingScreen} />
        <Tab.Screen name="แจ้งเตือน" component={NotificationScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
