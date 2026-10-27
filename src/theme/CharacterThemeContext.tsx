import { ThemeContext, resolveTheme, useThemeContext } from "./ThemeContext";
import type { ThemeFamilyId } from "./colors";
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
  const family = (character.themeFamily as ThemeFamilyId | null) ?? global.family;
  const fontChoice = (character.fontChoice as FontChoiceId | null) ?? global.fontChoice;
  const theme = resolveTheme(family, global.theme.mode, fontChoice);

  const value = {
    ...global,
    theme,
    family,
    fontChoice,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
