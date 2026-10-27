import { useCallback, useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  addCatalogSpellToCharacter,
  addSpellToCharacter,
  adjustSpellSlotUsage,
  listSpellSlots,
  listSpellsForCharacter,
  removeCharacterSpell,
  setSpellSlot,
  togglePrepared,
} from "./spellRepo";
import { SpellSlotsModal } from "./SpellSlotsModal";
import { ManageSpellsModal } from "./ManageSpellsModal";
import { LevelUpSpellsModal } from "./LevelUpSpellsModal";
import { SpellDetailModal } from "./SpellDetailModal";
import { getSpellRollType, getSpellSaveAbility } from "./spellRollType";
import { DEFAULT_RULESET, getRulesetCatalog } from "../../data/rulesets";
import {
  buildStructuredRollPlan,
  rollD20,
  spellSaveDc,
  structuredRollToResult,
} from "../../features/dice/structuredRolls";
import { ABILITY_LABELS } from "../../features/characters/characterCalculations";
import { endConcentration, startConcentration } from "../../features/characters/characterRepo";
import { saveRoll } from "../../features/dice/diceRepo";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";
import type { Character } from "../../types/models";
import { useIconSettings } from "../../features/icons/IconSettingsContext";
import { getSpellSchoolIcon } from "../../features/icons/iconAssets";

type SpellRow = Awaited<ReturnType<typeof listSpellsForCharacter>>[number];
type SlotRow = Awaited<ReturnType<typeof listSpellSlots>>[number];

const SLOT_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function SpellsTab({
  character,
  onCharacterChanged,
}: {
  character: Character;
  onCharacterChanged: () => void;
}) {
  const characterId = character.id;
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { iconsEnabled, iconStyle } = useIconSettings();
  const [spellRows, setSpellRows] = useState<SpellRow[]>([]);
  const [slots, setSlots] = useState<SlotRow[]>([]);

  const matchedClass = useMemo(() => {
    const catalog = getRulesetCatalog(character.ruleset || DEFAULT_RULESET);
    const trimmed = character.className.trim().toLowerCase();
    return catalog.classes.find((c) => c.name.toLowerCase() === trimmed);
  }, [character.ruleset, character.className]);

  const [slotsModalOpen, setSlotsModalOpen] = useState(false);
  const [manageSpellsOpen, setManageSpellsOpen] = useState(false);
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [detailSpell, setDetailSpell] = useState<SpellRow | null>(null);

  const refresh = useCallback(() => {
    listSpellsForCharacter(characterId).then(setSpellRows);
    listSpellSlots(characterId).then(setSlots);
  }, [characterId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  async function handleAddFromCatalog(spellId: number) {
    await addCatalogSpellToCharacter(characterId, spellId);
    refresh();
  }

  async function handleAddCustomSpell(name: string, level: number) {
    await addSpellToCharacter(characterId, name, level);
    refresh();
  }

  function handleRemoveSpell(characterSpellId: number, name: string) {
    Alert.alert("Unlearn spell?", `Remove "${name}" from known spells?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removeCharacterSpell(characterSpellId);
          refresh();
        },
      },
    ]);
  }

  async function handleToggle(characterSpellId: number, prepared: boolean) {
    await togglePrepared(characterSpellId, !prepared);
    refresh();
  }

  function handleEndConcentration() {
    endConcentration(characterId).then(onCharacterChanged);
  }

  function beginConcentration(spell: SpellRow) {
    startConcentration(characterId, spell.characterSpellId, spell.name).then(onCharacterChanged);
  }

  function handleToggleConcentration(spell: SpellRow) {
    const isConcentratingOnThis = character.concentratingSpellId === spell.characterSpellId;
    if (isConcentratingOnThis) {
      handleEndConcentration();
      return;
    }
    if (character.concentratingSpellName) {
      Alert.alert(
        "Switch concentration?",
        `You're concentrating on "${character.concentratingSpellName}". Starting "${spell.name}" will end it.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Switch", onPress: () => beginConcentration(spell) },
        ]
      );
      return;
    }
    beginConcentration(spell);
  }

  async function handleAdjustSlotTotal(level: number, current: number, delta: number) {
    const next = Math.max(0, current + delta);
    await setSpellSlot(characterId, level, next);
    refresh();
  }

  async function handleSlotUse(slotId: number, delta: number) {
    await adjustSpellSlotUsage(slotId, delta);
    refresh();
  }

  /**
   * Rolls the character's generic spell attack bonus (ability mod + prof)
   * for this spell and logs it to roll history. The catalog doesn't track
   * whether an individual spell is an attack roll, a save, or neither, so
   * this is a best-effort "spell attack" roll -- the spell save DC is shown
   * alongside for spells that actually force a save instead.
   */
  async function handleRollSpell(spell: SpellRow) {
    const plan = buildStructuredRollPlan({ mode: "spell", character, advantageMode: "normal" });
    if ("error" in plan) {
      Alert.alert("Can't roll", plan.error);
      return;
    }
    const raw = rollD20("normal", plan.modifier);
    const result = structuredRollToResult(
      { ...plan, label: `${spell.name} (Spell Attack)` },
      raw,
      "normal"
    );
    await saveRoll(result, characterId);

    if (spell.level > 0) {
      const slot = slots.find((s) => s.level === spell.level);
      if (slot && slot.used < slot.total) {
        await adjustSpellSlotUsage(slot.id, 1);
      }
    }
    refresh();
  }

  const knownSpellIds = useMemo(() => new Set(spellRows.map((s) => s.id)), [spellRows]);
  const slotTotals = useMemo(() => slots.map((s) => ({ level: s.level, total: s.total })), [slots]);
  const dc = spellSaveDc(character);

  return (
    <View>
      <View style={styles.dcBanner}>
        <Text style={styles.dcBannerLabel}>Spell Save DC</Text>
        <Text style={styles.dcBannerValue}>{dc}</Text>
      </View>

      <View style={styles.concentrationBanner}>
        {character.concentratingSpellName ? (
          <>
            <View style={styles.concentrationInfo}>
              <Text style={styles.concentrationLabel}>Concentrating on</Text>
              <Text style={styles.concentrationValue}>{character.concentratingSpellName}</Text>
            </View>
            <Pressable style={styles.concentrationEndButton} onPress={handleEndConcentration}>
              <Text style={styles.concentrationEndButtonText}>End</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.concentrationEmpty}>Not concentrating on a spell</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Spell Slots</Text>
      <View style={styles.slotGrid}>
        {SLOT_LEVELS.map((level) => {
          const slot = slots.find((s) => s.level === level);
          const total = slot?.total ?? 0;
          if (total === 0) {
            return null;
          }
          return (
            <View key={level} style={styles.slotCard}>
              <Text style={styles.slotLevel}>Lvl {level}</Text>
              <Text style={styles.slotCount}>
                {slot ? slot.used : 0}/{total}
              </Text>
              <View style={styles.slotButtons}>
                <Pressable
                  onPress={() => slot && handleSlotUse(slot.id, 1)}
                  style={styles.slotButton}
                >
                  <Text style={styles.slotButtonText}>Use</Text>
                </Pressable>
                <Pressable
                  onPress={() => slot && handleSlotUse(slot.id, -1)}
                  style={styles.slotButton}
                >
                  <Text style={styles.slotButtonText}>Free</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton} onPress={() => setSlotsModalOpen(true)}>
          <Text style={styles.actionButtonText} numberOfLines={1}>
            Slots
          </Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => setManageSpellsOpen(true)}>
          <Text style={styles.actionButtonText} numberOfLines={1}>
            Spells
          </Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => setLevelUpOpen(true)}>
          <Text style={styles.actionButtonText} numberOfLines={1}>
            Level Up
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Spells</Text>
      {spellRows.length === 0 ? (
        <Text style={styles.empty}>No spells added yet.</Text>
      ) : (
        spellRows.map((spell) => {
          const icon = iconsEnabled ? getSpellSchoolIcon(iconStyle, spell.school) : undefined;
          const rollType = getSpellRollType(spell.description);
          const saveAbility = getSpellSaveAbility(spell.description);
          const isConcentratingOnThis = character.concentratingSpellId === spell.characterSpellId;
          return (
            <Pressable
              key={spell.characterSpellId}
              style={styles.spellRow}
              onPress={() => handleToggle(spell.characterSpellId, spell.prepared)}
            >
              <View style={styles.spellTopRow}>
                {icon && <Image source={icon} style={styles.schoolIcon} resizeMode="contain" />}
                <View style={styles.spellInfo}>
                  <Text style={styles.spellName}>{spell.name}</Text>
                  <Text style={styles.spellMeta}>
                    {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`}
                    {spell.school ? ` · ${spell.school}` : ""}
                    {spell.concentration ? " · Concentration" : ""}
                  </Text>
                </View>
                <View style={[styles.preparedPill, spell.prepared && styles.preparedPillOn]}>
                  <Text
                    style={[
                      styles.preparedPillText,
                      spell.prepared && styles.preparedPillTextOn,
                    ]}
                  >
                    {spell.prepared ? "Prepared" : "Unprepared"}
                  </Text>
                </View>
              </View>
              <View style={styles.spellBottomRow}>
                <Pressable style={styles.detailButton} onPress={() => setDetailSpell(spell)}>
                  <Text style={styles.detailButtonText}>Details</Text>
                </Pressable>
                {spell.concentration && (
                  <Pressable
                    style={[
                      styles.concentrateButton,
                      isConcentratingOnThis && styles.concentrateButtonOn,
                    ]}
                    onPress={() => handleToggleConcentration(spell)}
                  >
                    <Text
                      style={[
                        styles.concentrateButtonText,
                        isConcentratingOnThis && styles.concentrateButtonTextOn,
                      ]}
                    >
                      {isConcentratingOnThis ? "Concentrating" : "Concentrate"}
                    </Text>
                  </Pressable>
                )}
                {rollType === "attack" && (
                  <Pressable
                    style={styles.rollSpellButton}
                    onPress={() => handleRollSpell(spell)}
                  >
                    <Text style={styles.rollSpellButtonText}>Roll</Text>
                  </Pressable>
                )}
                {rollType === "save" && (
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveBadgeText}>
                      {saveAbility ? `${ABILITY_LABELS[saveAbility]} ` : ""}Save DC {dc}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })
      )}

      <SpellSlotsModal
        visible={slotsModalOpen}
        slots={slotTotals}
        onClose={() => setSlotsModalOpen(false)}
        onAdjustTotal={handleAdjustSlotTotal}
      />

      <ManageSpellsModal
        visible={manageSpellsOpen}
        knownSpells={spellRows}
        matchedClass={matchedClass}
        onClose={() => setManageSpellsOpen(false)}
        onAddFromCatalog={handleAddFromCatalog}
        onAddCustom={handleAddCustomSpell}
        onRemove={handleRemoveSpell}
      />

      <LevelUpSpellsModal
        visible={levelUpOpen}
        slotTotals={slotTotals}
        knownSpellIds={knownSpellIds}
        matchedClass={matchedClass}
        onClose={() => setLevelUpOpen(false)}
        onAdjustSlotTotal={handleAdjustSlotTotal}
        onAddFromCatalog={handleAddFromCatalog}
      />

      <SpellDetailModal
        visible={detailSpell !== null}
        spell={detailSpell}
        onClose={() => setDetailSpell(null)}
      />
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 10,
      marginTop: 4,
    },
    dcBanner: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 16,
      alignItems: "center",
      marginBottom: 18,
    },
    dcBannerLabel: {
      color: theme.colors.primaryText,
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 1,
      textTransform: "uppercase",
      opacity: 0.85,
      fontFamily: theme.displayFontFamily,
    },
    dcBannerValue: {
      color: theme.colors.primaryText,
      fontSize: 40,
      fontWeight: "800",
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    concentrationBanner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginBottom: 18,
    },
    concentrationInfo: { flex: 1 },
    concentrationLabel: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      textTransform: "uppercase",
      fontFamily: theme.displayFontFamily,
    },
    concentrationValue: {
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: "700",
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    concentrationEmpty: {
      color: theme.colors.textMuted,
      fontSize: 13,
      fontFamily: theme.displayFontFamily,
    },
    concentrationEndButton: {
      backgroundColor: theme.colors.danger,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    concentrationEndButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
    slotCard: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      alignItems: "center",
      minWidth: 70,
    },
    slotLevel: { color: theme.colors.textMuted, fontSize: 11, fontWeight: "700" },
    slotCount: { color: theme.colors.text, fontSize: 16, fontWeight: "700", marginTop: 2 },
    slotButtons: { flexDirection: "row", gap: 8, marginTop: 8 },
    slotButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    slotButtonText: { color: theme.colors.text, fontSize: 13, fontWeight: "700" },
    actionRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
    actionButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    actionButtonText: {
      color: theme.colors.primaryText,
      fontSize: 14,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      textAlign: "center",
    },
    empty: { color: theme.colors.textMuted, fontFamily: theme.displayFontFamily },
    spellRow: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      marginBottom: 10,
    },
    spellTopRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    schoolIcon: { width: 28, height: 28 },
    spellInfo: { flex: 1 },
    spellName: {
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    spellMeta: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    spellBottomRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    detailButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 16,
      paddingVertical: 9,
    },
    detailButtonText: {
      color: theme.colors.accent,
      fontSize: 13,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    rollSpellButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 16,
      paddingVertical: 9,
    },
    rollSpellButtonText: {
      color: theme.colors.primaryText,
      fontSize: 13,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    saveBadge: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 9,
    },
    saveBadgeText: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    concentrateButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 9,
    },
    concentrateButtonOn: { backgroundColor: theme.colors.danger },
    concentrateButtonText: {
      color: theme.colors.accent,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    concentrateButtonTextOn: { color: "#FFFFFF" },
    preparedPill: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    preparedPillOn: { backgroundColor: theme.colors.primary },
    preparedPillText: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    preparedPillTextOn: { color: theme.colors.primaryText },
  });
}
