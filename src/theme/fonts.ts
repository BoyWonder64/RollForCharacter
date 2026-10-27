export type FontChoiceId =
  | "auto"
  | "system"
  | "cormorantGaramond"
  | "cinzel"
  | "caveat"
  | "specialElite"
  | "orbitron"
  | "medievalPixel";

export const FONT_CHOICES: Record<FontChoiceId, { label: string; fontFamily?: string }> = {
  auto: { label: "Automatic (matches theme)" },
  system: { label: "System Default" },
  cormorantGaramond: {
    label: "Manuscript",
    fontFamily: "CormorantGaramond_700Bold",
  },
  cinzel: { label: "Torchlight", fontFamily: "Cinzel_700Bold" },
  caveat: { label: "Journal", fontFamily: "Caveat_700Bold" },
  specialElite: { label: "Steampunk", fontFamily: "SpecialElite_400Regular" },
  orbitron: { label: "Sci-Fi", fontFamily: "Orbitron_700Bold" },
  // Alkhemikal: free for commercial use with attribution (see assets/fonts/Alkhemikal-LICENSE.txt).
  medievalPixel: { label: "Medieval Pixel", fontFamily: "Alkhemikal" },
};

export const FONT_CHOICE_ORDER: FontChoiceId[] = [
  "auto",
  "system",
  "cormorantGaramond",
  "cinzel",
  "caveat",
  "specialElite",
  "orbitron",
  "medievalPixel",
];
