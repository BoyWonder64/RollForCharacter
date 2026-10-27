import { Image } from "react-native";
import { Tabs } from "expo-router";
import { useTheme } from "../../theme/ThemeContext";
import { useIconSettings } from "../../features/icons/IconSettingsContext";
import { getTabIcon } from "../../features/icons/iconAssets";

function TabIcon({ tabName, focused }: { tabName: string; focused: boolean }) {
  const { iconsEnabled, iconStyle } = useIconSettings();
  if (!iconsEnabled) return null;
  const icon = getTabIcon(iconStyle, tabName);
  if (!icon) return null;
  return (
    <Image
      source={icon}
      style={{ width: 24, height: 24, opacity: focused ? 1 : 0.5 }}
      resizeMode="contain"
    />
  );
}

export default function TabLayout() {
  const theme = useTheme();
  const { iconsEnabled } = useIconSettings();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        // Without icons, the default label layout still reserves the icon's
        // vertical space above the text, so it reads as off-center. Centering
        // the label and dropping the icon-reserved margin fixes that.
        ...(iconsEnabled
          ? null
          : {
              tabBarLabelPosition: "below-icon" as const,
              tabBarItemStyle: { justifyContent: "center" as const },
              tabBarIconStyle: { width: 0, height: 0, margin: 0 },
              tabBarLabelStyle: { marginTop: 0 },
            }),
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontSize: 20,
          ...(theme.displayFontFamily ? { fontFamily: theme.displayFontFamily } : null),
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="characters"
        options={{
          title: "Characters",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon tabName="characters" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="dice-roller"
        options={{
          title: "Dice Roller",
          tabBarIcon: ({ focused }) => <TabIcon tabName="dice-roller" focused={focused} />,
        }}
      />
      {/* Settings keeps the system font so its own picker stays readable
          no matter which font is currently selected. */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitleStyle: { fontSize: 20 },
          tabBarIcon: ({ focused }) => <TabIcon tabName="settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
