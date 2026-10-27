import "../db/client";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { CormorantGaramond_700Bold } from "@expo-google-fonts/cormorant-garamond";
import { Cinzel_700Bold } from "@expo-google-fonts/cinzel";
import { Caveat_700Bold } from "@expo-google-fonts/caveat";
import { SpecialElite_400Regular } from "@expo-google-fonts/special-elite";
import { Orbitron_700Bold } from "@expo-google-fonts/orbitron";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";
import { KeepAwakeProvider } from "../features/settings/KeepAwakeContext";
import { DmModeProvider } from "../features/settings/DmModeContext";
import { RollHistoryProvider } from "../features/settings/RollHistoryContext";
import { IconSettingsProvider } from "../features/icons/IconSettingsContext";

SplashScreen.preventAutoHideAsync();

function ThemedRoot() {
  const theme = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontSize: 20,
            ...(theme.displayFontFamily ? { fontFamily: theme.displayFontFamily } : null),
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_700Bold,
    Cinzel_700Bold,
    Caveat_700Bold,
    SpecialElite_400Regular,
    Orbitron_700Bold,
    Alkhemikal: require("../../assets/fonts/Alkhemikal.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <KeepAwakeProvider>
            <DmModeProvider>
              <RollHistoryProvider>
                <IconSettingsProvider>
                  <ThemedRoot />
                </IconSettingsProvider>
              </RollHistoryProvider>
            </DmModeProvider>
          </KeepAwakeProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
