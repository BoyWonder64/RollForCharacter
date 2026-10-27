import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";

type AdBannerProps = {
  placement: "top" | "bottom";
};

/**
 * Placeholder for the real ad SDK (e.g. react-native-google-mobile-ads),
 * which needs a native build (EAS) and isn't wired up yet. Renders nothing
 * unless an ad has actually loaded, instead of always showing a filler box
 * -- there's no SDK wired up yet, so `adLoaded` never flips true today, but
 * the real SDK's onAdLoaded callback should call setAdLoaded(true) once it
 * exists.
 *
 * Placement rule: only mount this on the character list screen (the
 * open/close boundary for a character), never inside the dice roller or
 * spell lookup views, and never mid-session while a character is open.
 */
export function AdBanner({ placement }: AdBannerProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [adLoaded] = useState(false);

  if (!adLoaded) return null;

  return (
    <View style={[styles.banner, placement === "top" ? styles.top : styles.bottom]}>
      <Text style={styles.label}>Ad placeholder ({placement})</Text>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    banner: {
      height: 50,
      backgroundColor: theme.colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    top: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    bottom: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    label: {
      color: theme.colors.textMuted,
      fontSize: 12,
    },
  });
}
