import { useMemo, useState } from "react";
import { ThemeBackdropArt } from "../../components/ThemeBackdropArt";
import { CustomThemeEditor } from "../../components/CustomThemeEditor";
import { PixelFrameOverlay, SectionHeading } from "../../components/PixelFrame";
import {
  DICE_OVERRIDE_MODES,
  getDiceOverrideMode,
  setDiceOverride,
  type DiceOverrideMode,
} from "../../features/dice/diceEngine";
import { Alert, Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Switch, View } from "react-native";
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
  "grimdark",
  "journal",
  "steampunk",
  "scifi",
  "shadow",
  "darkmagic",
  "western",
  "galaxy",
  "water",
  "custom",
];

// Developer-mode only: which pixel-art packs the app currently draws from.
const PIXEL_PACKS_IN_USE: { name: string; usedFor: string }[] = [
  {
    name: "Raven Fantasy Icons (Clockwork Raven)",
    usedFor: "equipment, spell school, tab bar, condition icons",
  },
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

/** Text that would otherwise float directly on the themed backdrop: gets the same framed surface as the rows. */
function Note({
  styles,
  text,
  label,
  spaced = false,
}: {
  styles: ReturnType<typeof createStyles>;
  text?: string;
  label?: string;
  spaced?: boolean;
}) {
  return (
    <View style={[styles.noteCard, spaced && styles.noteCardSpaced]}>
      {label ? <Text style={styles.toggleLabel}>{label}</Text> : null}
      {text ? <Text style={styles.noteText}>{text}</Text> : null}
    </View>
  );
}

const FEEDBACK_EMAIL ="maitland.andrus@gmail.com";
const DONATE_URL = "";

export default function SettingsScreen() {
  const { theme, preference, setPreference, family, setFamily, fontChoice, setFontChoice, activeCharacterName } =
    useThemeContext();
  const { fontScale, setFontScale } = useFontScale();
  const { keepScreenOn, setKeepScreenOn } = useKeepAwakeSetting();
  const { dmMode, setDmMode, dmEdition, setDmEdition } = useDmMode();
  const { developerMode, setDeveloperMode } = useDeveloperMode();
  const { partyMode, setPartyMode } = usePartyMode();
  const { historyEnabled, setHistoryEnabled } = useRollHistorySetting();
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
      ],
    );
  };

  const handleSendFeedback = async () => {
    const body = developerMode
      ? `Bug report or feature suggestion:\n\n\n\n---\nDiagnostics\n${buildDiagnostics()}`
      : "Bug report or feature suggestion:\n\n";
    const url = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
      "RollForCharacter feedback",
    )}&body=${encodeURIComponent(body)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        throw new Error("mailto not supported");
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert("Couldn't open email app", `Send feedback to ${FEEDBACK_EMAIL}`);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={{ flexGrow: 1 }}>
        <ThemeBackdropArt />
        <SectionHeading title="Homebrew" textStyle={[styles.sectionTitle, styles.themeSectionTitle]} centered />
        <Button title="Homebrew Library" fullWidth onPress={() => router.push("/homebrew")} />

        <SectionHeading title="Appearance" textStyle={[styles.sectionTitle, styles.themeSectionTitle]} centered />
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

        <SectionHeading title="Theme" textStyle={[styles.sectionTitle, styles.themeSectionTitle]} centered />
        <Note
          styles={styles}
          text={
            activeCharacterName
              ? `Theme for ${activeCharacterName}. Each character keeps their own; switch characters on the Characters tab.`
              : "Default theme. Open a character to give them their own."
          }
        />
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
              <PixelFrameOverlay scale={0.75} />
              <View style={[styles.swatch, { backgroundColor: swatchColors.primary }]} />
              <Text style={[styles.familyLabel, active && styles.familyLabelActive]}>{definition.label}</Text>
            </Pressable>
          );
        })}

        {family === "custom" && <CustomThemeEditor />}

        <SectionHeading title="Font" textStyle={[styles.sectionTitle, styles.themeSectionTitle]} centered />
        {FONT_CHOICE_ORDER.map((fontId) => {
          const option = FONT_CHOICES[fontId];
          const active = fontChoice === fontId;
          return (
            <Pressable
              key={fontId}
              style={[styles.familyRow, active && styles.familyRowActive]}
              onPress={() => setFontChoice(fontId)}
            >
              <PixelFrameOverlay scale={0.75} />
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

        <SectionHeading title="Accessibility" textStyle={[styles.sectionTitle, styles.themeSectionTitle]} centered />
        <View style={styles.noteCard}>
          <Text style={styles.toggleLabel}>Text size: {Math.round(fontScale * 100)}%</Text>
          <Text style={styles.noteText}>Scales text throughout the app.</Text>
        </View>
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

        <SectionHeading title="Icons & Sound" textStyle={[styles.sectionTitle, styles.themeSectionTitle]} centered />
        <View style={styles.toggleRow}>
          <PixelFrameOverlay scale={0.75} />
          <Text style={styles.toggleLabel}>Show icons</Text>
          <Switch
            value={iconsEnabled}
            onValueChange={setIconsEnabled}
            trackColor={{
              false: theme.colors.surfaceAlt,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.primaryText}
          />
        </View>
        {iconsEnabled && (
          <View style={styles.iconStyleList}>
            <Note styles={styles} label="Icon style" spaced />
            {(["auto", ...ICON_STYLE_ORDER] as IconStylePreference[]).map((styleId) => {
              const option = styleId === "auto" ? AUTO_ICON_STYLE_OPTION : ICON_STYLES[styleId];
              const active = iconStylePreference === styleId;
              return (
                <Pressable
                  key={styleId}
                  style={[styles.familyRow, active && styles.familyRowActive]}
                  onPress={() => setIconStyle(styleId)}
                >
                  <PixelFrameOverlay scale={0.75} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.familyLabel, active && styles.familyLabelActive]}>{option.label}</Text>
                    <Text style={styles.iconStyleDescription}>{option.description}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <SectionHeading title="Device" textStyle={[styles.sectionTitle, styles.themeSectionTitle]} centered />
        <View style={styles.toggleRow}>
          <PixelFrameOverlay scale={0.75} />
          <Text style={styles.toggleLabel}>Keep screen on</Text>
          <Switch
            value={keepScreenOn}
            onValueChange={setKeepScreenOn}
            trackColor={{
              false: theme.colors.surfaceAlt,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.primaryText}
          />
        </View>

        <View style={[styles.toggleRow, styles.toggleRowSpaced]}>
          <PixelFrameOverlay scale={0.75} />
          <Text style={styles.toggleLabel}>Roll history</Text>
          <Switch
            value={historyEnabled}
            onValueChange={setHistoryEnabled}
            trackColor={{
              false: theme.colors.surfaceAlt,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.primaryText}
          />
        </View>
        <Note styles={styles} text="Log of recent rolls on the Dice Roller." spaced />

        <SectionHeading title="Game Modes" textStyle={[styles.sectionTitle, styles.themeSectionTitle]} centered />
        <View style={styles.toggleRow}>
          <PixelFrameOverlay scale={0.75} />
          <Text style={styles.toggleLabel}>DM mode</Text>
          <Switch
            value={dmMode}
            onValueChange={setDmMode}
            trackColor={{
              false: theme.colors.surfaceAlt,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.primaryText}
          />
        </View>
        <Note styles={styles} text="Adds an Encounter tab with party rolls and the SRD bestiary." spaced />

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
            <Note styles={styles} label="DM edition" />
            {DM_EDITION_OPTIONS.map((option) => {
              const active = dmEdition === option.key;
              return (
                <Pressable
                  key={option.key}
                  style={[styles.familyRow, active && styles.familyRowActive]}
                  onPress={() => setDmEdition(option.key)}
                >
                  <PixelFrameOverlay scale={0.75} />
                  <Text style={[styles.familyLabel, active && styles.familyLabelActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={[styles.toggleRow, styles.toggleRowSpaced]}>
          <PixelFrameOverlay scale={0.75} />
          <Text style={styles.toggleLabel}>Party mode (Premium)</Text>
          <Switch
            value={partyMode}
            onValueChange={handlePartyModeChange}
            trackColor={{
              false: theme.colors.surfaceAlt,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.primaryText}
          />
        </View>
        <Note styles={styles} text="Adds a Party tab to share characters with your group online." spaced />

        <SectionHeading title="Help" textStyle={[styles.sectionTitle, styles.themeSectionTitle]} centered />
        <Button title="Glossary" fullWidth onPress={() => router.push("/glossary")} />

        <Button
          title="Legal & Licenses"
          fullWidth
          style={styles.toggleRowSpaced}
          onPress={() => router.push("/legal")}
        />

        <SectionHeading
          title="Feedback & Support"
          textStyle={[styles.sectionTitle, styles.themeSectionTitle]}
          centered
        />
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

        <SectionHeading title="Advanced" textStyle={[styles.sectionTitle, styles.themeSectionTitle]} centered />
        <View style={styles.toggleRow}>
          <PixelFrameOverlay scale={0.75} />
          <Text style={styles.toggleLabel}>Developer mode</Text>
          <Switch
            value={developerMode}
            onValueChange={(value) => {
              setDeveloperMode(value);
              if (!value) setDiceMode("random");
            }}
            trackColor={{
              false: theme.colors.surfaceAlt,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.primaryText}
          />
        </View>
        <Note styles={styles} text="Shows diagnostics and attaches them to bug reports." spaced />

        {developerMode && (
          <>
            <SectionHeading title="Account" textStyle={[styles.sectionTitle, styles.themeSectionTitle]} centered />
            <AccountSection />
          </>
        )}
        {developerMode && (
          <View style={[styles.creditRow, styles.toggleRowSpaced]}>
            <PixelFrameOverlay scale={0.75} />
            <Text style={styles.creditText}>{buildDiagnostics()}</Text>
          </View>
        )}
        {developerMode && (
          <View style={[styles.creditRow, styles.toggleRowSpaced]}>
            <PixelFrameOverlay scale={0.75} />
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
            <PixelFrameOverlay scale={0.75} />
            <Text style={styles.toggleLabel}>Dice override</Text>
            <Text style={styles.toggleHint}>
              Every roll in the app (dice roller, character sheet, level-up HP, stat rolling, DM monster rolls) is made
              one die at a time. Normally each die is random. Pick a mode below to control the dice while testing. It
              resets to Random when Developer mode is turned off or the app restarts.
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
                    <PixelFrameOverlay scale={0.75} />
                    <Text style={[styles.familyLabel, active && styles.familyLabelActive]}>{option.label}</Text>
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
                  keyboardType="number-pad"
                  inputAccessoryViewID="done-settings"
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
      </View>
    </ScrollView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.screenBackground },
    content: { padding: 16, paddingBottom: 32, flexGrow: 1 },
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
    diceModeDescription: {
      color: theme.colors.text,
      fontSize: 13,
      marginTop: 10,
    },
    diceOverrideRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
    },
    diceOverrideChip: { paddingHorizontal: 14 },
    seedRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 10,
    },
    seedInput: {
      flex: 1,
      backgroundColor: theme.colors.surface,
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
      borderWidth: theme.pixel ? 0 : 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      marginBottom: 8,
    },
    familyRowActive: {
      borderColor: theme.colors.primary,
      ...(theme.pixel ? { backgroundColor: theme.colors.surfaceAlt } : {}),
    },
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
      borderWidth: theme.pixel ? 0 : 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
    },
    toggleRowSpaced: { marginTop: 12 },
    noteCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
      gap: 2,
    },
    noteCardSpaced: { marginTop: 8 },
    noteText: { color: theme.colors.textMuted, fontSize: 12 },
    toggleLabel: { color: theme.colors.text, fontWeight: "600" },
    toggleHint: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginTop: 6,
      marginBottom: 4,
    },
    iconStyleList: { marginTop: 8 },
    iconStyleDescription: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    creditRow: {
      backgroundColor: theme.colors.surface,
      borderWidth: theme.pixel ? 0 : 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      marginBottom: 8,
    },
    creditText: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    feedbackButtonText: { color: theme.colors.accent },
  });
}
