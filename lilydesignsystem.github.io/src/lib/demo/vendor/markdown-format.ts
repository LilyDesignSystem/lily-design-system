// VENDORED COPY of shared/markdown-format.ts in the monorepo (this site builds from its own repository). Edit the original, never this copy.
// Pure Markdown formatting for a plain-text selection. No DOM, no strings of
// its own: given the text and the selection, return the new text and the new
// selection. MarkdownEditor.svelte feeds it the textarea's value and selection.

export type Edit = { text: string; start: number; end: number };

/** Tools that wrap the selection in a marker on both sides. */
export type WrapTool = "bold" | "italic" | "strikethrough" | "code";
/** Tools that put a prefix at the start of every selected line. */
export type LineTool = "heading" | "quote" | "bulletList" | "numberedList";
export type ToolId = WrapTool | LineTool | "link";

export const WRAP_MARKERS: Record<WrapTool, string> = {
    bold: "**",
    italic: "*",
    strikethrough: "~~",
    code: "`",
};

export const TOOL_IDS: readonly ToolId[] = [
    "heading",
    "bold",
    "italic",
    "strikethrough",
    "code",
    "link",
    "quote",
    "bulletList",
    "numberedList",
];

const isWrapTool = (id: ToolId): id is WrapTool => id in WRAP_MARKERS;

/**
 * Wrap the selection in `marker`, or take the marker off when the selection
 * is already wrapped (markers just outside it, or just inside it). An empty
 * selection inserts a pair of markers and leaves the caret between them.
 */
export function toggleWrap(text: string, start: number, end: number, marker: string): Edit {
    const m = marker.length;
    const before = text.slice(0, start);
    const selected = text.slice(start, end);
    const after = text.slice(end);

    // Bold and italic share the asterisk: `***x***` is both, so decide by the
    // run of asterisks (italic needs an odd run, bold at least two).
    // `closing` is the text that ends at the opening marker, `opening` the text that starts at the closing one.
    const present = (closing: string, opening: string): boolean => {
        if (marker !== "*" && marker !== "**") return closing.endsWith(marker) && opening.startsWith(marker);
        const run = Math.min(closing.length - closing.replace(/\*+$/, "").length, opening.length - opening.replace(/^\*+/, "").length);
        return marker === "*" ? run % 2 === 1 : run >= 2;
    };

    // Markers just outside the selection: **|bold|** -> |bold|
    if (present(before, after)) {
        return { text: before.slice(0, -m) + selected + after.slice(m), start: start - m, end: end - m };
    }
    // Markers inside the selection: |**bold**| -> |bold|
    // (the selection's own leading run is the opener, its trailing run the closer)
    const lead = selected.match(/^\*+/)?.[0].length ?? 0;
    const trail = selected.match(/\*+$/)?.[0].length ?? 0;
    const insidePresent = marker === "*" || marker === "**"
        ? selected.length > lead && (marker === "*" ? Math.min(lead, trail) % 2 === 1 : Math.min(lead, trail) >= 2)
        : selected.length >= 2 * m && selected.startsWith(marker) && selected.endsWith(marker);
    if (insidePresent) {
        const inner = selected.slice(m, selected.length - m);
        return { text: before + inner + after, start, end: start + inner.length };
    }
    return { text: before + marker + selected + marker + after, start: start + m, end: end + m };
}

/** Link: `[selection](https://)` with the address selected, ready to be typed over. */
export function insertLink(text: string, start: number, end: number): Edit {
    const selected = text.slice(start, end);
    const url = "https://";
    const out = text.slice(0, start) + "[" + selected + "](" + url + ")" + text.slice(end);
    const urlStart = start + 1 + selected.length + 2;
    // With no selected text, the caret goes in the brackets: that is what is missing.
    if (selected === "") return { text: out, start: start + 1, end: start + 1 };
    return { text: out, start: urlStart, end: urlStart + url.length };
}

/** The line-start offsets covering the selection (a selection ending at a line start excludes that line). */
function lineBounds(text: string, start: number, end: number): { from: number; to: number } {
    const from = text.lastIndexOf("\n", start - 1) + 1;
    const effectiveEnd = end > start && text[end - 1] === "\n" ? end - 1 : end;
    const nl = text.indexOf("\n", effectiveEnd);
    return { from, to: nl === -1 ? text.length : nl };
}

const BULLET = /^([-*+]) /;
const NUMBERED = /^\d+\. /;
const QUOTE = /^> ?/;
const HEADING = /^#{1,6} /;

/**
 * Put a prefix on every selected line, or take it off when every non-empty
 * selected line already has it. Numbered lists count 1, 2, 3 from the first
 * selected line. A different list or heading prefix is replaced, not stacked.
 */
export function toggleLines(text: string, start: number, end: number, tool: LineTool, headingLevel = 2): Edit {
    const { from, to } = lineBounds(text, start, end);
    const lines = text.slice(from, to).split("\n");
    const prefixFor = (i: number): string => {
        switch (tool) {
            case "heading": return "#".repeat(headingLevel) + " ";
            case "quote": return "> ";
            case "bulletList": return "- ";
            case "numberedList": return `${i + 1}. `;
        }
    };
    const matcher = { heading: HEADING, quote: QUOTE, bulletList: BULLET, numberedList: NUMBERED }[tool];
    const nonEmpty = lines.filter((l) => l.trim() !== "");
    const alreadyAll = nonEmpty.length > 0 && nonEmpty.every((l) => matcher.test(l));
    // Replace a competing block prefix rather than stacking two.
    const strip = (l: string) => l.replace(HEADING, "").replace(BULLET, "").replace(NUMBERED, "").replace(QUOTE, "");
    let n = 0;
    const next = lines.map((l) => {
        if (alreadyAll) return l.replace(matcher, "");
        if (l.trim() === "") return l;
        const out = prefixFor(n) + (tool === "quote" && QUOTE.test(l) ? l : strip(l));
        n++;
        return out;
    });
    const block = next.join("\n");
    const delta = block.length - (to - from);
    return {
        text: text.slice(0, from) + block + text.slice(to),
        start: Math.max(from, start + (next[0].length - lines[0].length)),
        end: Math.max(from, end + delta),
    };
}

/** Apply one tool to the text and selection. */
export function applyTool(tool: ToolId, text: string, start: number, end: number, options: { headingLevel?: number } = {}): Edit {
    if (isWrapTool(tool)) return toggleWrap(text, start, end, WRAP_MARKERS[tool]);
    if (tool === "link") return insertLink(text, start, end);
    return toggleLines(text, start, end, tool, options.headingLevel ?? 2);
}
