import { useMemo, useState } from "react";
import {
  DICE_OVERRIDE_MODES,
  getDiceOverrideMode,
  setDiceOverride,
  type DiceOverrideMode,
} from "../../features/dice/diceEngine";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { Text, TextInput } from "../../components/AppText";
import Constants from "expo-constants";
import { router } from "expo-router";
import { Button } from "../../components/Button";
import { useThemeContext, type ThemePreference } from "../../theme/ThemeContext";
import { THEME_FAMILIES, type Theme, type ThemeFamilyId } from "../../theme/colors";
import {
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  FONT_SCALE_STEP,
  useFontScale,
} from "../../features/settings/FontScaleContext";
import { FONT_CHOICE_ORDER, FONT_CHOICES } from "../../theme/fonts";
import { useKeepAwakeSetting } from "../../features/settings/KeepAwakeContext";
import { DM_EDITION_OPTIONS, useDmMode } from "../../features/settings/DmModeContext";
import { useDeveloperMode } from "../../features/settings/DeveloperModeContext";
import { usePartyMode } from "../../features/settings/PartyModeContext";
import { useRollHistorySetting } from "../../features/settings/RollHistoryContext";
import { useSoundSettings } from "../../features/settings/SoundSettingsContext";
import { useIconSettings } from "../../features/icons/IconSettingsContext";
import {
  AUTO_ICON_STYLE_OPTION,
  ICON_STYLE_ORDER,
  ICON_STYLES,
  type IconStylePreference,
} from "../../features/icons/iconStyles";
import { DevToolsSection } from "../../features/dev/DevToolsSection";
import { useAuth } from "../../features/auth/AuthContext";
import { AccountSection } from "../../features/auth/AccountSection";
import { DoneAccessory } from "../../components/DoneAccessory";

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

// Developer-mode only: which pixel-art packs the app currently draws from.
const PIXEL_PACKS_IN_USE: { name: string; usedFor: string }[] = [
  { name: "Raven Fantasy Icons (Clockwork Raven)", usedFor: "equipment, spell school, tab bar, condition icons" },
  { name: "Pixel Dice Sprites (LullabyJazz)", usedFor: "dice faces" },
  { name: "32rogues (Seth Boyles)", usedFor: "character portraits" },
  { name: "Medieval Pixel font (Alkhemikal)", usedFor: "pixel font option" },
];

/** Host only -- the full project URL isn't needed to debug and shouldn't ride along in shared reports. */
function supabaseHost(): string {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!url) return "not configured";
  try {
    return new URL(url).host;
  } catch {
    return "invalid URL";
  }
}

const FEEDBACK_EMAIL ="maitland.andrus@gmail.com";
const DONATE_URL = "";

export default function SettingsScreen() {
  const { theme, preference, setPreference, family, setFamily, fontChoice, setFontChoice } =
    useThemeContext();
  const { fontScale, setFontScale } = useFontScale();
  const { keepScreenOn, setKeepScreenOn } = useKeepAwakeSetting();
  const { dmMode, setDmMode, dmEdition, setDmEdition } = useDmMode();
  const { developerMode, setDeveloperMode } = useDeveloperMode();
  const { partyMode, setPartyMode } = usePartyMode();
  const { historyEnabled, setHistoryEnabled } = useRollHistorySetting();
  const { soundEnabled, setSoundEnabled } = useSoundSettings();
  const { iconsEnabled, setIconsEnabled, iconStylePreference, setIconStyle } = useIconSettings();
  const { user } = useAuth();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [diceMode, setDiceMode] = useState<DiceOverrideMode>(getDiceOverrideMode());
  const [seedText, setSeedText] = useState("1");

  const handleDiceModeChange = (mode: DiceOverrideMode) => {
    const parsed = parseInt(seedText, 10);
    setDiceOverride(mode, Number.isFinite(parsed) ? parsed : 1);
    setDiceMode(mode);
  };

  const buildDiagnostics = () =>
    [
      `App version: ${Constants.expoConfig?.version ?? "unknown"}`,
      `Platform: ${Platform.OS} ${Platform.Version}`,
      `Execution environment: ${Constants.executionEnvironment ?? "unknown"}`,
      `Debug build: ${Constants.debugMode ?? __DEV__}`,
      `Device: ${Constants.deviceName ?? "unknown"}`,
      `Supabase host: ${supabaseHost()}`,
      `Signed in: ${user ? "yes" : "no"}`,
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

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Homebrew</Text>
      <Button title="Homebrew Library" fullWidth onPress={() => router.push("/homebrew")} />

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
        Default for characters without their own look (set in Edit → Appearance).
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

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Accessibility</Text>
      <Text style={styles.toggleLabel}>Text size: {Math.round(fontScale * 100)}%</Text>
      <Text style={styles.hint}>Scales text throughout the app.</Text>
      <View style={styles.optionRow}>
        <Button
          title="A−"
          style={styles.optionButtonWrap}
          disabled={fontScale <= FONT_SCALE_MIN}
          onPress={() => setFontScale(fontScale - FONT_SCALE_STEP)}
        />
        <Button
          title="Reset"
          style={styles.optionButtonWrap}
          disabled={fontScale === 1}
          onPress={() => setFontScale(1)}
        />
        <Button
          title="A+"
          style={styles.optionButtonWrap}
          disabled={fontScale >= FONT_SCALE_MAX}
          onPress={() => setFontScale(fontScale + FONT_SCALE_STEP)}
        />
      </View>

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Icons & Sound</Text>
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
          <Text style={styles.toggleLabel}>Icon style</Text>
          {(["auto", ...ICON_STYLE_ORDER] as IconStylePreference[]).map((styleId) => {
            const option = styleId === "auto" ? AUTO_ICON_STYLE_OPTION : ICON_STYLES[styleId];
            const active = iconStylePreference === styleId;
            return (
              <Pressable
                key={styleId}
                style={[styles.familyRow, active && styles.familyRowActive]}
                onPress={() => setIconStyle(styleId)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.familyLabel, active && styles.familyLabelActive]}>
                    {option.label}
                  </Text>
                  <Text style={styles.iconStyleDescription}>{option.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={[styles.toggleRow, styles.toggleRowSpaced]}>
        <Text style={styles.toggleLabel}>Sound effects</Text>
        <Switch
          value={soundEnabled}
          onValueChange={setSoundEnabled}
          trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.primary }}
          thumbColor={theme.colors.primaryText}
        />
      </View>

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
        Log of recent rolls on the Dice Roller.
      </Text>

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Game Modes</Text>
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
        Adds an Encounter tab with party rolls and the SRD bestiary.
      </Text>

      {dmMode && (
        <View
          style={{
            marginTop: 8,
            marginLeft: 4,
            paddingLeft: 12,
            borderLeftWidth: 3,
            borderLeftColor: theme.colors.primary,
          }}
        >
          <Text style={styles.toggleLabel}>DM edition</Text>
          {DM_EDITION_OPTIONS.map((option) => {
            const active = dmEdition === option.key;
            return (
              <Pressable
                key={option.key}
                style={[styles.familyRow, active && styles.familyRowActive]}
                onPress={() => setDmEdition(option.key)}
              >
                <Text style={[styles.familyLabel, active && styles.familyLabelActive]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

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
        Adds a Party tab to share characters with your group online.
      </Text>

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Help</Text>
      <Button
        title="Glossary"
        fullWidth
        onPress={() => router.push("/glossary")}
      />

      <Button
        title="Legal & Licenses"
        fullWidth
        style={styles.toggleRowSpaced}
        onPress={() => router.push("/legal")}
      />

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Feedback & Support</Text>
      <Button
        title="Report a Bug / Suggest a Feature"
        textStyle={styles.feedbackButtonText}
        fullWidth
        onPress={handleSendFeedback}
      />
      <Button
        title="Donate"
        textStyle={styles.feedbackButtonText}
        fullWidth
        style={styles.toggleRowSpaced}
        onPress={handleDonate}
      />

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Advanced</Text>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Developer mode</Text>
        <Switch
          value={developerMode}
          onValueChange={(value) => {
            setDeveloperMode(value);
            if (!value) setDiceMode("random");
          }}
          trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.primary }}
          thumbColor={theme.colors.primaryText}
        />
      </View>
      <Text style={styles.toggleHint}>
        Shows diagnostics and attaches them to bug reports.
      </Text>

      {developerMode && (
        <View style={[styles.creditRow, styles.toggleRowSpaced]}>
          <Text style={styles.creditText}>{buildDiagnostics()}</Text>
        </View>
      )}
      {developerMode && (
        <View style={[styles.creditRow, styles.toggleRowSpaced]}>
          <Text style={styles.toggleLabel}>Pixel packs in use</Text>
          {PIXEL_PACKS_IN_USE.map((pack) => (
            <Text key={pack.name} style={styles.creditText}>
              {`• ${pack.name} — ${pack.usedFor}`}
            </Text>
          ))}
        </View>
      )}
      {developerMode && (
        <View style={[styles.creditRow, styles.toggleRowSpaced]}>
          <Text style={styles.toggleLabel}>Dice override</Text>
          <Text style={styles.toggleHint}>
            Every roll in the app (dice roller, character sheet, level-up HP, stat rolling, DM
            monster rolls) is made one die at a time. Normally each die is random. Pick a mode below
            to control the dice while testing. It resets to Random when Developer mode is turned off
            or the app restarts.
          </Text>
          <Text style={styles.diceModeDescription}>
            {DICE_OVERRIDE_MODES.find((m) => m.key === diceMode)?.description}
          </Text>
          <View style={styles.diceOverrideRow}>
            {DICE_OVERRIDE_MODES.map((option) => {
              const active = diceMode === option.key;
              return (
                <Pressable
                  key={option.key}
                  style={[styles.familyRow, styles.diceOverrideChip, active && styles.familyRowActive]}
                  onPress={() => handleDiceModeChange(option.key)}
                >
                  <Text style={[styles.familyLabel, active && styles.familyLabelActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {diceMode === "seeded" && (
            <View style={styles.seedRow}>
              <DoneAccessory id="done-settings" />
              <TextInput
                style={styles.seedInput}
                value={seedText}
                onChangeText={setSeedText}
                keyboardType="number-pad" inputAccessoryViewID="done-settings"
                placeholder="Seed"
                placeholderTextColor={theme.colors.textMuted}
              />
              <Button title="Restart sequence" onPress={() => handleDiceModeChange("seeded")} />
            </View>
          )}
        </View>
      )}
      {developerMode && <DevToolsSection />}
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
    container: { flex: 1, backgroundColor: theme.screenBackground },
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
    diceModeDescription: { color: theme.colors.text, fontSize: 13, marginTop: 10 },
    diceOverrideRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
    diceOverrideChip: { paddingHorizontal: 14 },
    seedRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
    seedInput: {
      flex: 1,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
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
    iconStyleDescription: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
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
