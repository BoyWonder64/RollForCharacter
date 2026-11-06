import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Switch, View } from "react-native";
import { Text, TextInput } from "./AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTheme } from "../theme/ThemeContext";
import {
  addCustomDmCreature,
  addDmCreatureFromCatalog,
  getMonsterCatalog,
  type MonsterCatalogRow,
} from "../features/dm/dmCreatureRepo";
import { matchesDmEdition, useDmMode } from "../features/settings/DmModeContext";
import { createDmStyles } from "./dmStyles";
import { DoneAccessory } from "./DoneAccessory";

const PAGE_SIZE = 40;

type CrBand = { key: string; label: string; min: number; max: number };

const CR_BANDS: CrBand[] = [
  { key: "all", label: "Any CR", min: -1, max: Infinity },
  { key: "0-1", label: "CR 0–1", min: 0, max: 1 },
  { key: "2-4", label: "CR 2–4", min: 2, max: 4 },
  { key: "5-10", label: "CR 5–10", min: 5, max: 10 },
  { key: "11-16", label: "CR 11–16", min: 11, max: 16 },
  { key: "17+", label: "CR 17+", min: 17, max: Infinity },
];

/** "1/2" -> 0.5, "10" -> 10. Unparseable ratings sort as 0. */
export function challengeValue(cr: string): number {
  if (cr.includes("/")) {
    const [num, den] = cr.split("/").map(Number);
    return den ? num / den : 0;
  }
  const value = parseFloat(cr);
  return Number.isFinite(value) ? value : 0;
}

function baseType(type: string): string {
  const word = type.split(/[ (,]/)[0];
  return word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : "Other";
}

function toInt(text: string, fallback: number): number {
  const parsed = parseInt(text, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Browse the SRD bestiary (search + edition / type / CR filters) and add
 * creatures to the encounter. The sheet stays open after each add so a whole
 * encounter can be built in one pass; the quantity stepper adds N numbered
 * copies at once. A second tab adds a hand-made creature.
 */
export function DmCreaturePickerModal({
  visible,
  onClose,
  onChanged,
}: {
  visible: boolean;
  onClose: () => void;
  onChanged: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  const [tab, setTab] = useState<"catalog" | "custom">("catalog");
  const [catalog, setCatalog] = useState<MonsterCatalogRow[]>([]);
  const [search, setSearch] = useState("");
  const { dmEdition } = useDmMode();
  const [typeFilter, setTypeFilter] = useState("all");
  const [crBand, setCrBand] = useState("all");
  const [quantity, setQuantity] = useState(1);
  const [rollHp, setRollHp] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [message, setMessage] = useState<string | null>(null);

  const [customName, setCustomName] = useState("");
  const [customHp, setCustomHp] = useState("10");
  const [customAc, setCustomAc] = useState("10");
  const [customDex, setCustomDex] = useState("10");

  useEffect(() => {
    if (visible && catalog.length === 0) getMonsterCatalog().then(setCatalog);
  }, [visible, catalog.length]);

  const types = useMemo(
    () => Array.from(new Set(catalog.map((m) => baseType(m.type)))).sort(),
    [catalog]
  );

  const filtered = useMemo(() => {
    const band = CR_BANDS.find((b) => b.key === crBand) ?? CR_BANDS[0];
    const needle = search.trim().toLowerCase();
    return catalog
      .filter((m) => {
        if (needle && !m.name.toLowerCase().includes(needle)) return false;
        if (!matchesDmEdition(m.sourceKey, dmEdition)) return false;
        if (typeFilter !== "all" && baseType(m.type) !== typeFilter) return false;
        const cr = challengeValue(m.challengeRating);
        return cr >= band.min && cr <= band.max;
      })
      .sort(
        (a, b) =>
          challengeValue(a.challengeRating) - challengeValue(b.challengeRating) ||
          a.name.localeCompare(b.name)
      );
  }, [catalog, search, dmEdition, typeFilter, crBand]);

  function describeAdded(names: string[]): string {
    if (names.length === 0) return "Nothing added.";
    return names.length === 1 ? `Added ${names[0]}` : `Added ${names[0]} … ${names[names.length - 1]}`;
  }

  async function handlePick(monster: MonsterCatalogRow) {
    const names = await addDmCreatureFromCatalog(monster.id, { quantity, rollHp });
    setMessage(describeAdded(names));
    onChanged();
  }

  async function handleAddCustom() {
    const name = customName.trim();
    if (!name) {
      setMessage("Give the creature a name.");
      return;
    }
    const names = await addCustomDmCreature(
      name,
      Math.max(1, toInt(customHp, 10)),
      toInt(customAc, 10),
      { dexterity: toInt(customDex, 10), quantity }
    );
    setMessage(describeAdded(names));
    setCustomName("");
    onChanged();
  }

  function setFilterAndReset(setter: (value: string) => void, value: string) {
    setter(value);
    setLimit(PAGE_SIZE);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
<DoneAccessory id="done-DmCreaturePickerModal" />
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Creatures</Text>

            <View style={[styles.row, { marginBottom: 10 }]}>
              {(["catalog", "custom"] as const).map((key) => (
                <Pressable
                  key={key}
                  style={[styles.chip, tab === key && styles.chipActive]}
                  onPress={() => setTab(key)}
                >
                  <Text style={[styles.chipText, tab === key && styles.chipTextActive]}>
                    {key === "catalog" ? "SRD bestiary" : "Custom"}
                  </Text>
                </Pressable>
              ))}
              <View style={{ flex: 1 }} />
              <Text style={styles.hint}>Qty</Text>
              <Pressable
                style={styles.squareButton}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Text style={styles.squareButtonText}>−</Text>
              </Pressable>
              <Text style={[styles.sectionTitle, { minWidth: 22, textAlign: "center" }]}>
                {quantity}
              </Text>
              <Pressable
                style={styles.squareButton}
                onPress={() => setQuantity((q) => Math.min(30, q + 1))}
              >
                <Text style={styles.squareButtonText}>+</Text>
              </Pressable>
            </View>

            {tab === "catalog" ? (
              <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" style={{ maxHeight: 460 }} bottomOffset={60}>
                <TextInput
                  style={styles.input}
                  value={search}
                  onChangeText={(text) => setFilterAndReset(setSearch, text)}
                  placeholder="Search by name…"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="none"
                />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                  <View style={styles.row}>
                    {CR_BANDS.map((b) => (
                      <Pressable
                        key={b.key}
                        style={[styles.chip, crBand === b.key && styles.chipActive]}
                        onPress={() => setFilterAndReset(setCrBand, b.key)}
                      >
                        <Text style={[styles.chipText, crBand === b.key && styles.chipTextActive]}>
                          {b.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                  <View style={styles.row}>
                    {["all", ...types].map((t) => (
                      <Pressable
                        key={t}
                        style={[styles.chip, typeFilter === t && styles.chipActive]}
                        onPress={() => setFilterAndReset(setTypeFilter, t)}
                      >
                        <Text style={[styles.chipText, typeFilter === t && styles.chipTextActive]}>
                          {t === "all" ? "Any type" : t}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
                <View style={[styles.row, { marginTop: 8 }]}>
                  <Switch
                    value={rollHp}
                    onValueChange={setRollHp}
                    trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.primary }}
                    thumbColor={theme.colors.primaryText}
                  />
                  <Text style={styles.hint}>Roll hit dice for HP (otherwise average)</Text>
                </View>

                <View style={{ marginTop: 8 }}>
                  {filtered.slice(0, limit).map((m) => (
                    <Pressable
                      key={m.id}
                      style={{
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.border,
                      }}
                      onPress={() => handlePick(m)}
                    >
                      <Text style={styles.sectionTitle}>
                        {m.name}
                        <Text style={styles.hint}>
                          {"  "}
                          {m.sourceKey === "srd-2024" ? "2024" : "2014"}
                        </Text>
                      </Text>
                      <Text style={styles.hint}>
                        {m.size} {m.type} · CR {m.challengeRating} · AC {m.armorClass} · HP{" "}
                        {m.hitPoints}
                      </Text>
                    </Pressable>
                  ))}
                  {catalog.length === 0 && (
                    <Text style={[styles.hint, { textAlign: "center", padding: 20 }]}>
                      Loading bestiary…
                    </Text>
                  )}
                  {catalog.length > 0 && filtered.length === 0 && (
                    <Text style={[styles.hint, { textAlign: "center", padding: 20 }]}>
                      No creatures match those filters.
                    </Text>
                  )}
                  {limit < filtered.length && (
                    <Pressable
                      style={[styles.secondaryButton, { marginTop: 8 }]}
                      onPress={() => setLimit((n) => n + PAGE_SIZE)}
                    >
                      <Text style={styles.secondaryButtonText}>
                        Show more ({filtered.length - limit} remaining)
                      </Text>
                    </Pressable>
                  )}
                </View>
              </KeyboardAwareScrollView>
            ) : (
              <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" style={{ maxHeight: 460 }} contentContainerStyle={{ gap: 8 }} bottomOffset={60}>
                <TextInput
                  style={styles.input}
                  value={customName}
                  onChangeText={setCustomName}
                  placeholder="Name (e.g. Bandit)"
                  placeholderTextColor={theme.colors.textMuted}
                />
                <View style={styles.row}>
                  {[
                    { label: "HP", value: customHp, set: setCustomHp },
                    { label: "AC", value: customAc, set: setCustomAc },
                    { label: "DEX", value: customDex, set: setCustomDex },
                  ].map((field) => (
                    <View key={field.label} style={{ flex: 1 }}>
                      <Text style={styles.hint}>{field.label}</Text>
                      <TextInput
                        style={[styles.input, { textAlign: "center" }]}
                        value={field.value}
                        onChangeText={field.set}
                        keyboardType="number-pad" inputAccessoryViewID="done-DmCreaturePickerModal"
                      />
                    </View>
                  ))}
                </View>
                <Pressable style={styles.primaryButton} onPress={handleAddCustom}>
                  <Text style={styles.primaryButtonText}>
                    Add {quantity > 1 ? `${quantity} creatures` : "creature"}
                  </Text>
                </Pressable>
                <Text style={styles.hint}>
                  Custom creatures roll initiative from their DEX and use freeform dice for
                  everything else.
                </Text>
              </KeyboardAwareScrollView>
            )}

            {message ? (
              <Text style={[styles.hint, { marginTop: 8, color: theme.colors.accent }]}>
                {message}
              </Text>
            ) : null}
            <Pressable style={[styles.secondaryButton, { marginTop: 10 }]} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
