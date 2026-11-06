import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "./AppText";
import {
  deleteSavedEncounter,
  listSavedEncounters,
  loadSavedEncounter,
  saveCurrentEncounter,
  type SavedEncounter,
} from "../features/dm/dmCreatureRepo";
import { useTheme } from "../theme/ThemeContext";
import { createDmStyles } from "./dmStyles";

/** Save the current creature list under a name, or load / delete a saved one. */
export function DmEncountersModal({
  visible,
  hasCreatures,
  onClose,
  onChanged,
}: {
  visible: boolean;
  hasCreatures: boolean;
  onClose: () => void;
  onChanged: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);
  const [saved, setSaved] = useState<SavedEncounter[]>([]);
  const [name, setName] = useState("");

  const refresh = useCallback(() => {
    listSavedEncounters().then(setSaved);
  }, []);

  useEffect(() => {
    if (visible) refresh();
  }, [visible, refresh]);

  async function handleSave() {
    if (!hasCreatures) return;
    await saveCurrentEncounter(name || "Encounter");
    setName("");
    refresh();
  }

  function handleLoad(encounter: SavedEncounter) {
    const run = async () => {
      await loadSavedEncounter(encounter.id);
      onChanged();
      onClose();
    };
    if (!hasCreatures) {
      run();
      return;
    }
    Alert.alert("Replace current encounter?", `Loading "${encounter.name}" clears the creatures now in play.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Load", style: "destructive", onPress: run },
    ]);
  }

  async function handleDelete(encounter: SavedEncounter) {
    await deleteSavedEncounter(encounter.id);
    refresh();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Saved encounters</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={name}
              onChangeText={setName}
              placeholder="Name this encounter…"
              placeholderTextColor={theme.colors.textMuted}
            />
            <Pressable
              style={[styles.primaryButton, !hasCreatures && styles.disabled]}
              disabled={!hasCreatures}
              onPress={handleSave}
            >
              <Text style={styles.primaryButtonText}>Save</Text>
            </Pressable>
          </View>
          {!hasCreatures && <Text style={[styles.hint, { marginTop: 6 }]}>Add creatures to save them.</Text>}

          <ScrollView style={{ maxHeight: 320, marginTop: 12 }}>
            {saved.length === 0 ? (
              <Text style={styles.hint}>No saved encounters yet.</Text>
            ) : (
              saved.map((encounter) => (
                <View
                  key={encounter.id}
                  style={[
                    styles.row,
                    { paddingVertical: 8, borderTopWidth: 1, borderTopColor: theme.colors.border },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>{encounter.name}</Text>
                    <Text style={styles.hint}>
                      {encounter.creatureCount} creature{encounter.creatureCount === 1 ? "" : "s"}
                    </Text>
                  </View>
                  <Pressable style={styles.primaryButton} onPress={() => handleLoad(encounter)}>
                    <Text style={styles.primaryButtonText}>Load</Text>
                  </Pressable>
                  <Pressable style={styles.squareButton} onPress={() => handleDelete(encounter)}>
                    <Text style={styles.squareButtonText}>✕</Text>
                  </Pressable>
                </View>
              ))
            )}
          </ScrollView>

          <Pressable style={[styles.secondaryButton, { marginTop: 12 }]} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
