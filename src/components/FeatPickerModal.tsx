import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";
import { listFeatCatalog } from "../features/characters/featRepo";
import { FEATS, type FeatEffectTemplate } from "../data/feats";
import { getRulesetCatalog } from "../data/rulesets";
import {
  ABILITY_LABELS,
  describeFeatEffect,
  type FeatEffect,
  type ResolvedFeatPick,
} from "../features/characters/characterCalculations";
import type { AbilityScoreKey, Character } from "../types/models";

type CatalogRow = Awaited<ReturnType<typeof listFeatCatalog>>[number];

type FeatPickerModalProps = {
  visible: boolean;
  character: Character;
  onClose: () => void;
  onPick: (feat: ResolvedFeatPick) => void;
};

export function FeatPickerModal({ visible, character, onClose, onPick }: FeatPickerModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>
          {visible && <FeatPickerModalForm character={character} onClose={onClose} onPick={onPick} />}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const EFFECT_KIND_LABELS: Record<FeatEffect["kind"], string> = {
  abilityScoreIncrease: "Ability Score Increase",
  skillProficiency: "Skill Proficiency",
  savingThrowProficiency: "Saving Throw Proficiency",
  armorClassBonus: "Armor Class Bonus",
  initiativeProficiencyBonus: "Initiative (+Proficiency Bonus)",
  rangedAttackBonus: "Ranged Attack Bonus",
  meleeAttackBonus: "Melee Attack Bonus",
};
const EFFECT_KINDS = Object.keys(EFFECT_KIND_LABELS) as FeatEffect["kind"][];

type ResolveStep = "ability-mode" | "ability-pick" | "skills";

function FeatPickerModalForm({
  character,
  onClose,
  onPick,
}: Omit<FeatPickerModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const skillCatalog = getRulesetCatalog(character.ruleset).skills;

  const [mode, setMode] = useState<"catalog" | "custom">("catalog");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<CatalogRow[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Mid-resolution of a catalog feat whose effect needs a player choice
  // (which ability, which skills) before it can be confirmed.
  const [resolving, setResolving] = useState<{ row: CatalogRow; template: FeatEffectTemplate } | null>(null);
  const [resolveStep, setResolveStep] = useState<ResolveStep>("ability-pick");
  const [abilityMode, setAbilityMode] = useState<"one" | "two">("one");
  const [selectedAbilities, setSelectedAbilities] = useState<AbilityScoreKey[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [customName, setCustomName] = useState("");
  const [customPrerequisite, setCustomPrerequisite] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customEffects, setCustomEffects] = useState<FeatEffect[]>([]);
  const [effectBuilderOpen, setEffectBuilderOpen] = useState(false);
  const [builderKind, setBuilderKind] = useState<FeatEffect["kind"]>("abilityScoreIncrease");
  const [builderAbility, setBuilderAbility] = useState<AbilityScoreKey>("strength");
  const [builderAmount, setBuilderAmount] = useState("1");
  const [builderMax, setBuilderMax] = useState("20");
  const [builderSkills, setBuilderSkills] = useState<string[]>([]);

  useEffect(() => {
    listFeatCatalog(search.trim() || undefined).then(setResults);
  }, [search]);

  function catalogRowToPick(row: CatalogRow, effects: FeatEffect[]): ResolvedFeatPick {
    return {
      catalogFeatId: row.id,
      name: row.name,
      prerequisite: row.prerequisite,
      description: row.description,
      sourceName: row.sourceName,
      effects,
    };
  }

  function handleCatalogRowPress(row: CatalogRow) {
    const template = FEATS.find((f) => f.id === row.slug)?.effectTemplate;
    if (!template) {
      onPick(catalogRowToPick(row, []));
      return;
    }
    switch (template.kind) {
      case "abilityScoreImprovement":
        setResolving({ row, template });
        setAbilityMode("one");
        setSelectedAbilities([]);
        setResolveStep("ability-mode");
        return;
      case "abilityScoreIncreaseChoice":
        setResolving({ row, template });
        setSelectedAbilities([]);
        setResolveStep("ability-pick");
        return;
      case "skillProficiency":
        setResolving({ row, template });
        setSelectedSkills([]);
        setResolveStep("skills");
        return;
      case "armorClassBonus":
        onPick(catalogRowToPick(row, [{ kind: "armorClassBonus", amount: template.amount }]));
        return;
      case "initiativeProficiencyBonus":
        onPick(catalogRowToPick(row, [{ kind: "initiativeProficiencyBonus" }]));
        return;
      case "rangedAttackBonus":
        onPick(catalogRowToPick(row, [{ kind: "rangedAttackBonus", amount: template.amount }]));
        return;
      case "meleeAttackBonus":
        onPick(catalogRowToPick(row, [{ kind: "meleeAttackBonus", amount: template.amount }]));
        return;
    }
  }

  function confirmAbilityImprovement() {
    if (!resolving || resolving.template.kind !== "abilityScoreImprovement") return;
    const amount = abilityMode === "one" ? 2 : 1;
    const effects: FeatEffect[] = selectedAbilities.map((ability) => ({
      kind: "abilityScoreIncrease",
      ability,
      amount,
      max: resolving.template.kind === "abilityScoreImprovement" ? resolving.template.max : 20,
    }));
    onPick(catalogRowToPick(resolving.row, effects));
    setResolving(null);
  }

  function confirmAbilityIncreaseChoice() {
    if (!resolving || resolving.template.kind !== "abilityScoreIncreaseChoice") return;
    const ability = selectedAbilities[0];
    if (!ability) return;
    onPick(
      catalogRowToPick(resolving.row, [
        { kind: "abilityScoreIncrease", ability, amount: resolving.template.amount, max: resolving.template.max },
      ])
    );
    setResolving(null);
  }

  function confirmSkillProficiency() {
    if (!resolving || resolving.template.kind !== "skillProficiency") return;
    if (selectedSkills.length === 0) return;
    onPick(catalogRowToPick(resolving.row, [{ kind: "skillProficiency", skillIds: selectedSkills }]));
    setResolving(null);
  }

  function handleAddCustom() {
    const trimmed = customName.trim();
    if (!trimmed) return;
    onPick({
      name: trimmed,
      prerequisite: customPrerequisite.trim(),
      description: customDescription.trim(),
      sourceName: "",
      effects: customEffects,
    });
  }

  function handleAddBuilderEffect() {
    const amount = Number(builderAmount) || 0;
    const max = Number(builderMax) || 20;
    let effect: FeatEffect | null = null;
    switch (builderKind) {
      case "abilityScoreIncrease":
        effect = { kind: "abilityScoreIncrease", ability: builderAbility, amount, max };
        break;
      case "skillProficiency":
        if (builderSkills.length === 0) return;
        effect = { kind: "skillProficiency", skillIds: builderSkills };
        break;
      case "savingThrowProficiency":
        effect = { kind: "savingThrowProficiency", ability: builderAbility };
        break;
      case "armorClassBonus":
        effect = { kind: "armorClassBonus", amount };
        break;
      case "initiativeProficiencyBonus":
        effect = { kind: "initiativeProficiencyBonus" };
        break;
      case "rangedAttackBonus":
        effect = { kind: "rangedAttackBonus", amount };
        break;
      case "meleeAttackBonus":
        effect = { kind: "meleeAttackBonus", amount };
        break;
    }
    if (!effect) return;
    setCustomEffects((prev) => [...prev, effect as FeatEffect]);
    setBuilderSkills([]);
    setBuilderAmount("1");
  }

  // Mid-resolution of a catalog feat's player choice (ability/skills).
  if (resolving) {
    if (resolveStep === "ability-mode") {
      return (
        <View style={styles.card}>
          <Text style={styles.title}>{resolving.row.name}</Text>
          <Text style={styles.hint}>Choose how to split the ability increase.</Text>
          <View style={styles.buttonColumn}>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setAbilityMode("one");
                setSelectedAbilities([]);
                setResolveStep("ability-pick");
              }}
            >
              <Text style={styles.modalButtonText}>+2 to One Ability</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setAbilityMode("two");
                setSelectedAbilities([]);
                setResolveStep("ability-pick");
              }}
            >
              <Text style={styles.modalButtonText}>+1 to Two Abilities</Text>
            </Pressable>
          </View>
          <Pressable style={styles.secondaryButton} onPress={() => setResolving(null)}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </Pressable>
        </View>
      );
    }

    if (resolveStep === "ability-pick") {
      const isImprovement = resolving.template.kind === "abilityScoreImprovement";
      const limit = isImprovement ? (abilityMode === "one" ? 1 : 2) : 1;
      const chooseFrom =
        resolving.template.kind === "abilityScoreIncreaseChoice" ? resolving.template.chooseFrom : undefined;
      const abilityKeys = (chooseFrom ?? (Object.keys(ABILITY_LABELS) as AbilityScoreKey[])) as AbilityScoreKey[];
      return (
        <View style={styles.card}>
          <Text style={styles.title}>{resolving.row.name}</Text>
          <Text style={styles.hint}>
            Current score shown in parentheses. Select {limit}.
          </Text>
          <View style={styles.chipRow}>
            {abilityKeys.map((key) => {
              const selected = selectedAbilities.includes(key);
              return (
                <Pressable
                  key={key}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => {
                    if (selected) {
                      setSelectedAbilities(selectedAbilities.filter((k) => k !== key));
                    } else if (selectedAbilities.length < limit) {
                      setSelectedAbilities([...selectedAbilities, key]);
                    }
                  }}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {ABILITY_LABELS[key]} ({character[key]})
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            style={[styles.primaryButton, selectedAbilities.length !== limit && styles.primaryButtonDisabled]}
            disabled={selectedAbilities.length !== limit}
            onPress={isImprovement ? confirmAbilityImprovement : confirmAbilityIncreaseChoice}
          >
            <Text style={styles.primaryButtonText}>Confirm</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => (isImprovement ? setResolveStep("ability-mode") : setResolving(null))}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </Pressable>
        </View>
      );
    }

    // resolveStep === "skills"
    const count = resolving.template.kind === "skillProficiency" ? resolving.template.count : 0;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{resolving.row.name}</Text>
        <Text style={styles.hint}>Choose {count} skills.</Text>
        <ScrollView style={styles.catalogList}>
          <View style={styles.chipRow}>
            {skillCatalog.map((skill) => {
              const selected = selectedSkills.includes(skill.id);
              return (
                <Pressable
                  key={skill.id}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => {
                    if (selected) {
                      setSelectedSkills(selectedSkills.filter((id) => id !== skill.id));
                    } else if (selectedSkills.length < count) {
                      setSelectedSkills([...selectedSkills, skill.id]);
                    }
                  }}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{skill.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <Pressable
          style={[styles.primaryButton, selectedSkills.length !== count && styles.primaryButtonDisabled]}
          disabled={selectedSkills.length !== count}
          onPress={confirmSkillProficiency}
        >
          <Text style={styles.primaryButtonText}>Confirm</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => setResolving(null)}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Choose a Feat</Text>

      <View style={styles.modeRow}>
        <Pressable
          style={[styles.modeTab, mode === "catalog" && styles.modeTabActive]}
          onPress={() => setMode("catalog")}
        >
          <Text style={[styles.modeTabText, mode === "catalog" && styles.modeTabTextActive]}>
            Catalog
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeTab, mode === "custom" && styles.modeTabActive]}
          onPress={() => setMode("custom")}
        >
          <Text style={[styles.modeTabText, mode === "custom" && styles.modeTabTextActive]}>
            Custom
          </Text>
        </Pressable>
      </View>

      {mode === "catalog" ? (
        <>
          <TextInput
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            placeholder="Search feats…"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="none"
          />
          <ScrollView style={styles.catalogList}>
            {results.map((feat) => {
              const expanded = expandedId === feat.id;
              return (
                <Pressable
                  key={feat.id}
                  style={styles.catalogRow}
                  onPress={() => handleCatalogRowPress(feat)}
                >
                  <View style={styles.catalogInfo}>
                    <View style={styles.catalogHeaderRow}>
                      <Text style={styles.catalogName}>{feat.name}</Text>
                      <Pressable
                        hitSlop={8}
                        onPress={(e) => {
                          e.stopPropagation();
                          setExpandedId(expanded ? null : feat.id);
                        }}
                      >
                        <Text style={styles.infoToggle}>{expanded ? "▲" : "ⓘ"}</Text>
                      </Pressable>
                    </View>
                    <Text style={styles.catalogMeta}>
                      {feat.prerequisite ? `Prerequisite: ${feat.prerequisite} · ` : ""}
                      {feat.sourceName}
                    </Text>
                    {expanded && <Text style={styles.catalogDescription}>{feat.description}</Text>}
                  </View>
                </Pressable>
              );
            })}
            {results.length === 0 && <Text style={styles.empty}>No feats match.</Text>}
          </ScrollView>
        </>
      ) : (
        <ScrollView style={styles.catalogList}>
          <Text style={styles.fieldLabel}>Feat Name</Text>
          <TextInput
            style={styles.input}
            value={customName}
            onChangeText={setCustomName}
            placeholder="e.g. Great Weapon Master"
            placeholderTextColor={theme.colors.textMuted}
            autoFocus
          />
          <Text style={styles.fieldLabel}>Prerequisite (optional)</Text>
          <TextInput
            style={styles.input}
            value={customPrerequisite}
            onChangeText={setCustomPrerequisite}
            placeholder="e.g. Level 4+, Strength 13+"
            placeholderTextColor={theme.colors.textMuted}
          />
          <Text style={styles.fieldLabel}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            value={customDescription}
            onChangeText={setCustomDescription}
            placeholder="What does it do?"
            placeholderTextColor={theme.colors.textMuted}
            multiline
          />

          {customEffects.length > 0 && (
            <View style={{ gap: 8, marginBottom: 10 }}>
              {customEffects.map((effect, idx) => (
                <View key={idx} style={styles.traitRow}>
                  <Text style={styles.traitInfo}>{describeFeatEffect(effect, character.ruleset)}</Text>
                  <Pressable onPress={() => setCustomEffects((prev) => prev.filter((_, i) => i !== idx))}>
                    <Text style={styles.traitRemove}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <Pressable style={styles.secondaryButton} onPress={() => setEffectBuilderOpen((prev) => !prev)}>
            <Text style={styles.secondaryButtonText}>
              {effectBuilderOpen ? "Hide Effect Builder" : "+ Add a Mechanical Effect (optional)"}
            </Text>
          </Pressable>

          {effectBuilderOpen && (
            <View style={styles.effectBuilder}>
              <Text style={styles.fieldLabel}>Effect Type</Text>
              <View style={styles.chipRow}>
                {EFFECT_KINDS.map((kind) => (
                  <Pressable
                    key={kind}
                    style={[styles.chip, builderKind === kind && styles.chipSelected]}
                    onPress={() => setBuilderKind(kind)}
                  >
                    <Text style={[styles.chipText, builderKind === kind && styles.chipTextSelected]}>
                      {EFFECT_KIND_LABELS[kind]}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {(builderKind === "abilityScoreIncrease" || builderKind === "savingThrowProficiency") && (
                <>
                  <Text style={styles.fieldLabel}>Ability</Text>
                  <View style={styles.chipRow}>
                    {(Object.keys(ABILITY_LABELS) as AbilityScoreKey[]).map((key) => (
                      <Pressable
                        key={key}
                        style={[styles.chip, builderAbility === key && styles.chipSelected]}
                        onPress={() => setBuilderAbility(key)}
                      >
                        <Text style={[styles.chipText, builderAbility === key && styles.chipTextSelected]}>
                          {ABILITY_LABELS[key]}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}

              {builderKind === "abilityScoreIncrease" && (
                <View style={styles.builderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Amount</Text>
                    <TextInput
                      style={styles.input}
                      value={builderAmount}
                      onChangeText={setBuilderAmount}
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Max</Text>
                    <TextInput
                      style={styles.input}
                      value={builderMax}
                      onChangeText={setBuilderMax}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              )}

              {(builderKind === "armorClassBonus" ||
                builderKind === "rangedAttackBonus" ||
                builderKind === "meleeAttackBonus") && (
                <>
                  <Text style={styles.fieldLabel}>Amount</Text>
                  <TextInput
                    style={styles.input}
                    value={builderAmount}
                    onChangeText={setBuilderAmount}
                    keyboardType="number-pad"
                  />
                </>
              )}

              {builderKind === "skillProficiency" && (
                <>
                  <Text style={styles.fieldLabel}>Skills</Text>
                  <View style={styles.chipRow}>
                    {skillCatalog.map((skill) => {
                      const selected = builderSkills.includes(skill.id);
                      return (
                        <Pressable
                          key={skill.id}
                          style={[styles.chip, selected && styles.chipSelected]}
                          onPress={() =>
                            setBuilderSkills((prev) =>
                              selected ? prev.filter((id) => id !== skill.id) : [...prev, skill.id]
                            )
                          }
                        >
                          <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{skill.name}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              )}

              <Pressable style={styles.addButton} onPress={handleAddBuilderEffect}>
                <Text style={styles.addButtonText}>+ Add Effect</Text>
              </Pressable>
            </View>
          )}

          <Pressable
            style={[styles.addButton, !customName.trim() && styles.addButtonDisabled]}
            disabled={!customName.trim()}
            onPress={handleAddCustom}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </ScrollView>
      )}

      <Pressable style={styles.secondaryButton} onPress={onClose}>
        <Text style={styles.secondaryButtonText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    card: {
      width: "100%",
      maxWidth: 420,
      maxHeight: "85%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 20,
    },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 12,
      fontFamily: theme.displayFontFamily,
    },
    hint: { color: theme.colors.textMuted, fontSize: 13, marginBottom: 12 },
    modeRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
    modeTab: {
      flex: 1,
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 8,
      alignItems: "center",
    },
    modeTabActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    modeTabText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    modeTabTextActive: { color: theme.colors.primaryText },
    input: {
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 10,
      fontFamily: theme.displayFontFamily,
    },
    descriptionInput: { minHeight: 70, textAlignVertical: "top" },
    fieldLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 6,
      fontFamily: theme.displayFontFamily,
    },
    catalogList: { maxHeight: 360 },
    catalogRow: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    catalogInfo: { flex: 1 },
    catalogHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    catalogName: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    infoToggle: { color: theme.colors.accent, fontSize: 14, paddingLeft: 8 },
    catalogMeta: {
      color: theme.colors.textMuted,
      fontSize: 11,
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    catalogDescription: {
      color: theme.colors.text,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 6,
    },
    empty: {
      color: theme.colors.textMuted,
      textAlign: "center",
      paddingVertical: 20,
      fontFamily: theme.displayFontFamily,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
      marginBottom: 10,
    },
    addButtonDisabled: { opacity: 0.5 },
    addButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    secondaryButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
      marginBottom: 10,
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    buttonColumn: { gap: 10, marginBottom: 10 },
    modalButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    modalButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontSize: 15,
      fontFamily: theme.displayFontFamily,
    },
    primaryButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
      marginBottom: 10,
    },
    primaryButtonDisabled: { opacity: 0.4 },
    primaryButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontSize: 15,
      fontFamily: theme.displayFontFamily,
    },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
    chip: {
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    chipSelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipText: { color: theme.colors.text, fontWeight: "600", fontSize: 13 },
    chipTextSelected: { color: theme.colors.primaryText },
    effectBuilder: {
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      marginBottom: 10,
    },
    builderRow: { flexDirection: "row", gap: 10 },
    traitRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
    },
    traitInfo: { flex: 1, color: theme.colors.text, fontSize: 13, paddingRight: 8 },
    traitRemove: { color: theme.colors.accent, fontSize: 16, paddingHorizontal: 4 },
  });
}
