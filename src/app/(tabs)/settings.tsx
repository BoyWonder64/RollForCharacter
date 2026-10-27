import { useMemo } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useThemeContext, type ThemePreference } from "../../theme/ThemeContext";
import { THEME_FAMILIES, type Theme, type ThemeFamilyId } from "../../theme/colors";
import { FONT_CHOICE_ORDER, FONT_CHOICES } from "../../theme/fonts";
import { useKeepAwakeSetting } from "../../features/settings/KeepAwakeContext";
import { useDmMode } from "../../features/settings/DmModeContext";
import { useRollHistorySetting } from "../../features/settings/RollHistoryContext";
import { useIconSettings } from "../../features/icons/IconSettingsContext";
import { ICON_STYLE_ORDER, ICON_STYLES } from "../../features/icons/iconStyles";

const MODE_OPTIONS: { key: ThemePreference; label: string }[] = [
  { key: "system", label: "System" },
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
];

const FAMILY_ORDER: ThemeFamilyId[] = [
  "crimson",
  "classic",
  "parchment",
  "grimdark",
  "journal",
  "steampunk",
  "scifi",
  "shadow",
  "western",
  "galaxy",
];

const FEEDBACK_EMAIL = "maitland.andrus@gmail.com";
const DONATE_URL = "";

const CREDITS: { title: string; text: string }[] = [
  {
    title: '"Medieval Pixel" font',
    text: "Alkhemikal by jeti (dafont.com), CC BY 4.0.",
  },
  {
    title: "Clockwork Raven – Additional Art Assets",
    text: "Equipment, spell school, and tab bar icons.",
  },
];

// D&D rules content sources used by this app's catalogs (races, classes,
// spells, feats, magic items, monsters, conditions). Wizards of the Coast
// SRD content only (CC BY 4.0, attribution-only) -- third-party publishers
// (Kobold Press, EN Publishing/Level Up A5E, Open Design LLC) were pulled
// in during an earlier pass and then removed at the user's request, so
// this list and this app's catalogs are WotC-only going forward. See
// docs/DND_CONTENT_SOURCES.md for the full research/reversal history.
const DND_CONTENT_SOURCES: { title: string; publisher: string; license: string; url: string }[] = [
  {
    title: "System Reference Document 5.1 (2014 rules)",
    publisher: "Wizards of the Coast",
    license: "CC BY 4.0",
    url: "https://dnd.wizards.com/resources/systems-reference-document",
  },
  {
    title: "System Reference Document 5.2 (2024 rules)",
    publisher: "Wizards of the Coast",
    license: "CC BY 4.0",
    url: "https://dnd.wizards.com/resources/systems-reference-document",
  },
];

export default function SettingsScreen() {
  const { theme, preference, setPreference, family, setFamily, fontChoice, setFontChoice } =
    useThemeContext();
  const { keepScreenOn, setKeepScreenOn } = useKeepAwakeSetting();
  const { dmMode, setDmMode } = useDmMode();
  const { historyEnabled, setHistoryEnabled } = useRollHistorySetting();
  const { iconsEnabled, setIconsEnabled, iconStyle, setIconStyle } = useIconSettings();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleSendFeedback = async () => {
    const url = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
      "RollForCharacter feedback"
    )}&body=${encodeURIComponent("Bug report or feature suggestion:\n\n")}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        throw new Error("mailto not supported");
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Couldn't open email app",
        `Send feedback to ${FEEDBACK_EMAIL}`
      );
    }
  };

  const handleDonate = async () => {
    if (!DONATE_URL) {
      Alert.alert("Coming soon", "Donation links aren't set up yet — check back later!");
      return;
    }
    try {
      await Linking.openURL(DONATE_URL);
    } catch {
      Alert.alert("Couldn't open link", DONATE_URL);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.sectionTitle}>Appearance</Text>
      <View style={styles.optionRow}>
        {MODE_OPTIONS.map((option) => {
          const active = preference === option.key;
          return (
            <Pressable
              key={option.key}
              style={[styles.optionButton, active && styles.optionButtonActive]}
              onPress={() => setPreference(option.key)}
            >
              <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Theme</Text>
      <Text style={styles.hint}>
        This is your device&apos;s default theme and font, used by any character that
        hasn&apos;t set its own. To give one character a different look, open that
        character&apos;s Edit screen → Appearance instead.
      </Text>
      {FAMILY_ORDER.map((familyId) => {
        const definition = THEME_FAMILIES[familyId];
        const active = family === familyId;
        const swatchColors = theme.mode === "dark" ? definition.dark : definition.light;
        return (
          <Pressable
            key={familyId}
            style={[styles.familyRow, active && styles.familyRowActive]}
            onPress={() => setFamily(familyId)}
          >
            <View
              style={[styles.swatch, { backgroundColor: swatchColors.primary }]}
            />
            <Text style={[styles.familyLabel, active && styles.familyLabelActive]}>
              {definition.label}
            </Text>
          </Pressable>
        );
      })}

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Font</Text>
      {FONT_CHOICE_ORDER.map((fontId) => {
        const option = FONT_CHOICES[fontId];
        const active = fontChoice === fontId;
        return (
          <Pressable
            key={fontId}
            style={[styles.familyRow, active && styles.familyRowActive]}
            onPress={() => setFontChoice(fontId)}
          >
            <Text
              style={[
                styles.familyLabel,
                active && styles.familyLabelActive,
                option.fontFamily ? { fontFamily: option.fontFamily } : null,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Device</Text>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Keep screen on</Text>
        <Switch
          value={keepScreenOn}
          onValueChange={setKeepScreenOn}
          trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.primary }}
          thumbColor={theme.colors.primaryText}
        />
      </View>

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Gameplay</Text>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>DM mode</Text>
        <Switch
          value={dmMode}
          onValueChange={setDmMode}
          trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.primary }}
          thumbColor={theme.colors.primaryText}
        />
      </View>
      <Text style={styles.toggleHint}>
        Lets the Dice Roller switch between any character (for rolling on behalf of the
        party or NPCs). Off by default — normally the Dice Roller just rolls for your own
        character.
      </Text>

      <View style={[styles.toggleRow, styles.toggleRowSpaced]}>
        <Text style={styles.toggleLabel}>Roll history</Text>
        <Switch
          value={historyEnabled}
          onValueChange={setHistoryEnabled}
          trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.primary }}
          thumbColor={theme.colors.primaryText}
        />
      </View>
      <Text style={styles.toggleHint}>
        Keeps a log of recent rolls on the Dice Roller screen. Turn off to stop saving rolls
        entirely.
      </Text>

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Icons</Text>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Show icons</Text>
        <Switch
          value={iconsEnabled}
          onValueChange={setIconsEnabled}
          trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.primary }}
          thumbColor={theme.colors.primaryText}
        />
      </View>
      {iconsEnabled && (
        <View style={styles.iconStyleList}>
          {ICON_STYLE_ORDER.map((styleId) => {
            const option = ICON_STYLES[styleId];
            const active = iconStyle === styleId;
            return (
              <Pressable
                key={styleId}
                style={[styles.familyRow, active && styles.familyRowActive]}
                onPress={() => setIconStyle(styleId)}
              >
                <Text style={[styles.familyLabel, active && styles.familyLabelActive]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Credits</Text>
      {CREDITS.map((credit) => (
        <View key={credit.title} style={styles.creditRow}>
          <Text style={styles.creditTitle}>{credit.title}</Text>
          <Text style={styles.creditText}>{credit.text}</Text>
        </View>
      ))}

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>D&amp;D Content Sources</Text>
      <Text style={styles.hint}>
        Races, classes, spells, feats, magic items, monsters, and conditions in this app are
        drawn from these openly-licensed rules documents, used under their Creative Commons
        attribution terms.
      </Text>
      {DND_CONTENT_SOURCES.map((source) => (
        <Pressable
          key={source.title}
          style={styles.creditRow}
          onPress={() => Linking.openURL(source.url).catch(() => {})}
        >
          <Text style={styles.creditTitle}>{source.title}</Text>
          <Text style={styles.creditText}>
            {source.publisher} · {source.license}
          </Text>
        </Pressable>
      ))}

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Feedback</Text>
      <Pressable style={styles.feedbackButton} onPress={handleSendFeedback}>
        <Text style={styles.feedbackButtonText}>Report a Bug / Suggest a Feature</Text>
      </Pressable>

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Support</Text>
      <Pressable style={styles.feedbackButton} onPress={handleDonate}>
        <Text style={styles.feedbackButtonText}>Donate</Text>
      </Pressable>
    </ScrollView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: 16, paddingBottom: 32 },
    // Settings intentionally never uses theme.displayFontFamily -- this
    // screen stays legible in the system font no matter which font is
    // currently selected elsewhere in the app.
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 12,
    },
    themeSectionTitle: { marginTop: 24 },
    hint: { color: theme.colors.textMuted, fontSize: 12, marginBottom: 10 },
    optionRow: { flexDirection: "row", gap: 8 },
    optionButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    optionButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    optionLabel: { color: theme.colors.text, fontWeight: "600" },
    optionLabelActive: { color: theme.colors.primaryText },
    familyRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      marginBottom: 8,
    },
    familyRowActive: { borderColor: theme.colors.primary },
    swatch: {
      width: 24,
      height: 24,
      borderRadius: theme.radius,
    },
    familyLabel: { color: theme.colors.text, fontWeight: "600" },
    familyLabelActive: { color: theme.colors.accent },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
    },
    toggleRowSpaced: { marginTop: 12 },
    toggleLabel: { color: theme.colors.text, fontWeight: "600" },
    toggleHint: { color: theme.colors.textMuted, fontSize: 12, marginTop: 6, marginBottom: 4 },
    iconStyleList: { marginTop: 8 },
    creditRow: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      marginBottom: 8,
    },
    creditTitle: { color: theme.colors.text, fontWeight: "600" },
    creditText: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    feedbackButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    feedbackButtonText: { color: theme.colors.accent, fontWeight: "600" },
  });
}
