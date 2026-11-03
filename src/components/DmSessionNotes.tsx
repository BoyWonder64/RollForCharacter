import { useEffect, useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../theme/ThemeContext";
import { createDmStyles } from "./dmStyles";

const NOTES_KEY = "rollforcharacter.dm.sessionNotes";

/**
 * Freeform notes for the whole session (NPC names, where the party left
 * off, plot reminders) -- separate from each creature's own notes field,
 * and from saved encounters. Persisted to AsyncStorage rather than the
 * encounter DB tables since it isn't part of any one encounter snapshot.
 */
export function DmSessionNotes() {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  const [notes, setNotes] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(NOTES_KEY)
      .then((stored) => setNotes(stored ?? ""))
      .finally(() => setLoaded(true));
  }, []);

  function persist(text: string) {
    AsyncStorage.setItem(NOTES_KEY, text).catch(() => {});
  }

  return (
    <View>
      <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Session notes</Text>
      {loaded && (
        <TextInput
          style={[styles.input, { minHeight: 300, textAlignVertical: "top" }]}
          value={notes}
          onChangeText={setNotes}
          onEndEditing={() => persist(notes)}
          placeholder="NPC names, where the party left off, plot reminders…"
          placeholderTextColor={theme.colors.textMuted}
          multiline
        />
      )}
    </View>
  );
}
