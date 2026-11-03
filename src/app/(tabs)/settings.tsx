import { useMemo } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Constants from "expo-constants";
import { router } from "expo-router";
import { Button } from "../../components/Button";
import { useThemeContext, type ThemePreference } from "../../theme/ThemeContext";
import { THEME_FAMILIES, type Theme, type ThemeFamilyId } from "../../theme/colors";
import { FONT_CHOICE_ORDER, FONT_CHOICES } from "../../theme/fonts";
import { useKeepAwakeSetting } from "../../features/settings/KeepAwakeContext";
import { useDmMode } from "../../features/settings/DmModeContext";
import { useDeveloperMode } from "../../features/settings/DeveloperModeContext";
import { usePartyMode } from "../../features/settings/PartyModeContext";
import { useRollHistorySetting } from "../../features/settings/RollHistoryContext";
import { useSoundSettings } from "../../features/settings/SoundSettingsContext";
import { useIconSettings } from "../../features/icons/IconSettingsContext";
import { ICON_STYLE_ORDER, ICON_STYLES } from "../../features/icons/iconStyles";
import { useAuth } from "../../features/auth/AuthContext";
import { AccountSection } from "../../features/auth/AccountSection";

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

export default function SettingsScreen() {
  const { theme, preference, setPreference, family, setFamily, fontChoice, setFontChoice } =
    useThemeContext();
  const { keepScreenOn, setKeepScreenOn } = useKeepAwakeSetting();
  const { dmMode, setDmMode } = useDmMode();
  const { developerMode, setDeveloperMode } = useDeveloperMode();
  const { partyMode, setPartyMode } = usePartyMode();
  const { historyEnabled, setHistoryEnabled } = useRollHistorySetting();
  const { soundEnabled, setSoundEnabled } = useSoundSettings();
  const { iconsEnabled, setIconsEnabled, iconStyle, setIconStyle } = useIconSettings();
  const { user } = useAuth();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const buildDiagnostics = () =>
    [
      `App version: ${Constants.expoConfig?.version ?? "unknown"}`,
      `Platform: ${Platform.OS} ${Platform.Version}`,
      `Execution environment: ${Constants.executionEnvironment ?? "unknown"}`,
      `Debug build: ${Constants.debugMode ?? __DEV__}`,
      `Device: ${Constants.deviceName ?? "unknown"}`,
      `Supabase project: ${process.env.EXPO_PUBLIC_SUPABASE_URL ?? "not configured"}`,
      `Signed in: ${user ? user.email : "no"}`,
      `DM mode: ${dmMode} · Party mode: ${partyMode} · Icons: ${iconsEnabled}`,
    ].join("\n");

  const handleShareDiagnostics = async () => {
    try {
      await Share.share({ message: buildDiagnostics() });
    } catch {
      // User cancelled the share sheet -- nothing to do.
    }
  };

  const handlePartyModeChange = (value: boolean) => {
    if (!value) {
      setPartyMode(false);
      return;
    }
    Alert.alert(
      "Premium feature",
      "Party mode connects your characters with other players over the cloud so your DM can review the party remotely. Purchasing isn't set up yet, so it's free to try during early access.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Turn on", onPress: () => setPartyMode(true) },
      ]
    );
  };

  const handleSendFeedback = async () => {
    const body = developerMode
      ? `Bug report or feature suggestion:\n\n\n\n---\nDiagnostics\n${buildDiagnostics()}`
      : "Bug report or feature suggestion:\n\n";
    const url = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
      "RollForCharacter feedback"
    )}&body=${encodeURIComponent(body)}`;
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
      <Text style={styles.sectionTitle}>Account</Text>
      <AccountSection />

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Appearance</Text>
      <View style={styles.optionRow}>
        {MODE_OPTIONS.map((option) => {
          const active = preference === option.key;
          return (
            <Button
              key={option.key}
              title={option.label}
              selected={active}
              style={styles.optionButtonWrap}
              onPress={() => setPreference(option.key)}
            />
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
        Adds an Encounter tab: roll initiative, saves and checks for the whole party at
        once, build encounters from the SRD bestiary, and roll anything on a monster&apos;s stat
        block. The Dice Roller can also switch between any character. Off by default.
      </Text>

      <View style={[styles.toggleRow, styles.toggleRowSpaced]}>
        <Text style={styles.toggleLabel}>Party mode (Premium)</Text>
        <Switch
          value={partyMode}
          onValueChange={handlePartyModeChange}
          trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.primary }}
          thumbColor={theme.colors.primaryText}
        />
      </View>
      <Text style={styles.toggleHint}>
        Paid feature. Adds a Party tab: connect with other players&apos; devices over the
        cloud, choose what your character shares, and let the DM review everyone&apos;s stats
        remotely. Off by default.
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

      <View style={[styles.toggleRow, styles.toggleRowSpaced]}>
        <Text style={styles.toggleLabel}>Sound effects</Text>
        <Switch
          value={soundEnabled}
          onValueChange={setSoundEnabled}
          trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.primary }}
          thumbColor={theme.colors.primaryText}
        />
      </View>
      <Text style={styles.toggleHint}>
        Dice rolling and button sounds. On by default.
      </Text>

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Homebrew</Text>
      <Button title="Homebrew Library" fullWidth onPress={() => router.push("/homebrew")} />
      <Text style={styles.toggleHint}>
        Create, edit, and delete your own races, classes, subclasses, weapons, armor, magic
        items, feats, monsters, abilities, and spells -- once saved here, reuse them on any
        character.
      </Text>

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Help</Text>
      <Button title="Glossary" fullWidth onPress={() => router.push("/glossary")} />
      <Text style={styles.toggleHint}>
        What CR, AC, DC, SRD, and other abbreviations mean.
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

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Legal</Text>
      <Button title="Legal & Licenses" fullWidth onPress={() => router.push("/legal")} />
      <Text style={styles.toggleHint}>
        Credits, D&amp;D content sources, and the required CC BY 4.0 / Open Game License notices.
      </Text>

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Feedback</Text>
      <Button
        title="Report a Bug / Suggest a Feature"
        textStyle={styles.feedbackButtonText}
        fullWidth
        onPress={handleSendFeedback}
      />

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Support</Text>
      <Button title="Donate" textStyle={styles.feedbackButtonText} fullWidth onPress={handleDonate} />

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Advanced</Text>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Developer mode</Text>
        <Switch
          value={developerMode}
          onValueChange={setDeveloperMode}
          trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.primary }}
          thumbColor={theme.colors.primaryText}
        />
      </View>
      <Text style={styles.toggleHint}>
        Shows app and sync diagnostics below, and attaches them to bug reports sent from this
        screen. Also forces every 5th d20 roll to a 20 and every 6th to a 1, so crit/fumble UI
        is easy to test on demand. Off by default.
      </Text>

      {developerMode && (
        <View style={[styles.creditRow, styles.toggleRowSpaced]}>
          <Text style={styles.creditText}>{buildDiagnostics()}</Text>
        </View>
      )}
      {developerMode && (
        <Button
          title="Share Diagnostics"
          textStyle={styles.feedbackButtonText}
          fullWidth
          style={styles.toggleRowSpaced}
          onPress={handleShareDiagnostics}
        />
      )}
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
    optionButtonWrap: { flex: 1 },
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
    creditText: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    feedbackButtonText: { color: theme.colors.accent },
  });
}
