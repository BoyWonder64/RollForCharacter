import { useMemo } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Text } from "./AppText";
import { useThemeContext } from "../theme/ThemeContext";
import { THEME_FAMILIES, type BaseThemeFamilyId, type Theme } from "../theme/colors";
import { CUSTOM_FRAMES, CUSTOM_SCROLLS } from "../theme/customPixelAssets";
import { CUSTOM_BANNER_COUNT, CUSTOM_FRAME_COUNT } from "../theme/pixelKits";
import { withAlpha } from "../theme/alpha";

// Built-in themes the Custom look can borrow its colours, font and background from.
const BASE_ORDER: BaseThemeFamilyId[] = [
  "crimson",
  "classic",
  "grimdark",
  "journal",
  "steampunk",
  "scifi",
  "shadow",
  "darkmagic",
  "western",
  "galaxy",
  "water",
];

const FRAME_NUMBERS = Array.from({ length: CUSTOM_FRAME_COUNT }, (_, i) => i + 1);
const BANNER_NUMBERS = Array.from({ length: CUSTOM_BANNER_COUNT }, (_, i) => i + 1);

/**
 * Settings panel shown while the Custom theme is selected: pick which built-in
 * theme supplies the colours/background, then any border colour and banner colour.
 * Changes apply live (the screen is drawn with the theme being edited).
 */
export function CustomThemeEditor() {
  const { theme, customTheme, setCustomTheme } = useThemeContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Colors &amp; background</Text>
      <View style={styles.wrap}>
        {BASE_ORDER.map((id) => {
          const def = THEME_FAMILIES[id];
          const active = customTheme.base === id;
          const swatch = (theme.mode === "dark" ? def.dark : def.light).primary;
          return (
            <Pressable
              key={id}
              style={[styles.baseChip, active && styles.activeChip]}
              onPress={() => setCustomTheme({ ...customTheme, base: id })}
            >
              <View style={[styles.swatch, { backgroundColor: swatch }]} />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{def.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Border color</Text>
      <View style={styles.wrap}>
        {FRAME_NUMBERS.map((n) => (
          <Pressable
            key={n}
            style={[styles.thumb, customTheme.frame === n && styles.thumbActive]}
            onPress={() => setCustomTheme({ ...customTheme, frame: n })}
          >
            <Image source={CUSTOM_FRAMES[n]} style={styles.frameImage} resizeMode="contain" />
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Banner color</Text>
      <View style={styles.wrap}>
        {BANNER_NUMBERS.map((n) => (
          <Pressable
            key={n}
            style={[styles.thumb, customTheme.banner === n && styles.thumbActive]}
            onPress={() => setCustomTheme({ ...customTheme, banner: n })}
          >
            <View style={styles.scrollRow}>
              <Image source={CUSTOM_SCROLLS[n].left} style={styles.scrollCap} resizeMode="stretch" />
              <Image source={CUSTOM_SCROLLS[n].mid} style={styles.scrollMid} resizeMode="stretch" />
              <Image source={CUSTOM_SCROLLS[n].right} style={styles.scrollCap} resizeMode="stretch" />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { marginTop: 4, marginBottom: 8 },
    label: {
      color: theme.colors.textMuted,
      fontSize: 13,
      fontWeight: "700",
      marginTop: 12,
      marginBottom: 8,
      textAlign: "center",
    },
    wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" },
    baseChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: withAlpha(theme.colors.surface, theme.boxAlpha),
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    activeChip: { borderColor: theme.colors.primary, backgroundColor: theme.colors.surfaceAlt },
    swatch: { width: 14, height: 14, borderRadius: theme.radius },
    chipText: { color: theme.colors.text, fontWeight: "600", fontSize: 13 },
    chipTextActive: { color: theme.colors.accent },
    thumb: {
      backgroundColor: withAlpha(theme.colors.surface, theme.boxAlpha),
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 4,
    },
    thumbActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.surfaceAlt },
    frameImage: { width: 44, height: 44 },
    scrollRow: { flexDirection: "row", height: 30, width: 96 },
    scrollCap: { width: 15, height: 30 },
    scrollMid: { flex: 1, height: 30, marginHorizontal: -2 },
  });
}
