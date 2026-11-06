import { useMemo } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SPRITE_PORTRAITS, type SpritePortrait } from "../data/spritePortraits";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";

/** What the player picked: a bundled sprite, or a photo from their device. */
export type PortraitChoice =
  | { kind: "sprite"; id: string }
  | { kind: "upload"; uri: string }
  | null;

const pixelated = Platform.OS === "web" ? ({ imageRendering: "pixelated" } as object) : null;

export function PortraitPicker({
  value,
  onChange,
}: {
  value: PortraitChoice;
  onChange: (choice: PortraitChoice) => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const selectedSprite = value?.kind === "sprite" ? SPRITE_PORTRAITS.find((p) => p.id === value.id) : undefined;

  async function handleUpload() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"] });
    if (!result.canceled) onChange({ kind: "upload", uri: result.assets[0].uri });
  }

  function renderPreview() {
    if (value?.kind === "upload") return <Image source={{ uri: value.uri }} style={styles.previewImage} />;
    if (selectedSprite) return <Image source={selectedSprite.source} style={[styles.previewImage, pixelated]} />;
    return (
      <View style={[styles.previewImage, styles.previewEmpty]}>
        <Text style={styles.previewEmptyText}>No portrait</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.previewRow}>
        {renderPreview()}
        <View style={styles.actions}>
          <Pressable onPress={handleUpload}>
            <Text style={styles.actionText}>Upload your own</Text>
          </Pressable>
          {value && (
            <Pressable onPress={() => onChange(null)}>
              <Text style={styles.actionTextDanger}>Clear</Text>
            </Pressable>
          )}
        </View>
      </View>
      <View style={styles.grid}>
        {SPRITE_PORTRAITS.map((sprite: SpritePortrait) => {
          const selected = value?.kind === "sprite" && value.id === sprite.id;
          return (
            <Pressable
              key={sprite.id}
              accessibilityLabel={sprite.label}
              onPress={() => onChange({ kind: "sprite", id: sprite.id })}
              style={[styles.cell, selected && styles.cellActive]}
            >
              <Image source={sprite.source} style={[styles.cellImage, pixelated]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    previewRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 16 },
    previewImage: {
      width: 96,
      height: 96,
      borderRadius: theme.radius,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    previewEmpty: { alignItems: "center", justifyContent: "center" },
    previewEmptyText: { color: theme.colors.textMuted, fontSize: 12 },
    actions: { gap: 10 },
    actionText: { color: theme.colors.accent, fontSize: 15, fontWeight: "600" },
    actionTextDanger: { color: theme.colors.danger, fontSize: 15, fontWeight: "600" },
    grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
    cell: {
      width: 72,
      height: 72,
      borderRadius: theme.radius,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: 2,
    },
    cellActive: { borderColor: theme.colors.accent },
    cellImage: { width: "100%", height: "100%" },
  });
}
