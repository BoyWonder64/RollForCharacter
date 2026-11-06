import { useMemo, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Text, TextInput } from "../AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTheme } from "../../theme/ThemeContext";
import { createDmStyles } from "../dmStyles";
import {
  createHomebrewMonster,
  updateHomebrewMonster,
  type HomebrewMonsterInput,
} from "../../features/dm/dmCreatureRepo";
import { TraitListEditor, type NamedTrait } from "./TraitListEditor";
import { DoneAccessory } from "../DoneAccessory";

export type HomebrewMonsterRow = { id: number } & HomebrewMonsterInput;

const ABILITIES: { key: keyof HomebrewMonsterInput; label: string }[] = [
  { key: "strength", label: "STR" },
  { key: "dexterity", label: "DEX" },
  { key: "constitution", label: "CON" },
  { key: "intelligence", label: "INT" },
  { key: "wisdom", label: "WIS" },
  { key: "charisma", label: "CHA" },
];

export function HomebrewMonsterModal({
  visible,
  initial,
  onClose,
  onSaved,
}: {
  visible: boolean;
  initial?: HomebrewMonsterRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  const [name, setName] = useState(initial?.name ?? "");
  const [size, setSize] = useState(initial?.size ?? "Medium");
  const [type, setType] = useState(initial?.type ?? "");
  const [alignment, setAlignment] = useState(initial?.alignment ?? "");
  const [armorClassText, setArmorClassText] = useState(String(initial?.armorClass ?? 10));
  const [armorDetail, setArmorDetail] = useState(initial?.armorDetail ?? "");
  const [hitPointsText, setHitPointsText] = useState(String(initial?.hitPoints ?? 1));
  const [hitDice, setHitDice] = useState(initial?.hitDice ?? "");
  const [speed, setSpeed] = useState(initial?.speed ?? "30 ft.");
  const [abilities, setAbilities] = useState<Record<string, string>>({
    strength: String(initial?.strength ?? 10),
    dexterity: String(initial?.dexterity ?? 10),
    constitution: String(initial?.constitution ?? 10),
    intelligence: String(initial?.intelligence ?? 10),
    wisdom: String(initial?.wisdom ?? 10),
    charisma: String(initial?.charisma ?? 10),
  });
  const [challengeRating, setChallengeRating] = useState(initial?.challengeRating ?? "0");
  const [xpText, setXpText] = useState(String(initial?.xp ?? 0));
  const [senses, setSenses] = useState(initial?.senses ?? "");
  const [languages, setLanguages] = useState(initial?.languages ?? "");
  const [traits, setTraits] = useState<NamedTrait[]>(initial?.traits ?? []);
  const [actions, setActions] = useState<NamedTrait[]>(initial?.actions ?? []);
  const [legendaryActions, setLegendaryActions] = useState<NamedTrait[]>(initial?.legendaryActions ?? []);

  const canSave = name.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    const input: HomebrewMonsterInput = {
      name: name.trim(),
      size: size.trim(),
      type: type.trim(),
      alignment: alignment.trim(),
      armorClass: Number(armorClassText) || 10,
      armorDetail: armorDetail.trim(),
      hitPoints: Math.max(1, Number(hitPointsText) || 1),
      hitDice: hitDice.trim(),
      speed: speed.trim(),
      strength: Number(abilities.strength) || 10,
      dexterity: Number(abilities.dexterity) || 10,
      constitution: Number(abilities.constitution) || 10,
      intelligence: Number(abilities.intelligence) || 10,
      wisdom: Number(abilities.wisdom) || 10,
      charisma: Number(abilities.charisma) || 10,
      challengeRating: challengeRating.trim() || "0",
      xp: Math.max(0, Number(xpText) || 0),
      senses: senses.trim(),
      languages: languages.trim(),
      traits,
      actions,
      legendaryActions,
    };
    if (initial) await updateHomebrewMonster(initial.id, input);
    else await createHomebrewMonster(input);
    onSaved();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
<DoneAccessory id="done-HomebrewMonsterModal" />
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{initial ? "Edit Monster" : "New Homebrew Monster"}</Text>
            <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 460 }}
              bottomOffset={60}
            >
              <Text style={styles.hint}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Bog Wyrmling"
                placeholderTextColor={theme.colors.textMuted}
                autoFocus
              />

              <View style={[styles.row, { marginTop: 8 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Size</Text>
                  <TextInput style={styles.input} value={size} onChangeText={setSize} placeholder="Medium" placeholderTextColor={theme.colors.textMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Type</Text>
                  <TextInput style={styles.input} value={type} onChangeText={setType} placeholder="beast" placeholderTextColor={theme.colors.textMuted} />
                </View>
              </View>

              <Text style={styles.hint}>Alignment</Text>
              <TextInput
                style={styles.input}
                value={alignment}
                onChangeText={setAlignment}
                placeholder="unaligned"
                placeholderTextColor={theme.colors.textMuted}
              />

              <View style={[styles.row, { marginTop: 8 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Armor Class</Text>
                  <TextInput style={styles.input} value={armorClassText} onChangeText={setArmorClassText} keyboardType="number-pad" inputAccessoryViewID="done-HomebrewMonsterModal" />
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={styles.hint}>AC Detail (optional)</Text>
                  <TextInput style={styles.input} value={armorDetail} onChangeText={setArmorDetail} placeholder="e.g. natural armor" placeholderTextColor={theme.colors.textMuted} />
                </View>
              </View>

              <View style={[styles.row, { marginTop: 8 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Hit Points</Text>
                  <TextInput style={styles.input} value={hitPointsText} onChangeText={setHitPointsText} keyboardType="number-pad" inputAccessoryViewID="done-HomebrewMonsterModal" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Hit Dice</Text>
                  <TextInput style={styles.input} value={hitDice} onChangeText={setHitDice} placeholder="2d8+2" placeholderTextColor={theme.colors.textMuted} />
                </View>
              </View>

              <Text style={styles.hint}>Speed</Text>
              <TextInput
                style={styles.input}
                value={speed}
                onChangeText={setSpeed}
                placeholder="30 ft., fly 60 ft."
                placeholderTextColor={theme.colors.textMuted}
              />

              <Text style={styles.subTitle}>Ability Scores</Text>
              <View style={styles.wrapRow}>
                {ABILITIES.map((a) => (
                  <View key={a.key} style={{ width: 70 }}>
                    <Text style={styles.hint}>{a.label}</Text>
                    <TextInput
                      style={[styles.input, { textAlign: "center" }]}
                      value={abilities[a.key as string]}
                      onChangeText={(text) => setAbilities((prev) => ({ ...prev, [a.key]: text }))}
                      keyboardType="number-pad" inputAccessoryViewID="done-HomebrewMonsterModal"
                    />
                  </View>
                ))}
              </View>

              <View style={[styles.row, { marginTop: 8 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Challenge Rating</Text>
                  <TextInput style={styles.input} value={challengeRating} onChangeText={setChallengeRating} placeholder="1/2" placeholderTextColor={theme.colors.textMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>XP</Text>
                  <TextInput style={styles.input} value={xpText} onChangeText={setXpText} keyboardType="number-pad" inputAccessoryViewID="done-HomebrewMonsterModal" />
                </View>
              </View>

              <Text style={styles.hint}>Senses</Text>
              <TextInput
                style={styles.input}
                value={senses}
                onChangeText={setSenses}
                placeholder="darkvision 60 ft., passive Perception 10"
                placeholderTextColor={theme.colors.textMuted}
              />

              <Text style={styles.hint}>Languages</Text>
              <TextInput
                style={styles.input}
                value={languages}
                onChangeText={setLanguages}
                placeholder="—"
                placeholderTextColor={theme.colors.textMuted}
              />

              <View style={{ marginTop: 12 }}>
                <TraitListEditor label="Traits" traits={traits} onChange={setTraits} />
              </View>
              <View style={{ marginTop: 12 }}>
                <TraitListEditor label="Actions" traits={actions} onChange={setActions} namePlaceholder="Action name (e.g. Bite)" />
              </View>
              <View style={{ marginTop: 12 }}>
                <TraitListEditor
                  label="Legendary Actions"
                  traits={legendaryActions}
                  onChange={setLegendaryActions}
                  namePlaceholder="Legendary action name"
                />
              </View>
            </KeyboardAwareScrollView>

            <View style={[styles.row, { marginTop: 12 }]}>
              <Pressable style={[styles.secondaryButton, { flex: 1 }]} onPress={onClose}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.primaryButton, { flex: 1 }, !canSave && styles.disabled]}
                disabled={!canSave}
                onPress={handleSave}
              >
                <Text style={styles.primaryButtonText}>{initial ? "Save" : "Create"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
