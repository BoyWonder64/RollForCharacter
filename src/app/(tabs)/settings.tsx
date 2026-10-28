import { useMemo, useState } from "react";
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
  {
    title: "Pixel Dice Sprites",
    text: "By LullabyJazz.",
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
  {
    title: "System Reference Document 3.5",
    publisher: "Wizards of the Coast",
    license: "OGL 1.0a (see Open Game License section below)",
    url: "https://www.d20srd.org/",
  },
];

// Required by the Open Game License v1.0a itself (clauses 10 and 15): any
// product distributing Open Game Content must include a copy of the full
// license text plus a copyright notice naming every OGL source used. The
// 3.5e ruleset (src/data/rulesets/3.5e/, see LEGAL.md there) is OGL Open
// Game Content, so both blocks below are a compliance requirement, not
// just a credit -- don't remove or shorten this without replacing it.
// Fetched verbatim via curl from opengamingfoundation.org (the Open Gaming
// Foundation's own mirror, "approved for general use" per Wizards of the
// Coast), not retyped from memory or paraphrased through a summarizer.
const OGL_COPYRIGHT_NOTICE =
  "Open Game License v 1.0a Copyright 2000, Wizards of the Coast, Inc.\n\n" +
  "System Reference Document Copyright 2000-2003, Wizards of the Coast, Inc.; " +
  "Authors Jonathan Tweet, Monte Cook, Skip Williams, Rich Baker, Andy Collins, " +
  "David Noonan, Rich Redman, Bruce R. Cordell, John D. Rateliff, Thomas Reid, " +
  "James Wyatt, based on original material by E. Gary Gygax and Dave Arneson.";

const OGL_FULL_TEXT =
  'THIS LICENSE IS APPROVED FOR GENERAL USE. PERMISSION TO DISTRIBUTE THIS LICENSE IS MADE BY WIZARDS OF THE COAST!\n\n' +
  "OPEN GAME LICENSE Version 1.0a\n\n" +
  'The following text is the property of Wizards of the Coast, Inc. and is Copyright 2000 Wizards of the Coast, Inc ("Wizards"). All Rights Reserved.\n\n' +
  '1. Definitions: (a)"Contributors" means the copyright and/or trademark owners who have contributed Open Game Content; (b)"Derivative Material" means copyrighted material including derivative works and translations (including into other computer languages), potation, modification, correction, addition, extension, upgrade, improvement, compilation, abridgment or other form in which an existing work may be recast, transformed or adapted; (c) "Distribute" means to reproduce, license, rent, lease, sell, broadcast, publicly display, transmit or otherwise distribute; (d)"Open Game Content" means the game mechanic and includes the methods, procedures, processes and routines to the extent such content does not embody the Product Identity and is an enhancement over the prior art and any additional content clearly identified as Open Game Content by the Contributor, and means any work covered by this License, including translations and derivative works under copyright law, but specifically excludes Product Identity. (e) "Product Identity" means product and product line names, logos and identifying marks including trade dress; artifacts; creatures characters; stories, storylines, plots, thematic elements, dialogue, incidents, language, artwork, symbols, designs, depictions, likenesses, formats, poses, concepts, themes and graphic, photographic and other visual or audio representations; names and descriptions of characters, spells, enchantments, personalities, teams, personas, likenesses and special abilities; places, locations, environments, creatures, equipment, magical or supernatural abilities or effects, logos, symbols, or graphic designs; and any other trademark or registered trademark clearly identified as Product identity by the owner of the Product Identity, and which specifically excludes the Open Game Content; (f) "Trademark" means the logos, names, mark, sign, motto, designs that are used by a Contributor to identify itself or its products or the associated products contributed to the Open Game License by the Contributor (g) "Use", "Used" or "Using" means to use, Distribute, copy, edit, format, modify, translate and otherwise create Derivative Material of Open Game Content. (h) "You" or "Your" means the licensee in terms of this agreement.\n\n' +
  "2. The License: This License applies to any Open Game Content that contains a notice indicating that the Open Game Content may only be Used under and in terms of this License. You must affix such a notice to any Open Game Content that you Use. No terms may be added to or subtracted from this License except as described by the License itself. No other terms or conditions may be applied to any Open Game Content distributed using this License.\n\n" +
  "3. Offer and Acceptance: By Using the Open Game Content You indicate Your acceptance of the terms of this License.\n\n" +
  "4. Grant and Consideration: In consideration for agreeing to use this License, the Contributors grant You a perpetual, worldwide, royalty-free, non-exclusive license with the exact terms of this License to Use, the Open Game Content.\n\n" +
  "5. Representation of Authority to Contribute: If You are contributing original material as Open Game Content, You represent that Your Contributions are Your original creation and/or You have sufficient rights to grant the rights conveyed by this License.\n\n" +
  "6. Notice of License Copyright: You must update the COPYRIGHT NOTICE portion of this License to include the exact text of the COPYRIGHT NOTICE of any Open Game Content You are copying, modifying or distributing, and You must add the title, the copyright date, and the copyright holder's name to the COPYRIGHT NOTICE of any original Open Game Content you Distribute.\n\n" +
  "7. Use of Product Identity: You agree not to Use any Product Identity, including as an indication as to compatibility, except as expressly licensed in another, independent Agreement with the owner of each element of that Product Identity. You agree not to indicate compatibility or co-adaptability with any Trademark or Registered Trademark in conjunction with a work containing Open Game Content except as expressly licensed in another, independent Agreement with the owner of such Trademark or Registered Trademark. The use of any Product Identity in Open Game Content does not constitute a challenge to the ownership of that Product Identity. The owner of any Product Identity used in Open Game Content shall retain all rights, title and interest in and to that Product Identity.\n\n" +
  "8. Identification: If you distribute Open Game Content You must clearly indicate which portions of the work that you are distributing are Open Game Content.\n\n" +
  "9. Updating the License: Wizards or its designated Agents may publish updated versions of this License. You may use any authorized version of this License to copy, modify and distribute any Open Game Content originally distributed under any version of this License.\n\n" +
  "10. Copy of this License: You MUST include a copy of this License with every copy of the Open Game Content You Distribute.\n\n" +
  "11. Use of Contributor Credits: You may not market or advertise the Open Game Content using the name of any Contributor unless You have written permission from the Contributor to do so.\n\n" +
  "12. Inability to Comply: If it is impossible for You to comply with any of the terms of this License with respect to some or all of the Open Game Content due to statute, judicial order, or governmental regulation then You may not Use any Open Game Material so affected.\n\n" +
  "13. Termination: This License will terminate automatically if You fail to comply with all terms herein and fail to cure such breach within 30 days of becoming aware of the breach. All sublicenses shall survive the termination of this License.\n\n" +
  "14. Reformation: If any provision of this License is held to be unenforceable, such provision shall be reformed only to the extent necessary to make it enforceable.\n\n" +
  "15. COPYRIGHT NOTICE\n\n" +
  OGL_COPYRIGHT_NOTICE +
  "\n\nEND OF LICENSE";

export default function SettingsScreen() {
  const { theme, preference, setPreference, family, setFamily, fontChoice, setFontChoice } =
    useThemeContext();
  const { keepScreenOn, setKeepScreenOn } = useKeepAwakeSetting();
  const { dmMode, setDmMode } = useDmMode();
  const { historyEnabled, setHistoryEnabled } = useRollHistorySetting();
  const { iconsEnabled, setIconsEnabled, iconStyle, setIconStyle } = useIconSettings();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [oglExpanded, setOglExpanded] = useState(false);

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

      <Text style={[styles.sectionTitle, styles.themeSectionTitle]}>Open Game License</Text>
      <Text style={styles.hint}>
        The 3.5 ruleset&apos;s content is Open Game Content under the Open Game License v1.0a, which
        requires this exact notice and a copy of the full license text in any product that uses it.
      </Text>
      <View style={styles.creditRow}>
        <Text style={styles.creditText}>{OGL_COPYRIGHT_NOTICE}</Text>
      </View>
      <Pressable
        style={styles.feedbackButton}
        onPress={() => setOglExpanded((expanded) => !expanded)}
      >
        <Text style={styles.feedbackButtonText}>
          {oglExpanded ? "Hide Full License Text" : "View Full License Text"}
        </Text>
      </Pressable>
      {oglExpanded && (
        <View style={styles.creditRow}>
          <Text style={styles.creditText}>{OGL_FULL_TEXT}</Text>
        </View>
      )}

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
