import { InputAccessoryView, Keyboard, Platform, Pressable, StyleSheet, View } from "react-native";
import { Text } from "./AppText";
import { useTheme } from "../theme/ThemeContext";

/**
 * iOS-only "Done" bar attached directly to the top of the keyboard. iOS number pads have no
 * Return key, so this is the standard way to put them away. Renders nothing on Android (its
 * number pad already has a check key).
 *
 * Mount one per screen/modal and give each numeric TextInput the same `inputAccessoryViewID`.
 * It must live inside the same Modal as the inputs it serves.
 */
export function DoneAccessory({ id }: { id: string }) {
  const theme = useTheme();
  if (Platform.OS !== "ios") return null;
  return (
    <InputAccessoryView nativeID={id}>
      <View
        style={[
          styles.bar,
          { backgroundColor: theme.colors.surfaceAlt, borderTopColor: theme.colors.border },
        ]}
      >
        <Pressable onPress={() => Keyboard.dismiss()} hitSlop={8} style={styles.button}>
          <Text style={[styles.text, { color: theme.colors.accent }]}>Done</Text>
        </Pressable>
      </View>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
  },
  button: { paddingVertical: 10, paddingHorizontal: 8 },
  text: { fontSize: 17, fontWeight: "600" },
});
