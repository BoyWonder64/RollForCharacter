import { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ThemeContext, resolveTheme, useThemeContext } from "./ThemeContext";
import { normalizeFamilyId } from "./colors";
import type { FontChoiceId } from "./fonts";
import type { Character } from "../types/models";

/**
 * Wraps a character-scoped screen (the character sheet and its tabs, the
 * Edit screen) so every `useTheme()`/`useThemeContext()` call beneath it
 * resolves that one character's theme/font override instead of the global
 * device setting -- `null` on either column means "use the device default,"
 * which is also what a character gets before ever picking an override.
 *
 * Deliberately NOT used on screens with no single character to speak for
 * (character list, Dice Roller, Settings) -- those stay on the plain global
 * ThemeProvider from the root layout.
 */
export function CharacterThemeProvider({
  character,
  children,
}: {
  character: Pick<Character, "themeFamily" | "fontChoice">;
  children: React.ReactNode;
}) {
  const global = useThemeContext();
  const family = normalizeFamilyId(character.themeFamily) ?? global.defaultFamily;
  const fontChoice = (character.fontChoice as FontChoiceId | null) ?? global.defaultFontChoice;
  const mode = global.theme.mode;
  const customTheme = global.customTheme;
  const transparentBoxes = global.transparentBoxes;
  // Memoised: a fresh theme object on every render would make every component below
  // rebuild its styles each time the sheet refreshes.
  const theme = useMemo(
    () => resolveTheme(family, mode, fontChoice, customTheme, transparentBoxes),
    [family, mode, fontChoice, customTheme, transparentBoxes]
  );
  const value = useMemo(() => ({ ...global, theme, family, fontChoice }), [global, theme, family, fontChoice]);

  // The root layout paints the global theme's backdrop; a character with its
  // own theme paints its own so transparent screens don't show the wrong one.
  return (
    <ThemeContext.Provider value={value}>
      <View style={{ flex: 1, backgroundColor: theme.backdrop ? theme.colors.border : theme.colors.background }}>
        {theme.backdrop ? (
          <Image
            source={theme.backdrop}
            style={StyleSheet.absoluteFill}
            resizeMode="stretch"
            pointerEvents="none"
          />
        ) : null}
        {children}
      </View>
    </ThemeContext.Provider>
  );
}
