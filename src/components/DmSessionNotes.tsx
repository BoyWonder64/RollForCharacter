import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  addDmNote,
  addDmTimelineEvent,
  listDmNotes,
  listDmTimelineEvents,
  migrateLegacySessionNotesIfNeeded,
  removeDmNote,
  removeDmTimelineEvent,
  updateDmNote,
  updateDmTimelineEvent,
} from "../features/dm/dmNotesRepo";
import type { DmTimelineEventInput } from "../features/dm/dmNotesRepo";
import { CampaignNoteModal, type CampaignNoteDraft } from "./CampaignNoteModal";
import { DmTimelineEventModal } from "./DmTimelineEventModal";
import { useTheme } from "../theme/ThemeContext";
import { createDmStyles } from "./dmStyles";

type NoteRow = Awaited<ReturnType<typeof listDmNotes>>[number];
type TimelineRow = Awaited<ReturnType<typeof listDmTimelineEvents>>[number];

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

/**
 * DM mode's Notes tab: a journal of freeform session notes (NPC names,
 * where the party left off, plot reminders -- each its own entry so older
 * ones stay readable instead of one ever-growing textbox) plus a running
 * timeline of campaign events. Both are global to DM mode, not tied to any
 * one character or saved encounter.
 */
export function DmSessionNotes() {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteRow | null>(null);

  const [events, setEvents] = useState<TimelineRow[]>([]);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineRow | null>(null);

  const refreshNotes = useCallback(() => {
    listDmNotes().then(setNotes);
  }, []);

  const refreshEvents = useCallback(() => {
    listDmTimelineEvents().then(setEvents);
  }, []);

  useEffect(() => {
    migrateLegacySessionNotesIfNeeded().then(refreshNotes);
  }, [refreshNotes]);

  useFocusEffect(
    useCallback(() => {
      refreshNotes();
      refreshEvents();
    }, [refreshNotes, refreshEvents])
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
      await updateDmNote(editingNote.id, draft);
    } else {
      await addDmNote(draft);
    }
    setNoteModalOpen(false);
    setEditingNote(null);
    refreshNotes();
  }

  function handleRemoveNote(noteId: number, subject: string) {
    Alert.alert("Delete note?", `Delete "${subject}" from the session notes?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeDmNote(noteId);
          refreshNotes();
        },
      },
    ]);
  }

  function handleOpenAddEvent() {
    setEditingEvent(null);
    setEventModalOpen(true);
  }

  function handleOpenEditEvent(event: TimelineRow) {
    setEditingEvent(event);
    setEventModalOpen(true);
  }

  async function handleConfirmEvent(draft: DmTimelineEventInput) {
    if (editingEvent) {
      await updateDmTimelineEvent(editingEvent.id, draft);
    } else {
      await addDmTimelineEvent(draft);
    }
    setEventModalOpen(false);
    setEditingEvent(null);
    refreshEvents();
  }

  function handleRemoveEvent(eventId: number, title: string) {
    Alert.alert("Delete event?", `Delete "${title}" from the timeline?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeDmTimelineEvent(eventId);
          refreshEvents();
        },
      },
    ]);
  }

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Session notes</Text>
        <Pressable style={styles.primaryButton} onPress={handleOpenAddNote}>
          <Text style={styles.primaryButtonText}>+ Add Note</Text>
        </Pressable>
      </View>

      {notes.length === 0 ? (
        <Text style={styles.hint}>
          No notes yet. NPC names, where the party left off, plot reminders…
        </Text>
      ) : (
        notes.map((note) => (
          <View key={note.id} style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={[styles.sectionTitle, { fontSize: 15, flex: 1 }]} numberOfLines={1}>
                {note.subject}
              </Text>
              <Pressable onPress={() => handleOpenEditNote(note)}>
                <Text style={[styles.hint, { color: theme.colors.accent, fontWeight: "700" }]}>
                  Edit
                </Text>
              </Pressable>
            </View>
            <Text style={[styles.hint, { fontSize: 11, marginTop: -4 }]}>
              {formatDate(note.updatedAt)}
              {note.updatedAt !== note.createdAt ? " (edited)" : ""}
            </Text>
            {note.body ? (
              <Text style={{ color: theme.colors.text, fontSize: 13, lineHeight: 19, marginTop: 8 }}>
                {note.body}
              </Text>
            ) : null}
            <Pressable
              style={{ alignSelf: "flex-end", marginTop: 8 }}
              onPress={() => handleRemoveNote(note.id, note.subject)}
            >
              <Text style={styles.bad}>Delete</Text>
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

      <View style={[styles.headerRow, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <Pressable style={styles.primaryButton} onPress={handleOpenAddEvent}>
          <Text style={styles.primaryButtonText}>+ Add Event</Text>
        </Pressable>
      </View>

      {events.length === 0 ? (
        <Text style={styles.hint}>No events logged yet. Build a timeline as the campaign goes.</Text>
      ) : (
        events.map((event, index) => (
          <View key={event.id} style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={[styles.sectionTitle, { fontSize: 15, flex: 1 }]} numberOfLines={1}>
                {index + 1}. {event.title}
              </Text>
              <Pressable onPress={() => handleOpenEditEvent(event)}>
                <Text style={[styles.hint, { color: theme.colors.accent, fontWeight: "700" }]}>
                  Edit
                </Text>
              </Pressable>
            </View>
            {event.eventDate ? (
              <Text style={[styles.hint, { fontSize: 11, marginTop: -4 }]}>{event.eventDate}</Text>
            ) : null}
            {event.body ? (
              <Text style={{ color: theme.colors.text, fontSize: 13, lineHeight: 19, marginTop: 8 }}>
                {event.body}
              </Text>
            ) : null}
            <Pressable
              style={{ alignSelf: "flex-end", marginTop: 8 }}
              onPress={() => handleRemoveEvent(event.id, event.title)}
            >
              <Text style={styles.bad}>Delete</Text>
            </Pressable>
          </View>
        ))
      )}

      <DmTimelineEventModal
        visible={eventModalOpen}
        initial={
          editingEvent
            ? { title: editingEvent.title, eventDate: editingEvent.eventDate, body: editingEvent.body }
            : undefined
        }
        onClose={() => {
          setEventModalOpen(false);
          setEditingEvent(null);
        }}
        onConfirm={handleConfirmEvent}
      />
    </View>
  );
}
