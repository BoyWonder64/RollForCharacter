import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ScrollViewInstance,
  type TextInputFocusEvent,
} from "react-native";
import { router } from "expo-router";
import {
  ALIGNMENTS,
  CUSTOM_CLASS_FALLBACK,
  CUSTOM_OPTION_ID,
  CUSTOM_RACE_FALLBACK,
  DEFAULT_RULESET,
  RULESETS,
  getRulesetCatalog,
  type ArmorDefinition,
  type ClassDefinition,
  type EquipmentGrant,
  type EquipmentLine,
  type EquipmentOption,
  type RaceDefinition,
  type WeaponDefinition,
  type WeaponProficiencyCategory,
} from "../../../data/rulesets";
import {
  addArmorFromCatalog,
  addCustomWeapon,
  addWeaponFromCatalog,
  describeArmorAc,
} from "../../../features/characters/gearRepo";
import {
  applyRaceAbilityBonuses,
  armorClassBaseline,
  calculateMaxHp,
  languageGrantForRace,
  proficiencyBonusForLevel,
  roll4d6DropLowest,
  STANDARD_ARRAY,
} from "../../../features/characters/characterCalculations";
import {
  ABILITY_LABELS,
  abilityModifier,
  createCharacterFromOnboarding,
} from "../../../features/characters/characterRepo";
import {
  addCatalogSpellToCharacter,
  listSpellCatalog,
} from "../../../features/spells/spellRepo";
import { getSpellLimits } from "../../../features/characters/spellLimits";
import { xpThresholdForLevel } from "../../../features/characters/xpTable";
import type { AbilityScoreKey } from "../../../types/models";
import { useTheme } from "../../../theme/ThemeContext";
import type { Theme } from "../../../theme/colors";
import { useIconSettings } from "../../../features/icons/IconSettingsContext";
import { getSpellSchoolIcon } from "../../../features/icons/iconAssets";

const ALL_STEPS = [
  "ruleset",
  "name",
  "race",
  "languages",
  "class",
  "equipment",
  "background",
  "alignment",
  "personality",
  "proficiencies",
  "level",
  "experience",
  "abilities",
  "skills",
  "spells",
  "review",
] as const;
type Step = (typeof ALL_STEPS)[number];

type CatalogRow = Awaited<ReturnType<typeof listSpellCatalog>>[number];
const SPELL_RESULT_PAGE_SIZE = 30;

const ABILITY_KEYS: AbilityScoreKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

function clampLevel(value: string): number {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(20, Math.max(1, parsed));
}

export default function NewCharacterScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scrollRef = useRef<ScrollViewInstance>(null);

  // Long steps (lists of races/classes, multiple text fields) can leave a
  // focused field below the keyboard -- ScrollView's built-in "scroll
  // focused input into view" doesn't reliably fire once KeyboardAvoidingView
  // is also resizing the layout, so each TextInput triggers this manually,
  // reusing the same native helper ScrollView uses internally.
  function scrollFieldIntoView(event: TextInputFocusEvent) {
    if (event.target === undefined) return;
    scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard(event.target, 120, true);
  }
  const { iconsEnabled, iconStyle } = useIconSettings();
  const [stepIndex, setStepIndex] = useState(0);

  const [ruleset, setRuleset] = useState(DEFAULT_RULESET);
  const catalog = useMemo(() => getRulesetCatalog(ruleset), [ruleset]);

  const [name, setName] = useState("");

  const [raceId, setRaceId] = useState<string | null>(null);
  const [customRaceName, setCustomRaceName] = useState("");
  const [selectedExtraLanguageIds, setSelectedExtraLanguageIds] = useState<Set<string>>(new Set());

  const [classId, setClassId] = useState<string | null>(null);
  const [customClassName, setCustomClassName] = useState("");

  const [background, setBackground] = useState("");
  const [alignment, setAlignment] = useState<string | null>(null);
  const [personalityTraits, setPersonalityTraits] = useState("");
  const [ideals, setIdeals] = useState("");
  const [bonds, setBonds] = useState("");
  const [flaws, setFlaws] = useState("");
  const [otherProficiencies, setOtherProficiencies] = useState("");
  const [featuresAndTraits, setFeaturesAndTraits] = useState("");
  const [level, setLevel] = useState("1");
  const [usesXp, setUsesXp] = useState<boolean | null>(null);

  const [abilityMethod, setAbilityMethod] = useState<"standard" | "roll">("standard");
  const [assignments, setAssignments] = useState<
    Partial<Record<AbilityScoreKey, number>>
  >({});
  // Per-ability roll detail (the 4 dice + which was dropped), "roll" method only -- kept
  // separately from `assignments` (the actual score, which both methods write into) so the
  // UI can show "4, 3, 2 (dropped 1)" alongside the total and support rerolling one ability.
  const [rolledDetails, setRolledDetails] = useState<
    Partial<Record<AbilityScoreKey, { dice: number[]; dropped: number }>>
  >({});
  const [chosenBonusAbilities, setChosenBonusAbilities] = useState<
    AbilityScoreKey[]
  >([]);

  const [selectedSkillIds, setSelectedSkillIds] = useState<Set<string>>(new Set());

  // Index within each startingEquipment line's "A or B" split -- defaults
  // to the first option until the player picks differently.
  const [equipmentChoiceIndex, setEquipmentChoiceIndex] = useState<Record<number, number>>({});
  // Which catalog weapon the player picked for a "weaponChoice" grant (e.g.
  // "any martial weapon"), keyed by "<lineIndex>:<optionIndex>:<grantIndex>"
  // -- defaults to the first matching weapon until the player picks
  // differently. A value of `CUSTOM_OPTION_ID` means "typed in their own
  // weapon instead" -- the typed name lives in `customWeaponNames` below,
  // same free-text-fallback spirit as the race/class pickers.
  const [equipmentWeaponPick, setEquipmentWeaponPick] = useState<Record<string, string>>({});
  const [customWeaponNames, setCustomWeaponNames] = useState<Record<string, string>>({});

  const [selectedSpellIds, setSelectedSpellIds] = useState<Set<number>>(new Set());
  const [spellSearch, setSpellSearch] = useState("");
  const [spellCatalogResults, setSpellCatalogResults] = useState<CatalogRow[]>([]);
  const [onlySpellClass, setOnlySpellClass] = useState(true);
  const [spellResultLimit, setSpellResultLimit] = useState(SPELL_RESULT_PAGE_SIZE);
  const [expandedSpellIds, setExpandedSpellIds] = useState<Set<number>>(new Set());

  const selectedRace: RaceDefinition | null =
    raceId === CUSTOM_OPTION_ID
      ? CUSTOM_RACE_FALLBACK
      : catalog.races.find((r) => r.id === raceId) ?? null;

  // Only meaningful once a language catalog exists for this ruleset (5e,
  // 5e-2024) -- 3.5e has none yet, so its "languages" step is filtered out
  // below and this stays unused for it.
  const languageGrant = languageGrantForRace(ruleset, selectedRace);
  const languageChoiceOptions = (catalog.languages ?? []).filter(
    (l) => !languageGrant.granted.includes(l.id)
  );

  // What's granted and how many extra choices are available depends on the
  // race/ruleset, so a stale selection from a previous one can't carry over
  // (e.g. switching away from a race with more choice slots than the new
  // one allows) -- cleared right where race/ruleset are chosen rather than
  // via an effect.
  function selectRuleset(id: string) {
    setRuleset(id);
    setSelectedExtraLanguageIds(new Set());
  }

  function selectRace(id: string) {
    setRaceId(id);
    setSelectedExtraLanguageIds(new Set());
  }

  function toggleExtraLanguage(languageId: string) {
    setSelectedExtraLanguageIds((prev) => {
      const next = new Set(prev);
      if (next.has(languageId)) {
        next.delete(languageId);
      } else {
        if (next.size >= languageGrant.chooseCount) return prev;
        next.add(languageId);
      }
      return next;
    });
  }

  const selectedClass: ClassDefinition | null =
    classId === CUSTOM_OPTION_ID
      ? CUSTOM_CLASS_FALLBACK
      : catalog.classes.find((c) => c.id === classId) ?? null;

  const raceNameValue =
    raceId === CUSTOM_OPTION_ID
      ? customRaceName.trim() || "Custom Race"
      : selectedRace?.name ?? "";

  const classNameValue =
    classId === CUSTOM_OPTION_ID
      ? customClassName.trim() || "Custom Class"
      : selectedClass?.name ?? "";

  const levelNum = clampLevel(level);

  // Paladins and Rangers are 5e half-casters -- they get no spells at all
  // until character level 2 (first-level spell slots), unlike full casters
  // who get cantrips/spells starting at level 1.
  const HALF_CASTER_IDS = ["paladin", "ranger"];
  const spellcastingMinLevel =
    selectedClass && HALF_CASTER_IDS.includes(selectedClass.id) ? 2 : 1;

  const isSpellcaster =
    classId !== null &&
    classId !== CUSTOM_OPTION_ID &&
    !!selectedClass?.spellcastingAbility &&
    levelNum >= spellcastingMinLevel;

  const hasEquipmentChoices =
    classId !== null && classId !== CUSTOM_OPTION_ID && !!selectedClass?.startingEquipment;

  const steps: Step[] = ALL_STEPS.filter((s) => {
    if (s === "spells") return isSpellcaster;
    if (s === "equipment") return hasEquipmentChoices;
    // 3.5e has no language catalog yet -- its languages still live in the
    // freetext "Other Proficiencies" field on the proficiencies step.
    if (s === "languages") return !!catalog.languages;
    return true;
  });
  const step: Step = steps[stepIndex] ?? steps[steps.length - 1];

  const maxOnboardingSpellLevel = Math.min(9, Math.ceil(levelNum / 2));

  useEffect(() => {
    if (step !== "spells" || !selectedClass) return;
    listSpellCatalog({
      classId: onlySpellClass ? selectedClass.id : undefined,
      search: spellSearch.trim() || undefined,
    }).then((rows) =>
      setSpellCatalogResults(rows.filter((r) => r.level <= maxOnboardingSpellLevel))
    );
  }, [step, selectedClass, spellSearch, maxOnboardingSpellLevel, onlySpellClass]);

  // Custom/homebrew classes have no skill-choice data to constrain by, so
  // they get a generic "pick 2 of anything" fallback instead of blocking
  // the step entirely.
  const skillChoiceSpec = selectedClass?.skillChoices ?? {
    count: 2,
    options: catalog.skills.map((s) => s.id),
  };

  // Players can pick ANY skill, not just the ones their class normally
  // grants -- the class's usual list is just grouped first for reference,
  // same free-text-fallback spirit as the race/class pickers' "Custom..."
  // option.
  const classSkillIds = new Set(
    classId !== null && classId !== CUSTOM_OPTION_ID ? selectedClass?.skillChoices?.options ?? [] : []
  );
  const groupedSkillOptions =
    classSkillIds.size > 0
      ? {
          classSkills: catalog.skills.filter((s) => classSkillIds.has(s.id)),
          otherSkills: catalog.skills.filter((s) => !classSkillIds.has(s.id)),
        }
      : { classSkills: [], otherSkills: catalog.skills };

  function toggleSkillSelection(skillId: string) {
    setSelectedSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        if (next.size >= skillChoiceSpec.count) return prev;
        next.add(skillId);
      }
      return next;
    });
  }

  function selectClass(id: string) {
    setClassId(id);
    setSelectedSkillIds(new Set());
    setEquipmentChoiceIndex({});
    setEquipmentWeaponPick({});
  }

  function selectEquipmentOption(lineIndex: number, optionIndex: number) {
    setEquipmentChoiceIndex((prev) => ({ ...prev, [lineIndex]: optionIndex }));
  }

  function selectEquipmentWeapon(grantKey: string, weaponId: string) {
    setEquipmentWeaponPick((prev) => ({ ...prev, [grantKey]: weaponId }));
  }

  /** Every catalog weapon matching a "weaponChoice" grant's category -- what the player picks a specific weapon from. */
  function weaponsForCategory(category: WeaponProficiencyCategory): WeaponDefinition[] {
    const weapons = catalog.weapons ?? [];
    if (category === "Simple") return weapons.filter((w) => w.category.startsWith("Simple"));
    if (category === "Martial") return weapons.filter((w) => w.category.startsWith("Martial"));
    return weapons.filter((w) => w.category === category);
  }

  function resolvedWeaponIdFor(grantKey: string, category: WeaponProficiencyCategory): string | undefined {
    return equipmentWeaponPick[grantKey] ?? weaponsForCategory(category)[0]?.id;
  }

  function isCustomWeaponPick(grantKey: string): boolean {
    return equipmentWeaponPick[grantKey] === CUSTOM_OPTION_ID;
  }

  function customWeaponNameFor(grantKey: string): string {
    return customWeaponNames[grantKey] ?? "";
  }

  function weaponStatsText(def: WeaponDefinition): string {
    const parts = [def.damageDice ? `${def.damageDice} ${def.damageType}` : "No damage", def.category];
    if (def.properties.length > 0) parts.push(def.properties.join(", "));
    parts.push(`${def.weight} lb`, def.cost);
    return parts.join(" · ");
  }

  function armorStatsText(def: ArmorDefinition): string {
    const parts = [`AC ${describeArmorAc(def)}`, def.category];
    if (def.strengthRequirement) parts.push(`Str ${def.strengthRequirement}`);
    if (def.stealthDisadvantage) parts.push("Stealth disadvantage");
    parts.push(`${def.weight} lb`, def.cost);
    return parts.join(" · ");
  }

  function grantLabel(grant: EquipmentGrant, grantKey: string): string {
    const qty = grant.kind !== "armor" && grant.quantity && grant.quantity > 1 ? `${grant.quantity} ` : "";
    switch (grant.kind) {
      case "weapon": {
        const def = catalog.weapons?.find((w) => w.id === grant.weaponId);
        return `${qty}${def?.name ?? grant.weaponId}`;
      }
      case "weaponChoice": {
        if (isCustomWeaponPick(grantKey)) {
          return `${qty}${customWeaponNameFor(grantKey).trim() || "Custom weapon"}`;
        }
        const def = catalog.weapons?.find((w) => w.id === resolvedWeaponIdFor(grantKey, grant.category));
        return `${qty}${def?.name ?? `any ${grant.category.toLowerCase()} weapon`}`;
      }
      case "armor": {
        const def = catalog.armor?.find((a) => a.id === grant.armorId);
        return def?.name ?? grant.armorId;
      }
      case "item":
        return `${qty}${grant.name}`;
    }
  }

  function grantStatsText(grant: EquipmentGrant, grantKey: string): string | undefined {
    if (grant.kind === "weapon") {
      const def = catalog.weapons?.find((w) => w.id === grant.weaponId);
      return def ? weaponStatsText(def) : undefined;
    }
    if (grant.kind === "weaponChoice") {
      if (isCustomWeaponPick(grantKey)) return undefined;
      const def = catalog.weapons?.find((w) => w.id === resolvedWeaponIdFor(grantKey, grant.category));
      return def ? weaponStatsText(def) : undefined;
    }
    if (grant.kind === "armor") {
      const def = catalog.armor?.find((a) => a.id === grant.armorId);
      return def ? armorStatsText(def) : undefined;
    }
    return undefined;
  }

  function grantDescriptionText(grant: EquipmentGrant, grantKey: string): string | undefined {
    if (grant.kind === "weapon") return catalog.weapons?.find((w) => w.id === grant.weaponId)?.description;
    if (grant.kind === "weaponChoice") {
      if (isCustomWeaponPick(grantKey)) return undefined;
      return catalog.weapons?.find((w) => w.id === resolvedWeaponIdFor(grantKey, grant.category))?.description;
    }
    if (grant.kind === "armor") return catalog.armor?.find((a) => a.id === grant.armorId)?.description;
    return grant.description;
  }

  function describeEquipmentLine(line: EquipmentLine, lineIndex: number): string {
    const optionIndex = equipmentChoiceIndex[lineIndex] ?? 0;
    const option = line[optionIndex] ?? line[0] ?? [];
    return option
      .map((grant, grantIndex) => grantLabel(grant, `${lineIndex}:${optionIndex}:${grantIndex}`))
      .join(", ");
  }

  function renderEquipmentOption(
    option: EquipmentOption,
    lineIndex: number,
    optionIndex: number,
    onActivate?: () => void,
    expanded: boolean = true
  ) {
    return option.map((grant, grantIndex) => {
      const grantKey = `${lineIndex}:${optionIndex}:${grantIndex}`;
      const stats = grantStatsText(grant, grantKey);
      const description = grantDescriptionText(grant, grantKey);
      return (
        <View key={grantIndex} style={styles.equipmentGrant}>
          <Text style={styles.equipmentGrantLabel}>{grantLabel(grant, grantKey)}</Text>
          {stats && <Text style={styles.equipmentGrantStats}>{stats}</Text>}
          {description && <Text style={styles.equipmentGrantFlavor}>{description}</Text>}
          {grant.kind === "weaponChoice" && !expanded && (
            <Text style={styles.equipmentGrantHint}>Tap to pick exactly which one</Text>
          )}
          {grant.kind === "weaponChoice" && expanded && (
            <View style={styles.equipmentWeaponPicker}>
              <Text style={styles.equipmentGrantHint}>Pick exactly which one:</Text>
              {weaponsForCategory(grant.category).map((w) => {
                const active = !isCustomWeaponPick(grantKey) && resolvedWeaponIdFor(grantKey, grant.category) === w.id;
                return (
                  <Pressable
                    key={w.id}
                    style={[styles.equipmentWeaponRow, active && styles.equipmentWeaponRowActive]}
                    onPress={() => {
                      onActivate?.();
                      selectEquipmentWeapon(grantKey, w.id);
                    }}
                  >
                    <Text
                      style={[styles.equipmentWeaponName, active && styles.equipmentWeaponNameActive]}
                    >
                      {w.name}
                    </Text>
                    <Text style={styles.equipmentWeaponStats}>{weaponStatsText(w)}</Text>
                  </Pressable>
                );
              })}
              <Pressable
                style={[
                  styles.equipmentWeaponRow,
                  isCustomWeaponPick(grantKey) && styles.equipmentWeaponRowActive,
                ]}
                onPress={() => {
                  onActivate?.();
                  selectEquipmentWeapon(grantKey, CUSTOM_OPTION_ID);
                }}
              >
                <Text
                  style={[
                    styles.equipmentWeaponName,
                    isCustomWeaponPick(grantKey) && styles.equipmentWeaponNameActive,
                  ]}
                >
                  Custom…
                </Text>
                <Text style={styles.equipmentWeaponStats}>Type your own weapon</Text>
              </Pressable>
              {isCustomWeaponPick(grantKey) && (
                <TextInput
                  style={styles.input}
                  value={customWeaponNameFor(grantKey)}
                  onChangeText={(text) =>
                    setCustomWeaponNames((prev) => ({ ...prev, [grantKey]: text }))
                  }
                  placeholder="Weapon name"
                  placeholderTextColor={theme.colors.textMuted}
                  onFocus={scrollFieldIntoView}
                />
              )}
            </View>
          )}
        </View>
      );
    });
  }

  function toggleSpellSelection(spell: CatalogRow) {
    setSelectedSpellIds((prev) => {
      const next = new Set(prev);
      if (next.has(spell.id)) {
        next.delete(spell.id);
        return next;
      }
      if (spellLimits) {
        const isCantrip = spell.level === 0;
        const countOfType = spellCatalogResults.filter(
          (s) => next.has(s.id) && (s.level === 0) === isCantrip
        ).length;
        const limit = isCantrip ? spellLimits.cantrips : spellLimits.spells;
        if (countOfType >= limit) return prev;
      }
      next.add(spell.id);
      return next;
    });
  }

  function toggleSpellExpanded(spellId: number) {
    setExpandedSpellIds((prev) => {
      const next = new Set(prev);
      if (next.has(spellId)) {
        next.delete(spellId);
      } else {
        next.add(spellId);
      }
      return next;
    });
  }

  const baseAbilityScores: Record<AbilityScoreKey, number> = {
    strength: assignments.strength ?? 10,
    dexterity: assignments.dexterity ?? 10,
    constitution: assignments.constitution ?? 10,
    intelligence: assignments.intelligence ?? 10,
    wisdom: assignments.wisdom ?? 10,
    charisma: assignments.charisma ?? 10,
  };
  const finalAbilityScores: Record<AbilityScoreKey, number> =
    !selectedRace || raceId === CUSTOM_OPTION_ID
      ? baseAbilityScores
      : applyRaceAbilityBonuses(baseAbilityScores, selectedRace, chosenBonusAbilities);

  const spellLimits =
    selectedClass && selectedClass.spellcastingAbility
      ? getSpellLimits(
          selectedClass.id,
          levelNum,
          abilityModifier(finalAbilityScores[selectedClass.spellcastingAbility])
        )
      : undefined;

  const derivedMaxHp = selectedClass
    ? calculateMaxHp(
        selectedClass.hitDie,
        levelNum,
        abilityModifier(finalAbilityScores.constitution)
      )
    : 10;
  const derivedArmorClass = armorClassBaseline(finalAbilityScores.dexterity);
  const derivedSpeed = selectedRace?.speed ?? 30;
  const derivedProficiencyBonus = proficiencyBonusForLevel(levelNum);

  function canGoNext(): boolean {
    switch (step) {
      case "ruleset":
        return true;
      case "name":
        return name.trim().length > 0;
      case "race":
        return (
          raceId !== null &&
          (raceId !== CUSTOM_OPTION_ID || customRaceName.trim().length > 0)
        );
      case "languages":
        return selectedExtraLanguageIds.size === languageGrant.chooseCount;
      case "class":
        return (
          classId !== null &&
          (classId !== CUSTOM_OPTION_ID || customClassName.trim().length > 0)
        );
      case "equipment":
        return true;
      case "background":
        return true;
      case "alignment":
        return true;
      case "personality":
        return true;
      case "proficiencies":
        return true;
      case "level":
        return level.trim().length > 0;
      case "experience":
        return usesXp !== null;
      case "abilities": {
        const allAssigned = ABILITY_KEYS.every((key) => assignments[key] !== undefined);
        if (!allAssigned) return false;
        if (selectedRace?.chooseAbilityBonus && raceId !== CUSTOM_OPTION_ID) {
          return chosenBonusAbilities.length === selectedRace.chooseAbilityBonus.count;
        }
        return true;
      }
      case "skills":
        return true;
      case "spells":
        return true;
      case "review":
        return true;
    }
  }

  function goNext() {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
  }

  function goBack() {
    if (stepIndex === 0) {
      router.back();
      return;
    }
    setStepIndex(stepIndex - 1);
  }

  function selectAbilityMethod(method: "standard" | "roll") {
    setAbilityMethod(method);
    setAssignments({});
    setRolledDetails({});
  }

  function rollAbilityScore(ability: AbilityScoreKey) {
    const result = roll4d6DropLowest();
    setAssignments((prev) => ({ ...prev, [ability]: result.total }));
    setRolledDetails((prev) => ({
      ...prev,
      [ability]: { dice: result.dice, dropped: result.dropped },
    }));
  }

  function selectAbilityValue(ability: AbilityScoreKey, value: number) {
    setAssignments((prev) => {
      const next = { ...prev };
      if (next[ability] === value) {
        delete next[ability];
      } else {
        next[ability] = value;
      }
      return next;
    });
  }

  function isValueUsedByOther(value: number, ability: AbilityScoreKey): boolean {
    return Object.entries(assignments).some(
      ([key, used]) => key !== ability && used === value
    );
  }

  function toggleBonusAbility(key: AbilityScoreKey) {
    const maxCount = selectedRace?.chooseAbilityBonus?.count ?? 0;
    setChosenBonusAbilities((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= maxCount) return prev;
      return [...prev, key];
    });
  }

  function equipmentSummaryText(): string {
    const lines = selectedClass?.startingEquipment ?? [];
    if (lines.length === 0) return "";
    return `Starting Equipment: ${lines.map((line, i) => describeEquipmentLine(line, i)).join("; ")}`;
  }

  // Turns the chosen startingEquipment grants into real characterWeapons/
  // characterArmor rows instead of a text summary -- so they show up as
  // actual gear on the Equipment tab, not a line buried in Notes. Generic
  // "item" grants (packs, instruments, holy symbols, etc.) have no weapon/
  // armor catalog entry to attach to, so they're intentionally skipped here.
  async function addStartingEquipment(characterId: number): Promise<void> {
    const lines = selectedClass?.startingEquipment ?? [];
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const optionIndex = equipmentChoiceIndex[lineIndex] ?? 0;
      const option = lines[lineIndex][optionIndex] ?? lines[lineIndex][0] ?? [];
      for (let grantIndex = 0; grantIndex < option.length; grantIndex++) {
        const grant = option[grantIndex];
        if (grant.kind === "weapon") {
          await addWeaponFromCatalog(characterId, ruleset, grant.weaponId);
        } else if (grant.kind === "weaponChoice") {
          const grantKey = `${lineIndex}:${optionIndex}:${grantIndex}`;
          if (isCustomWeaponPick(grantKey)) {
            const customName = customWeaponNameFor(grantKey).trim();
            if (customName) await addCustomWeapon(characterId, { name: customName });
          } else {
            const weaponId = resolvedWeaponIdFor(grantKey, grant.category);
            if (weaponId) await addWeaponFromCatalog(characterId, ruleset, weaponId);
          }
        } else if (grant.kind === "armor") {
          await addArmorFromCatalog(characterId, ruleset, grant.armorId);
        }
      }
    }
  }

  async function handleCreate() {
    const created = await createCharacterFromOnboarding({
      name: name.trim(),
      ruleset,
      race: raceNameValue,
      className: classNameValue,
      background: background.trim(),
      alignment: alignment ?? "",
      personalityTraits: personalityTraits.trim(),
      ideals: ideals.trim(),
      bonds: bonds.trim(),
      flaws: flaws.trim(),
      otherProficiencies: otherProficiencies.trim(),
      featuresAndTraits: featuresAndTraits.trim(),
      languages: catalog.languages
        ? [...languageGrant.granted, ...Array.from(selectedExtraLanguageIds)]
        : [],
      level: levelNum,
      maxHp: derivedMaxHp,
      armorClass: derivedArmorClass,
      speed: derivedSpeed,
      proficiencyBonus: derivedProficiencyBonus,
      strength: finalAbilityScores.strength,
      dexterity: finalAbilityScores.dexterity,
      constitution: finalAbilityScores.constitution,
      intelligence: finalAbilityScores.intelligence,
      wisdom: finalAbilityScores.wisdom,
      charisma: finalAbilityScores.charisma,
      skillProficiencies: Array.from(selectedSkillIds),
      notes: "",
      usesXp: usesXp ?? false,
      experiencePoints: usesXp ? xpThresholdForLevel(ruleset, levelNum) : 0,
    });
    await addStartingEquipment(created.id);
    for (const spellId of selectedSpellIds) {
      await addCatalogSpellToCharacter(created.id, spellId);
    }
    router.replace({
      pathname: "/(tabs)/characters/[characterId]",
      params: { characterId: String(created.id) },
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.stepCounter}>
        Step {stepIndex + 1} of {steps.length}
      </Text>

      <ScrollView
        ref={scrollRef}
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
      >
        {step === "ruleset" && (
          <View>
            <Text style={styles.title}>Which rules are you playing with?</Text>
            <Text style={styles.hint}>
              This determines the races, classes, spells, and skills available for this
              character.
            </Text>
            {Object.values(RULESETS).map((rs) => (
              <ChoiceRow
                key={rs.id}
                label={rs.label}
                sublabel={`${rs.classes.length} classes · ${rs.races.length} races · ${rs.spells.length} spells`}
                selected={ruleset === rs.id}
                onPress={() => selectRuleset(rs.id)}
              />
            ))}
          </View>
        )}

        {step === "name" && (
          <View>
            <Text style={styles.title}>What&apos;s your character&apos;s name?</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Character name"
              placeholderTextColor={theme.colors.textMuted}
              autoFocus
              onFocus={scrollFieldIntoView}
            />
          </View>
        )}

        {step === "race" && (
          <View>
            <Text style={styles.title}>Choose a race</Text>
            {catalog.races.map((race) => (
              <View key={race.id}>
                <ChoiceRow
                  label={race.name}
                  sublabel={race.summary}
                  selected={raceId === race.id}
                  onPress={() => selectRace(race.id)}
                />
                {raceId === race.id && (
                  <View style={styles.detailPanel}>
                    <Text style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Speed: </Text>
                      {race.speed} ft
                    </Text>
                    <Text style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Size: </Text>
                      {race.size}
                    </Text>
                    {Object.keys(race.abilityBonuses).length > 0 && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ability Bonuses: </Text>
                        {Object.entries(race.abilityBonuses)
                          .map(
                            ([key, value]) =>
                              `+${value} ${ABILITY_LABELS[key as AbilityScoreKey]}`
                          )
                          .join(", ")}
                      </Text>
                    )}
                    {race.chooseAbilityBonus && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Choice Bonus: </Text>
                        +{race.chooseAbilityBonus.amount} to {race.chooseAbilityBonus.count}{" "}
                        ability score{race.chooseAbilityBonus.count > 1 ? "s" : ""} of your
                        choice
                        {race.chooseAbilityBonus.excluding &&
                        race.chooseAbilityBonus.excluding.length > 0
                          ? ` (not ${race.chooseAbilityBonus.excluding
                              .map((a) => ABILITY_LABELS[a])
                              .join(", ")})`
                          : ""}
                      </Text>
                    )}
                    {race.traits && race.traits.length > 0 && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Traits: </Text>
                        {race.traits.map((t) => t.name).join(", ")}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}
            <ChoiceRow
              label="Custom…"
              sublabel="Type your own race"
              selected={raceId === CUSTOM_OPTION_ID}
              onPress={() => selectRace(CUSTOM_OPTION_ID)}
            />
            {raceId === CUSTOM_OPTION_ID && (
              <TextInput
                style={styles.input}
                value={customRaceName}
                onChangeText={setCustomRaceName}
                placeholder="Race name"
                placeholderTextColor={theme.colors.textMuted}
                onFocus={scrollFieldIntoView}
              />
            )}
          </View>
        )}

        {step === "languages" && (
          <View>
            <Text style={styles.title}>Languages</Text>
            <Text style={styles.hint}>
              {languageGrant.granted.length > 0
                ? `You automatically know: ${languageGrant.granted
                    .map((id) => catalog.languages?.find((l) => l.id === id)?.name ?? id)
                    .join(", ")}.`
                : ""}{" "}
              {languageChoiceOptions.length > 0 && languageGrant.chooseCount > 0
                ? `Choose ${languageGrant.chooseCount} more.`
                : ""}
            </Text>
            {languageGrant.chooseCount > 0 && (
              <>
                <View style={styles.skillGrid}>
                  {languageChoiceOptions.map((lang) => {
                    const selected = selectedExtraLanguageIds.has(lang.id);
                    return (
                      <Pressable
                        key={lang.id}
                        onPress={() => toggleExtraLanguage(lang.id)}
                        style={[styles.skillCard, selected && styles.skillCardActive]}
                      >
                        <Text
                          style={[styles.skillCardText, selected && styles.skillCardTextActive]}
                        >
                          {lang.name}
                        </Text>
                        <Text
                          style={[styles.skillCardSub, selected && styles.skillCardTextActive]}
                        >
                          {lang.rare ? "Rare" : "Standard"}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Text style={styles.hint}>
                  {selectedExtraLanguageIds.size} / {languageGrant.chooseCount} selected.
                </Text>
              </>
            )}
          </View>
        )}

        {step === "class" && (
          <View>
            <Text style={styles.title}>Choose a class</Text>
            {catalog.classes.map((klass) => (
              <View key={klass.id}>
                <ChoiceRow
                  label={klass.name}
                  sublabel={klass.summary}
                  selected={classId === klass.id}
                  onPress={() => selectClass(klass.id)}
                />
                {classId === klass.id && (
                  <View style={styles.detailPanel}>
                    <Text style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Hit Die: </Text>d{klass.hitDie}
                    </Text>
                    {klass.savingThrows && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Saving Throws: </Text>
                        {klass.savingThrows.map((a) => ABILITY_LABELS[a]).join(", ")}
                      </Text>
                    )}
                    {klass.spellcastingAbility && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Spellcasting: </Text>
                        {ABILITY_LABELS[klass.spellcastingAbility]}
                      </Text>
                    )}
                    {klass.skillChoices && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Skills: </Text>
                        Choose {klass.skillChoices.count} from{" "}
                        {klass.skillChoices.options
                          .map((id) => catalog.skills.find((s) => s.id === id)?.name ?? id)
                          .join(", ")}
                      </Text>
                    )}
                    {klass.armorProficiencies && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Armor: </Text>
                        {klass.armorProficiencies.length > 0
                          ? klass.armorProficiencies.join(", ")
                          : "None"}
                      </Text>
                    )}
                    {klass.weaponProficiencies && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Weapons: </Text>
                        {klass.weaponProficiencies.join(", ")}
                      </Text>
                    )}
                    {klass.startingEquipment && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Starting Equipment: </Text>
                        {klass.startingEquipment
                          .map((line, i) => describeEquipmentLine(line, i))
                          .join("; ")}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}
            <ChoiceRow
              label="Custom…"
              sublabel="Type your own class"
              selected={classId === CUSTOM_OPTION_ID}
              onPress={() => selectClass(CUSTOM_OPTION_ID)}
            />
            {classId === CUSTOM_OPTION_ID && (
              <TextInput
                style={styles.input}
                value={customClassName}
                onChangeText={setCustomClassName}
                placeholder="Class name"
                placeholderTextColor={theme.colors.textMuted}
                onFocus={scrollFieldIntoView}
              />
            )}
          </View>
        )}

        {step === "equipment" && selectedClass && (
          <View>
            <Text style={styles.title}>Starting Equipment</Text>
            <Text style={styles.hint}>
              This is the gear your {selectedClass.name} starts with, shown with full stats
              so you know what you&apos;re carrying. Some of it comes with alternatives — tap
              the one you want wherever you see more than one option. Where the rules just
              say “any simple weapon” or “any martial weapon,” every matching weapon is
              listed so you can pick exactly which one. Anything with just one option is
              included automatically.
            </Text>
            {(selectedClass.startingEquipment ?? []).map((line, lineIndex) => {
              if (line.length === 1) {
                return (
                  <View key={lineIndex} style={styles.equipmentGroup}>
                    <Text style={styles.equipmentGroupLabel}>Included</Text>
                    <View style={styles.equipmentFixedRow}>
                      {renderEquipmentOption(line[0], lineIndex, 0)}
                    </View>
                  </View>
                );
              }
              const chosenIndex = equipmentChoiceIndex[lineIndex] ?? 0;
              return (
                <View key={lineIndex} style={styles.equipmentGroup}>
                  <Text style={styles.equipmentGroupLabel}>Choose one</Text>
                  {line.map((option, optionIndex) => {
                    const active = chosenIndex === optionIndex;
                    return (
                      <Pressable
                        key={optionIndex}
                        style={[
                          styles.equipmentOptionCard,
                          active && styles.equipmentOptionCardActive,
                        ]}
                        onPress={() => selectEquipmentOption(lineIndex, optionIndex)}
                      >
                        {renderEquipmentOption(
                          option,
                          lineIndex,
                          optionIndex,
                          () => selectEquipmentOption(lineIndex, optionIndex),
                          active
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              );
            })}
          </View>
        )}

        {step === "background" && (
          <View>
            <Text style={styles.title}>Background (optional)</Text>
            <TextInput
              style={styles.input}
              value={background}
              onChangeText={setBackground}
              placeholder="e.g. Soldier, Sage, Criminal…"
              placeholderTextColor={theme.colors.textMuted}
              onFocus={scrollFieldIntoView}
            />
          </View>
        )}

        {step === "alignment" && (
          <View>
            <Text style={styles.title}>Alignment (optional)</Text>
            <Text style={styles.hint}>
              A rough compass for how your character approaches morality and order.
            </Text>
            {ALIGNMENTS.map((option) => (
              <ChoiceRow
                key={option}
                label={option}
                sublabel=""
                selected={alignment === option}
                onPress={() => setAlignment(alignment === option ? null : option)}
              />
            ))}
          </View>
        )}

        {step === "personality" && (
          <View>
            <Text style={styles.title}>Personality (optional)</Text>
            <Text style={styles.hint}>
              The four roleplay prompts from the standard character sheet. Skip any of
              these for now — they&apos;re easy to fill in later from Edit.
            </Text>
            <Text style={styles.fieldLabel}>Personality Traits</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={personalityTraits}
              onChangeText={setPersonalityTraits}
              placeholder="How does your character act, speak, or see the world?"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              onFocus={scrollFieldIntoView}
            />
            <Text style={styles.fieldLabel}>Ideals</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={ideals}
              onChangeText={setIdeals}
              placeholder="What principles does your character believe in?"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              onFocus={scrollFieldIntoView}
            />
            <Text style={styles.fieldLabel}>Bonds</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={bonds}
              onChangeText={setBonds}
              placeholder="Who or what is your character tied to?"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              onFocus={scrollFieldIntoView}
            />
            <Text style={styles.fieldLabel}>Flaws</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={flaws}
              onChangeText={setFlaws}
              placeholder="What weakness or vice might get your character in trouble?"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              onFocus={scrollFieldIntoView}
            />
          </View>
        )}

        {step === "proficiencies" && (
          <View>
            <Text style={styles.title}>Proficiencies &amp; Traits (optional)</Text>
            <Text style={styles.hint}>
              Anything else from the sheet that doesn&apos;t fit elsewhere — tool
              proficiencies
              {catalog.languages ? "" : ", languages you speak"}
              {selectedRace?.traits ? "" : ", racial traits"}, or your background feature.
              {selectedRace?.traits
                ? " Your race's traits are tracked automatically and show up on the sheet."
                : ""}
            </Text>
            <Text style={styles.fieldLabel}>
              {catalog.languages ? "Other Proficiencies" : "Other Proficiencies & Languages"}
            </Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={otherProficiencies}
              onChangeText={setOtherProficiencies}
              placeholder={catalog.languages ? "e.g. Thieves' tools" : "e.g. Thieves' tools, Common, Elvish…"}
              placeholderTextColor={theme.colors.textMuted}
              multiline
              onFocus={scrollFieldIntoView}
            />
            <Text style={styles.fieldLabel}>
              {selectedRace?.traits ? "Background Feature & Other Traits" : "Features & Traits"}
            </Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={featuresAndTraits}
              onChangeText={setFeaturesAndTraits}
              placeholder={
                selectedRace?.traits
                  ? "e.g. Shelter of the Faithful…"
                  : "e.g. Darkvision, Lucky, Shelter of the Faithful…"
              }
              placeholderTextColor={theme.colors.textMuted}
              multiline
              onFocus={scrollFieldIntoView}
            />
          </View>
        )}

        {step === "level" && (
          <View>
            <Text style={styles.title}>Starting level</Text>
            <TextInput
              style={styles.input}
              value={level}
              onChangeText={setLevel}
              keyboardType="number-pad"
              placeholder="1"
              placeholderTextColor={theme.colors.textMuted}
              onFocus={scrollFieldIntoView}
            />
          </View>
        )}

        {step === "experience" && (
          <View>
            <Text style={styles.title}>Track Experience Points?</Text>
            <Text style={styles.hint}>
              Some tables track XP from quests and monsters to determine when you level up;
              others just have the DM call for a level-up at a good story moment
              (&quot;milestone&quot; leveling). Either is fine — this only changes what shows
              up on this character&apos;s sheet.
            </Text>
            <View style={styles.advantageRow}>
              {([true, false] as const).map((value) => (
                <Pressable
                  key={String(value)}
                  style={[styles.advantageButton, usesXp === value && styles.advantageButtonActive]}
                  onPress={() => setUsesXp(value)}
                >
                  <Text
                    style={[styles.advantageText, usesXp === value && styles.advantageTextActive]}
                  >
                    {value ? "Yes, track XP" : "No, milestone leveling"}
                  </Text>
                </Pressable>
              ))}
            </View>
            {usesXp === true && (
              <Text style={styles.hint}>
                Starting at {xpThresholdForLevel(ruleset, levelNum)} XP (the minimum for level{" "}
                {levelNum}).
              </Text>
            )}
          </View>
        )}

        {step === "abilities" && (
          <View>
            <Text style={styles.title}>Assign ability scores</Text>
            <View style={styles.advantageRow}>
              {(["standard", "roll"] as const).map((method) => (
                <Pressable
                  key={method}
                  style={[styles.advantageButton, abilityMethod === method && styles.advantageButtonActive]}
                  onPress={() => selectAbilityMethod(method)}
                >
                  <Text
                    style={[
                      styles.advantageText,
                      abilityMethod === method && styles.advantageTextActive,
                    ]}
                  >
                    {method === "standard" ? "Standard Array" : "Roll (4d6 drop lowest)"}
                  </Text>
                </Pressable>
              ))}
            </View>

            {abilityMethod === "standard" ? (
              <>
                <Text style={styles.hint}>
                  Place each of {STANDARD_ARRAY.join(", ")} on an ability score.
                </Text>
                {ABILITY_KEYS.map((key) => (
                  <View key={key} style={styles.abilityRow}>
                    <Text style={styles.abilityRowLabel}>{ABILITY_LABELS[key]}</Text>
                    <View style={styles.abilityValues}>
                      {STANDARD_ARRAY.map((value) => {
                        const assignedHere = assignments[key] === value;
                        const disabled = !assignedHere && isValueUsedByOther(value, key);
                        return (
                          <Pressable
                            key={value}
                            disabled={disabled}
                            onPress={() => selectAbilityValue(key, value)}
                            style={[
                              styles.abilityValueButton,
                              assignedHere && styles.abilityValueButtonActive,
                              disabled && styles.abilityValueButtonDisabled,
                            ]}
                          >
                            <Text
                              style={[
                                styles.abilityValueText,
                                assignedHere && styles.abilityValueTextActive,
                              ]}
                            >
                              {value}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.hint}>
                  Roll each ability independently — 4d6, dropping the lowest die. Reroll any
                  of them as many times as you like.
                </Text>
                {ABILITY_KEYS.map((key) => {
                  const detail = rolledDetails[key];
                  const score = assignments[key];
                  return (
                    <View key={key} style={styles.rollAbilityRow}>
                      <Text style={styles.abilityRowLabel}>{ABILITY_LABELS[key]}</Text>
                      <View style={styles.rollAbilityResult}>
                        {score !== undefined && detail ? (
                          <Text style={styles.rollAbilityDetail}>
                            {detail.dice.join(", ")} (dropped {detail.dropped})
                          </Text>
                        ) : (
                          <Text style={styles.rollAbilityDetail}>Not rolled yet</Text>
                        )}
                      </View>
                      <Text style={styles.rollAbilityScore}>{score ?? "—"}</Text>
                      <Pressable
                        style={styles.rollAbilityButton}
                        onPress={() => rollAbilityScore(key)}
                      >
                        <Text style={styles.rollAbilityButtonText}>
                          {score !== undefined ? "Reroll" : "Roll"}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </>
            )}

            {selectedRace?.chooseAbilityBonus && raceId !== CUSTOM_OPTION_ID && (
              <View style={styles.bonusSection}>
                <Text style={styles.hint}>
                  Choose {selectedRace.chooseAbilityBonus.count} abilities to gain +
                  {selectedRace.chooseAbilityBonus.amount} from your race.
                </Text>
                <View style={styles.bonusRow}>
                  {ABILITY_KEYS.filter(
                    (key) => !selectedRace.chooseAbilityBonus?.excluding?.includes(key)
                  ).map((key) => {
                    const chosen = chosenBonusAbilities.includes(key);
                    return (
                      <Pressable
                        key={key}
                        onPress={() => toggleBonusAbility(key)}
                        style={[styles.bonusChip, chosen && styles.bonusChipActive]}
                      >
                        <Text
                          style={[styles.bonusChipText, chosen && styles.bonusChipTextActive]}
                        >
                          {ABILITY_LABELS[key]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}

        {step === "skills" && (
          <View>
            <Text style={styles.title}>Skill Proficiencies</Text>
            <Text style={styles.hint}>
              Choose {skillChoiceSpec.count} skills this character is proficient in — you
              aren&apos;t limited to your class&apos;s usual list, so pick whatever fits your
              character.{" "}
              {groupedSkillOptions.classSkills.length > 0
                ? `${selectedClass?.name}'s usual skills are grouped first for reference.`
                : ""}{" "}
              Background-granted skills aren&apos;t tracked separately yet, so include those
              here too if you know them.
            </Text>
            {groupedSkillOptions.classSkills.length > 0 && (
              <>
                <Text style={styles.equipmentGroupLabel}>{selectedClass?.name}&apos;s Skills</Text>
                <View style={styles.skillGrid}>
                  {groupedSkillOptions.classSkills.map((skill) => {
                    const selected = selectedSkillIds.has(skill.id);
                    return (
                      <Pressable
                        key={skill.id}
                        onPress={() => toggleSkillSelection(skill.id)}
                        style={[styles.skillCard, selected && styles.skillCardActive]}
                      >
                        <Text style={[styles.skillCardText, selected && styles.skillCardTextActive]}>
                          {skill.name}
                        </Text>
                        <Text style={[styles.skillCardSub, selected && styles.skillCardTextActive]}>
                          {ABILITY_LABELS[skill.ability]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
            <Text style={styles.equipmentGroupLabel}>
              {groupedSkillOptions.classSkills.length > 0 ? "Other Skills" : "Skills"}
            </Text>
            <View style={styles.skillGrid}>
              {groupedSkillOptions.otherSkills.map((skill) => {
                const selected = selectedSkillIds.has(skill.id);
                return (
                  <Pressable
                    key={skill.id}
                    onPress={() => toggleSkillSelection(skill.id)}
                    style={[styles.skillCard, selected && styles.skillCardActive]}
                  >
                    <Text style={[styles.skillCardText, selected && styles.skillCardTextActive]}>
                      {skill.name}
                    </Text>
                    <Text
                      style={[styles.skillCardSub, selected && styles.skillCardTextActive]}
                    >
                      {ABILITY_LABELS[skill.ability]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.hint}>
              {selectedSkillIds.size} / {skillChoiceSpec.count} selected.
            </Text>
          </View>
        )}

        {step === "spells" && selectedClass && (
          <View>
            <Text style={styles.title}>Starting Spells</Text>
            <Text style={styles.hint}>
              Shows spells up to level {maxOnboardingSpellLevel} (an approximation of what a
              level {levelNum} {selectedClass.name} can access — not exact slot-by-slot
              scaling). Tap a spell to pick it; tap the ⓘ to read what it does.
            </Text>
            {spellLimits && (
              <View style={styles.spellLimitRow}>
                {spellLimits.cantrips > 0 && (
                  <Text style={styles.spellLimitText}>
                    Cantrips: {selectedSpellIds.size > 0
                      ? spellCatalogResults.filter((s) => selectedSpellIds.has(s.id) && s.level === 0).length
                      : 0}{" "}
                    / {spellLimits.cantrips}
                  </Text>
                )}
                <Text style={styles.spellLimitText}>
                  {spellLimits.mode === "prepared" ? "Prepared" : "Known"} spells:{" "}
                  {spellCatalogResults.filter((s) => selectedSpellIds.has(s.id) && s.level > 0).length}{" "}
                  / {spellLimits.spells}
                </Text>
              </View>
            )}
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={spellSearch}
                onChangeText={(text) => {
                  setSpellSearch(text);
                  setSpellResultLimit(SPELL_RESULT_PAGE_SIZE);
                }}
                placeholder="Search spells…"
                placeholderTextColor={theme.colors.textMuted}
                onFocus={scrollFieldIntoView}
                autoCapitalize="none"
              />
              <Pressable
                style={styles.spellClassFilterChip}
                onPress={() => {
                  setOnlySpellClass((v) => !v);
                  setSpellResultLimit(SPELL_RESULT_PAGE_SIZE);
                }}
              >
                <Text style={styles.spellClassFilterChipText}>
                  {onlySpellClass ? selectedClass.name : "All classes"}
                </Text>
              </Pressable>
            </View>
            {spellCatalogResults.slice(0, spellResultLimit).map((spell) => {
              const selected = selectedSpellIds.has(spell.id);
              const expanded = expandedSpellIds.has(spell.id);
              const icon = iconsEnabled ? getSpellSchoolIcon(iconStyle, spell.school) : undefined;
              return (
                <Pressable
                  key={spell.id}
                  style={[styles.choiceRow, styles.spellChoiceRow, selected && styles.choiceRowActive]}
                  onPress={() => toggleSpellSelection(spell)}
                >
                  {icon && (
                    <Image source={icon} style={styles.spellChoiceIcon} resizeMode="contain" />
                  )}
                  <View style={styles.spellChoiceText}>
                    <View style={styles.spellChoiceHeaderRow}>
                      <Text style={styles.choiceRowLabel}>{spell.name}</Text>
                      <Pressable
                        hitSlop={8}
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleSpellExpanded(spell.id);
                        }}
                      >
                        <Text style={styles.spellInfoToggle}>{expanded ? "▲" : "ⓘ"}</Text>
                      </Pressable>
                    </View>
                    <Text style={styles.choiceRowSub}>
                      {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`} · {spell.school}
                    </Text>
                    {expanded && (
                      <Text style={styles.spellDescription}>{spell.description}</Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
            {spellResultLimit < spellCatalogResults.length && (
              <Pressable
                style={styles.showMoreButton}
                onPress={() => setSpellResultLimit((n) => n + SPELL_RESULT_PAGE_SIZE)}
              >
                <Text style={styles.showMoreButtonText}>
                  Show more ({spellCatalogResults.length - spellResultLimit} remaining)
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {step === "review" && (
          <View>
            <Text style={styles.title}>Review</Text>
            <Text style={styles.reviewName}>{name}</Text>
            <Text style={styles.reviewSub}>
              {catalog.label} · {raceNameValue} · {classNameValue} · Level {levelNum}
              {background.trim() ? ` · ${background.trim()}` : ""}
              {alignment ? ` · ${alignment}` : ""}
              {selectedSpellIds.size > 0 ? ` · ${selectedSpellIds.size} spells` : ""}
            </Text>
            {selectedSkillIds.size > 0 && (
              <Text style={styles.reviewSub}>
                Proficient:{" "}
                {Array.from(selectedSkillIds)
                  .map((id) => catalog.skills.find((s) => s.id === id)?.name ?? id)
                  .join(", ")}
              </Text>
            )}
            {equipmentSummaryText() !== "" && (
              <Text style={styles.reviewSub}>{equipmentSummaryText()}</Text>
            )}
            {catalog.languages && languageGrant.granted.length + selectedExtraLanguageIds.size > 0 && (
              <Text style={styles.reviewSub}>
                Languages:{" "}
                {[...languageGrant.granted, ...Array.from(selectedExtraLanguageIds)]
                  .map((id) => catalog.languages?.find((l) => l.id === id)?.name ?? id)
                  .join(", ")}
              </Text>
            )}
            <Text style={styles.reviewSub}>
              {usesXp
                ? `Tracking XP (starting at ${xpThresholdForLevel(ruleset, levelNum)})`
                : "Milestone leveling (no XP tracked)"}
            </Text>

            <View style={styles.summaryRow}>
              <SummaryStat label="Max HP" value={String(derivedMaxHp)} />
              <SummaryStat label="Armor Class" value={String(derivedArmorClass)} />
              <SummaryStat label="Speed" value={`${derivedSpeed} ft`} />
              <SummaryStat label="Prof. Bonus" value={`+${derivedProficiencyBonus}`} />
            </View>

            <View style={styles.abilityGrid}>
              {ABILITY_KEYS.map((key) => (
                <View key={key} style={styles.abilityCard}>
                  <Text style={styles.abilityCardLabel}>{ABILITY_LABELS[key]}</Text>
                  <Text style={styles.abilityCardScore}>{finalAbilityScores[key]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.navRow}>
        <Pressable style={styles.navButtonSecondary} onPress={goBack}>
          <Text style={styles.navButtonSecondaryText}>
            {stepIndex === 0 ? "Cancel" : "Back"}
          </Text>
        </Pressable>
        {step === "review" ? (
          <Pressable style={styles.navButtonPrimary} onPress={handleCreate}>
            <Text style={styles.navButtonPrimaryText}>Create Character</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.navButtonPrimary, !canGoNext() && styles.navButtonDisabled]}
            disabled={!canGoNext()}
            onPress={goNext}
          >
            <Text style={styles.navButtonPrimaryText}>Next</Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function ChoiceRow({
  label,
  sublabel,
  selected,
  onPress,
}: {
  label: string;
  sublabel: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      style={[styles.choiceRow, selected && styles.choiceRowActive]}
      onPress={onPress}
    >
      <Text style={styles.choiceRowLabel}>{label}</Text>
      <Text style={styles.choiceRowSub}>{sublabel}</Text>
    </Pressable>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    stepCounter: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 12,
    },
    body: { flex: 1 },
    bodyContent: { padding: 16 },
    title: {
      color: theme.colors.text,
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 16,
      fontFamily: theme.displayFontFamily,
    },
    hint: { color: theme.colors.textMuted, fontSize: 13, marginBottom: 12 },
    input: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 8,
    },
    multilineInput: { minHeight: 70, textAlignVertical: "top", marginBottom: 12 },
    fieldLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    choiceRow: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius,
      padding: 14,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: "transparent",
    },
    choiceRowActive: { borderColor: theme.colors.primary },
    choiceRowLabel: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    choiceRowSub: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    spellChoiceRow: { flexDirection: "row", alignItems: "center" },
    spellChoiceIcon: { width: 28, height: 28, marginRight: 10 },
    spellChoiceText: { flex: 1 },
    spellChoiceHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    spellInfoToggle: { color: theme.colors.accent, fontSize: 14, paddingLeft: 8 },
    spellDescription: {
      color: theme.colors.text,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 6,
    },
    spellLimitRow: { flexDirection: "row", gap: 14, marginBottom: 10 },
    spellLimitText: {
      color: theme.colors.accent,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    inputRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
    spellClassFilterChip: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      justifyContent: "center",
    },
    spellClassFilterChipText: {
      color: theme.colors.accent,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    showMoreButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
      marginTop: 8,
    },
    showMoreButtonText: {
      color: theme.colors.accent,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    abilityRow: { marginBottom: 16 },
    abilityRowLabel: {
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 6,
      fontFamily: theme.displayFontFamily,
    },
    abilityValues: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    abilityValueButton: {
      width: 44,
      height: 44,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    abilityValueButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    abilityValueButtonDisabled: { opacity: 0.3 },
    abilityValueText: { color: theme.colors.text, fontWeight: "700" },
    abilityValueTextActive: { color: theme.colors.primaryText },
    advantageRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
    advantageButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 8,
      alignItems: "center",
    },
    advantageButtonActive: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
    advantageText: {
      color: theme.colors.textMuted,
      fontWeight: "600",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    advantageTextActive: { color: theme.colors.primaryText },
    rollAbilityRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      marginBottom: 8,
      gap: 8,
    },
    rollAbilityResult: { flex: 1 },
    rollAbilityDetail: { color: theme.colors.textMuted, fontSize: 11 },
    rollAbilityScore: {
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 18,
      minWidth: 28,
      textAlign: "center",
    },
    rollAbilityButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    rollAbilityButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    bonusSection: { marginTop: 8 },
    bonusRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    bonusChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    bonusChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    bonusChipText: {
      color: theme.colors.text,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    bonusChipTextActive: { color: theme.colors.primaryText },
    detailPanel: {
      marginTop: 4,
      marginBottom: 8,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      gap: 6,
    },
    detailRow: { color: theme.colors.text, fontSize: 13, lineHeight: 18 },
    detailLabel: { fontWeight: "700", color: theme.colors.textMuted },
    equipmentGroup: { marginBottom: 16 },
    equipmentGroupLabel: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    equipmentFixedRow: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius,
      padding: 14,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    equipmentOptionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius,
      padding: 14,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: "transparent",
    },
    equipmentOptionCardActive: { borderColor: theme.colors.primary },
    equipmentGrant: { marginBottom: 8 },
    equipmentGrantLabel: {
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    equipmentGrantStats: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    equipmentGrantFlavor: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontStyle: "italic",
      marginTop: 2,
      lineHeight: 16,
    },
    equipmentGrantHint: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontWeight: "700",
      marginTop: 8,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    equipmentWeaponPicker: { marginTop: 4 },
    equipmentWeaponRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 4,
      gap: 8,
    },
    equipmentWeaponRowActive: { borderColor: theme.colors.primary, borderWidth: 2 },
    equipmentWeaponName: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    equipmentWeaponNameActive: { color: theme.colors.primary },
    equipmentWeaponStats: { color: theme.colors.textMuted, fontSize: 11, flexShrink: 1, textAlign: "right" },
    skillGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
    skillCard: {
      width: "31%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
    },
    skillCardActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    skillCardText: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
      textAlign: "center",
    },
    skillCardSub: { color: theme.colors.textMuted, fontSize: 10, marginTop: 2 },
    skillCardTextActive: { color: theme.colors.primaryText },
    reviewName: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    reviewSub: { color: theme.colors.textMuted, marginTop: 4, marginBottom: 16 },
    summaryRow: { flexDirection: "row", gap: 8, marginBottom: 20, flexWrap: "wrap" },
    summaryCard: {
      flex: 1,
      minWidth: "22%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      alignItems: "center",
    },
    summaryValue: { color: theme.colors.text, fontSize: 16, fontWeight: "700" },
    summaryLabel: {
      color: theme.colors.textMuted,
      fontSize: 10,
      marginTop: 4,
      textAlign: "center",
    },
    abilityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    abilityCard: {
      width: "31%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    abilityCardLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    abilityCardScore: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginTop: 4,
    },
    navRow: {
      flexDirection: "row",
      gap: 10,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    navButtonPrimary: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    navButtonDisabled: { opacity: 0.4 },
    navButtonPrimaryText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    navButtonSecondary: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    navButtonSecondaryText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
  });
}
