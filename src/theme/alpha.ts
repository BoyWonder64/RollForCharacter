/** Applies opacity (0–1) to a #RRGGBB colour; anything else is returned unchanged. */
export function withAlpha(color: string, alpha: number): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${color}${a}`;
}

/** Opacity for bordered boxes so the themed backdrop art shows faintly through. */
export const BOX_ALPHA = 0.88;
