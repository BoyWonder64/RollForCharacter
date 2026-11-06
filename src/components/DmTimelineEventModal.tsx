import { useMemo, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Text, TextInput } from "./AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTheme } from "../theme/ThemeContext";
import { createDmStyles } from "./dmStyles";
import type { DmTimelineEventInput } from "../features/dm/dmNotesRepo";

type DmTimelineEventModalProps = {
  visible: boolean;
  initial?: DmTimelineEventInput;
  onClose: () => void;
  onConfirm: (draft: DmTimelineEventInput) => void;
};

export function DmTimelineEventModal({
  visible,
  initial,
  onClose,
  onConfirm,
}: DmTimelineEventModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          {visible && (
            <DmTimelineEventModalForm initial={initial} onClose={onClose} onConfirm={onConfirm} />
          )}
        </View>
      </View>
    </Modal>
  );
}

function DmTimelineEventModalForm({
  initial,
  onClose,
  onConfirm,
}: Omit<DmTimelineEventModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);
  // The parent only mounts this form while the modal is visible (see
  // DmTimelineEventModal above), so a fresh `initial` always means a fresh
  // mount -- no effect needed to re-seed these on change.
  const [title, setTitle] = useState(initial?.title ?? "");
  const [eventDate, setEventDate] = useState(initial?.eventDate ?? "");
  const [body, setBody] = useState(initial?.body ?? "");

  function handleConfirm() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onConfirm({ title: trimmedTitle, eventDate: eventDate.trim(), body: body.trim() });
  }

  return (
    <View style={styles.modalCard}>
      <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" bottomOffset={60}>
        <Text style={styles.modalTitle}>{initial ? "Edit Event" : "Add Timeline Event"}</Text>

        <Text style={[styles.subTitle, { marginTop: 0 }]}>Event</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. The party razed the goblin camp"
          placeholderTextColor={theme.colors.textMuted}
          autoFocus
        />

        <Text style={styles.subTitle}>When</Text>
        <TextInput
          style={styles.input}
          value={eventDate}
          onChangeText={setEventDate}
          placeholder="e.g. Session 4, or day 15 of the second month"
          placeholderTextColor={theme.colors.textMuted}
        />

        <Text style={styles.subTitle}>Details</Text>
        <TextInput
          style={[styles.input, { minHeight: 100, textAlignVertical: "top" }]}
          value={body}
          onChangeText={setBody}
          placeholder="What happened, and what it sets up…"
          placeholderTextColor={theme.colors.textMuted}
          multiline
        />
      </KeyboardAwareScrollView>

      <View style={[styles.row, { marginTop: 16 }]}>
        <Pressable style={[styles.secondaryButton, { flex: 1 }]} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={[styles.primaryButton, { flex: 1 }]} onPress={handleConfirm}>
          <Text style={styles.primaryButtonText}>{initial ? "Save" : "Add"}</Text>
        </Pressable>
      </View>
    </View>
  );
}
