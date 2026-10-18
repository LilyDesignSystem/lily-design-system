/**
 * Label packs: the strings a grid-like helper's `labels` object needs, in one file per locale.
 *
 * Lily ships no English defaults, so every app writes (and translates) the same hundred-odd strings. A pack is that
 * work done once: `labelsFor("data-grid", pack)` returns a ready `labels` object for `DataGrid`, with the function
 * labels built from templates. Pure and framework-neutral; the packs are the data files `locales/<locale>.json`.
 *
 * Templates use `{name}` placeholders. The names, and which argument each one reads, are in SPEC below:
 *   "header"          the argument, as text (an `Error` gives its message; an array is joined with ", ")
 *   "card=card.title" a property of an object argument, under another name; "a=o.a|b=o.b" feeds two placeholders from one argument
 *   "@direction"      selects among the pack value's keys by the argument: the value is an object
 *                     (`{"ascending": "...", "descending": "..."}`) instead of a string
 *   "format"          is shown upper-cased (`xlsx` -> `XLSX`)
 * A string label is just a string. Labels that depend on how the locale writes dates (weekday names, period titles,
 * day names, column labels, the date-time-picker labels) are not in a pack: build them with `Intl` and pass them yourself.
 *
 * A pack's `common` section holds the labels several helpers share (export, copy, search); a helper's own section wins.
 * `reviewed` is false until a native speaker has checked the pack.
 */

export type LabelHelper = "data-grid" | "kanban-board" | "calendar" | "gantt-chart" | "filter";

export type LabelTemplate = string | { [select: string]: string };
export type LabelPack = {
    /** The locale tag, e.g. `ta-001`. */
    locale: string;
    /** Has a native speaker checked it? False for machine-drafted packs. */
    reviewed: boolean;
    /** Writing direction of the locale's script. */
    direction?: "ltr" | "rtl";
    /** The language's name in itself (`Cymraeg`). */
    endonym?: string;
    /** The language's name in each other pack's language, keyed by locale (`en-001`: `Welsh`). Bhojpuri has none yet. */
    exonyms?: Record<string, string>;
    common?: Record<string, LabelTemplate | Record<string, string>>;
    "data-grid"?: Record<string, LabelTemplate | Record<string, string>>;
    "kanban-board"?: Record<string, LabelTemplate | Record<string, string>>;
    calendar?: Record<string, LabelTemplate | Record<string, string>>;
    "gantt-chart"?: Record<string, LabelTemplate | Record<string, string>>;
    filter?: Record<string, LabelTemplate | Record<string, string>>;
};

/** Per helper: function label -> the names of its arguments (see the header comment). A key not listed here is a plain string. */
export const SPEC: Record<LabelHelper, Record<string, string[]>> = {
    "data-grid": {
        columnVisibilityOption: ["header"],
        resizeHandle: ["header"],
        selectRow: ["rowLabel"],
        pageStatus: ["page", "pageCount", "rowCount"],
        pageAnnouncement: ["page", "pageCount"],
        sortAnnouncement: ["header", "@direction"],
        filterAnnouncement: ["matches", "total"],
        selectionAnnouncement: ["count"],
        columnMoveAnnouncement: ["header", "position", "count"],
        editCell: ["header", "rowLabel"],
        cellEditor: ["header"],
        editAnnouncement: ["header", "value"],
        exportAnnouncement: ["format", "count", "filename"],
        copyAnnouncement: ["count"],
        invalidValue: ["header", "type"],
        opensInNewTab: ["text"],
        radioGroup: ["header", "rowLabel"],
        timeZone: ["header"],
        exportUtcHeader: ["header"],
        morePeople: ["count"],
        removeFile: ["name"],
        fileInput: ["header", "rowLabel"],
        formulaEditor: ["header"],
        rollupDescription: ["header"],
        editCancelAnnouncement: ["header"],
        undoAnnouncement: ["header", "text"],
        redoAnnouncement: ["header", "text"],
        editError: ["header", "message"],
    },
    "kanban-board": {
        cardCount: ["count"],
        overLimit: ["count", "limit"],
        titleEditor: ["title"],
        titleEditAnnouncement: ["previous", "title"],
        moveButton: ["card=card.title"],
        moveAnnouncement: ["card", "column"],
        moveBlocked: ["card", "column"],
        reorderAnnouncement: ["card", "position", "total"],
        collapseColumn: ["column=column.title", "@collapsed"],
        addCard: ["column=column.title"],
        emptyColumn: ["column=column.title"],
        movePending: ["card", "column"],
        moveFailed: ["card", "column", "error"],
        searchAnnouncement: ["matches", "total"],
        collapseLane: ["lane=lane.title", "@collapsed"],
        laneCount: ["lane=lane.title", "count"],
        moveManyAnnouncement: ["count", "column"],
        undoAnnouncement: ["card", "column"],
        undoManyAnnouncement: ["count"],
        columnMoveAnnouncement: ["column", "position", "count"],
        exportAnnouncement: ["format", "count", "filename"],
        copyAnnouncement: ["count"],
        editAnnouncement: ["card", "field", "text"],
        editInvalid: ["card", "field"],
        editRefused: ["card", "field", "message"],
        fieldUndoAnnouncement: ["card", "field", "text"],
        fieldRedoAnnouncement: ["card", "field", "text"],
    },
    calendar: {
        previous: ["@view"],
        next: ["@view"],
        weekNumber: ["week"],
        rangeLimit: ["@limit", "date"],
        eventMoveAnnouncement: ["event=calendarEvent.title", "date"],
        exportAnnouncement: ["format", "count", "filename"],
        copyAnnouncement: ["count"],
        editAnnouncement: ["event", "field", "text"],
        editInvalid: ["event", "field"],
        editRefused: ["event", "field", "message"],
        undoAnnouncement: ["event", "field", "text"],
        redoAnnouncement: ["event", "field", "text"],
        searchAnnouncement: ["matches", "total"],
    },
    "gantt-chart": {
        editButton: ["task=task.label"],
        dependencySummary: ["tasks"],
        dateAnnouncement: ["task", "start", "end"],
        dependencyDetail: ["predecessor", "@type", "lag"],
        baselineSummary: ["task", "baselineStart=baseline.start|baselineEnd=baseline.end", "variance"],
        collapseButton: ["task=task.label", "@collapsed"],
        zoomAnnouncement: ["@timeUnit"],
        exportAnnouncement: ["format", "count", "filename"],
        copyAnnouncement: ["count"],
        editAnnouncement: ["task", "field", "text"],
        editInvalid: ["task", "field"],
        editRefused: ["task", "field", "message"],
        undoAnnouncement: ["task", "field", "text"],
        redoAnnouncement: ["task", "field", "text"],
        searchAnnouncement: ["matches", "total"],
    },
    filter: {
        rule: ["n"],
        group: ["depth"],
        removeRule: ["n"],
        removeGroup: ["depth"],
        ruleAdded: ["n"],
        ruleRemoved: ["n"],
        groupAdded: ["depth"],
        groupRemoved: ["depth"],
    },
};

/** The pack keys that are objects of plain strings handed over as they are (export headers, operator names). */
/** Which shared (`common`) labels each helper takes; the filter takes none. */
const COMMON_FOR: Record<LabelHelper, string[]> = {
    "data-grid": ["search", "export", "exportCsv", "exportTsv", "exportExcel", "exportAnnouncement", "copy", "copyAnnouncement", "copyFailed"],
    "kanban-board": ["search", "searchAnnouncement", "export", "exportCsv", "exportTsv", "exportExcel", "exportAnnouncement", "copy", "copyAnnouncement", "copyFailed"],
    calendar: ["search", "searchAnnouncement", "export", "exportCsv", "exportTsv", "exportExcel", "exportAnnouncement", "copy", "copyAnnouncement", "copyFailed"],
    "gantt-chart": ["search", "searchAnnouncement", "export", "exportCsv", "exportTsv", "exportExcel", "exportAnnouncement", "copy", "copyAnnouncement", "copyFailed"],
    filter: [],
};

const OBJECT_LABELS = new Set(["exportHeaders"]);

function text(value: unknown): string {
    if (value instanceof Error) return value.message;
    if (Array.isArray(value)) return value.map(text).join(", ");
    return value === null || value === undefined ? "" : String(value);
}

function read(arg: unknown, path: string[]): unknown {
    let value = arg;
    for (const key of path) value = (value as Record<string, unknown> | null | undefined)?.[key];
    return value;
}

/** Fill `{name}` placeholders from a name -> text map; an unknown placeholder is left as written. */
export function fillTemplate(template: string, values: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (whole, name: string) => (name in values ? values[name] : whole));
}

function build(template: LabelTemplate, params: string[]): (...args: unknown[]) => string {
    return (...args: unknown[]) => {
        const values: Record<string, string> = {};
        let chosen: string | undefined = typeof template === "string" ? template : undefined;
        params.forEach((spec, i) => {
            const arg = args[i];
            // One argument may feed several placeholders: "a=obj.a|b=obj.b".
            for (const param of spec.split("|")) {
                if (param.startsWith("@")) {
                    const key = text(arg);
                    if (typeof template !== "string") chosen = template[key] ?? template.other;
                    continue;
                }
                const [name, path] = param.includes("=") ? param.split("=") : [param, param];
                // `card=card.title` reads `.title` of the argument; the first path segment is the parameter's own name.
                let value = param.includes("=") ? read(arg, path.split(".").slice(1)) : arg;
                // An object without the named property (a calendar event with no `title`) is shown by its id, as the helpers do.
                if (param.includes("=") && (value === undefined || value === null || value === "")) value = read(arg, ["id"]);
                values[name] = name === "format" ? text(value).toUpperCase() : text(value);
            }
        });
        return fillTemplate(chosen ?? "", values);
    };
}

/**
 * The `labels` object for one helper from a pack: plain strings as they are, function labels built from their templates.
 * Keys the pack lacks are left out, so the helper leaves that control unnamed (and says so in development) rather than
 * showing text from another language.
 */
export function labelsFor(helper: LabelHelper, pack: LabelPack): Record<string, unknown> {
    const merged = mergedLabels(helper, pack);
    const spec = SPEC[helper];
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(merged)) {
        if (key === "operators") {
            // The filter's operator names, by operator id; `operatorName(operator, field)` looks one up.
            const names = value as Record<string, string>;
            out.operatorName = (operator: string) => names[operator] ?? "";
        } else if (OBJECT_LABELS.has(key)) out[key] = value;
        else if (key in spec) out[key] = build(value as LabelTemplate, spec[key]);
        else if (typeof value === "string") out[key] = value;
    }
    return out;
}

/** The pack's raw label data for one helper: its own section over the shared labels that helper takes. Strings, select objects and groups, unbuilt. */
export function mergedLabels(helper: LabelHelper, pack: LabelPack): Record<string, LabelTemplate | Record<string, string>> {
    return {
        ...Object.fromEntries(Object.entries(pack.common ?? {}).filter(([key]) => COMMON_FOR[helper].includes(key))),
        ...(pack[helper] ?? {}),
    };
}

/** Every label key a helper's pack should hold (plain strings and templated functions), for coverage checks. */
export function packKeys(helper: LabelHelper, pack: LabelPack): string[] {
    return Object.keys({
        ...Object.fromEntries(Object.entries(pack.common ?? {}).filter(([key]) => COMMON_FOR[helper].includes(key))),
        ...(pack[helper] ?? {}),
    });
}
