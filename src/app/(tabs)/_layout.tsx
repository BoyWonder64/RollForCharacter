import { Tabs } from "expo-router";
import { useTheme } from "../../theme/ThemeContext";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen name="characters" options={{ title: "Characters", headerShown: false }} />
      <Tabs.Screen name="dice-roller" options={{ title: "Dice Roller" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
