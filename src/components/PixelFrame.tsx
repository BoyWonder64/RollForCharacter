import { Image, Platform, StyleSheet, View, type ImageSourcePropType, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { Text } from "./AppText";
import { useTheme } from "../theme/ThemeContext";

type SliceSpec = {
  source: ImageSourcePropType;
  srcW: number;
  srcH: number;
  /** Fixed source pixels on each side; the remainder stretches. */
  left: number;
  right: number;
  top: number;
  bottom: number;
  scale: number;
};

// Keep pixel art crisp on web; native scales with the default filter.
const CRISP = Platform.OS === "web" ? ({ imageRendering: "pixelated" } as object) : null;

/**
 * Draws a 9-slice image filling its parent (absolute, non-interactive).
 * Each piece is an overflow-hidden window onto the same image: fixed-size
 * corners keep integer pixel scale, edges and centre stretch via percentages,
 * so it works the same on iOS, Android and web (RN's `capInsets` is iOS-only).
 */
function NineSlice({ source, srcW, srcH, left, right, top, bottom, scale }: SliceSpec) {
  const cols = [
    { sx: 0, sw: left, fixed: left > 0 },
    { sx: left, sw: srcW - left - right, fixed: false },
    { sx: srcW - right, sw: right, fixed: right > 0 },
  ];
  const rows = [
    { sy: 0, sh: top, fixed: top > 0 },
    { sy: top, sh: srcH - top - bottom, fixed: false },
    { sy: srcH - bottom, sh: bottom, fixed: bottom > 0 },
  ];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {rows.map((row, r) =>
        row.sh <= 0 ? null : (
          <View
            key={r}
            style={{ flexDirection: "row", ...(r === 1 ? { flex: 1 } : { height: row.sh * scale }) }}
          >
            {cols.map((col, c) => {
              if (col.sw <= 0) return null;
              const imgW = col.fixed ? srcW * scale : `${(srcW / col.sw) * 100}%`;
              const imgL = col.fixed ? -col.sx * scale : `${(-col.sx / col.sw) * 100}%`;
              const imgH = row.fixed ? srcH * scale : `${(srcH / row.sh) * 100}%`;
              const imgT = row.fixed ? -row.sy * scale : `${(-row.sy / row.sh) * 100}%`;
              return (
                <View
                  key={c}
                  style={[
                    { overflow: "hidden" },
                    col.fixed ? { width: col.sw * scale } : { flex: 1 },
                  ]}
                >
                  <Image
                    source={source}
                    resizeMode="stretch"
                    style={[
                      { position: "absolute", width: imgW, height: imgH, left: imgL, top: imgT } as ViewStyle,
                      CRISP,
                    ]}
                  />
                </View>
              );
            })}
          </View>
        )
      )}
    </View>
  );
}

/**
 * Pixel border drawn over a box. Renders nothing when the active theme has no
 * pixel kit, so callers can always include it. The parent needs
 * `position: relative` (the default) and should drop its own border.
 */
export function PixelFrameOverlay({ scale = 1 }: { scale?: number }) {
  const { pixel } = useTheme();
  if (!pixel) return null;
  const s = pixel.frameSlice;
  return (
    <NineSlice
      source={pixel.frame}
      srcW={pixel.frameSize.width}
      srcH={pixel.frameSize.height}
      left={s}
      right={s}
      top={s}
      bottom={s}
      scale={scale}
    />
  );
}

/** Border width callers should use: pixel themes draw their own frame. */
export function useBoxBorderWidth(): number {
  return useTheme().pixel ? 0 : 1;
}

type PixelBannerProps = {
  title: string;
  /** "scroll" (rod-ended, default) or "ribbon" (tailed). */
  variant?: "scroll" | "ribbon";
  /** Stretch across the parent instead of hugging the text. */
  fullWidth?: boolean;
  scale?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/** Banner with centred text; falls back to plain text on non-pixel themes. */
export function PixelBanner({
  title,
  variant = "scroll",
  fullWidth = false,
  scale = 2,
  style,
  textStyle,
}: PixelBannerProps) {
  const theme = useTheme();
  const { pixel, colors } = theme;

  if (!pixel) {
    return (
      <Text
        style={[
          { color: colors.text, fontSize: 16, fontWeight: "700", fontFamily: theme.displayFontFamily },
          textStyle,
        ]}
      >
        {title}
      </Text>
    );
  }

  const spec = pixel[variant];
  const h = spec.height * scale;
  return (
    <View
      style={[{ height: h, alignSelf: fullWidth ? "stretch" : "flex-start", maxWidth: "100%" }, style]}
    >
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { flexDirection: "row" }]}>
        <Image
          source={spec.left}
          resizeMode="stretch"
          style={[{ width: spec.cap * scale, height: h }, CRISP]}
        />
        {/* Overlaps each cap by one source pixel so the seams can't show a hairline. */}
        <Image
          source={spec.mid}
          resizeMode="stretch"
          style={[{ flex: 1, height: h, marginHorizontal: -scale }, CRISP]}
        />
        <Image
          source={spec.right}
          resizeMode="stretch"
          style={[{ width: spec.cap * scale, height: h }, CRISP]}
        />
      </View>
      <View
        style={{
          height: spec.bodyHeight * scale,
          paddingHorizontal: spec.textInset * scale,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          numberOfLines={1}
          style={[
            { color: "#10243A", fontSize: 15, fontWeight: "700", fontFamily: theme.displayFontFamily },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
