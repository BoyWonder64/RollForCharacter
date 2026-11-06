import { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, View } from "react-native";
import { Text } from "./AppText";
import { useTheme } from "../theme/ThemeContext";

// Middle row of the GUI loading-spinner sheet (8-wedge wheel), sliced into 5 frames.
const FRAMES = [
  require("../../assets/ui/loading/wedge-0.png"),
  require("../../assets/ui/loading/wedge-1.png"),
  require("../../assets/ui/loading/wedge-2.png"),
  require("../../assets/ui/loading/wedge-3.png"),
  require("../../assets/ui/loading/wedge-4.png"),
];

const FRAME_MS = 140;
const MESSAGE_MS = 2600;

const MESSAGES = [
  "Rolling for initiative…",
  "Sharpening swords…",
  "Convincing the bard to stop singing…",
  "Consulting the ancient tomes…",
  "Checking for traps…",
  "Counting copper pieces…",
  "Negotiating with the Dungeon Master…",
  "Polishing your armor…",
  "Waking the sleeping wizard…",
  "Arguing about whether a hot dog is a sandwich…",
  "Packing 50 feet of hempen rope…",
  "Rerolling that natural 1 behind the screen…",
  "Naming the tavern you'll start in…",
  "Making sure the rogue isn't pickpocketing you…",
  "Inscribing your legend…",
];

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Full-screen dimmed overlay shown while a character is being written to the database. Cycles the
 * pixel-art wedge spinner frames and rotates through flavor lines so a long wait feels alive.
 */
export function CreatingOverlay({ visible }: { visible: boolean }) {
  const theme = useTheme();
  const [frame, setFrame] = useState(0);
  const [order] = useState(() => shuffled(MESSAGES));
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const frameTimer = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), FRAME_MS);
    const messageTimer = setInterval(() => setMessageIndex((i) => i + 1), MESSAGE_MS);
    return () => {
      clearInterval(frameTimer);
      clearInterval(messageTimer);
    };
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <Image source={FRAMES[frame]} style={styles.spinner} resizeMode="stretch" fadeDuration={0} />
        <Text style={[styles.title, { color: theme.colors.text }]}>Creating your character</Text>
        <Text style={[styles.message, { color: theme.colors.textMuted }]}>
          {order[messageIndex % order.length]}
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  // 48px source frame at 3x, with nearest-neighbour-ish scaling for crisp pixels on web.
  spinner: { width: 144, height: 144, marginBottom: 24 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  message: { fontSize: 15, textAlign: "center", minHeight: 40 },
});
