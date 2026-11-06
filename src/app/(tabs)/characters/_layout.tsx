import { Stack } from "expo-router";
import { useTheme } from "../../../theme/ThemeContext";
import { useFontScale } from "../../../features/settings/FontScaleContext";

export default function CharactersStackLayout() {
  const theme = useTheme();
  const { fontScale } = useFontScale();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontSize: 20 * fontScale,
          ...(theme.displayFontFamily ? { fontFamily: theme.displayFontFamily } : null),
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Characters" }} />
      <Stack.Screen name="new" options={{ title: "New Character" }} />
      <Stack.Screen name="[characterId]/index" options={{ title: "Character" }} />
      <Stack.Screen name="[characterId]/edit" options={{ title: "Edit Character" }} />
    </Stack>
  );
}
