import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import DashboardScreen from "./src/screens/DashboardScreen";
import ChatScreen from "./src/screens/ChatScreen";
import { COLORS } from "./src/constants/theme";
import "./src/locales/i18n";

const Tab = createBottomTabNavigator();

export default function App() {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Üst başlıkları kapatıyoruz, ekranların içinde kendi header'ımız var
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.border,
            elevation: 0, // Android gölgesini kaldır
            shadowOpacity: 0, // iOS gölgesini kaldır
            paddingBottom: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginTop: -5,
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ tabBarLabel: t("nav.dashboard") }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{ tabBarLabel: t("nav.chat") }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
