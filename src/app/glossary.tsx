import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "../components/AppText";
import { Stack } from "expo-router";
import { useTheme } from "../theme/ThemeContext";
import { createDmStyles } from "../components/dmStyles";

type GlossaryEntry = { term: string; meaning: string; description: string };
type GlossarySection = { title: string; entries: GlossaryEntry[] };

const SECTIONS: GlossarySection[] = [
  {
    title: "Ability Scores",
    entries: [
      { term: "STR", meaning: "Strength", description: "Physical power -- melee attacks, carrying capacity." },
      { term: "DEX", meaning: "Dexterity", description: "Agility and reflexes -- Armor Class, Initiative, ranged attacks, Stealth." },
      { term: "CON", meaning: "Constitution", description: "Health and stamina -- determines Hit Points." },
      { term: "INT", meaning: "Intelligence", description: "Reasoning and memory -- Wizard spellcasting, knowledge checks." },
      { term: "WIS", meaning: "Wisdom", description: "Perception and intuition -- Cleric/Druid spellcasting, Perception checks." },
      { term: "CHA", meaning: "Charisma", description: "Force of personality -- Bard/Sorcerer/Warlock spellcasting, social checks." },
    ],
  },
  {
    title: "Combat & Rolls",
    entries: [
      { term: "AC", meaning: "Armor Class", description: "How hard a creature is to hit. An attack roll must meet or beat it to land." },
      { term: "HP", meaning: "Hit Points", description: "How much damage a creature can take before falling unconscious or dying." },
      { term: "DC", meaning: "Difficulty Class", description: "The number a saving throw or skill check must meet or beat to succeed." },
      { term: "XP", meaning: "Experience Points", description: "Points earned from combat and milestones that add up to level up a character." },
      { term: "CR", meaning: "Challenge Rating", description: "How tough a monster is, roughly matched to the level of party that can handle it alone." },
      { term: "PB", meaning: "Proficiency Bonus", description: "A bonus added to rolls a character is trained in; it grows as the character levels up." },
      { term: "AoE", meaning: "Area of Effect", description: "An effect (like a Fireball) that covers a zone instead of targeting one creature." },
      { term: "d20, d6, etc.", meaning: "Die type", description: "\"d\" plus a number is a die with that many sides -- a d20 is a twenty-sided die." },
    ],
  },
  {
    title: "Currency",
    entries: [
      { term: "CP", meaning: "Copper Pieces", description: "The smallest coin denomination. 100 cp = 1 gp." },
      { term: "SP", meaning: "Silver Pieces", description: "10 sp = 1 gp." },
      { term: "EP", meaning: "Electrum Pieces", description: "A rarely-used coin worth half a gold piece. 2 ep = 1 gp." },
      { term: "GP", meaning: "Gold Pieces", description: "The standard unit of currency most prices are listed in." },
      { term: "PP", meaning: "Platinum Pieces", description: "The largest coin denomination. 1 pp = 10 gp." },
    ],
  },
  {
    title: "Roles & People",
    entries: [
      { term: "DM", meaning: "Dungeon Master", description: "The person running the game world, monsters, and story." },
      { term: "PC", meaning: "Player Character", description: "A character controlled by a player, as opposed to an NPC." },
      { term: "NPC", meaning: "Non-Player Character", description: "A character controlled by the DM rather than a player." },
    ],
  },
  {
    title: "Rules Content",
    entries: [
      { term: "SRD", meaning: "System Reference Document", description: "The official, openly-licensed rules text this app's content is sourced from. See Settings → Legal & Licenses." },
      { term: "5e", meaning: "5th Edition", description: "The 2014 ruleset of Dungeons & Dragons." },
      { term: "2024 rules", meaning: "Revised 5th Edition", description: "The 2024 update to the 5e ruleset, also called \"5.5e\" by some fans." },
      { term: "3.5e", meaning: "3.5 Edition", description: "An earlier D&D ruleset, included here under the Open Game License." },
      { term: "OGL", meaning: "Open Game License", description: "The license that permits reuse of the 3.5e ruleset's content." },
    ],
  },
];

export default function GlossaryScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  return (
    <>
      <Stack.Screen options={{ title: "Glossary" }} />
      <ScrollView style={{ flex: 1, backgroundColor: theme.screenBackground }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text style={styles.hint}>
          Abbreviations and terms used throughout the app, explained.
        </Text>
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.entries.map((entry) => (
              <View key={entry.term} style={styles.card}>
                <View style={styles.row}>
                  <Text style={[styles.sectionTitle, { fontSize: 14 }]}>{entry.term}</Text>
                  <Text style={styles.hint}>{entry.meaning}</Text>
                </View>
                <Text style={[styles.hint, { marginTop: 4 }]}>{entry.description}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
}
