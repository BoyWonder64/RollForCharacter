import { useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "md" | "sm";

type ButtonProps = {
  title?: string;
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  /** For segmented/toggle-style buttons (theme pickers, mode switches, etc). */
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Overrides the face's padding/layout (e.g. extra horizontal padding for emphasis). */
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
};

const PRESS_IN_MS = 60;
const PRESS_OUT_MS = 150;
const PRESS_SCALE = 0.97;

export function Button({
  title,
  children,
  onPress,
  variant = "secondary",
  size = "md",
  disabled = false,
  fullWidth = false,
  selected = false,
  style,
  contentStyle,
  textStyle,
  testID,
}: ButtonProps) {
  const theme = useTheme();
  const [anim] = useState(() => new Animated.Value(0));

  const handlePressIn = () => {
    Animated.timing(anim, { toValue: 1, duration: PRESS_IN_MS, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.timing(anim, { toValue: 0, duration: PRESS_OUT_MS, useNativeDriver: true }).start();
  };

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, PRESS_SCALE] });

  const colors = getVariantColors(theme, variant, selected);
  const sizing = SIZES[size];

  return (
    <Animated.View
      style={[
        styles.face,
        sizing.face,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: theme.radius === 0 ? 1 : StyleSheet.hairlineWidth + 1,
          transform: [{ scale }],
        },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
        contentStyle,
      ]}
    >
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={disabled ? undefined : handlePressIn}
        onPressOut={disabled ? undefined : handlePressOut}
        disabled={disabled}
        testID={testID}
        style={styles.pressable}
      >
        {children ?? (
          <Text
            style={[styles.text, sizing.text, { color: colors.text }, textStyle]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

function getVariantColors(theme: Theme, variant: ButtonVariant, selected: boolean) {
  const { colors } = theme;
  switch (variant) {
    case "primary":
      return { background: colors.primary, border: colors.primary, text: colors.primaryText };
    case "danger":
      return { background: colors.danger, border: colors.danger, text: colors.primaryText };
    case "ghost":
      return selected
        ? { background: colors.surfaceAlt, border: colors.accent, text: colors.accent }
        : { background: "transparent", border: colors.border, text: colors.accent };
    case "secondary":
    default:
      return selected
        ? { background: colors.primary, border: colors.primary, text: colors.primaryText }
        : { background: colors.surface, border: colors.border, text: colors.text };
  }
}

const SIZES = {
  md: {
    face: { paddingVertical: 12, paddingHorizontal: 16 },
    text: { fontSize: 15 },
  },
  sm: {
    face: { paddingVertical: 8, paddingHorizontal: 12 },
    text: { fontSize: 13 },
  },
} as const;

const styles = StyleSheet.create({
  face: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  fullWidth: { alignSelf: "stretch", width: "100%" },
  disabled: { opacity: 0.45 },
  pressable: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
