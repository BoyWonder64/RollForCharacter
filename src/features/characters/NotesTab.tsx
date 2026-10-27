import { useCallback, useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  addCampaignItem,
  addCampaignNote,
  listCampaignItems,
  listCampaignNotes,
  removeCampaignItem,
  removeCampaignNote,
  updateCampaignNote,
} from "./campaignRepo";
import { CampaignItemModal } from "../../components/CampaignItemModal";
import { CampaignNoteModal, type CampaignNoteDraft } from "../../components/CampaignNoteModal";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";
import type { Character } from "../../types/models";
import { useIconSettings } from "../icons/IconSettingsContext";
import { getCampaignItemIcon, type CampaignItemIconId } from "../icons/iconAssets";

type ItemRow = Awaited<ReturnType<typeof listCampaignItems>>[number];
type NoteRow = Awaited<ReturnType<typeof listCampaignNotes>>[number];

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function NotesTab({ character }: { character: Character }) {
  const characterId = character.id;
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { iconsEnabled, iconStyle } = useIconSettings();

  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteRow | null>(null);

  const [items, setItems] = useState<ItemRow[]>([]);
  const [addItemOpen, setAddItemOpen] = useState(false);

  const scrollIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "scroll") : undefined;
  const chestIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "chest") : undefined;

  const refreshNotes = useCallback(() => {
    listCampaignNotes(characterId).then(setNotes);
  }, [characterId]);

  const refreshItems = useCallback(() => {
    listCampaignItems(characterId).then(setItems);
  }, [characterId]);

  useFocusEffect(
    useCallback(() => {
      refreshNotes();
      refreshItems();
    }, [refreshNotes, refreshItems])
  );

  function handleOpenAddNote() {
    setEditingNote(null);
    setNoteModalOpen(true);
  }

  function handleOpenEditNote(note: NoteRow) {
    setEditingNote(note);
    setNoteModalOpen(true);
  }

  async function handleConfirmNote(draft: CampaignNoteDraft) {
    if (editingNote) {
      await updateCampaignNote(editingNote.id, draft);
    } else {
      await addCampaignNote(characterId, draft);
    }
    setNoteModalOpen(false);
    setEditingNote(null);
    refreshNotes();
  }

  function handleRemoveNote(noteId: number, subject: string) {
    Alert.alert("Delete note?", `Delete "${subject}" from this character's campaign history?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeCampaignNote(noteId);
          refreshNotes();
        },
      },
    ]);
  }

  async function handleAddItem(input: { name: string; icon: CampaignItemIconId; description: string }) {
    await addCampaignItem(characterId, input);
    setAddItemOpen(false);
    refreshItems();
  }

  function handleRemoveItem(itemId: number, name: string) {
    Alert.alert("Remove item?", `Remove "${name}" from this character's campaign items?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removeCampaignItem(itemId);
          refreshItems();
        },
      },
    ]);
  }

  return (
    <View>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleRow}>
          {scrollIcon && <Image source={scrollIcon} style={styles.sectionIcon} resizeMode="contain" />}
          <Text style={styles.sectionTitle}>Campaign Notes</Text>
        </View>
        <Pressable style={styles.actionLink} onPress={handleOpenAddNote}>
          <Text style={styles.actionLinkText}>+ Add Note</Text>
        </Pressable>
      </View>

      {notes.length === 0 ? (
        <Text style={styles.empty}>No campaign notes yet.</Text>
      ) : (
        notes.map((note) => (
          <View key={note.id} style={styles.noteCard}>
            <View style={styles.noteHeaderRow}>
              <Text style={styles.noteSubject}>{note.subject}</Text>
              <Pressable onPress={() => handleOpenEditNote(note)}>
                <Text style={styles.editLink}>Edit</Text>
              </Pressable>
            </View>
            <Text style={styles.noteDate}>
              {formatDate(note.updatedAt)}
              {note.updatedAt !== note.createdAt ? " (edited)" : ""}
            </Text>
            {note.body ? <Text style={styles.noteBody}>{note.body}</Text> : null}
            <Pressable
              style={styles.deleteLinkWrap}
              onPress={() => handleRemoveNote(note.id, note.subject)}
            >
              <Text style={styles.removeLink}>Delete</Text>
            </Pressable>
          </View>
        ))
      )}

      <CampaignNoteModal
        visible={noteModalOpen}
        initial={editingNote ? { subject: editingNote.subject, body: editingNote.body } : undefined}
        onClose={() => {
          setNoteModalOpen(false);
          setEditingNote(null);
        }}
        onConfirm={handleConfirmNote}
      />

      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleRow}>
          {chestIcon && <Image source={chestIcon} style={styles.sectionIcon} resizeMode="contain" />}
          <Text style={styles.sectionTitle}>Special Items</Text>
        </View>
        <Pressable style={styles.actionLink} onPress={() => setAddItemOpen(true)}>
          <Text style={styles.actionLinkText}>+ Add Item</Text>
        </Pressable>
      </View>

      {items.length === 0 ? (
        <Text style={styles.empty}>No special items yet.</Text>
      ) : (
        items.map((item) => {
          const icon = iconsEnabled
            ? getCampaignItemIcon(iconStyle, item.icon as CampaignItemIconId)
            : undefined;
          return (
            <View key={item.id} style={styles.itemRow}>
              {icon && <Image source={icon} style={styles.itemIcon} resizeMode="contain" />}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.description ? (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                ) : null}
              </View>
              <Pressable onPress={() => handleRemoveItem(item.id, item.name)}>
                <Text style={styles.removeLink}>Remove</Text>
              </Pressable>
            </View>
          );
        })
      )}

      <CampaignItemModal
        visible={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        onConfirm={handleAddItem}
      />
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 10,
      marginBottom: 10,
    },
    sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    sectionIcon: { width: 18, height: 18 },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    actionLink: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    actionLinkText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    empty: { color: theme.colors.textMuted, fontFamily: theme.displayFontFamily },
    noteCard: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      marginBottom: 8,
    },
    noteHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    noteSubject: {
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      flex: 1,
    },
    editLink: {
      color: theme.colors.accent,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    noteDate: {
      color: theme.colors.textMuted,
      fontSize: 11,
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    noteBody: {
      color: theme.colors.text,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 8,
      fontFamily: theme.displayFontFamily,
    },
    deleteLinkWrap: { alignSelf: "flex-end", marginTop: 8 },
    itemRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      marginBottom: 8,
      gap: 10,
    },
    itemIcon: { width: 32, height: 32 },
    itemInfo: { flex: 1 },
    itemName: {
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    itemDescription: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    removeLink: {
      color: theme.colors.danger,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
  });
}
