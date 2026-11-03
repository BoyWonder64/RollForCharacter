import { useCallback, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  addCustomResource,
  customRowToInput,
  listCharacterResources,
  listCustomResources,
  removeCustomResource,
  resetResource,
  restoreResourceUse,
  rollResource,
  setResourceOverride,
  spendResourceUse,
  updateCustomResource,
  type CharacterResource,
  type CustomResourceInput,
} from "../features/characters/resourceRepo";
import { spendHitDie, type SpendHitDieOutcome } from "../features/characters/characterRepo";
import { getClassDefinitionForCharacter } from "../features/characters/characterCalculations";
import { useSoundEffects } from "../features/sound/useSoundEffects";
import { CustomResourceModal } from "./CustomResourceModal";
import { ResourceOverrideModal, type ResourceOverrideChange } from "./ResourceOverrideModal";
import { useIconSettings } from "../features/icons/IconSettingsContext";
import { getCampaignItemIcon, type CampaignItemIconId } from "../features/icons/iconAssets";
import type { Character } from "../types/models";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";

/**
 * Shows every limited-use class resource the character has gained so far
 * (Action Surge, Second Wind, Indomitable, ...) as a pip tracker with a tap
 * to spend a use, plus Hit Dice (spent for HP during a short rest). Resources
 * recharge via the Rest modal (short/long rest) -- see `shortRest`/`longRest`
 * in characterRepo.ts. The class-resource list renders nothing if the
 * character's class has no resources defined yet, or none are gained at
 * their current level, but the card always shows so the player can create
 * their own ability or tracker (stored in `character_custom_resources`),
 * which then behaves exactly like a catalog resource and can be edited or
 * deleted here.
 */
export function ClassResourceTracker({
  character,
  onChanged,
}: {
  character: Character;
  onChanged?: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const playSound = useSoundEffects();
  const [resources, setResources] = useState<CharacterResource[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: number; input: CustomResourceInput } | null>(null);
  const [adjusting, setAdjusting] = useState<CharacterResource | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [lastRoll, setLastRoll] = useState<{ resourceId: string; text: string } | null>(null);
  const [lastHitDieRoll, setLastHitDieRoll] = useState<SpendHitDieOutcome | null>(null);
  const [hitDiceExpanded, setHitDiceExpanded] = useState(false);
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const [manualValue, setManualValue] = useState("");
  const { iconsEnabled, iconStyle } = useIconSettings();
  const hitDie = getClassDefinitionForCharacter(character).hitDie;
  const atFullHp = character.currentHp >= character.maxHp;
  const spendHitDieDisabled = character.hitDiceRemaining <= 0 || atFullHp;
  const parsedManualValue = parseInt(manualValue, 10);
  const manualValueValid =
    Number.isInteger(parsedManualValue) && parsedManualValue >= 1 && parsedManualValue <= hitDie;

  const refresh = useCallback(() => {
    listCharacterResources(character, { includeHidden: true }).then(setResources);
  }, [character]);

  const visible = resources.filter((r) => !r.hidden);
  const hiddenResources = resources.filter((r) => r.hidden);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  async function handleUse(resourceId: string) {
    await spendResourceUse(character, resourceId);
    refresh();
  }

  async function handleStep(resourceId: string, amount: number) {
    if (amount < 0) await spendResourceUse(character, resourceId, -amount);
    else await restoreResourceUse(character, resourceId, amount);
    refresh();
  }

  /** Rolls the resource's formula; `spend` also uses one charge first (so a failed spend on an empty resource doesn't roll). */
  async function handleRoll(resource: CharacterResource, spend: boolean) {
    if (spend) {
      if (resource.remaining <= 0) return;
      await spendResourceUse(character, resource.definition.id);
    }
    try {
      const result = await rollResource(character, resource);
      if (result) {
        setLastRoll({
          resourceId: resource.definition.id,
          text: `${result.total}  (${result.breakdown})`,
        });
      }
    } catch (error) {
      setLastRoll({
        resourceId: resource.definition.id,
        text: error instanceof Error ? error.message : "Could not roll.",
      });
    }
    refresh();
  }

  async function handleOverride(change: ResourceOverrideChange) {
    if (adjusting) await setResourceOverride(character.id, adjusting.definition.id, change);
    setAdjusting(null);
    refresh();
  }

  async function handleReset() {
    if (adjusting) await resetResource(character, adjusting.definition.id);
    setAdjusting(null);
    refresh();
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function handleEdit(customId: number) {
    const row = (await listCustomResources(character.id)).find((r) => r.id === customId);
    if (!row) return;
    setEditing({ id: row.id, input: customRowToInput(row) });
    setModalOpen(true);
  }

  async function handleConfirm(input: CustomResourceInput) {
    if (editing) await updateCustomResource(editing.id, input);
    else await addCustomResource(character.id, input);
    closeModal();
    refresh();
  }

  async function handleDelete() {
    if (editing) await removeCustomResource(editing.id);
    closeModal();
    refresh();
  }

  async function handleSpendHitDie(manualRoll?: number) {
    const outcome = await spendHitDie(character.id, manualRoll);
    if (outcome) {
      setLastHitDieRoll(outcome);
      // Only for an app-rolled die -- manual entry just records a roll made
      // at the table, so there's nothing here for the app to "land".
      if (manualRoll === undefined) playSound("diceLand");
    }
    onChanged?.();
  }

  function handleManualHitDieSubmit() {
    if (!manualValueValid) return;
    handleSpendHitDie(parsedManualValue);
    setManualValue("");
    setManualEntryOpen(false);
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.hitDiceToggleRow}
        onPress={() => setHitDiceExpanded((prev) => !prev)}
      >
        <Text style={styles.title}>Hit Dice</Text>
        <View style={styles.hitDiceToggleRight}>
          <Text style={styles.count}>
            {character.hitDiceRemaining}/{character.level} (d{hitDie})
          </Text>
          <Text style={styles.editLink}>{hitDiceExpanded ? "Hide" : "Use"}</Text>
        </View>
      </Pressable>
      {hitDiceExpanded && (
        <>
          <Text style={styles.description}>
            Spend a Hit Die to roll d{hitDie} + CON and heal that much -- usable any time
            you&apos;re not in combat, as many times as you have dice left.
          </Text>
          <View style={styles.hitDiceButtonRow}>
            <Pressable
              style={[
                styles.useButton,
                styles.useButtonFlex,
                spendHitDieDisabled && styles.useButtonDisabled,
              ]}
              disabled={spendHitDieDisabled}
              onPress={() => handleSpendHitDie()}
            >
              <Text style={styles.useButtonText}>Roll For Me</Text>
            </Pressable>
            <Pressable
              style={[
                styles.useButton,
                styles.useButtonFlex,
                spendHitDieDisabled && styles.useButtonDisabled,
              ]}
              disabled={spendHitDieDisabled}
              onPress={() => setManualEntryOpen((prev) => !prev)}
            >
              <Text style={styles.useButtonText}>I Rolled My Own</Text>
            </Pressable>
          </View>
          {manualEntryOpen && (
            <View style={styles.manualEntryRow}>
              <Text style={styles.description}>You rolled a d{hitDie} of</Text>
              <TextInput
                style={styles.manualInput}
                keyboardType="number-pad"
                value={manualValue}
                onChangeText={setManualValue}
                placeholder={`1-${hitDie}`}
                placeholderTextColor={theme.colors.textMuted}
                maxLength={2}
              />
              <Pressable
                style={[styles.useButton, !manualValueValid && styles.useButtonDisabled]}
                disabled={!manualValueValid}
                onPress={handleManualHitDieSubmit}
              >
                <Text style={styles.useButtonText}>Apply</Text>
              </Pressable>
            </View>
          )}
          {lastHitDieRoll && (
            <Text style={styles.rollResult}>
              Rolled {lastHitDieRoll.roll.total} → healed {lastHitDieRoll.healed} HP (now{" "}
              {character.currentHp}/{character.maxHp}).
            </Text>
          )}
        </>
      )}

      <View style={styles.divider} />

      <View style={styles.titleRow}>
        <Text style={styles.title}>Class Resources</Text>
        <Pressable
          style={styles.createButton}
          onPress={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Text style={styles.createButtonText}>+ Create</Text>
        </Pressable>
      </View>
      {visible.length === 0 && (
        <Text style={styles.empty}>
          No limited-use abilities yet. Create your own.
        </Text>
      )}
      {visible.map((resource) => {
        const { definition, max, remaining, customId, description, icon, rollFormula, overrideMax } = resource;
        const iconSource =
          iconsEnabled && icon ? getCampaignItemIcon(iconStyle, icon as CampaignItemIconId) : undefined;
        const roll = lastRoll?.resourceId === definition.id ? lastRoll.text : undefined;
        return (
        <View key={definition.id} style={styles.row}>
          <View style={styles.rowHeader}>
            <View style={styles.nameGroup}>
              {iconSource && <Image source={iconSource} style={styles.icon} resizeMode="contain" />}
              <Text style={styles.name}>{definition.name}</Text>
            </View>
            <View style={styles.countGroup}>
              <Text style={styles.count}>
                {remaining}/{max}
                {overrideMax !== undefined ? "*" : ""}
              </Text>
              <Pressable
                onPress={() => (customId !== undefined ? handleEdit(customId) : setAdjusting(resource))}
                hitSlop={8}
              >
                <Text style={styles.editLink}>{customId !== undefined ? "Edit" : "Adjust"}</Text>
              </Pressable>
            </View>
          </View>
          {!!description && <Text style={styles.description}>{description}</Text>}
          {!!roll && <Text style={styles.rollResult}>Rolled {roll}</Text>}
          {definition.isPointPool ? (
            <View style={styles.poolRow}>
              <Pressable
                style={[styles.useButton, remaining <= 0 && styles.useButtonDisabled]}
                disabled={remaining <= 0}
                onPress={() => handleStep(definition.id, -1)}
              >
                <Text style={styles.useButtonText}>-1</Text>
              </Pressable>
              <Pressable
                style={[styles.useButton, remaining >= max && styles.useButtonDisabled]}
                disabled={remaining >= max}
                onPress={() => handleStep(definition.id, 1)}
              >
                <Text style={styles.useButtonText}>+1</Text>
              </Pressable>
              {!!rollFormula && (
                <Pressable style={styles.useButton} onPress={() => handleRoll(resource, false)}>
                  <Text style={styles.useButtonText}>Roll</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View style={styles.pipsRow}>
              <View style={styles.pips}>
                {Array.from({ length: max }, (_, i) => (
                  <View key={i} style={[styles.pip, i < remaining && styles.pipOn]} />
                ))}
              </View>
              <Pressable
                style={[styles.useButton, remaining <= 0 && styles.useButtonDisabled]}
                disabled={remaining <= 0}
                onPress={() => handleUse(definition.id)}
              >
                <Text style={styles.useButtonText}>Use</Text>
              </Pressable>
              {!!rollFormula && (
                <Pressable
                  style={[styles.useButton, remaining <= 0 && styles.useButtonDisabled]}
                  disabled={remaining <= 0}
                  onPress={() => handleRoll(resource, true)}
                >
                  <Text style={styles.useButtonText}>Use + Roll</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
        );
      })}
      {hiddenResources.length > 0 && (
        <View style={styles.hiddenBlock}>
          <Pressable onPress={() => setShowHidden(!showHidden)}>
            <Text style={styles.editLink}>
              {showHidden ? "Collapse" : "Show"} {hiddenResources.length} hidden{" "}
              {hiddenResources.length === 1 ? "ability" : "abilities"}
            </Text>
          </Pressable>
          {showHidden &&
            hiddenResources.map((resource) => (
              <View key={resource.definition.id} style={styles.hiddenRow}>
                <Text style={styles.count}>{resource.definition.name}</Text>
                <Pressable onPress={() => setAdjusting(resource)} hitSlop={8}>
                  <Text style={styles.editLink}>Adjust</Text>
                </Pressable>
              </View>
            ))}
        </View>
      )}
      <ResourceOverrideModal
        visible={adjusting !== null}
        name={adjusting?.definition.name ?? ""}
        defaultMax={adjusting?.defaultMax ?? adjusting?.max ?? 1}
        overrideMax={adjusting?.overrideMax}
        hidden={adjusting?.hidden ?? false}
        onClose={() => setAdjusting(null)}
        onSave={handleOverride}
        onReset={handleReset}
      />
      <CustomResourceModal
        visible={modalOpen}
        initial={editing?.input}
        onClose={closeModal}
        onConfirm={handleConfirm}
        onDelete={editing ? handleDelete : undefined}
      />
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 14,
      marginTop: 12,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    title: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 4,
    },
    hitDiceToggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    hitDiceToggleRight: { flexDirection: "row", alignItems: "center", gap: 10 },
    hitDiceButtonRow: { flexDirection: "row", gap: 10, marginTop: 10 },
    manualEntryRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
    manualInput: {
      width: 56,
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: 14,
      textAlign: "center",
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 14,
    },
    createButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    createButtonText: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    empty: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    nameGroup: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1 },
    icon: { width: 20, height: 20 },
    rollResult: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 4,
      fontFamily: theme.displayFontFamily,
    },
    hiddenBlock: { marginTop: 6 },
    hiddenRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
    countGroup: { flexDirection: "row", alignItems: "center", gap: 10 },
    editLink: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    description: {
      color: theme.colors.textMuted,
      fontSize: 11,
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    row: { marginBottom: 10 },
    rowHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    name: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    count: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    pipsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 6,
      gap: 10,
    },
    pips: { flexDirection: "row", gap: 6, flexShrink: 1 },
    poolRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 10 },
    pip: {
      width: 16,
      height: 16,
      borderRadius: theme.radius,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceAlt,
    },
    pipOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    useButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    useButtonFlex: { flex: 1, alignItems: "center" },
    useButtonDisabled: { opacity: 0.5 },
    useButtonText: {
      color: theme.colors.primaryText,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
  });
}
