import {
  StyleSheet,
  Text as RNText,
  TextInput as RNTextInput,
  type TextInputProps,
  type TextProps,
  type TextStyle,
} from "react-native";
import { useFontScale } from "../features/settings/FontScaleContext";

const DEFAULT_FONT_SIZE = 14;

// Most sizes in the app are hardcoded in StyleSheets, so the user's font-size
// setting is applied here: every Text/TextInput multiplies its fontSize (and
// lineHeight) by the scale. Import Text/TextInput from this file, not from
// react-native.
function scaleStyle<T>(style: T, scale: number): T {
  if (scale === 1) return style;
  const flat = (StyleSheet.flatten(style as never) ?? {}) as TextStyle;
  return {
    ...flat,
    fontSize: (flat.fontSize ?? DEFAULT_FONT_SIZE) * scale,
    ...(flat.lineHeight != null ? { lineHeight: flat.lineHeight * scale } : null),
  } as T;
}

export function Text({ style, ...rest }: TextProps) {
  const { fontScale } = useFontScale();
  return <RNText {...rest} style={scaleStyle(style, fontScale)} />;
}

export function TextInput({ style, ...rest }: TextInputProps) {
  const { fontScale } = useFontScale();
  return <RNTextInput {...rest} style={scaleStyle(style, fontScale)} />;
}
