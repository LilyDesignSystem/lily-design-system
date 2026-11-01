// Extras for components whose Alpine snippet is the HTML catalog's markup (no behaviour of their own): header lines
// the HTML source lacks, notes, and tests beyond the generated ones. generate-components.mjs reads this file; it is
// in families/shared/ so the family loader does not treat it as a behaviour family.
//
// slug -> { keyboard?, aria?, notes?: string[], test?: string }

// The convert family: one named group holding six parts with no role of their own.
const convertPart = (slug) => ({
    test: `
  it("has no role and no aria-label", async () => {
    await mount("${slug}");
    expect(el().getAttribute("role")).toBeNull();
    expect(el().getAttribute("aria-label")).toBeNull();
  });`,
});

export default {
    "convert-div": {
        test: `
  it("is a named group", async () => {
    await mount("convert-div");
    expect(el().getAttribute("role")).toBe("group");
    expect(el().getAttribute("aria-label")).not.toBeNull();
  });`,
    },
    ...Object.fromEntries(
        [
            "convert-from-div",
            "convert-from-value-div",
            "convert-from-unit-div",
            "convert-into-div",
            "convert-into-value-div",
            "convert-into-unit-div",
        ].map((slug) => [slug, convertPart(slug)]),
    ),

    "heatmap-chart-with-year-of-days": {
        test: `
  it("carries data-year and data-week-start", async () => {
    await mount("heatmap-chart-with-year-of-days");
    expect(el().getAttribute("data-year")).toBe("2026");
    expect(el().getAttribute("data-week-start")).toBe("0");
  });`,
    },

    grid: {
        notes: [
            "",
            "Fluid mode: for as many columns as fit, each at least W wide, use",
            "  grid-template-columns: repeat(auto-fit, minmax(min(W, 100%), 1fr));",
            '  with data-min-column-width="W" (e.g. 12rem). It replaces the column count.',
        ],
        test: `
  it("documents the fluid minColumnWidth template", async () => {
    const { readFileSync } = await import("node:fs");
    const text = readFileSync("components/grid.html", "utf8");
    expect(text).toContain("repeat(auto-fit, minmax(min(W, 100%), 1fr))");
    expect(text).toContain("data-min-column-width");
  });`,
    },

    "warning-text": {
        keyboard: "None (passive element)",
        aria: "the icon span is aria-hidden; the visually hidden prefix is the consumer's text, in the consumer's language",
        test: `
  it("has no role", async () => {
    await mount("warning-text");
    expect(el().getAttribute("role")).toBeNull();
  });
  it("hides the icon and puts the hidden prefix and text in strong.warning-text-text", async () => {
    await mount("warning-text");
    expect(el().querySelector(":scope > .warning-text-icon").getAttribute("aria-hidden")).toBe("true");
    const strong = el().querySelector(":scope > strong.warning-text-text");
    expect(strong.querySelector(".visually-hidden")).not.toBeNull();
  });`,
    },
};
