import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Switch, View, type TextInputProps } from "react-native";
import { Text, TextInput } from "./AppText";
import type {
  ArmorDefinition,
  ClassDefinition,
  EquipmentGrant,
  RulesetCatalog,
  WeaponDefinition,
} from "../data/rulesets";
import { describeArmorAc } from "../features/characters/gearRepo";
import {
  CUSTOM_PICK,
  NO_PICK,
  armorCandidates,
  chosenOptionIndex,
  computeArmorClass,
  describeOption,
  goldInsteadChoice,
  grantKey,
  itemChoiceOptions,
  resolveStartingGear,
  resolvedArmorId,
  resolvedItemChoiceName,
  resolvedWeaponId,
  rollGoldOption,
  swapKind,
  weaponCandidates,
  type StartingEquipmentSelection,
} from "../features/characters/startingEquipment";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";

type Props = {
  classDef: ClassDefinition;
  catalog: RulesetCatalog;
  /** Final Dexterity score, to preview the Armor Class this kit gives. */
  dexterity: number;
  selection: StartingEquipmentSelection;
  onChange: (next: StartingEquipmentSelection) => void;
  /** Lets the host screen wire its live-preview/scroll-into-view helpers into the typed-weapon input. */
  customInputProps?: (key: string, value: string, setValue: (text: string) => void) => TextInputProps;
};

function weaponStats(def: WeaponDefinition): string {
  const parts = [def.damageDice ? `${def.damageDice} ${def.damageType}` : "No damage", def.category];
  if (def.properties.length > 0) parts.push(def.properties.join(", "));
  parts.push(`${def.weight} lb`, def.cost);
  return parts.join(" · ");
}

function armorStats(def: ArmorDefinition): string {
  const parts = [`AC ${describeArmorAc(def)}`, def.category];
  if (def.strengthRequirement) parts.push(`Str ${def.strengthRequirement}`);
  if (def.stealthDisadvantage) parts.push("Stealth disadvantage");
  parts.push(`${def.weight} lb`, def.cost);
  return parts.join(" · ");
}

/**
 * Onboarding's Starting Equipment step. Each line is either granted outright
 * ("Included") or a choice between the class's packages (kit A / kit B /
 * gold). Inside the chosen package, every weapon and armor can be swapped for
 * any other the class is proficient with (with a toggle to see the rest), so
 * the player is never stuck with the default kit.
 */
export function StartingEquipmentStep({ classDef, catalog, dexterity, selection, onChange, customInputProps }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [showAll, setShowAll] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const lines = useMemo(() => classDef.startingEquipment ?? [], [classDef]);

  const gear = useMemo(
    () => resolveStartingGear(lines, selection, catalog, classDef),
    [lines, selection, catalog, classDef]
  );
  const armorClass = computeArmorClass(dexterity, gear.armor);
  // "Take gold instead" (2014 5e) replaces the whole kit -- see
  // `goldInsteadChoice` -- so the other lines' own choices are moot while
  // it's active; they're hidden rather than shown-but-ignored.
  const goldInstead = goldInsteadChoice(lines, selection);

  function chooseOption(lineIndex: number, optionIndex: number) {
    // Swaps belong to the option they were made in, so switching packages starts that package fresh.
    let next: StartingEquipmentSelection = {
      ...selection,
      optionIndex: { ...selection.optionIndex, [lineIndex]: optionIndex },
    };
    // Roll any "take gold instead" option's dice the moment it's picked, so
    // the amount is fixed rather than re-rolling on every re-render.
    (lines[lineIndex]?.[optionIndex] ?? []).forEach((grant, grantIndex) => {
      if (grant.kind === "goldRoll") {
        next = rollGoldOption(grant, grantKey(lineIndex, optionIndex, grantIndex), next);
      }
    });
    onChange(next);
    setOpenKey(null);
  }

  function pick(key: string, value: string | undefined) {
    const picks = { ...selection.picks };
    if (value === undefined) delete picks[key];
    else picks[key] = value;
    onChange({ ...selection, picks });
  }

  function optionTitle(line: EquipmentGrant[][], optionIndex: number): string {
    const option = line[optionIndex];
    if (option.length === 1 && option[0].kind === "gold") return `Take ${option[0].amount} gp instead`;
    if (option.length === 1 && option[0].kind === "goldRoll") return "Take gold instead";
    if (
      line.length === 2 &&
      line.some((o) => o.length === 1 && (o[0].kind === "gold" || o[0].kind === "goldRoll"))
    ) {
      return "Starting gear";
    }
    return `Option ${String.fromCharCode(65 + optionIndex)}`;
  }

  function renderGrant(grant: EquipmentGrant, lineIndex: number, optionIndex: number, grantIndex: number) {
    const key = grantKey(lineIndex, optionIndex, grantIndex);
    const kind = swapKind(grant, catalog);
    const qty = "quantity" in grant && grant.quantity && grant.quantity > 1 ? `${grant.quantity} × ` : "";

    if (grant.kind === "gold") {
      return (
        <View key={grantIndex} style={styles.grant}>
          <Text style={styles.grantLabel}>{grant.amount} gp</Text>
        </View>
      );
    }
    if (grant.kind === "goldRoll") {
      const amount = selection.rolledAmounts[key];
      return (
        <View key={grantIndex} style={styles.grant}>
          <Text style={styles.grantLabel}>{amount !== undefined ? `${amount} gp` : "Rolling…"}</Text>
        </View>
      );
    }
    if (grant.kind === "itemChoice") {
      const customPicked = selection.picks[key] === CUSTOM_PICK;
      const label = customPicked
        ? `${qty}${(selection.customNames[key] ?? "").trim() || "Custom item"}`
        : `${qty}${resolvedItemChoiceName(grant, key, selection) ?? "Item"}`;
      const open = openKey === key;
      return (
        <View key={grantIndex} style={styles.grant}>
          <View style={styles.grantHeader}>
            <Text style={[styles.grantLabel, styles.grantLabelFlex]}>{label}</Text>
            <Pressable onPress={() => setOpenKey(open ? null : key)} hitSlop={8}>
              <Text style={styles.changeLink}>{open ? "Done" : "Change"}</Text>
            </Pressable>
          </View>
          {open && renderItemChoicePicker(grant, key)}
        </View>
      );
    }
    if (grant.kind === "item") {
      return (
        <View key={grantIndex} style={styles.grant}>
          <Text style={styles.grantLabel}>
            {qty}
            {grant.name}
          </Text>
          {!!grant.description && <Text style={styles.grantFlavor}>{grant.description}</Text>}
        </View>
      );
    }

    // Weapons and armor: show what's currently selected, with a Change control.
    let label: string;
    let stats: string | undefined;
    let flavor: string | undefined;
    if (kind === "weapon") {
      const picked = selection.picks[key];
      if (picked === CUSTOM_PICK) {
        label = `${qty}${(selection.customNames[key] ?? "").trim() || "Custom weapon"}`;
      } else {
        const def = catalog.weapons?.find((w) => w.id === resolvedWeaponId(grant, key, selection, catalog, classDef));
        label = `${qty}${def?.name ?? "Weapon"}`;
        stats = def ? weaponStats(def) : undefined;
        flavor = def?.description;
      }
    } else {
      const id = resolvedArmorId(grant, key, selection);
      const def = catalog.armor?.find((a) => a.id === id);
      label = def?.name ?? (kind === "shield" ? "No shield" : "No armor");
      stats = def ? armorStats(def) : undefined;
      flavor = def?.description;
    }
    const open = openKey === key;

    return (
      <View key={grantIndex} style={styles.grant}>
        <View style={styles.grantHeader}>
          <Text style={[styles.grantLabel, styles.grantLabelFlex]}>{label}</Text>
          <Pressable onPress={() => setOpenKey(open ? null : key)} hitSlop={8}>
            <Text style={styles.changeLink}>{open ? "Done" : "Change"}</Text>
          </Pressable>
        </View>
        {!!stats && <Text style={styles.grantStats}>{stats}</Text>}
        {!!flavor && !open && <Text style={styles.grantFlavor}>{flavor}</Text>}
        {open && renderPicker(grant, key, kind)}
      </View>
    );
  }

  function renderPicker(grant: EquipmentGrant, key: string, kind: "weapon" | "armor" | "shield" | null) {
    if (kind === "weapon") {
      const candidates = weaponCandidates(grant, catalog, classDef, showAll);
      const current = selection.picks[key] === CUSTOM_PICK ? CUSTOM_PICK : resolvedWeaponId(grant, key, selection, catalog, classDef);
      return (
        <View style={styles.picker}>
          <Text style={styles.pickerHint}>
            {showAll ? "Every weapon" : `Weapons ${classDef.name} is proficient with`}
          </Text>
          {candidates.map(({ def, proficient }) => (
            <Pressable
              key={def.id}
              style={[styles.pickRow, current === def.id && styles.pickRowActive]}
              onPress={() => pick(key, def.id)}
            >
              <View style={styles.pickText}>
                <Text style={[styles.pickName, current === def.id && styles.pickNameActive]}>
                  {def.name}
                  {!proficient ? "  · not proficient" : ""}
                </Text>
                <Text style={styles.pickStats}>{weaponStats(def)}</Text>
              </View>
            </Pressable>
          ))}
          <Pressable
            style={[styles.pickRow, current === CUSTOM_PICK && styles.pickRowActive]}
            onPress={() => pick(key, CUSTOM_PICK)}
          >
            <View style={styles.pickText}>
              <Text style={[styles.pickName, current === CUSTOM_PICK && styles.pickNameActive]}>Custom…</Text>
              <Text style={styles.pickStats}>Type your own weapon</Text>
            </View>
          </Pressable>
          {current === CUSTOM_PICK && (
            renderCustomInput(key)
          )}
          {renderShowAll()}
        </View>
      );
    }

    // Armor or shield.
    const candidates = armorCandidates(grant, catalog, classDef, showAll);
    const current = resolvedArmorId(grant, key, selection) ?? NO_PICK;
    return (
      <View style={styles.picker}>
        <Text style={styles.pickerHint}>
          {showAll
            ? kind === "shield"
              ? "Every shield"
              : "Every armor"
            : `${kind === "shield" ? "Shields" : "Armor"} ${classDef.name} is proficient with`}
        </Text>
        {candidates.map(({ def, proficient }) => (
          <Pressable
            key={def.id}
            style={[styles.pickRow, current === def.id && styles.pickRowActive]}
            onPress={() => pick(key, def.id)}
          >
            <View style={styles.pickText}>
              <Text style={[styles.pickName, current === def.id && styles.pickNameActive]}>
                {def.name}
                {!proficient ? "  · not proficient" : ""}
              </Text>
              <Text style={styles.pickStats}>{armorStats(def)}</Text>
            </View>
          </Pressable>
        ))}
        <Pressable
          style={[styles.pickRow, current === NO_PICK && styles.pickRowActive]}
          onPress={() => pick(key, NO_PICK)}
        >
          <View style={styles.pickText}>
            <Text style={[styles.pickName, current === NO_PICK && styles.pickNameActive]}>
              {kind === "shield" ? "No shield" : "No armor"}
            </Text>
          </View>
        </Pressable>
        {renderShowAll()}
      </View>
    );
  }

  function renderItemChoicePicker(grant: Extract<EquipmentGrant, { kind: "itemChoice" }>, key: string) {
    const options = itemChoiceOptions(grant);
    const current = selection.picks[key] === CUSTOM_PICK ? CUSTOM_PICK : resolvedItemChoiceName(grant, key, selection);
    return (
      <View style={styles.picker}>
        {options.map((name) => (
          <Pressable
            key={name}
            style={[styles.pickRow, current === name && styles.pickRowActive]}
            onPress={() => pick(key, name)}
          >
            <View style={styles.pickText}>
              <Text style={[styles.pickName, current === name && styles.pickNameActive]}>{name}</Text>
            </View>
          </Pressable>
        ))}
        <Pressable
          style={[styles.pickRow, current === CUSTOM_PICK && styles.pickRowActive]}
          onPress={() => pick(key, CUSTOM_PICK)}
        >
          <View style={styles.pickText}>
            <Text style={[styles.pickName, current === CUSTOM_PICK && styles.pickNameActive]}>Custom…</Text>
          </View>
        </Pressable>
        {current === CUSTOM_PICK && renderCustomInput(key, "Item name")}
      </View>
    );
  }

  function renderShowAll() {
    return (
      <View style={styles.toggleRow}>
        <Text style={styles.toggleText}>Also show items I&apos;m not proficient with</Text>
        <Switch value={showAll} onValueChange={setShowAll} />
      </View>
    );
  }

  // A render function, not a component: a nested component would remount (and drop focus) on every keystroke.
  function renderCustomInput(key: string, placeholder = "Weapon name") {
    const value = selection.customNames[key] ?? "";
    const setName = (text: string) =>
      onChange({ ...selection, customNames: { ...selection.customNames, [key]: text } });
    return (
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setName}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        {...customInputProps?.(key, value, setName)}
      />
    );
  }

  return (
    <View>
      <Text style={styles.title}>Starting Equipment</Text>
      <Text style={styles.hint}>
        Pick your {classDef.name}&apos;s starting gear. Wherever you see Change, you can swap that weapon or armor
        for any other your class is proficient with — or take the gold instead where the rules offer it.
      </Text>

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Your kit</Text>
        <Text style={styles.summaryText}>
          {goldInstead
            ? `${gear.gold} gp instead of your starting gear`
            : lines
                .map((line, i) => {
                  const optionIndex = chosenOptionIndex(selection, i);
                  return describeOption(line[optionIndex] ?? line[0], i, optionIndex, selection, catalog, classDef);
                })
                .filter(Boolean)
                .join("; ") || "Nothing"}
        </Text>
        {!goldInstead && <Text style={styles.summaryText}>Armor Class: {armorClass}</Text>}
      </View>

      {lines.map((line, lineIndex) => {
        // Every other line is moot once "take gold instead" is chosen on
        // one of them -- only that line stays visible, so the player can
        // still switch back.
        if (goldInstead && lineIndex !== goldInstead.lineIndex) return null;
        if (line.length === 1) {
          return (
            <View key={lineIndex} style={styles.group}>
              <Text style={styles.groupLabel}>Included</Text>
              <View style={styles.fixedCard}>{line[0].map((g, i) => renderGrant(g, lineIndex, 0, i))}</View>
            </View>
          );
        }
        const chosen = chosenOptionIndex(selection, lineIndex);
        return (
          <View key={lineIndex} style={styles.group}>
            <Text style={styles.groupLabel}>Choose one</Text>
            {line.map((option, optionIndex) => {
              const active = chosen === optionIndex;
              return (
                <Pressable
                  key={optionIndex}
                  style={[styles.optionCard, active && styles.optionCardActive]}
                  onPress={() => !active && chooseOption(lineIndex, optionIndex)}
                >
                  <Text style={styles.optionTitle}>{optionTitle(line, optionIndex)}</Text>
                  {active ? (
                    option.map((g, i) => renderGrant(g, lineIndex, optionIndex, i))
                  ) : (
                    <Text style={styles.grantStats}>
                      {describeOption(option, lineIndex, optionIndex, selection, catalog, classDef)}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    title: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 8,
    },
    hint: { color: theme.colors.textMuted, fontSize: 13, lineHeight: 18, marginBottom: 12 },
    summary: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 12,
      marginBottom: 16,
      gap: 4,
    },
    summaryLabel: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    summaryText: { color: theme.colors.text, fontSize: 13, lineHeight: 18 },
    group: { marginBottom: 16 },
    groupLabel: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    fixedCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius,
      padding: 14,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    optionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius,
      padding: 14,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: "transparent",
    },
    optionCardActive: { borderColor: theme.colors.primary },
    optionTitle: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    grant: { marginBottom: 10 },
    grantHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
    grantLabel: { color: theme.colors.text, fontSize: 15, fontWeight: "600", fontFamily: theme.displayFontFamily },
    grantLabelFlex: { flexShrink: 1 },
    grantStats: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    grantFlavor: { color: theme.colors.textMuted, fontSize: 12, fontStyle: "italic", marginTop: 2, lineHeight: 16 },
    changeLink: { color: theme.colors.primary, fontSize: 13, fontWeight: "700", fontFamily: theme.displayFontFamily },
    picker: { marginTop: 8 },
    pickerHint: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontWeight: "700",
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    pickRow: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 4,
    },
    pickRowActive: { borderColor: theme.colors.primary, borderWidth: 2 },
    pickText: { flexShrink: 1 },
    pickName: { color: theme.colors.text, fontSize: 13, fontWeight: "600", fontFamily: theme.displayFontFamily },
    pickNameActive: { color: theme.colors.primary },
    pickStats: { color: theme.colors.textMuted, fontSize: 11, marginTop: 2 },
    input: {
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 4,
      fontFamily: theme.displayFontFamily,
    },
    toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, gap: 8 },
    toggleText: { color: theme.colors.textMuted, fontSize: 12, flexShrink: 1 },
  });
}
