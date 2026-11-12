import { MAGIC_ITEMS } from "../../../data/magicItems";
import { formatRulesText } from "../formatRulesText";

describe("formatRulesText", () => {
  it("returns an empty string for empty input", () => {
    expect(formatRulesText(null)).toBe("");
    expect(formatRulesText("")).toBe("");
  });

  it("drops emphasis markers", () => {
    expect(formatRulesText("An _arrow of slaying_ is **very** *sharp*.")).toBe(
      "An arrow of slaying is very sharp."
    );
    expect(formatRulesText("**_Random Properties_**. An orb")).toBe("Random Properties. An orb");
  });

  it("keeps footnote asterisks and snake_case words", () => {
    expect(formatRulesText("Vizier* and Comet*")).toBe("Vizier* and Comet*");
    expect(formatRulesText("some_internal_name")).toBe("some_internal_name");
  });

  it("turns tables into one line per row and drops the separator", () => {
    const table = "| Type | Strength |\n|------|----------|\n| Hill giant | 21 |";
    expect(formatRulesText(table)).toBe("Type · Strength\nHill giant · 21");
  });

  it("strips heading and blockquote prefixes and star bullets", () => {
    expect(formatRulesText("## Sentient Items\n> **AC** 11\n* Cantrips: light")).toBe(
      "Sentient Items\nAC 11\n• Cantrips: light"
    );
  });

  it("collapses runs of blank lines", () => {
    expect(formatRulesText("a\n\n\n\nb")).toBe("a\n\nb");
  });

  it("leaves no escaped newlines or table pipes in any magic item", () => {
    for (const item of MAGIC_ITEMS) {
      expect(item.description).not.toContain("\\n");
      expect(formatRulesText(item.description)).not.toMatch(/^\s*\|/m);
    }
  });
});
