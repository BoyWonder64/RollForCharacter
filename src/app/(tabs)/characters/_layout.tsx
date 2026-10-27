import { Stack } from "expo-router";
import { useTheme } from "../../../theme/ThemeContext";

export default function CharactersStackLayout() {
  const theme = useTheme();

  return (
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
      <Stack.Screen name="index" options={{ title: "Characters" }} />
      <Stack.Screen name="new" options={{ title: "New Character" }} />
      <Stack.Screen name="[characterId]/index" options={{ title: "Character" }} />
      <Stack.Screen name="[characterId]/edit" options={{ title: "Edit Character" }} />
    </Stack>
  );
}
