import { useMemo, useState } from "react";
import { PixelFrameOverlay, SectionHeading } from "../components/PixelFrame";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "../components/AppText";
import { Stack } from "expo-router";
import { Button } from "../components/Button";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";
import { withAlpha, BOX_ALPHA } from "../theme/alpha";

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
    title: "Pixel GUI Frames, Banners and Ribbons",
    text: "Custom Border and Panels and Retro Pixel Ribbons, Banners and Frames by bdragon1727.",
  },
  {
    title: "Castle Background",
    text: "Fort of Illusion pixel-art background by Luis Zuno (Ansimuz), CC0 1.0.",
  },
  {
    title: "Pixel Dice Sprites",
    text: "By LullabyJazz.",
  },
  {
    title: "32rogues Character Portraits",
    text:
      "\"32rogues\" pixel-art sprites by Seth Boyles, Copyright 2024. Used under the author's license for " +
      "in-app character portraits (cropped and enlarged). Not redistributed as an asset pack.",
  },
  {
    title: "Shikashi's Fantasy Icons Pack",
    text:
      "Icons by Matt Firth (shikashipx). Many are based on designs from game-icons.net (CC BY 4.0). " +
      "Credit: Matt Firth (shikashipx) and game-icons.net.",
  },
  {
    title: "Dice Rolling Sounds",
    text: "Kenney Casino Audio pack by Kenney (kenney.nl), CC0 1.0.",
  },
  {
    title: "Natural 20 / Natural 1 Stingers",
    text: 'From "512 Sound Effects (8-bit style)" by Juhani Junkala (OpenGameArt), CC0 1.0.',
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

// Required attribution statements for the CC-BY-4.0-licensed SRD content
// (src/data/rulesets/5e/ and 5e-2024/). Each SRD's own "Legal Information"
// page specifies the exact wording Wizards requires and asks that no other
// attribution to Wizards be added -- this is quoted verbatim, not
// paraphrased. Fetched via curl+pdftotext from the official SRD PDFs
// (media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf and
// .../5.2/SRD_CC_v5.2.1.pdf, linked from dnd.wizards.com/resources/
// systems-reference-document), not retyped from memory.
const CC_BY_NOTICE_SRD_5_1 =
  'This work includes material taken from the System Reference Document 5.1 ("SRD 5.1") ' +
  "by Wizards of the Coast LLC and available at " +
  "https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is licensed " +
  "under the Creative Commons Attribution 4.0 International License available at " +
  "https://creativecommons.org/licenses/by/4.0/legalcode.";

const CC_BY_NOTICE_SRD_5_2 =
  'This work includes material from the System Reference Document 5.2.1 ("SRD 5.2.1") by ' +
  "Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is " +
  "licensed under the Creative Commons Attribution 4.0 International License, available at " +
  "https://creativecommons.org/licenses/by/4.0/legalcode.";

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

export default function LegalScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [oglExpanded, setOglExpanded] = useState(false);

  return (
    <>
      <Stack.Screen options={{ title: "Legal & Licenses" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <SectionHeading title="Credits" textStyle={styles.sectionTitle} />
        {CREDITS.map((credit) => (
          <View key={credit.title} style={styles.creditRow}>
            <PixelFrameOverlay scale={0.75} />
            <Text style={styles.creditTitle}>{credit.title}</Text>
            <Text style={styles.creditText}>{credit.text}</Text>
          </View>
        ))}

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>D&amp;D Content Sources</Text>
        <Text style={styles.hint}>
          Races, classes, spells, feats, magic items, monsters, and conditions this app ships
          as catalog entries are drawn from these openly-licensed rules documents: the 5th
          Edition ones under the Creative Commons Attribution 4.0 license, the 3.5 one under the
          Open Game License. Text has been reformatted and, in places, adapted (for example
          items expanded into per-weapon variants). This does not cover anything you create
          yourself in Homebrew Library -- homebrew races, classes, subclasses, spells, feats,
          magic items, monsters, and abilities are your own content, not SRD/CC-BY/OGL material,
          and aren&apos;t covered by the licenses or attributions on this screen.
        </Text>
        {DND_CONTENT_SOURCES.map((source) => (
          <Pressable
            key={source.title}
            style={styles.creditRow}
            onPress={() => Linking.openURL(source.url).catch(() => {})}
          >
            <PixelFrameOverlay scale={0.75} />
            <Text style={styles.creditTitle}>{source.title}</Text>
            <Text style={styles.creditText}>
              {source.publisher} · {source.license}
            </Text>
          </Pressable>
        ))}
        <Text style={styles.hint}>
          Required CC BY 4.0 attribution statements, exactly as specified in each SRD&apos;s own
          Legal Information page:
        </Text>
        <View style={styles.creditRow}>
          <PixelFrameOverlay scale={0.75} />
          <Text style={styles.creditTitle}>System Reference Document 5.1</Text>
          <Text style={styles.creditText}>{CC_BY_NOTICE_SRD_5_1}</Text>
        </View>
        <View style={styles.creditRow}>
          <PixelFrameOverlay scale={0.75} />
          <Text style={styles.creditTitle}>System Reference Document 5.2 / 5.2.1</Text>
          <Text style={styles.creditText}>{CC_BY_NOTICE_SRD_5_2}</Text>
        </View>

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>Open Game License</Text>
        <Text style={styles.hint}>
          The 3.5 ruleset&apos;s content is Open Game Content under the Open Game License v1.0a, which
          requires this exact notice and a copy of the full license text in any product that uses it.
        </Text>
        <View style={styles.creditRow}>
          <PixelFrameOverlay scale={0.75} />
          <Text style={styles.creditText}>{OGL_COPYRIGHT_NOTICE}</Text>
        </View>
        <Button
          title={oglExpanded ? "Hide Full License Text" : "View Full License Text"}
          textStyle={styles.feedbackButtonText}
          fullWidth
          onPress={() => setOglExpanded((expanded) => !expanded)}
        />
        {oglExpanded && (
          <View style={styles.creditRow}>
            <PixelFrameOverlay scale={0.75} />
            <Text style={styles.creditText}>{OGL_FULL_TEXT}</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.screenBackground },
    content: { padding: 16, paddingBottom: 32 },
    sectionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "700", marginBottom: 12 },
    sectionTitleSpaced: { marginTop: 24 },
    hint: { color: theme.colors.textMuted, fontSize: 12, marginBottom: 10 },
    creditRow: {
      backgroundColor: withAlpha(theme.colors.surface, BOX_ALPHA),
      borderWidth: theme.pixel ? 0 : 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      marginBottom: 8,
    },
    creditTitle: { color: theme.colors.text, fontWeight: "600" },
    creditText: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    feedbackButtonText: { color: theme.colors.accent },
  });
}
