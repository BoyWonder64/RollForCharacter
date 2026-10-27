import type { LanguageDefinition } from "./types";

// Shared between the 2014 and 2024 5e SRDs -- both use the same language
// roster (the 2024 SRD's Standard/Rare split, verified against the real
// document via the open5e v2 API, `document__key=srd-2024`, under
// "Step 2: Character Origin" -> "Choose Languages"). The 2024 SRD adds
// Common Sign Language to the Standard table; 2014 doesn't call it out
// separately but it isn't wrong to offer it there too, so it's listed once
// here rather than forked per edition. 3.5e isn't wired to this catalog --
// its own SRD uses a different, non-overlapping language list (Draconic,
// Dwarven, Gnoll, etc. with different names/splits) that hasn't been
// sourced yet, so it still falls back to the old freetext field.
export const SRD_LANGUAGES: LanguageDefinition[] = [
  { id: "common", name: "Common", rare: false, typicalSpeakers: "Spoken by humans, and as a shared trade tongue almost everywhere." },
  {
    id: "common-sign-language",
    name: "Common Sign Language",
    rare: false,
    typicalSpeakers: "A silent, gestural language understood across many communities.",
  },
  {
    id: "draconic",
    name: "Draconic",
    rare: false,
    typicalSpeakers:
      "Thought to be one of the oldest languages, often used in the study of magic. Harsh-sounding, full of hard consonants and sibilants.",
  },
  {
    id: "dwarvish",
    name: "Dwarvish",
    rare: false,
    typicalSpeakers:
      "Spoken by dwarves. Full of hard consonants and guttural sounds.",
  },
  {
    id: "elvish",
    name: "Elvish",
    rare: false,
    typicalSpeakers:
      "Spoken by elves. Fluid, with subtle intonations and intricate grammar; rich in songs and poetry.",
  },
  { id: "giant", name: "Giant", rare: false, typicalSpeakers: "Spoken by giants and ogres." },
  {
    id: "gnomish",
    name: "Gnomish",
    rare: false,
    typicalSpeakers:
      "Spoken by gnomes, using the Dwarvish script. Known for technical treatises and catalogs of natural lore.",
  },
  {
    id: "goblin",
    name: "Goblin",
    rare: false,
    typicalSpeakers: "Spoken by goblinoids -- goblins, hobgoblins, and bugbears.",
  },
  {
    id: "halfling",
    name: "Halfling",
    rare: false,
    typicalSpeakers:
      "Spoken by halflings. Not secret, but rarely shared with outsiders; a strong oral tradition with little written literature.",
  },
  {
    id: "orc",
    name: "Orc",
    rare: false,
    typicalSpeakers:
      "Spoken by orcs. Harsh and grating, with no script of its own -- written in the Dwarvish script.",
  },
  {
    id: "abyssal",
    name: "Abyssal",
    rare: true,
    typicalSpeakers: "Spoken by demons and other denizens of the Abyss.",
  },
  {
    id: "celestial",
    name: "Celestial",
    rare: true,
    typicalSpeakers: "Spoken by angels and other celestial beings.",
  },
  {
    id: "deep-speech",
    name: "Deep Speech",
    rare: true,
    typicalSpeakers: "An alien tongue spoken by aberrations such as mind flayers.",
  },
  {
    id: "druidic",
    name: "Druidic",
    rare: true,
    typicalSpeakers:
      "A secret language known only to druids, who are sworn never to teach it to non-druids.",
  },
  {
    id: "infernal",
    name: "Infernal",
    rare: true,
    typicalSpeakers: "Spoken by devils and other denizens of the Nine Hells.",
  },
  {
    id: "primordial",
    name: "Primordial",
    rare: true,
    typicalSpeakers:
      "Spoken by elementals; includes the Aquan, Auran, Ignan, and Terran dialects.",
  },
  { id: "sylvan", name: "Sylvan", rare: true, typicalSpeakers: "Spoken by fey creatures." },
  {
    id: "thieves-cant",
    name: "Thieves' Cant",
    rare: true,
    typicalSpeakers:
      "A secret mix of dialect, jargon, and code known only to rogues and their contacts.",
  },
  {
    id: "undercommon",
    name: "Undercommon",
    rare: true,
    typicalSpeakers: "The trade language of the Underdark.",
  },
];
