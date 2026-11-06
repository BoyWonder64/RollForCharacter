import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  addDmNote,
  addDmTimelineEvent,
  completeDmOnboarding,
  createDmCampaign,
  deleteDmCampaign,
  isDmOnboarded,
  loadDmCampaigns,
  renameDmCampaign,
  setActiveDmCampaign,
  type DmCampaigns,
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

  const [campaigns, setCampaigns] = useState<DmCampaigns | null>(null);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [campaignEdit, setCampaignEdit] = useState<"new" | "rename" | null>(null);
  const activeCampaign = campaigns?.active ?? "";

  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteRow | null>(null);

  const [events, setEvents] = useState<TimelineRow[]>([]);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineRow | null>(null);

  const refreshNotes = useCallback(() => {
    if (!activeCampaign) return;
    listDmNotes(activeCampaign).then(setNotes);
  }, [activeCampaign]);

  const refreshEvents = useCallback(() => {
    if (!activeCampaign) return;
    listDmTimelineEvents(activeCampaign).then(setEvents);
  }, [activeCampaign]);

  useEffect(() => {
    (async () => {
      const wasOnboarded = await isDmOnboarded();
      setOnboarded(wasOnboarded);
      // Pre-campaign notes are adopted into the first campaign once onboarding completes.
      if (wasOnboarded) setCampaigns(await loadDmCampaigns());
    })();
  }, []);

  useEffect(() => {
    if (!campaigns) return;
    migrateLegacySessionNotesIfNeeded(campaigns.active).then(refreshNotes);
  }, [campaigns, refreshNotes]);

  async function handleFinishOnboarding() {
    setCampaigns(await completeDmOnboarding(nameDraft));
    setOnboarded(true);
    setNameDraft("");
  }

  async function handleSubmitCampaignName() {
    if (campaignEdit === "new") {
      setCampaigns(await createDmCampaign(nameDraft));
    } else if (campaignEdit === "rename" && campaigns) {
      setCampaigns(await renameDmCampaign(campaigns.active, nameDraft));
    }
    setCampaignEdit(null);
    setNameDraft("");
  }

  function handleDeleteCampaign() {
    if (!campaigns || campaigns.names.length <= 1) return;
    Alert.alert(
      "Delete campaign?",
      `Delete "${campaigns.active}" and all of its notes and timeline? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => setCampaigns(await deleteDmCampaign(campaigns.active)),
        },
      ]
    );
  }

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
      await addDmNote(draft, activeCampaign);
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
      await addDmTimelineEvent(draft, activeCampaign);
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

  if (onboarded === null) return null;

  if (!onboarded) {
    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Welcome, Dungeon Master</Text>
        <Text style={[styles.hint, { marginVertical: 8 }]}>
          Notes and your timeline are kept per campaign, so you can run more than one. Name your
          first campaign to get started. You can rename it or add more any time.
        </Text>
        <TextInput
          style={styles.input}
          value={nameDraft}
          onChangeText={setNameDraft}
          placeholder="e.g. Curse of the Crimson Throne"
          placeholderTextColor={theme.colors.textMuted}
        />
        <Pressable style={[styles.primaryButton, { marginTop: 12 }]} onPress={handleFinishOnboarding}>
          <Text style={styles.primaryButtonText}>Start Campaign</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.subTitle}>Campaign</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {campaigns?.names.map((name) => (
            <Pressable
              key={name}
              style={[styles.chip, name === activeCampaign && styles.chipActive]}
              onPress={async () => setCampaigns(await setActiveDmCampaign(name))}
            >
              <Text style={[styles.chipText, name === activeCampaign && styles.chipTextActive]}>
                {name}
              </Text>
            </Pressable>
          ))}
          <Pressable
            style={styles.chip}
            onPress={() => {
              setNameDraft("");
              setCampaignEdit("new");
            }}
          >
            <Text style={styles.chipText}>+ New</Text>
          </Pressable>
        </View>
      </ScrollView>

      {campaignEdit ? (
        <View style={[styles.row, { marginTop: 8 }]}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={nameDraft}
            onChangeText={setNameDraft}
            placeholder={campaignEdit === "new" ? "New campaign name" : "Campaign name"}
            placeholderTextColor={theme.colors.textMuted}
            autoFocus
          />
          <Pressable style={styles.primaryButton} onPress={handleSubmitCampaignName}>
            <Text style={styles.primaryButtonText}>Save</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => setCampaignEdit(null)}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
        </View>
      ) : (
        <View style={[styles.row, { marginTop: 8, gap: 16 }]}>
          <Pressable
            onPress={() => {
              setNameDraft(activeCampaign);
              setCampaignEdit("rename");
            }}
          >
            <Text style={[styles.hint, { color: theme.colors.accent, fontWeight: "700" }]}>
              Rename
            </Text>
          </Pressable>
          {campaigns && campaigns.names.length > 1 ? (
            <Pressable onPress={handleDeleteCampaign}>
              <Text style={styles.bad}>Delete campaign</Text>
            </Pressable>
          ) : null}
        </View>
      )}

      <View style={[styles.headerRow, { marginTop: 16 }]}>
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
