/**
 * Label packs for the Nunjucks catalogs.
 *
 * A Nunjucks macro cannot take a function, and the Nunjucks helpers were written with string templates that use their own
 * placeholder names and, for labels with two states, two separate strings. This turns a pack (see label-pack.ts) into exactly what
 * each Nunjucks helper reads:
 *
 *   const { macro, client } = nunjucksLabelsFor("kanban-board", pack);
 *   {{ kanbanBoard({ ..., labels: macro }) }}          // JSON-safe strings and templates, in the helper's own names and tokens
 *   initKanbanBoard(root, { labels: client });          // the same pack as functions, for the labels a client option takes
 *
 * `macro` holds only strings, templates and string groups, so it can cross the template boundary and be dumped into the helper's
 * configuration. `client` is `labelsFor(helper, pack)`: functions with the positional arguments the other catalogs use. The client
 * option wins over a template wherever the helper offers both.
 *
 * Differences a Nunjucks reader will notice, all of them the helper's existing contract rather than the pack's:
 *  - an export announcement's `{format}` is the lower-case format id (`csv`, `tsv`, `xlsx`), not upper-cased;
 *  - the calendar's Previous / Next arrows are named for one view before the client runs (`options.view`, default `month`);
 *  - the labels that depend on how the locale writes dates (weekday names, period titles, the Gantt column label) are not in a pack.
 */

import { labelsFor, mergedLabels, type LabelHelper, type LabelPack } from "./label-pack.js";

export type NunjucksLabels = {
    /** For the macro's `labels` param: JSON-safe, in the helper's own key names and `{token}` names. */
    macro: Record<string, unknown>;
    /** For the client's `labels` init option: functions with the other catalogs' positional arguments. */
    client: Record<string, unknown>;
};

export type NunjucksLabelOptions = {
    /** The calendar's view, for the two arrows' names before the client runs. Default `month`. */
    view?: string;
};

/** Rewrites `{from}` placeholders as `{to}`. */
function retoken(template: string, renames: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (whole, name: string) => (name in renames ? `{${renames[name]}}` : whole));
}

type Raw = Record<string, string | Record<string, string>>;

/** Copies the listed keys that are plain strings or groups; a template gets its tokens renamed. */
function take(raw: Raw, keys: string[], renames: Record<string, Record<string, string>> = {}): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const key of keys) {
        const value = raw[key];
        if (value === undefined) continue;
        out[key] = typeof value === "string" && renames[key] ? retoken(value, renames[key]) : value;
    }
    return out;
}

/** A two-state select (`{"true": …, "false": …}`) split into the two separate strings the Nunjucks helpers take. */
function split(raw: Raw, key: string, ifTrue: string, ifFalse: string, renames: Record<string, string> = {}): Record<string, string> {
    const value = raw[key];
    if (!value || typeof value === "string") return {};
    const out: Record<string, string> = {};
    if (value["true"] !== undefined) out[ifTrue] = retoken(value["true"], renames);
    if (value["false"] !== undefined) out[ifFalse] = retoken(value["false"], renames);
    return out;
}

const SHARED_PLAIN = ["search", "export", "exportCsv", "exportTsv", "exportExcel", "exportHeaders", "copy", "copyFailed"];

function dataGrid(raw: Raw): Record<string, unknown> {
    // The data grid's client names its tokens after the Svelte parameters; its select labels (sortAnnouncement) stay objects.
    const renames: Record<string, Record<string, string>> = {
        filterAnnouncement: { matches: "matchCount", total: "totalCount" },
        selectionAnnouncement: { count: "selectedCount" },
        exportAnnouncement: { count: "rowCount" },
        copyAnnouncement: { count: "rowCount" },
    };
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(raw)) {
        out[key] = typeof value === "string" && renames[key] ? retoken(value, renames[key]) : value;
    }
    return out;
}

function kanban(raw: Raw): Record<string, unknown> {
    const tasks = { text: "value" };
    return {
        ...take(raw, [...SHARED_PLAIN, "moveMenuLabel", "undo", "cardCount", "overLimit", "moveButton", "addCard", "emptyColumn", "laneCount", "exportAnnouncement", "editInvalid", "editRefused", "copyAnnouncement", "titleEditor", "titleEditAnnouncement"]),
        ...take(raw, ["editAnnouncement", "fieldUndoAnnouncement", "fieldRedoAnnouncement"], { editAnnouncement: tasks, fieldUndoAnnouncement: tasks, fieldRedoAnnouncement: tasks }),
        ...take(raw, ["searchAnnouncement"], { searchAnnouncement: { matches: "matched" } }),
        ...split(raw, "collapseColumn", "expandColumn", "collapseColumn"),
        ...split(raw, "collapseLane", "expandLane", "collapseLane"),
    };
}

function gantt(raw: Raw): Record<string, unknown> {
    const text = { text: "value" };
    const out: Record<string, unknown> = {
        ...take(raw, [...SHARED_PLAIN, "taskColumnHeader", "startLabel", "endLabel", "saveLabel", "cancelLabel", "criticalLabel", "percentLabel", "expandAll", "collapseAll", "zoomIn", "zoomOut", "exportAnnouncement", "editInvalid", "editRefused", "copyAnnouncement"]),
        ...take(raw, ["editAnnouncement"], { editAnnouncement: text }),
        ...take(raw, ["searchAnnouncement"], { searchAnnouncement: { matches: "matched" } }),
        ...take(raw, ["dependencySummary"], { dependencySummary: { tasks: "predecessors" } }),
        ...split(raw, "collapseButton", "expandLabel", "collapseLabel"),
        // The Nunjucks Gantt calls these fieldUndoAnnouncement / fieldRedoAnnouncement; the pack, like Svelte, undoAnnouncement / redoAnnouncement.
    };
    for (const [from, to] of [["undoAnnouncement", "fieldUndoAnnouncement"], ["redoAnnouncement", "fieldRedoAnnouncement"]] as const) {
        const value = raw[from];
        if (typeof value === "string") out[to] = retoken(value, text);
    }
    // One wording per dependency type: an object keyed by `e2s` / `s2s` / `e2e` / `s2e`, tokens {predecessor} and {lag}.
    if (raw.dependencyDetail && typeof raw.dependencyDetail !== "string") out.dependencyDetail = raw.dependencyDetail;
    return out;
}

function calendar(raw: Raw, options: NunjucksLabelOptions): Record<string, unknown> {
    const view = options.view ?? "month";
    const out: Record<string, unknown> = take(raw, [...SHARED_PLAIN, "dayView", "weekView", "fourWeekView", "monthView", "agendaView", "agendaEmpty", "today", "weekNumberHeader"]);
    const previous = raw.previous;
    const next = raw.next;
    if (previous && typeof previous !== "string" && previous[view]) out.previousLabel = previous[view];
    if (next && typeof next !== "string" && next[view]) out.nextLabel = next[view];
    return out;
}

function filter(raw: Raw): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(raw)) out[key === "operators" ? "operatorNames" : key] = value;
    return out;
}

/** What each Nunjucks helper reads from a pack. See the file header. */
export function nunjucksLabelsFor(helper: LabelHelper, pack: LabelPack, options: NunjucksLabelOptions = {}): NunjucksLabels {
    const raw = mergedLabels(helper, pack) as Raw;
    const macro =
        helper === "data-grid" ? dataGrid(raw)
        : helper === "kanban-board" ? kanban(raw)
        : helper === "gantt-chart" ? gantt(raw)
        : helper === "calendar" ? calendar(raw, options)
        : filter(raw);
    return { macro, client: labelsFor(helper, pack) };
}
