import { useCallback, useEffect, useMemo, useState } from "react";
import { PixelFrameOverlay } from "../components/PixelFrame";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "../components/AppText";
import { Stack } from "expo-router";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";
import { Button } from "../components/Button";
import { RULESETS, DEFAULT_RULESET } from "../data/rulesets";
import {
  listHomebrewWeapons,
  deleteHomebrewWeapon,
  addWeaponFromHomebrew,
  listHomebrewArmor,
  deleteHomebrewArmor,
  addArmorFromHomebrew,
} from "../features/characters/gearRepo";
import {
  listMagicItemCatalog,
  deleteHomebrewMagicItem,
  addMagicItemFromCatalog,
} from "../features/characters/magicItemRepo";
import { listFeatCatalog, deleteHomebrewFeat, addCatalogFeat } from "../features/characters/featRepo";
import { listMonsterCatalog, deleteHomebrewMonster } from "../features/dm/dmCreatureRepo";
import {
  listHomebrewResources,
  deleteHomebrewResource,
  createHomebrewResource,
  updateHomebrewResource,
  addResourceFromHomebrew,
  type CustomResourceInput,
} from "../features/characters/resourceRepo";
import {
  listSpellCatalog,
  deleteHomebrewSpell,
  addCatalogSpellToCharacter,
} from "../features/spells/spellRepo";
import {
  listHomebrewRaces,
  deleteHomebrewRace,
  setCharacterHomebrewRace,
  listHomebrewClasses,
  deleteHomebrewClass,
  setCharacterHomebrewClass,
  listHomebrewSubclasses,
  deleteHomebrewSubclass,
  setCharacterHomebrewSubclass,
} from "../features/characters/homebrewRepo";
import { listCharacters, getCharacter } from "../features/characters/characterRepo";
import { HomebrewWeaponModal, type HomebrewWeaponRow } from "../components/homebrew/HomebrewWeaponModal";
import { HomebrewArmorModal, type HomebrewArmorRow } from "../components/homebrew/HomebrewArmorModal";
import { HomebrewMagicItemModal, type HomebrewMagicItemRow } from "../components/homebrew/HomebrewMagicItemModal";
import { HomebrewFeatModal, type HomebrewFeatRow } from "../components/homebrew/HomebrewFeatModal";
import { HomebrewMonsterModal, type HomebrewMonsterRow } from "../components/homebrew/HomebrewMonsterModal";
import { HomebrewSpellModal, type HomebrewSpellRow } from "../components/homebrew/HomebrewSpellModal";
import { HomebrewRaceModal, type HomebrewRaceRow } from "../components/homebrew/HomebrewRaceModal";
import { HomebrewClassModal, type HomebrewClassRow } from "../components/homebrew/HomebrewClassModal";
import { HomebrewSubclassModal, type HomebrewSubclassRow } from "../components/homebrew/HomebrewSubclassModal";
import { CustomResourceModal } from "../components/CustomResourceModal";
import { AddToCharacterModal } from "../components/homebrew/AddToCharacterModal";
import type { Character } from "../types/models";
import { withAlpha } from "../theme/alpha";

type CategoryKey =
  | "races"
  | "classes"
  | "subclasses"
  | "weapons"
  | "armor"
  | "items"
  | "feats"
  | "monsters"
  | "resources"
  | "spells";

const CATEGORIES: { key: CategoryKey; label: string; singular: string; usesRuleset: boolean }[] = [
  { key: "races", label: "Races", singular: "Race", usesRuleset: true },
  { key: "classes", label: "Classes", singular: "Class", usesRuleset: true },
  { key: "subclasses", label: "Subclasses", singular: "Subclass", usesRuleset: true },
  { key: "weapons", label: "Weapons", singular: "Weapon", usesRuleset: true },
  { key: "armor", label: "Armor", singular: "Armor", usesRuleset: true },
  { key: "items", label: "Magic Items", singular: "Magic Item", usesRuleset: false },
  { key: "feats", label: "Feats", singular: "Feat", usesRuleset: true },
  { key: "monsters", label: "Monsters", singular: "Monster", usesRuleset: false },
  { key: "resources", label: "Abilities", singular: "Ability", usesRuleset: false },
  { key: "spells", label: "Spells", singular: "Spell", usesRuleset: true },
];

/** Generic display shape for the list, regardless of category -- `raw` carries the full row for editing. */
type DisplayRow = { id: number; name: string; summary: string; raw: unknown };

async function loadRows(category: CategoryKey, ruleset: string): Promise<DisplayRow[]> {
  switch (category) {
    case "weapons": {
      const rows = await listHomebrewWeapons(ruleset);
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        summary: [r.category, r.damageDice, r.damageType].filter(Boolean).join(" · ") || "No details yet",
        raw: r,
      }));
    }
    case "armor": {
      const rows = await listHomebrewArmor(ruleset);
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        summary: `${r.category || "Armor"} · AC ${r.baseArmorClass}`,
        raw: r,
      }));
    }
    case "items": {
      const rows = (await listMagicItemCatalog()).filter((r) => r.sourceKey === "homebrew");
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        summary: [r.category, r.rarity].filter(Boolean).join(" · ") || "No details yet",
        raw: r,
      }));
    }
    case "feats": {
      const rows = (await listFeatCatalog()).filter((r) => r.sourceKey === "homebrew" && r.ruleset === ruleset);
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        summary: r.prerequisite || "No prerequisite",
        raw: r,
      }));
    }
    case "monsters": {
      const rows = (await listMonsterCatalog()).filter((r) => r.sourceKey === "homebrew");
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        summary: `${[r.size, r.type].filter(Boolean).join(" ")} · CR ${r.challengeRating}`,
        raw: r,
      }));
    }
    case "resources": {
      const rows = await listHomebrewResources();
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        summary: `${r.maxMode} uses · recharges on ${r.rechargeOn} rest`,
        raw: r,
      }));
    }
    case "spells": {
      const rows = (await listSpellCatalog()).filter((r) => r.sourceKey === "homebrew" && r.ruleset === ruleset);
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        summary: `${r.level === 0 ? "Cantrip" : `Level ${r.level}`}${r.school ? ` · ${r.school}` : ""}`,
        raw: r,
      }));
    }
    case "races": {
      const rows = await listHomebrewRaces(ruleset);
      return rows.map((r) => ({ id: r.id, name: r.name, summary: `Speed ${r.speed} · ${r.size}`, raw: r }));
    }
    case "classes": {
      const rows = await listHomebrewClasses(ruleset);
      return rows.map((r) => ({ id: r.id, name: r.name, summary: `d${r.hitDie} hit die`, raw: r }));
    }
    case "subclasses": {
      const rows = await listHomebrewSubclasses({ ruleset });
      return rows.map((r) => ({ id: r.id, name: r.name, summary: `Subclass of ${r.parentClassId}`, raw: r }));
    }
  }
}

async function deleteRow(category: CategoryKey, id: number): Promise<void> {
  switch (category) {
    case "weapons":
      return deleteHomebrewWeapon(id);
    case "armor":
      return deleteHomebrewArmor(id);
    case "items":
      return deleteHomebrewMagicItem(id);
    case "feats":
      return deleteHomebrewFeat(id);
    case "monsters":
      return deleteHomebrewMonster(id);
    case "resources":
      return deleteHomebrewResource(id);
    case "spells":
      return deleteHomebrewSpell(id);
    case "races":
      return deleteHomebrewRace(id);
    case "classes":
      return deleteHomebrewClass(id);
    case "subclasses":
      return deleteHomebrewSubclass(id);
  }
}

export default function HomebrewLibraryScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const rulesetOptions = useMemo(() => Object.values(RULESETS).map((r) => ({ id: r.id, label: r.label })), []);
  const [ruleset, setRuleset] = useState(DEFAULT_RULESET);
  const [category, setCategory] = useState<CategoryKey>("weapons");
  const [rows, setRows] = useState<DisplayRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<DisplayRow | null>(null);

  const reload = useCallback(() => {
    loadRows(category, ruleset).then(setRows);
  }, [category, ruleset]);

  useEffect(() => {
    reload();
  }, [reload]);

  function openCreate() {
    setEditingRow(null);
    setModalOpen(true);
  }

  function openEdit(row: DisplayRow) {
    setEditingRow(row);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingRow(null);
  }

  function handleSaved() {
    closeModal();
    reload();
  }

  function confirmDelete(row: DisplayRow) {
    Alert.alert("Delete from library?", `"${row.name}" will be removed from your homebrew library. Characters who already took it keep their own copy.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteRow(category, row.id);
          reload();
        },
      },
    ]);
  }

  const [characters, setCharacters] = useState<Character[]>([]);
  const [addTargetRow, setAddTargetRow] = useState<DisplayRow | null>(null);

  useEffect(() => {
    listCharacters().then(setCharacters);
  }, []);

  function openAddToCharacter(row: DisplayRow) {
    setAddTargetRow(row);
  }

  async function applyRowToCharacter(row: DisplayRow, characterId: number): Promise<void> {
    switch (category) {
      case "weapons":
        return addWeaponFromHomebrew(characterId, row.id);
      case "armor":
        return addArmorFromHomebrew(characterId, row.id);
      case "items":
        return addMagicItemFromCatalog(characterId, row.id);
      case "resources":
        await addResourceFromHomebrew(characterId, row.id);
        return;
      case "spells":
        await addCatalogSpellToCharacter(characterId, row.id);
        return;
      case "feats": {
        const feat = row.raw as { id: number; name: string; prerequisite: string; description: string; sourceName: string };
        const character = await getCharacter(characterId);
        if (!character) return;
        return addCatalogFeat(
          character,
          { id: feat.id, name: feat.name, prerequisite: feat.prerequisite, description: feat.description, sourceName: feat.sourceName },
          []
        );
      }
      case "races":
        return setCharacterHomebrewRace(characterId, row.id);
      case "classes":
        return setCharacterHomebrewClass(characterId, row.id);
      case "subclasses":
        return setCharacterHomebrewSubclass(characterId, row.id);
      case "monsters":
        return;
    }
  }

  function handlePickCharacter(characterId: number) {
    const row = addTargetRow;
    if (!row) return;
    setAddTargetRow(null);
    const character = characters.find((c) => c.id === characterId);
    if (!character) return;

    const finish = async () => {
      await applyRowToCharacter(row, characterId);
      Alert.alert("Added", `"${row.name}" was added to ${character.name}.`);
    };

    if (category === "races" || category === "classes" || category === "subclasses") {
      const current = category === "races" ? character.race : category === "classes" ? character.className : character.subclass;
      Alert.alert(
        `Replace ${character.name}'s ${activeCategory.singular.toLowerCase()}?`,
        `This replaces "${current || "none"}" with "${row.name}". This can't be undone.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Continue", style: "destructive", onPress: finish },
        ]
      );
    } else {
      finish();
    }
  }

  const activeCategory = CATEGORIES.find((c) => c.key === category)!;

  const addToCharacterTargets = activeCategory.usesRuleset
    ? characters.filter((c) => c.ruleset === ruleset)
    : characters;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Homebrew Library" }} />

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.title}>Homebrew Library</Text>
        <Text style={styles.hint}>
          Create your own races, classes, weapons, armor, magic items, feats, monsters,
          abilities, and spells here -- once saved, reuse them on any character.
        </Text>

        <Text style={styles.fieldLabel}>Ruleset</Text>
        {rulesetOptions.map((r) => {
          const full = RULESETS[r.id];
          return (
            <ChoiceRow
              key={r.id}
              label={r.label}
              sublabel={
                full
                  ? `${full.classes.length} classes · ${full.races.length} races · ${full.spells.length} spells`
                  : ""
              }
              selected={ruleset === r.id}
              onPress={() => setRuleset(r.id)}
            />
          );
        })}

        <Text style={[styles.fieldLabel, { marginTop: 18 }]}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.key}
              onPress={() => setCategory(c.key)}
              style={[styles.categoryCard, category === c.key && styles.categoryCardActive]}
            >
              <PixelFrameOverlay />
              <Text
                style={[styles.categoryCardText, category === c.key && styles.categoryCardTextActive]}
              >
                {c.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.fieldLabel, { marginTop: 18 }]}>
          {activeCategory.label} ({rows.length})
        </Text>
        {rows.length === 0 && (
          <Text style={styles.hint}>
            {activeCategory.usesRuleset
              ? `No homebrew ${activeCategory.label.toLowerCase()} yet for ${RULESETS[ruleset]?.label ?? ruleset}.`
              : `No homebrew ${activeCategory.label.toLowerCase()} yet.`}
          </Text>
        )}
        {rows.map((row) => (
          <View key={row.id} style={styles.card}>
            <PixelFrameOverlay />
            <Text style={styles.cardName}>{row.name}</Text>
            <Text style={styles.cardSummary}>{row.summary}</Text>
            <View style={styles.cardActions}>
              {category !== "monsters" && (
                <Button
                  title="Add to Character"
                  size="sm"
                  variant="secondary"
                  onPress={() => openAddToCharacter(row)}
                />
              )}
              <Button title="Edit" size="sm" variant="secondary" onPress={() => openEdit(row)} />
              <Button title="Delete" size="sm" variant="danger" onPress={() => confirmDelete(row)} />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.navRow}>
        <Button
          title={`+ New ${activeCategory.singular}`}
          variant="primary"
          fullWidth
          onPress={openCreate}
        />
      </View>

      <AddToCharacterModal
        visible={addTargetRow !== null}
        characters={addToCharacterTargets}
        itemName={addTargetRow?.name ?? ""}
        onClose={() => setAddTargetRow(null)}
        onPick={handlePickCharacter}
      />

      {category === "weapons" && (
        <HomebrewWeaponModal
          visible={modalOpen}
          ruleset={ruleset}
          initial={editingRow ? (editingRow.raw as HomebrewWeaponRow) : undefined}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
      {category === "armor" && (
        <HomebrewArmorModal
          visible={modalOpen}
          ruleset={ruleset}
          initial={editingRow ? (editingRow.raw as HomebrewArmorRow) : undefined}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
      {category === "items" && (
        <HomebrewMagicItemModal
          visible={modalOpen}
          initial={editingRow ? (editingRow.raw as HomebrewMagicItemRow) : undefined}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
      {category === "feats" && (
        <HomebrewFeatModal
          visible={modalOpen}
          initial={editingRow ? (editingRow.raw as HomebrewFeatRow) : undefined}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
      {category === "monsters" && (
        <HomebrewMonsterModal
          visible={modalOpen}
          initial={editingRow ? (editingRow.raw as HomebrewMonsterRow) : undefined}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
      {category === "spells" && (
        <HomebrewSpellModal
          visible={modalOpen}
          ruleset={ruleset}
          initial={editingRow ? (editingRow.raw as HomebrewSpellRow) : undefined}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
      {category === "races" && (
        <HomebrewRaceModal
          visible={modalOpen}
          ruleset={ruleset}
          initial={editingRow ? (editingRow.raw as HomebrewRaceRow) : undefined}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
      {category === "classes" && (
        <HomebrewClassModal
          visible={modalOpen}
          ruleset={ruleset}
          initial={editingRow ? (editingRow.raw as HomebrewClassRow) : undefined}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
      {category === "subclasses" && (
        <HomebrewSubclassModal
          visible={modalOpen}
          ruleset={ruleset}
          initial={editingRow ? (editingRow.raw as HomebrewSubclassRow) : undefined}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
      {category === "resources" && (
        <CustomResourceModal
          visible={modalOpen}
          initial={editingRow ? (editingRow.raw as CustomResourceInput) : undefined}
          onClose={closeModal}
          onConfirm={async (input) => {
            if (editingRow) await updateHomebrewResource(editingRow.id, input);
            else await createHomebrewResource(input);
            handleSaved();
          }}
          onDelete={
            editingRow
              ? async () => {
                  await deleteHomebrewResource(editingRow.id);
                  handleSaved();
                }
              : undefined
          }
        />
      )}
    </View>
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
    <Pressable style={[styles.choiceRow, selected && styles.choiceRowActive]} onPress={onPress}>
      <Text style={styles.choiceRowLabel}>{label}</Text>
      {sublabel.length > 0 && <Text style={styles.choiceRowSub}>{sublabel}</Text>}
    </Pressable>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.screenBackground },
    body: { flex: 1 },
    bodyContent: { padding: 16 },
    title: {
      color: theme.colors.text,
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 8,
      fontFamily: theme.displayFontFamily,
    },
    hint: { color: theme.colors.textMuted, fontSize: 13, marginBottom: 12 },
    fieldLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 8,
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
    categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    categoryCard: {
      width: "31%",
      backgroundColor: withAlpha(theme.colors.surface, theme.boxAlpha),
      borderWidth: theme.pixel ? 0 : 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
    },
    categoryCardActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    categoryCardText: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
      textAlign: "center",
    },
    categoryCardTextActive: { color: theme.colors.primaryText },
    card: {
      backgroundColor: withAlpha(theme.colors.surface, theme.boxAlpha),
      borderWidth: theme.pixel ? 0 : 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 14,
      marginBottom: 8,
    },
    cardName: {
      color: theme.colors.text,
      fontSize: 17,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    cardSummary: { color: theme.colors.textMuted, fontSize: 13, marginTop: 2, marginBottom: 10 },
    cardActions: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    navRow: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
  });
}
