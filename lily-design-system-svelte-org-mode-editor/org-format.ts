// Pure Emacs Org mode formatting for a plain-text selection. No DOM, no strings of its
// own: given the text, the selection and a few options, return the new text and the new
// selection. OrgModeEditor.svelte feeds it the textarea's value and selection.
//
// Org syntax is not user-interface text: `TODO`, `SCHEDULED:`, `:PROPERTIES:`, `#+BEGIN_QUOTE`
// and the weekday abbreviation inside `<2026-10-24 Sat>` are what Org itself reads and writes.

export type Edit = { text: string; start: number; end: number };

/** Tools that wrap the selection in a marker on both sides. */
export type WrapTool = "bold" | "italic" | "underline" | "strikethrough" | "code" | "verbatim";
/** Tools that act on every selected line. */
export type LineTool = "heading" | "promote" | "demote" | "bulletList" | "numberedList" | "checkbox";
/** Tools that wrap whole selected lines in a begin and an end line. */
export type BlockTool = "quote" | "sourceBlock" | "drawer";
/** Tools that act on the heading the caret is under. */
export type TaskTool = "todo" | "priority" | "scheduled" | "deadline";
export type ToolId = WrapTool | LineTool | BlockTool | TaskTool | "link" | "timestamp" | "property" | "contact";

export const WRAP_MARKERS: Record<WrapTool, string> = {
    bold: "*",
    italic: "/",
    underline: "_",
    strikethrough: "+",
    code: "~",
    verbatim: "=",
};

/** The default toolbar order. */
export const TOOL_IDS: readonly ToolId[] = [
    "heading",
    "promote",
    "demote",
    "todo",
    "priority",
    "scheduled",
    "deadline",
    "timestamp",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "code",
    "verbatim",
    "link",
    "bulletList",
    "numberedList",
    "checkbox",
    "quote",
    "sourceBlock",
    "property",
    "drawer",
    "contact",
];

/** Which group a tool sits in, for a consumer's separators (`data-group`). */
export const TOOL_GROUPS: Record<ToolId, "structure" | "task" | "text" | "data"> = {
    heading: "structure",
    promote: "structure",
    demote: "structure",
    bulletList: "structure",
    numberedList: "structure",
    checkbox: "structure",
    quote: "structure",
    sourceBlock: "structure",
    todo: "task",
    priority: "task",
    scheduled: "task",
    deadline: "task",
    timestamp: "task",
    bold: "text",
    italic: "text",
    underline: "text",
    strikethrough: "text",
    code: "text",
    verbatim: "text",
    link: "text",
    property: "data",
    drawer: "data",
    contact: "data",
};

export type OrgOptions = {
    /** Stars the heading tool writes on a plain line. Default 1. */
    headingLevel?: number;
    /** The task keywords the todo tool cycles through. Default `["TODO", "DONE"]`. */
    todoKeywords?: string[];
    /** The priority letters the priority tool cycles through. Default `["A", "B", "C"]`. */
    priorities?: string[];
    /** Today as `YYYY-MM-DD`, for scheduled, deadline and timestamp. Default: the local date. */
    today?: string;
    /** The property the property tool adds. Default `ID`. */
    propertyKey?: string;
    /** The drawer the drawer tool writes. Default `LOGBOOK`. */
    drawerName?: string;
    /** The properties a contact entry gets. Default `["EMAIL", "PHONE", "ADDRESS", "BIRTHDAY"]`. */
    contactProperties?: string[];
};

const DEFAULT_KEYWORDS = ["TODO", "DONE"];
const DEFAULT_PRIORITIES = ["A", "B", "C"];
const DEFAULT_CONTACT = ["EMAIL", "PHONE", "ADDRESS", "BIRTHDAY"];

// ---- lines ------------------------------------------------------------------------------------

/** Start offset of the line containing `pos`. */
function lineStartOf(text: string, pos: number): number {
    return pos <= 0 ? 0 : text.lastIndexOf("\n", pos - 1) + 1;
}

/** Offset of the newline ending the line containing `pos` (or the text length). */
function lineEndOf(text: string, pos: number): number {
    const nl = text.indexOf("\n", pos);
    return nl === -1 ? text.length : nl;
}

/** The line-start offsets covering the selection (a selection ending at a line start excludes that line). */
function lineBounds(text: string, start: number, end: number): { from: number; to: number } {
    const from = lineStartOf(text, start);
    const effectiveEnd = end > start && text[end - 1] === "\n" ? end - 1 : end;
    return { from, to: lineEndOf(text, effectiveEnd) };
}

const unchanged = (text: string, start: number, end: number): Edit => ({ text, start, end });

/** Replace the lines `from..to` with `next`, keeping the selection on the same text where it can. */
function replaceLines(text: string, start: number, end: number, from: number, to: number, nextLines: string[], firstDelta?: number): Edit {
    const block = nextLines.join("\n");
    const delta = block.length - (to - from);
    const first = firstDelta ?? (nextLines.length ? nextLines[0].length - text.slice(from, lineEndOf(text, from)).length : 0);
    return {
        text: text.slice(0, from) + block + text.slice(to),
        start: Math.max(from, start + first),
        end: Math.max(from, end + delta),
    };
}

// ---- headings ---------------------------------------------------------------------------------

const HEADING = /^(\*+) /;
const PRIORITY = /^\[#([A-Z])\](?: |$)/;

type Heading = { stars: number; keyword: string; priority: string; title: string };

/** Parse `** TODO [#A] Title :tag:`. The keyword is only one of `keywords`. */
function parseHeading(line: string, keywords: string[]): Heading | null {
    const m = HEADING.exec(line);
    if (!m) return null;
    let rest = line.slice(m[0].length);
    let keyword = "";
    for (const k of keywords) {
        if (rest === k || rest.startsWith(k + " ")) {
            keyword = k;
            rest = rest.slice(k.length + 1);
            break;
        }
    }
    let priority = "";
    const p = PRIORITY.exec(rest);
    if (p) {
        priority = p[1];
        rest = rest.slice(p[0].length);
    }
    return { stars: m[1].length, keyword, priority, title: rest };
}

function formatHeading(h: Heading): string {
    const parts = [h.keyword, h.priority ? `[#${h.priority}]` : "", h.title].filter((p) => p !== "");
    return "*".repeat(h.stars) + " " + parts.join(" ");
}

const BULLET = /^[-+] (?:\[[ X-]\] )?/;
const NUMBERED = /^\d+[.)] /;
const CHECKBOX = /^([-+] )\[([ X-])\] /;

/** Strip any block prefix a line can have, so a new one is not stacked on it. */
function stripPrefix(line: string): string {
    return line.replace(HEADING, "").replace(BULLET, "").replace(NUMBERED, "");
}

/** The nearest heading at or above `pos`: its line start and parsed form. */
function headingAbove(text: string, pos: number, keywords: string[]): { from: number; to: number; heading: Heading } | null {
    let from = lineStartOf(text, pos);
    for (;;) {
        const to = lineEndOf(text, from);
        const heading = parseHeading(text.slice(from, to), keywords);
        if (heading) return { from, to, heading };
        if (from === 0) return null;
        from = lineStartOf(text, from - 1);
    }
}

// ---- wrap -------------------------------------------------------------------------------------

/**
 * Wrap the selection in `marker`, or take it off when the selection is already wrapped (markers just
 * outside it, or just inside it). An empty selection inserts a pair and leaves the caret between.
 */
export function toggleWrap(text: string, start: number, end: number, marker: string): Edit {
    const m = marker.length;
    const before = text.slice(0, start);
    const selected = text.slice(start, end);
    const after = text.slice(end);
    if (before.endsWith(marker) && after.startsWith(marker)) {
        return { text: before.slice(0, -m) + selected + after.slice(m), start: start - m, end: end - m };
    }
    if (selected.length >= 2 * m && selected.startsWith(marker) && selected.endsWith(marker)) {
        const inner = selected.slice(m, selected.length - m);
        return { text: before + inner + after, start, end: start + inner.length };
    }
    return { text: before + marker + selected + marker + after, start: start + m, end: end + m };
}

/** Link: `[[https://][selection]]` with the address selected; with no selection `[[https://]]`. */
export function insertLink(text: string, start: number, end: number): Edit {
    const url = "https://";
    const selected = text.slice(start, end);
    const body = selected === "" ? `[[${url}]]` : `[[${url}][${selected}]]`;
    return { text: text.slice(0, start) + body + text.slice(end), start: start + 2, end: start + 2 + url.length };
}

// ---- line prefixes ----------------------------------------------------------------------------

/** Heading: stars on every selected line, or off when every non-empty line is already a heading. */
export function toggleHeading(text: string, start: number, end: number, level = 1): Edit {
    const { from, to } = lineBounds(text, start, end);
    const lines = text.slice(from, to).split("\n");
    const nonEmpty = lines.filter((l) => l.trim() !== "");
    const all = nonEmpty.length > 0 && nonEmpty.every((l) => HEADING.test(l));
    const next = lines.map((l) => (all ? l.replace(HEADING, "") : l.trim() === "" ? l : "*".repeat(level) + " " + stripPrefix(l)));
    return replaceLines(text, start, end, from, to, next);
}

/** Promote (fewer stars, never below one) or demote (one more star) every selected heading. */
export function shiftHeadings(text: string, start: number, end: number, direction: 1 | -1): Edit {
    const { from, to } = lineBounds(text, start, end);
    const lines = text.slice(from, to).split("\n");
    let touched = false;
    const next = lines.map((l) => {
        const m = HEADING.exec(l);
        if (!m) return l;
        if (direction === -1 && m[1].length === 1) return l;
        touched = true;
        return direction === 1 ? "*" + l : l.slice(1);
    });
    if (!touched) return unchanged(text, start, end);
    return replaceLines(text, start, end, from, to, next);
}

/** Bulleted or numbered list on every selected line, or off when every non-empty line already has it. */
export function toggleList(text: string, start: number, end: number, tool: "bulletList" | "numberedList"): Edit {
    const { from, to } = lineBounds(text, start, end);
    const lines = text.slice(from, to).split("\n");
    const matcher = tool === "bulletList" ? BULLET : NUMBERED;
    const nonEmpty = lines.filter((l) => l.trim() !== "");
    const all = nonEmpty.length > 0 && nonEmpty.every((l) => matcher.test(l));
    let n = 0;
    const next = lines.map((l) => {
        if (all) return l.replace(matcher, "");
        if (l.trim() === "") return l;
        const prefix = tool === "bulletList" ? "- " : `${n + 1}. `;
        n++;
        return prefix + stripPrefix(l);
    });
    return replaceLines(text, start, end, from, to, next);
}

/** Checkbox on the selected lines, cycling none → `[ ]` → `[X]` → none, by the first non-empty line. */
export function cycleCheckbox(text: string, start: number, end: number): Edit {
    const { from, to } = lineBounds(text, start, end);
    const lines = text.slice(from, to).split("\n");
    const first = lines.find((l) => l.trim() !== "");
    if (first === undefined) return unchanged(text, start, end);
    const m = CHECKBOX.exec(first);
    const state = m ? (m[2] === " " ? "open" : "done") : "none";
    const next = lines.map((l) => {
        if (l.trim() === "") return l;
        const body = l.replace(BULLET, "").replace(NUMBERED, "").replace(HEADING, "");
        const indentless = body;
        if (state === "none") return "- [ ] " + indentless;
        if (state === "open") return "- [X] " + indentless;
        return indentless;
    });
    return replaceLines(text, start, end, from, to, next);
}

// ---- blocks -----------------------------------------------------------------------------------

/**
 * Wrap the selected lines in `begin` and `end` lines, or take the wrapper off when the selection
 * is already wrapped (the lines just outside it, or its own first and last lines).
 */
export function toggleBlock(text: string, start: number, end: number, begin: string, endLine: string, isBegin: (l: string) => boolean, isEnd: (l: string) => boolean): Edit {
    const { from, to } = lineBounds(text, start, end);
    const lines = text.slice(from, to).split("\n");

    // The selection's own first and last lines are the wrapper.
    if (lines.length >= 2 && isBegin(lines[0]) && isEnd(lines[lines.length - 1])) {
        const inner = lines.slice(1, -1);
        const block = inner.join("\n");
        return { text: text.slice(0, from) + block + text.slice(to), start: from, end: from + block.length };
    }
    // The wrapper sits on the lines just outside the selection.
    if (from > 0 && to < text.length) {
        const prevFrom = lineStartOf(text, from - 1);
        const nextTo = lineEndOf(text, to + 1);
        if (isBegin(text.slice(prevFrom, from - 1)) && isEnd(text.slice(to + 1, nextTo))) {
            const block = text.slice(from, to);
            return { text: text.slice(0, prevFrom) + block + text.slice(nextTo), start: prevFrom, end: prevFrom + block.length };
        }
    }
    const block = begin + "\n" + lines.join("\n") + "\n" + endLine;
    const innerStart = from + begin.length + 1;
    return { text: text.slice(0, from) + block + text.slice(to), start: innerStart, end: innerStart + lines.join("\n").length };
}

const isBeginBlock = (name: string) => (l: string) => new RegExp(`^#\\+begin_${name}(\\s|$)`, "i").test(l.trim());
const isEndBlock = (name: string) => (l: string) => new RegExp(`^#\\+end_${name}\\s*$`, "i").test(l.trim());
const isBeginDrawer = (l: string) => /^:[^\s:]+:\s*$/.test(l.trim()) && !/^:END:\s*$/i.test(l.trim());
const isEndDrawer = (l: string) => /^:END:\s*$/i.test(l.trim());

// ---- dates ------------------------------------------------------------------------------------

// Org writes the weekday abbreviation in the day name of the timestamp; Org itself reads English by default.
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n: number): string {
    return String(n).padStart(2, "0");
}

/** The local date as `YYYY-MM-DD`. */
export function localToday(now: Date = new Date()): string {
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** `2026-10-24` → `2026-10-24 Sat`, by UTC date maths (no time zone, no `Intl`). */
export function dayStamp(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number);
    const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    return `${iso} ${WEEKDAYS[weekday]}`;
}

/** Insert an active timestamp `<2026-10-24 Sat>`, replacing the selection, with the date selected. */
export function insertTimestamp(text: string, start: number, end: number, today: string): Edit {
    const stamp = dayStamp(today);
    return { text: text.slice(0, start) + `<${stamp}>` + text.slice(end), start: start + 1, end: start + 1 + stamp.length };
}

// ---- tasks ------------------------------------------------------------------------------------

/**
 * The line at the caret becomes (or already is) a heading and moves one step along
 * none → keyword 1 → … → last keyword → none.
 */
export function cycleTodo(text: string, start: number, end: number, keywords: string[] = DEFAULT_KEYWORDS, level = 1): Edit {
    const from = lineStartOf(text, start);
    const to = lineEndOf(text, from);
    const line = text.slice(from, to);
    const h = parseHeading(line, keywords);
    let next: string;
    if (h) {
        const at = keywords.indexOf(h.keyword);
        const keyword = h.keyword === "" ? keywords[0] ?? "" : at + 1 < keywords.length ? keywords[at + 1] : "";
        next = formatHeading({ ...h, keyword });
    } else {
        next = formatHeading({ stars: level, keyword: keywords[0] ?? "", priority: "", title: stripPrefix(line) });
    }
    return replaceLines(text, start, end, from, to, [next], next.length - line.length);
}

/** The line at the caret becomes (or already is) a heading and moves one step along none → A → B → C → none. */
export function cyclePriority(text: string, start: number, end: number, priorities: string[] = DEFAULT_PRIORITIES, keywords: string[] = DEFAULT_KEYWORDS, level = 1): Edit {
    const from = lineStartOf(text, start);
    const to = lineEndOf(text, from);
    const line = text.slice(from, to);
    const h = parseHeading(line, keywords) ?? { stars: level, keyword: "", priority: "", title: stripPrefix(line) };
    const at = priorities.indexOf(h.priority);
    const priority = h.priority === "" ? priorities[0] ?? "" : at + 1 < priorities.length ? priorities[at + 1] : "";
    const next = formatHeading({ ...h, priority });
    return replaceLines(text, start, end, from, to, [next], next.length - line.length);
}

const PLANNING = /^\s*(?:SCHEDULED|DEADLINE|CLOSED):/;

/** The index just past the heading line and its planning line, if it has one. */
function afterPlanning(text: string, headingTo: number): number {
    if (headingTo >= text.length) return text.length;
    const nextFrom = headingTo + 1;
    const nextTo = lineEndOf(text, nextFrom);
    return PLANNING.test(text.slice(nextFrom, nextTo)) ? nextTo : headingTo;
}

/**
 * Put `SCHEDULED: <date>` or `DEADLINE: <date>` on the planning line under the heading the caret is in,
 * or take it off when the heading already has it. The date is selected so it can be changed.
 */
export function togglePlanning(text: string, start: number, end: number, keyword: "SCHEDULED" | "DEADLINE", today: string, keywords: string[] = DEFAULT_KEYWORDS): Edit {
    const found = headingAbove(text, start, keywords);
    if (!found) return unchanged(text, start, end);
    const planFrom = found.to + 1;
    const hasPlan = found.to < text.length && PLANNING.test(text.slice(planFrom, lineEndOf(text, planFrom)));
    const stamp = `${keyword}: <${dayStamp(today)}>`;
    const select = (at: number): { start: number; end: number } => ({ start: at, end: at + dayStamp(today).length });

    if (!hasPlan) {
        const out = text.slice(0, found.to) + "\n" + stamp + text.slice(found.to);
        return { text: out, ...select(found.to + 1 + keyword.length + 3) };
    }
    const planTo = lineEndOf(text, planFrom);
    const plan = text.slice(planFrom, planTo);
    const existing = new RegExp(`\\s*${keyword}: [<\\[][^>\\]]*[>\\]]`).exec(plan);
    if (existing) {
        const remaining = (plan.slice(0, existing.index) + plan.slice(existing.index + existing[0].length)).trim();
        if (remaining === "") {
            // The planning line is now empty: remove the whole line.
            return { text: text.slice(0, found.to) + text.slice(planTo), start: found.to, end: found.to };
        }
        return { text: text.slice(0, planFrom) + remaining + text.slice(planTo), start: planFrom, end: planFrom };
    }
    const out = text.slice(0, planTo) + " " + stamp + text.slice(planTo);
    return { text: out, ...select(planTo + 1 + keyword.length + 3) };
}

// ---- properties, drawers, contacts ------------------------------------------------------------

/**
 * Add `:KEY: ` to the property drawer under the heading the caret is in, creating the drawer when there is
 * none. A key the drawer already has is not added again: the caret goes to the end of its line.
 */
export function addProperty(text: string, start: number, end: number, key = "ID", keywords: string[] = DEFAULT_KEYWORDS): Edit {
    const found = headingAbove(text, start, keywords);
    const anchor = found ? afterPlanning(text, found.to) : -1; // the end of the line the drawer follows
    const line = (s: string) => `:${key}: ${s}`.replace(/ +$/, " ");
    // A file-level drawer (no heading above): it goes at the very top.
    if (!found) {
        const out = `:PROPERTIES:\n${line("")}\n:END:\n` + text;
        const at = ":PROPERTIES:\n".length + `:${key}: `.length;
        return { text: out, start: at, end: at };
    }
    const dFrom = anchor + 1;
    const dTo = anchor < text.length ? lineEndOf(text, dFrom) : text.length;
    if (anchor < text.length && /^\s*:PROPERTIES:\s*$/i.test(text.slice(dFrom, dTo))) {
        // Find the :END: of this drawer.
        let cur = dTo + 1;
        while (cur <= text.length) {
            const curTo = lineEndOf(text, cur);
            const l = text.slice(cur, curTo);
            if (/^\s*:END:\s*$/i.test(l)) {
                const existing = new RegExp(`^\\s*:${key}:`, "im");
                const drawerBody = text.slice(dTo + 1, cur);
                const m = existing.exec(drawerBody);
                if (m) {
                    const lineEnd = dTo + 1 + lineEndOf(drawerBody, m.index);
                    return { text, start: lineEnd, end: lineEnd };
                }
                const add = `:${key}: `;
                const out = text.slice(0, cur) + add + "\n" + text.slice(cur);
                return { text: out, start: cur + add.length, end: cur + add.length };
            }
            if (curTo >= text.length) break;
            cur = curTo + 1;
        }
    }
    const add = `\n:PROPERTIES:\n:${key}: \n:END:`;
    const out = text.slice(0, anchor) + add + text.slice(anchor);
    const at = anchor + "\n:PROPERTIES:\n".length + `:${key}: `.length;
    return { text: out, start: at, end: at };
}

/**
 * A contact entry: a heading (one level under the heading above, else `level`) holding a property drawer
 * of `properties`. The selection becomes the contact's name; the caret lands on the first property.
 */
export function insertContact(text: string, start: number, end: number, properties: string[] = DEFAULT_CONTACT, level = 1, keywords: string[] = DEFAULT_KEYWORDS): Edit {
    const above = headingAbove(text, start, keywords);
    const stars = above ? above.heading.stars + 1 : level;
    const name = text.slice(start, end);
    const atLineStart = start === 0 || text[start - 1] === "\n";
    const lead = atLineStart ? "" : "\n";
    const head = `${"*".repeat(stars)} ${name}\n:PROPERTIES:\n`;
    const rows = properties.map((p) => `:${p}: `).join("\n");
    const entry = lead + head + rows + (rows ? "\n" : "") + ":END:";
    const out = text.slice(0, start) + entry + text.slice(end);
    const firstRow = start + lead.length + head.length;
    const caret = firstRow + (properties[0] ? `:${properties[0]}: `.length : 0);
    return { text: out, start: caret, end: caret };
}

// ---- dispatch ---------------------------------------------------------------------------------

/** Apply one tool to the text and selection. */
export function applyTool(tool: ToolId, text: string, start: number, end: number, options: OrgOptions = {}): Edit {
    const keywords = options.todoKeywords ?? DEFAULT_KEYWORDS;
    const level = options.headingLevel ?? 1;
    const today = options.today ?? localToday();
    if (tool in WRAP_MARKERS) return toggleWrap(text, start, end, WRAP_MARKERS[tool as WrapTool]);
    switch (tool) {
        case "link":
            return insertLink(text, start, end);
        case "heading":
            return toggleHeading(text, start, end, level);
        case "promote":
            return shiftHeadings(text, start, end, -1);
        case "demote":
            return shiftHeadings(text, start, end, 1);
        case "bulletList":
        case "numberedList":
            return toggleList(text, start, end, tool);
        case "checkbox":
            return cycleCheckbox(text, start, end);
        case "quote":
            return toggleBlock(text, start, end, "#+BEGIN_QUOTE", "#+END_QUOTE", isBeginBlock("quote"), isEndBlock("quote"));
        case "sourceBlock":
            return toggleBlock(text, start, end, "#+BEGIN_SRC", "#+END_SRC", isBeginBlock("src"), isEndBlock("src"));
        case "drawer":
            return toggleBlock(text, start, end, `:${options.drawerName ?? "LOGBOOK"}:`, ":END:", isBeginDrawer, isEndDrawer);
        case "todo":
            return cycleTodo(text, start, end, keywords, level);
        case "priority":
            return cyclePriority(text, start, end, options.priorities ?? DEFAULT_PRIORITIES, keywords, level);
        case "scheduled":
            return togglePlanning(text, start, end, "SCHEDULED", today, keywords);
        case "deadline":
            return togglePlanning(text, start, end, "DEADLINE", today, keywords);
        case "timestamp":
            return insertTimestamp(text, start, end, today);
        case "property":
            return addProperty(text, start, end, options.propertyKey ?? "ID", keywords);
        case "contact":
            return insertContact(text, start, end, options.contactProperties ?? DEFAULT_CONTACT, level, keywords);
    }
    return unchanged(text, start, end);
}
