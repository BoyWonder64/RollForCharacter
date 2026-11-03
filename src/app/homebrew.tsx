import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../theme/ThemeContext";
import { createDmStyles } from "../components/dmStyles";
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
  const styles = useMemo(() => createDmStyles(theme), [theme]);

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
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <Stack.Screen options={{ title: "Homebrew Library" }} />

      <Text style={styles.subTitle}>Ruleset</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {rulesetOptions.map((r) => (
            <Pressable
              key={r.id}
              style={[styles.chip, ruleset === r.id && styles.chipActive]}
              onPress={() => setRuleset(r.id)}
            >
              <Text style={[styles.chipText, ruleset === r.id && styles.chipTextActive]}>{r.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Text style={[styles.subTitle, { marginTop: 14 }]}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {CATEGORIES.map((c) => (
            <Pressable key={c.key} style={[styles.chip, category === c.key && styles.chipActive]} onPress={() => setCategory(c.key)}>
              <Text style={[styles.chipText, category === c.key && styles.chipTextActive]}>{c.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Button
        title={`+ New ${activeCategory.singular}`}
        variant="primary"
        fullWidth
        style={{ marginTop: 14, marginBottom: 10 }}
        onPress={openCreate}
      />

      <ScrollView style={{ flex: 1 }}>
        {rows.length === 0 && (
          <Text style={[styles.hint, { textAlign: "center", padding: 20 }]}>
            {activeCategory.usesRuleset
              ? `No homebrew ${activeCategory.label.toLowerCase()} yet for ${RULESETS[ruleset]?.label ?? ruleset}.`
              : `No homebrew ${activeCategory.label.toLowerCase()} yet.`}
          </Text>
        )}
        {rows.map((row) => (
          <View key={row.id} style={styles.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>{row.name}</Text>
                <Text style={styles.hint}>{row.summary}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {category !== "monsters" && (
                  <Pressable style={styles.secondaryButton} onPress={() => openAddToCharacter(row)}>
                    <Text style={styles.secondaryButtonText}>Add to Character</Text>
                  </Pressable>
                )}
                <Pressable style={styles.secondaryButton} onPress={() => openEdit(row)}>
                  <Text style={styles.secondaryButtonText}>Edit</Text>
                </Pressable>
                <Pressable style={styles.dangerButton} onPress={() => confirmDelete(row)}>
                  <Text style={styles.dangerButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

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
