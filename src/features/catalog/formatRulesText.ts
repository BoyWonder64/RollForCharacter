/**
 * Catalog rules text (spells, magic items, monsters, class features) comes
 * from Markdown sources, but the app shows it in plain <Text>. This turns
 * the Markdown into readable plain text: emphasis markers are dropped,
 * tables become one "cell · cell" line per row, and headings/blockquotes
 * lose their prefixes.
 */
export function formatRulesText(text: string | null | undefined): string {
  if (!text) return "";

  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];

  for (const rawLine of lines) {
    // Blockquote prefix ("> text") used for embedded stat blocks.
    let line = rawLine.replace(/^\s*>\s?/, "");

    // Table rows.
    if (/^\s*\|/.test(line)) {
      // Separator row: |-----|-----|
      if (/^\s*\|[\s:|-]*$/.test(line)) continue;
      const cells = line
        .split("|")
        .map((cell) => stripInline(cell.trim()))
        .filter((cell) => cell.length > 0);
      if (cells.length > 0) out.push(cells.join(" · "));
      continue;
    }

    // Headings ("## Title"); a bare "#" line is noise.
    const heading = /^\s*#{1,6}\s*(.*)$/.exec(line);
    if (heading) {
      if (heading[1].trim().length === 0) continue;
      line = heading[1];
    }

    // "* item" bullets.
    line = line.replace(/^(\s*)\*\s+/, "$1• ");

    out.push(stripInline(line));
  }

  return out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Removes inline Markdown emphasis while leaving footnote asterisks alone. */
function stripInline(text: string): string {
  return text
    .replace(/\*\*\*([^*\n]+)\*\*\*/g, "$1")
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/(^|[^\w*])\*([^*\s][^*\n]*?)\*(?=[^\w*]|$)/g, "$1$2")
    .replace(/(^|[^\w_])_{1,3}([^_\s][^_\n]*?)_{1,3}(?=[^\w_]|$)/g, "$1$2");
}
