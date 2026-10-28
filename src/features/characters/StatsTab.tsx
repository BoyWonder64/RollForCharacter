import { useCallback, useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  ABILITY_LABELS,
  abilityModifier,
  addXp,
  adjustCurrency,
  levelUp,
  toggleInspiration,
} from "./characterRepo";
import {
  aggregateFeatEffects,
  classFeaturesForCharacter,
  getClassDefinitionForCharacter,
  initiativeModifier,
  isSavingThrowProficient,
  isSkillProficient,
  parseLanguages,
  passiveSkillScore,
  racialTraitsForCharacter,
} from "./characterCalculations";
import { listCharacterFeats } from "./featRepo";
import { addClass, levelUpClass, listCharacterClasses } from "./characterClassRepo";
import { formatMulticlassLabel, isMulticlassed } from "./multiclass";
import { ConditionsChecklist } from "../../components/ConditionsChecklist";
import { ClassResourceTracker } from "../../components/ClassResourceTracker";
import { FeatsList } from "../../components/FeatsList";
import {
  describeArmorAc,
  describeAttackBonus,
  describeWeaponDamage,
  isProficientWithWeapon,
  listCharacterArmor,
  listCharacterWeapons,
  weaponAttackBonus,
  weaponFeatAttackBonus,
} from "./gearRepo";
import { levelForXp, xpToNextLevel } from "./xpTable";
import { getRulesetCatalog } from "../../data/rulesets";
import { spellSaveDc } from "../dice/structuredRolls";
import { CurrencyModal, type CurrencyDenomination } from "../../components/CurrencyModal";
import { LevelUpModal } from "../../components/LevelUpModal";
import { XpModal } from "../../components/XpModal";
import type { LevelUpChoices } from "./characterRepo";
import type { AbilityScoreKey, Character, CharacterClass } from "../../types/models";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";
import { useIconSettings } from "../icons/IconSettingsContext";
import { getCampaignItemIcon } from "../icons/iconAssets";

const CURRENCY_FIELDS: {
  key: CurrencyDenomination;
  label: string;
  fullName: string;
  column: keyof Character;
}[] = [
  { key: "copper", label: "CP", fullName: "Copper Pieces", column: "copperPieces" },
  { key: "silver", label: "SP", fullName: "Silver Pieces", column: "silverPieces" },
  { key: "electrum", label: "EP", fullName: "Electrum Pieces", column: "electrumPieces" },
  { key: "gold", label: "GP", fullName: "Gold Pieces", column: "goldPieces" },
  { key: "platinum", label: "PP", fullName: "Platinum Pieces", column: "platinumPieces" },
];

const ABILITY_KEYS: AbilityScoreKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

const ABILITY_DESCRIPTIONS: Record<AbilityScoreKey, string> = {
  strength:
    "Measures physical power. Affects melee attack and damage rolls, Athletics checks, and how much you can carry.",
  dexterity:
    "Measures agility and reflexes. Affects Armor Class, Initiative, ranged and finesse attacks, and Acrobatics, Stealth, and Sleight of Hand checks.",
  constitution:
    "Measures health and stamina. Affects your hit points and Constitution saving throws (including Concentration checks).",
  intelligence:
    "Measures reasoning and memory. Affects Arcana, History, Investigation, Nature, and Religion checks, and spellcasting for Wizards.",
  wisdom:
    "Measures awareness and intuition. Affects Perception, Insight, Medicine, Survival, and Animal Handling checks, and spellcasting for Clerics, Druids, and Rangers.",
  charisma:
    "Measures force of personality. Affects Persuasion, Deception, Intimidation, and Performance checks, and spellcasting for Bards, Paladins, Sorcerers, and Warlocks.",
};

const SAVING_THROW_DESCRIPTIONS: Record<AbilityScoreKey, string> = {
  strength:
    "Resists being physically moved, shoved, restrained, or grappled against your will.",
  dexterity:
    "Resists area effects you can dodge or react to, like a fireball, falling trap, or sudden gust of wind.",
  constitution:
    "Resists poison and disease, and keeps your Concentration on a spell when you take damage.",
  intelligence: "Resists effects that assault or deceive the mind, such as illusions.",
  wisdom: "Resists effects that prey on your willpower, such as being charmed or frightened.",
  charisma:
    "Resists effects that try to possess, banish, or otherwise overwhelm your very being.",
};

// Keyed by SkillDefinition.id so it covers every ruleset's skill list.
const SKILL_DESCRIPTIONS: Record<string, string> = {
  acrobatics: "Balance, tumble, and stay on your feet in tricky physical situations.",
  "animal-handling": "Calm, control, or read the intentions of an animal.",
  arcana: "Recall lore about spells, magic items, and magical traditions.",
  athletics: "Climb, jump, swim, or grapple — any strenuous physical task.",
  deception: "Convincingly hide the truth, through lies, misdirection, or disguise.",
  history: "Recall lore about historical events, civilizations, wars, and lost kingdoms.",
  insight: "Read body language and tone to determine someone's true intentions.",
  intimidation: "Influence someone through threats, hostile actions, or physical menace.",
  investigation: "Search for clues and deduce conclusions from evidence.",
  medicine: "Stabilize the dying, diagnose illness, and treat injuries.",
  nature: "Recall lore about terrain, plants, animals, and weather.",
  perception: "Spot, hear, or otherwise notice something using your senses.",
  performance: "Delight an audience with music, dance, acting, or storytelling.",
  persuasion: "Influence someone through tact, social graces, or good nature.",
  religion: "Recall lore about deities, rites, prayers, and religious hierarchies.",
  "sleight-of-hand": "Pick pockets, palm an object, or perform manual trickery unnoticed.",
  stealth: "Conceal yourself from enemies, slip past guards, or sneak around unheard.",
  survival: "Follow tracks, forage, navigate the wilderness, and predict the weather.",
  appraise: "Estimate the value of an item at a glance.",
  balance: "Keep your footing on narrow, slippery, or unstable surfaces.",
  bluff: "Convincingly deceive someone through lies, feints, or misdirection.",
  climb: "Scale walls, cliffs, and other steep or difficult surfaces.",
  concentration: "Maintain focus on a spell or task despite being hurt or distracted.",
  craft: "Create or repair an item in a chosen trade, such as blacksmithing or alchemy.",
  "decipher-script": "Make sense of unfamiliar, coded, or archaic writing.",
  diplomacy: "Influence attitudes through tact, charm, and good manners.",
  "disable-device": "Disarm traps and sabotage or bypass mechanical devices.",
  disguise: "Alter your appearance to pass as someone or something else.",
  "escape-artist": "Slip free of bonds, manacles, or a grapple.",
  forgery: "Create or detect a forged document, seal, or signature.",
  "gather-information": "Find out local rumors, gossip, and secrets by talking to people.",
  "handle-animal": "Train an animal or coax a trained response out of one.",
  heal: "Treat wounds, stabilize the dying, and tend to the sick or injured.",
  hide: "Conceal yourself from view.",
  intimidate: "Influence someone through threats and displays of hostility.",
  jump: "Leap across gaps, over obstacles, or up to greater heights.",
  "knowledge-arcana": "Recall lore about spells, magic items, and magical traditions.",
  "knowledge-architecture-engineering": "Recall lore about buildings, construction, and engineering.",
  "knowledge-dungeoneering": "Recall lore about underground hazards, aberrations, and dungeon lore.",
  "knowledge-geography": "Recall lore about lands, terrain, and distant places.",
  "knowledge-history": "Recall lore about historical events, civilizations, and wars.",
  "knowledge-local": "Recall lore about the people, laws, and customs of a specific area.",
  "knowledge-nature": "Recall lore about terrain, plants, animals, and weather.",
  "knowledge-nobility-royalty": "Recall lore about noble houses, heraldry, and lines of succession.",
  "knowledge-religion": "Recall lore about deities, religious rites, and holy orders.",
  "knowledge-the-planes": "Recall lore about the Outer and Inner Planes and their native creatures.",
  listen: "Hear something you might otherwise miss, like an approaching creature.",
  "move-silently": "Move without making enough noise to be heard.",
  "open-lock": "Pick a lock with thieves' tools.",
  perform: "Entertain an audience with music, dance, acting, or storytelling.",
  profession: "Earn a living and apply practical, workaday knowledge in a chosen trade.",
  ride: "Control a mount, including in combat or over rough terrain.",
  search: "Find hidden objects, traps, or secret doors by examining an area closely.",
  "sense-motive": "Read body language and tone to tell when someone's lying or hiding something.",
  "speak-language": "Know and speak an additional language.",
  spellcraft: "Identify spells as they're cast and recognize magic items and effects.",
  spot: "Notice something in your surroundings using your eyes.",
  swim: "Move through water and avoid drowning or being swept away.",
  tumble: "Fall, roll, or acrobatically avoid an attack of opportunity.",
  "use-magic-device": "Use a magic item despite not meeting its normal requirements.",
  "use-rope": "Tie, untie, and bind knots, including under duress.",
};

const SUMMARY_STAT_DESCRIPTIONS: Record<string, string> = {
  "Armor Class":
    "How hard you are to hit in combat. An attacker's d20 roll plus their attack bonus must meet or beat your AC to land a hit.",
  Speed:
    "The distance in feet you can move on your turn. Moving further costs actions like Dash, or may require special movement.",
  Initiative:
    "Added to a d20 roll at the start of combat to set turn order — higher results act first. Equal to your Dexterity modifier plus any bonuses.",
  "Prof. Bonus":
    "Added to attack rolls, saving throws, and skill checks you're proficient in. It rises as you gain levels.",
  "Spell Save DC":
    "The number a target must meet or beat on a saving throw to resist your spells. Equal to 8 + proficiency bonus + spellcasting ability modifier.",
};

// Each ruleset names this skill differently (5e/5e-2024: perception; 3.5e:
// spot) -- listed by preference so whichever one a catalog actually has gets
// used.
const PASSIVE_SKILLS: { label: string; skillIds: string[] }[] = [
  { label: "Passive Perception", skillIds: ["perception", "spot"] },
  { label: "Passive Investigation", skillIds: ["investigation", "search"] },
  { label: "Passive Insight", skillIds: ["insight", "sense-motive"] },
];

const PASSIVE_SCORE_DESCRIPTION =
  "10 + your skill modifier, with no roll needed. Represents what you'd notice or figure out passively -- used when the DM doesn't want to call for an active roll.";

function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

type WeaponRow = Awaited<ReturnType<typeof listCharacterWeapons>>[number];
type ArmorRow = Awaited<ReturnType<typeof listCharacterArmor>>[number];

export function StatsTab({
  character,
  onChanged,
}: {
  character: Character;
  onChanged: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const catalog = getRulesetCatalog(character.ruleset);
  const classDef = getClassDefinitionForCharacter(character);
  const racialTraits = racialTraitsForCharacter(character);
  const knownLanguages = parseLanguages(character)
    .map((id) => catalog.languages?.find((l) => l.id === id))
    .filter((l): l is NonNullable<typeof l> => !!l);
  const { iconsEnabled, iconStyle } = useIconSettings();
  const coinIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "coin") : undefined;
  const gemIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "gem") : undefined;
  const savingThrowIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "shield") : undefined;
  const skillsIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "book") : undefined;
  const armorIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "shield") : undefined;
  const weaponsIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "sword") : undefined;
  const notesIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "scroll") : undefined;
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [xpModalOpen, setXpModalOpen] = useState(false);

  const [weapons, setWeapons] = useState<WeaponRow[]>([]);
  const [armor, setArmor] = useState<ArmorRow[]>([]);
  const [classRows, setClassRows] = useState<CharacterClass[]>([]);
  const [feats, setFeats] = useState<Awaited<ReturnType<typeof listCharacterFeats>>>([]);
  const featEffects = useMemo(() => aggregateFeatEffects(feats), [feats]);
  // `character.level` is the SUM across every class once multiclassed (see
  // `characterClasses` schema comment) -- the primary class's own level is
  // `classRows[0]`'s level once multiclass rows exist, or `character.level`
  // itself beforehand (zero rows = that's still the single source of truth).
  const primaryClassLevel = classRows.length > 0 ? classRows[0].level : character.level;
  const classFeatures = classFeaturesForCharacter(character, primaryClassLevel);

  useFocusEffect(
    useCallback(() => {
      listCharacterWeapons(character.id).then(setWeapons);
      listCharacterArmor(character.id).then(setArmor);
      listCharacterClasses(character.id).then(setClassRows);
      listCharacterFeats(character).then(setFeats);
    }, [character])
  );

  async function handleCurrencyConfirm(denomination: CurrencyDenomination, delta: number) {
    await adjustCurrency(character.id, denomination, delta);
    setCurrencyModalOpen(false);
    onChanged();
  }

  async function handleToggleInspiration() {
    await toggleInspiration(character.id);
    onChanged();
  }

  async function handleXpConfirm(delta: number) {
    await addXp(character.id, delta);
    setXpModalOpen(false);
    onChanged();
  }

  async function handleLevelUpConfirm(choices: LevelUpChoices, classId?: string) {
    const outcome = classId
      ? await levelUpClass(character.id, classId, choices)
      : await levelUp(character.id, choices);
    setLevelUpModalOpen(false);
    onChanged();
    listCharacterClasses(character.id).then(setClassRows);
    if (outcome) {
      const profLine =
        outcome.proficiencyBonus !== character.proficiencyBonus
          ? `\nProficiency bonus is now +${outcome.proficiencyBonus}.`
          : "";
      const hpLine =
        choices.hpMethod === "manual"
          ? `Set your HP for this level yourself in Edit.`
          : `+${outcome.hpGain} max HP${
              outcome.roll !== undefined ? ` (rolled ${outcome.roll})` : ""
            }`;
      const featureLines = outcome.featuresGained.map((f) => `• ${f.name}`).join("\n");
      const body = [hpLine + profLine, featureLines].filter(Boolean).join("\n\n");
      Alert.alert(`Level ${outcome.newLevel}!`, body);
    }
  }

  async function handleMulticlassConfirm(
    classId: string,
    className: string,
    choices: LevelUpChoices
  ) {
    const outcome = await addClass(character.id, classId, className, choices);
    setLevelUpModalOpen(false);
    onChanged();
    listCharacterClasses(character.id).then(setClassRows);
    if (outcome) {
      const hpLine =
        choices.hpMethod === "manual"
          ? "Set your HP for this level yourself in Edit."
          : `+${outcome.hpGain} max HP${outcome.roll !== undefined ? ` (rolled ${outcome.roll})` : ""}`;
      const featureLines = outcome.featuresGained.map((f) => `• ${f.name}`).join("\n");
      const body = [hpLine, featureLines].filter(Boolean).join("\n\n");
      Alert.alert(`${className} 1!`, body);
    }
  }

  const xpReadyToLevelUp =
    character.usesXp && levelForXp(character.ruleset, character.experiencePoints) > character.level;
  const xpNeeded = character.usesXp
    ? xpToNextLevel(character.ruleset, character.level, character.experiencePoints)
    : undefined;

  return (
    <View>
      <View style={styles.levelRow}>
        <Text style={styles.levelText}>
          Level {character.level}
          {isMulticlassed(classRows) ? ` (${formatMulticlassLabel(classRows, character.className)})` : ""}
        </Text>
        <Pressable style={styles.levelUpButton} onPress={() => setLevelUpModalOpen(true)}>
          <Text style={styles.levelUpButtonText}>
            Level Up{xpReadyToLevelUp ? " ✓" : ""}
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.inspirationChip, character.inspiration && styles.inspirationChipActive]}
        onPress={handleToggleInspiration}
      >
        <Text
          style={[
            styles.inspirationChipText,
            character.inspiration && styles.inspirationChipTextActive,
          ]}
        >
          ✦ Inspiration{character.inspiration ? " (ready)" : ""}
        </Text>
      </Pressable>

      <ClassResourceTracker character={character} />

      <LevelUpModal
        visible={levelUpModalOpen}
        character={character}
        classRows={classRows}
        onClose={() => setLevelUpModalOpen(false)}
        onConfirm={handleLevelUpConfirm}
        onMulticlassConfirm={handleMulticlassConfirm}
      />

      <Text style={styles.sectionTitle}>Conditions</Text>
      <ConditionsChecklist character={character} onChanged={onChanged} />

      {character.usesXp && (
        <>
          <View style={styles.currencyHeaderRow}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <Pressable onPress={() => setXpModalOpen(true)}>
              <Text style={styles.currencyEditLink}>Add XP</Text>
            </Pressable>
          </View>
          <Text style={styles.xpText}>
            {character.experiencePoints} XP
            {xpNeeded !== undefined
              ? ` (${xpNeeded} to level ${character.level + 1})`
              : " (max level)"}
          </Text>
          {xpReadyToLevelUp && (
            <Text style={styles.xpReadyText}>
              You have enough XP to level up — tap Level Up above.
            </Text>
          )}
          <XpModal
            visible={xpModalOpen}
            onClose={() => setXpModalOpen(false)}
            onConfirm={handleXpConfirm}
          />
        </>
      )}

      <View style={styles.summaryRow}>
        <SummaryStat
          label="Armor Class"
          value={
            featEffects.armorClassBonus > 0
              ? `${character.armorClass} (+${featEffects.armorClassBonus} feat)`
              : String(character.armorClass)
          }
        />
        <SummaryStat label="Speed" value={`${character.speed} ft`} />
        <SummaryStat label="Initiative" value={formatModifier(initiativeModifier(character, feats))} />
        <SummaryStat label="Prof. Bonus" value={formatModifier(character.proficiencyBonus)} />
        <SummaryStat label="Spell Save DC" value={String(spellSaveDc(character))} />
      </View>

      <View style={styles.currencyHeaderRow}>
        <View style={styles.sectionTitleRow}>
          {coinIcon && <Image source={coinIcon} style={styles.sectionIcon} resizeMode="contain" />}
          <Text style={[styles.sectionTitle, styles.sectionTitleInline]}>Currency</Text>
        </View>
        <Pressable onPress={() => setCurrencyModalOpen(true)}>
          <Text style={styles.currencyEditLink}>Add / Spend</Text>
        </Pressable>
      </View>
      <View style={styles.currencyRow}>
        {CURRENCY_FIELDS.map((field) => (
          <Pressable
            key={field.key}
            style={styles.currencyCard}
            onPress={() => Alert.alert(field.fullName, `${field.label} stands for ${field.fullName}.`)}
          >
            <Text style={styles.currencyValue}>{character[field.column] as number}</Text>
            <Text style={styles.currencyLabel}>{field.label}</Text>
          </Pressable>
        ))}
      </View>
      <CurrencyModal
        visible={currencyModalOpen}
        onClose={() => setCurrencyModalOpen(false)}
        onConfirm={handleCurrencyConfirm}
      />

      <SectionTitle icon={gemIcon} title="Ability Scores" />
      <View style={styles.abilityGrid}>
        {ABILITY_KEYS.map((key) => {
          const score = character[key];
          const modifier = abilityModifier(score);
          return (
            <Pressable
              key={key}
              style={styles.abilityCard}
              onPress={() => Alert.alert(ABILITY_LABELS[key], ABILITY_DESCRIPTIONS[key])}
            >
              <Text style={styles.abilityLabel}>{ABILITY_LABELS[key]}</Text>
              <Text style={styles.abilityScore}>{score}</Text>
              <Text style={styles.abilityModifier}>{formatModifier(modifier)}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle icon={savingThrowIcon} title="Saving Throws" />
      <View style={styles.proficiencyGrid}>
        {ABILITY_KEYS.map((key) => {
          const proficient = isSavingThrowProficient(character, key, feats);
          const modifier =
            abilityModifier(character[key]) + (proficient ? character.proficiencyBonus : 0);
          return (
            <Pressable
              key={key}
              style={styles.proficiencyRow}
              onPress={() =>
                Alert.alert(
                  `${ABILITY_LABELS[key]} Saving Throw`,
                  `${SAVING_THROW_DESCRIPTIONS[key]}${
                    proficient
                      ? "\n\nYou're proficient in this save."
                      : "\n\nYou're not proficient in this save."
                  }`
                )
              }
            >
              <View style={[styles.proficiencyDot, proficient && styles.proficiencyDotOn]} />
              <Text style={styles.proficiencyName}>{ABILITY_LABELS[key]}</Text>
              <Text style={styles.proficiencyMod}>{formatModifier(modifier)}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle icon={skillsIcon} title="Skills" />
      <View style={styles.proficiencyGrid}>
        {catalog.skills.map((skill) => {
          const proficient = isSkillProficient(character, skill.id, feats);
          const modifier =
            abilityModifier(character[skill.ability]) +
            (proficient ? character.proficiencyBonus : 0);
          const description =
            SKILL_DESCRIPTIONS[skill.id] ?? `Checked using your ${ABILITY_LABELS[skill.ability]} modifier.`;
          return (
            <Pressable
              key={skill.id}
              style={styles.proficiencyRow}
              onPress={() =>
                Alert.alert(
                  skill.name,
                  `${description}${
                    proficient
                      ? "\n\nYou're proficient in this skill."
                      : "\n\nYou're not proficient in this skill."
                  }`
                )
              }
            >
              <View style={[styles.proficiencyDot, proficient && styles.proficiencyDotOn]} />
              <Text style={styles.proficiencyName}>
                {skill.name} <Text style={styles.proficiencyAbility}>({ABILITY_LABELS[skill.ability]})</Text>
              </Text>
              <Text style={styles.proficiencyMod}>{formatModifier(modifier)}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle icon={skillsIcon} title="Passive Scores" />
      <View style={styles.summaryRow}>
        {PASSIVE_SKILLS.map(({ label, skillIds }) => {
          const skill = catalog.skills.find((s) => skillIds.includes(s.id));
          if (!skill) return null;
          return (
            <Pressable
              key={label}
              style={styles.summaryCard}
              onPress={() => Alert.alert(label, PASSIVE_SCORE_DESCRIPTION)}
            >
              <Text style={styles.summaryValue}>{passiveSkillScore(character, skill, feats)}</Text>
              <Text style={styles.summaryLabel}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionTitleRow}>
        {armorIcon && <Image source={armorIcon} style={styles.sectionIcon} resizeMode="contain" />}
        {weaponsIcon && <Image source={weaponsIcon} style={styles.sectionIcon} resizeMode="contain" />}
        <Text style={styles.sectionTitle}>Armor &amp; Weapons</Text>
      </View>
      {weapons.length === 0 && armor.length === 0 ? (
        <Text style={styles.flavorLine}>
          Nothing carried yet — add gear from the Equipment tab.
        </Text>
      ) : (
        <>
          {weapons.map((weapon) => {
            const proficient = isProficientWithWeapon(weapon, classDef.weaponProficiencies);
            const attackBonus = weaponAttackBonus(
              weapon,
              character.strength,
              character.dexterity,
              character.proficiencyBonus,
              proficient,
              weaponFeatAttackBonus(weapon, featEffects)
            );
            return (
              <Text key={`w-${weapon.id}`} style={styles.flavorLine}>
                <Text style={styles.flavorLabel}>
                  {weapon.isMagic ? "✨ " : ""}
                  {weapon.name}:{" "}
                </Text>
                Attack {describeAttackBonus(attackBonus)}
                {` · ${describeWeaponDamage(weapon)}`}
                {weapon.equipped ? " (Equipped)" : ""}
              </Text>
            );
          })}
          {armor.map((item) => (
            <Text key={`a-${item.id}`} style={styles.flavorLine}>
              <Text style={styles.flavorLabel}>
                {item.isMagic ? "✨ " : ""}
                {item.name}:{" "}
              </Text>
              AC {describeArmorAc(item)}
              {item.equipped ? " (Equipped)" : ""}
            </Text>
          ))}
        </>
      )}

      {racialTraits.length > 0 && (
        <>
          <SectionTitle title={`${character.race} Traits`} />
          <View style={styles.proficiencyGrid}>
            {racialTraits.map((trait) => (
              <Pressable
                key={trait.name}
                style={styles.proficiencyRow}
                onPress={() => Alert.alert(trait.name, trait.description)}
              >
                <View style={[styles.proficiencyDot, styles.proficiencyDotOn]} />
                <Text style={styles.proficiencyName}>{trait.name}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {classFeatures.length > 0 && (
        <>
          <SectionTitle title={`${character.className} Features`} />
          <View style={styles.proficiencyGrid}>
            {classFeatures.map((feature, i) => (
              <Pressable
                key={`${feature.name}-${i}`}
                style={styles.proficiencyRow}
                onPress={() => Alert.alert(feature.name, feature.description)}
              >
                <View style={[styles.proficiencyDot, styles.proficiencyDotOn]} />
                <Text style={styles.proficiencyName}>{feature.name}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      <View style={{ marginTop: 20 }}>
        <FeatsList character={character} />
      </View>

      {knownLanguages.length > 0 && (
        <>
          <SectionTitle title="Languages" />
          <View style={styles.proficiencyGrid}>
            {knownLanguages.map((lang) => (
              <Pressable
                key={lang.id}
                style={styles.proficiencyRow}
                onPress={() => Alert.alert(lang.name, lang.typicalSpeakers)}
              >
                <View style={[styles.proficiencyDot, styles.proficiencyDotOn]} />
                <Text style={styles.proficiencyName}>{lang.name}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {(character.otherProficiencies || character.featuresAndTraits) && (
        <>
          {character.otherProficiencies && (
            <>
              <Text style={styles.sectionTitle}>
                {catalog.languages ? "Other Proficiencies" : "Other Proficiencies & Languages"}
              </Text>
              <Text style={styles.notes}>{character.otherProficiencies}</Text>
            </>
          )}
          {character.featuresAndTraits && (
            <>
              <Text style={styles.sectionTitle}>Features &amp; Traits</Text>
              <Text style={styles.notes}>{character.featuresAndTraits}</Text>
            </>
          )}
        </>
      )}

      {(character.personalityTraits || character.ideals || character.bonds || character.flaws) && (
        <>
          <Text style={styles.sectionTitle}>Personality</Text>
          {character.personalityTraits && (
            <Text style={styles.flavorLine}>
              <Text style={styles.flavorLabel}>Traits: </Text>
              {character.personalityTraits}
            </Text>
          )}
          {character.ideals && (
            <Text style={styles.flavorLine}>
              <Text style={styles.flavorLabel}>Ideals: </Text>
              {character.ideals}
            </Text>
          )}
          {character.bonds && (
            <Text style={styles.flavorLine}>
              <Text style={styles.flavorLabel}>Bonds: </Text>
              {character.bonds}
            </Text>
          )}
          {character.flaws && (
            <Text style={styles.flavorLine}>
              <Text style={styles.flavorLabel}>Flaws: </Text>
              {character.flaws}
            </Text>
          )}
        </>
      )}

      {character.notes ? (
        <>
          <SectionTitle icon={notesIcon} title="Notes" />
          <Text style={styles.notes}>{character.notes}</Text>
        </>
      ) : null}
    </View>
  );
}

function SectionTitle({ icon, title }: { icon?: number; title: string }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.sectionTitleRow}>
      {icon && <Image source={icon} style={styles.sectionIcon} resizeMode="contain" />}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const description = SUMMARY_STAT_DESCRIPTIONS[label];

  return (
    <Pressable
      style={styles.summaryCard}
      onPress={() => description && Alert.alert(label, description)}
    >
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </Pressable>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    levelRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 14,
    },
    levelText: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      flexShrink: 1,
    },
    levelUpButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    levelUpButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontSize: 13,
      fontFamily: theme.displayFontFamily,
    },
    inspirationChip: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginBottom: 20,
    },
    inspirationChipActive: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
    inspirationChipText: {
      color: theme.colors.textMuted,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    inspirationChipTextActive: { color: theme.colors.primaryText },
    summaryRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 20, marginBottom: 20 },
    summaryCard: {
      flexBasis: "47%",
      flexGrow: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      alignItems: "center",
    },
    summaryValue: { color: theme.colors.text, fontSize: 18, fontWeight: "700" },
    summaryLabel: {
      color: theme.colors.textMuted,
      fontSize: 11,
      marginTop: 4,
      fontFamily: theme.displayFontFamily,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 10,
      marginTop: 20,
    },
    sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    sectionTitleInline: { marginTop: 0, marginBottom: 0 },
    sectionIcon: { width: 18, height: 18 },
    currencyHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 20,
    },
    currencyEditLink: {
      color: theme.colors.accent,
      fontWeight: "700",
      fontSize: 13,
      fontFamily: theme.displayFontFamily,
    },
    currencyRow: { flexDirection: "row", gap: 6 },
    xpText: { color: theme.colors.text, fontSize: 13, marginBottom: 4 },
    xpReadyText: {
      color: theme.colors.accent,
      fontSize: 12,
      fontWeight: "700",
      marginBottom: 10,
    },
    currencyCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
    },
    currencyValue: {
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    currencyLabel: {
      color: theme.colors.textMuted,
      fontSize: 10,
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    abilityGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    abilityCard: {
      width: "31%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    abilityLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    abilityScore: { color: theme.colors.text, fontSize: 20, fontWeight: "700", marginTop: 4 },
    abilityModifier: { color: theme.colors.accent, fontSize: 13, marginTop: 2 },
    proficiencyGrid: { gap: 2 },
    proficiencyRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 4,
      gap: 8,
    },
    proficiencyDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.border,
    },
    proficiencyDotOn: { backgroundColor: theme.colors.primary },
    proficiencyName: { color: theme.colors.text, fontWeight: "600", flex: 1, fontSize: 13 },
    proficiencyAbility: { color: theme.colors.textMuted, fontWeight: "400" },
    proficiencyMod: { color: theme.colors.accent, fontWeight: "700" },
    flavorLine: { color: theme.colors.text, fontSize: 13, lineHeight: 18, marginBottom: 4 },
    flavorLabel: { fontWeight: "700", color: theme.colors.textMuted },
    notes: { color: theme.colors.text, lineHeight: 20, fontFamily: theme.displayFontFamily },
  });
}
