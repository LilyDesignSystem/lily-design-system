// Cell types for DataGrid: a `column.type` is a named bundle of defaults for the
// hooks a column already has (`format`, `compare`, `filterText`, `exportValue`,
// `align`, `editor`). Nothing here is new machinery: `resolveColumn` fills in
// what the column left out, and a column's own props always win.
//
// Values are plain data. Display is derived: no English, no default locale (with
// no `locale` a value shows as stored), no HTML, no icons. See
// spec/cell-types/index.md.

export type DataGridCellType =
    | "text"
    | "number"
    | "link"
    | "date"
    | "time"
    | "time-zone"
    | "select"
    | "radio"
    | "person"
    | "file"
    | "rollup"
    | "formula";

/** A time of day and the zone it is stated in (an IANA zone id, or a bare offset such as `+01:00`). */
export type DataGridZonedTime = { time: string; timeZone: string };

/** One person: the name is always shown as text; the avatar is the consumer's. */
export type DataGridPerson = { id: string; name?: string; email?: string; avatarUrl?: string };

/** One file's metadata. The bytes live elsewhere; the grid never uploads. */
export type DataGridFile = { id: string; name: string; size?: number; type?: string; href?: string };

/** What a rollup reduces its related values with. */
export type DataGridAggregate =
    | "count"
    | "countUnique"
    | "sum"
    | "avg"
    | "median"
    | "min"
    | "max"
    | "range"
    | "percentTrue"
    | "percentEmpty";

/** What a formula engine hands back: a value, or an error message shown as text. */
export type DataGridFormulaResult = { value: unknown } | { error: string };

/** What a formula engine is given. `rows` is every row, for references to other rows. */
export type DataGridFormulaContext = { row: Record<string, unknown>; rows: Record<string, unknown>[]; columnId: string };

/** An option of a `select` or `radio` column. The label is displayed; the id is stored. */
export type DataGridOption = { id: string; label: string; disabled?: boolean; group?: string; [key: string]: unknown };

/** A link value: an address, or an address with a label. */
export type DataGridLink = { href: string; label?: string; external?: boolean };

/** The column facets a type can fill in. Structural so this module does not import the grid. */
export type TypedColumn = {
    id: string;
    type?: DataGridCellType;
    locale?: string;
    options?: DataGridOption[];
    sortBy?: "label" | "order";
    exportAs?: "label" | "id" | "email";
    numberFormat?: Intl.NumberFormatOptions;
    dateFormat?: Intl.DateTimeFormatOptions;
    timeFormat?: Intl.DateTimeFormatOptions;
    accessor?: (row: Record<string, unknown>) => unknown;
    format?: (value: unknown, row: Record<string, unknown>) => string;
    compare?: (a: unknown, b: unknown) => number;
    filterText?: (value: unknown, row: Record<string, unknown>) => string;
    exportValue?: (row: Record<string, unknown>) => unknown;
    align?: "start" | "center" | "end";
    editor?: string;
    parse?: (draft: string, row: Record<string, unknown>) => unknown;
    editable?: boolean;
    /** `time-zone`: the zones the editor offers, as `{ id, label }`. */
    timeZones?: DataGridOption[];
    /** `time-zone`: the date (ISO) used to order zoned times and to name a zone. Never computed here. */
    referenceDate?: string;
    /** `rollup`: how the related values are reduced. */
    aggregate?: DataGridAggregate;
    /** `rollup`: anything the named aggregates do not cover. */
    reduce?: (values: unknown[], row: Record<string, unknown>) => unknown;
    /** `rollup`: reads the related values. Defaults to the row's own array at the column id. */
    relation?: (row: Record<string, unknown>) => unknown[];
    /** `rollup` and `formula`: the type of the result, so it formats and sorts like one. */
    resultType?: "number" | "date" | "text";
    /** `formula`: evaluates an expression. Lily ships no engine and never evaluates a string itself. */
    evaluate?: (expression: string, context: DataGridFormulaContext) => DataGridFormulaResult;
    /** `person`: how many people show before "+N". */
    maxPeople?: number;
    /** `file`: formats a size in bytes for display. */
    formatSize?: (bytes: number) => string;
    /** Set by `resolveColumn` for a `formula`: the expression the row holds (the editor shows this, not the result). */
    source?: (row: Record<string, unknown>) => unknown;
    /** Set by `resolveColumn` for a `formula`: the error message for a row, or undefined. */
    errorOf?: (row: Record<string, unknown>) => string | undefined;
};

const SAFE_SCHEME = /^(https?:|mailto:|tel:)/i;
const RELATIVE = /^(\/(?!\/)|\.\.?\/|#|\?)/;

/** An address safe to put in an `href`: http(s), mailto, tel, or a relative one. Anything else (`javascript:`, `data:`) is null. */
export function safeHref(href: unknown): string | null {
    if (typeof href !== "string") return null;
    const text = href.trim();
    if (!text) return null;
    // Control characters are stripped by browsers when reading a scheme, so they cannot be allowed to hide one.
    // eslint-disable-next-line no-control-regex
    if (/[\u0000-\u001F\u007F]/.test(text)) return null;
    return SAFE_SCHEME.test(text) || RELATIVE.test(text) ? text : null;
}

/** A link value as `{ href, label?, external? }`; a plain string is the address. */
export function linkParts(value: unknown): DataGridLink | null {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "string") return { href: value };
    if (typeof value === "object" && typeof (value as DataGridLink).href === "string") return value as DataGridLink;
    return null;
}

export function linkLabel(value: unknown): string {
    const link = linkParts(value);
    return link ? (link.label ?? link.href) : "";
}

/** A civil date `YYYY-MM-DD` that exists on the calendar. */
export function isCivilDate(text: unknown): text is string {
    if (typeof text !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
    const [y, m, d] = text.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/** A civil time `HH:mm` or `HH:mm:ss`, 24-hour. */
export function isCivilTime(text: unknown): text is string {
    if (typeof text !== "string") return false;
    const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(text);
    return !!match && Number(match[1]) < 24 && Number(match[2]) < 60 && (match[3] === undefined || Number(match[3]) < 60);
}

/** A civil date as a `Date` at UTC midnight, or null. Typed, so an export writes a real spreadsheet date. */
export function civilDateToDate(text: unknown): Date | null {
    if (text instanceof Date) return Number.isNaN(text.getTime()) ? null : text;
    return isCivilDate(text) ? new Date(`${text}T00:00:00Z`) : null;
}

const isEmpty = (value: unknown) => value === null || value === undefined || value === "";

const OFFSET = /^([+-])(\d{2}):?(\d{2})$/;

/** The zone's offset from UTC, in minutes, at an instant. A bare offset (`+01:00`) is its own answer. Null when the zone is unknown. */
function zoneOffsetMinutes(timeZone: string, instantMs: number): number | null {
    const bare = OFFSET.exec(timeZone);
    if (bare) return (bare[1] === "-" ? -1 : 1) * (Number(bare[2]) * 60 + Number(bare[3]));
    try {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone,
            hourCycle: "h23",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).formatToParts(new Date(instantMs));
        const n = (type: string) => Number(parts.find((x) => x.type === type)?.value);
        const local = Date.UTC(n("year"), n("month") - 1, n("day"), n("hour") % 24, n("minute"), n("second"));
        return (local - Math.floor(instantMs / 1000) * 1000) / 60000;
    } catch {
        return null;
    }
}

/** An IANA zone id the platform knows, or a bare offset such as `+01:00`. */
export function isValidTimeZone(timeZone: unknown): timeZone is string {
    return typeof timeZone === "string" && timeZone !== "" && zoneOffsetMinutes(timeZone, 0) !== null;
}

/** A zoned time: `{ time: "HH:mm[:ss]", timeZone }` with a real time and a known zone. */
export function isZonedTime(value: unknown): value is DataGridZonedTime {
    return !!value && typeof value === "object" && isCivilTime((value as DataGridZonedTime).time) && isValidTimeZone((value as DataGridZonedTime).timeZone);
}

/**
 * A zoned time as a number for ordering. With a `referenceDate` (ISO, supplied by the consumer: never computed here)
 * it is the UTC minute of that instant, so equal instants compare equal; without one it is the stated local time and
 * the zone is ignored.
 */
export function zonedMinutes(value: unknown, referenceDate?: string): number | null {
    if (!isZonedTime(value)) return null;
    const [h, m, sec] = value.time.split(":").map(Number);
    const local = h * 60 + m + (sec || 0) / 60;
    if (!referenceDate || !isCivilDate(referenceDate)) return local;
    const [y, mo, d] = referenceDate.split("-").map(Number);
    const guess = Date.UTC(y, mo - 1, d, h, m, sec || 0);
    const offset = zoneOffsetMinutes(value.timeZone, guess);
    if (offset === null) return local;
    return guess / 60000 - offset;
}

/** A zoned time as the UTC time of day (`HH:mm`) at a reference date. Null without a valid reference date or value. */
export function zonedUtcTime(value: unknown, referenceDate?: string): string | null {
    if (!referenceDate || !isCivilDate(referenceDate)) return null;
    const minutes = zonedMinutes(value, referenceDate);
    if (minutes === null) return null;
    const day = ((Math.round(minutes) % 1440) + 1440) % 1440;
    return `${String(Math.floor(day / 60)).padStart(2, "0")}:${String(day % 60).padStart(2, "0")}`;
}

/** The zone as text: its short name (`BST`) when there is a locale and a reference date, else the zone id as given. */
function zoneLabel(timeZone: string, locale: string | undefined, referenceDate: string | undefined): string {
    if (!locale || !referenceDate || !isCivilDate(referenceDate) || OFFSET.test(timeZone)) return timeZone;
    try {
        const parts = new Intl.DateTimeFormat(locale, { timeZone, timeZoneName: "short" }).formatToParts(new Date(`${referenceDate}T12:00:00Z`));
        return parts.find((x) => x.type === "timeZoneName")?.value ?? timeZone;
    } catch {
        return timeZone;
    }
}

/** The people in a value: one object or an array, each with an id. */
export function peopleOf(value: unknown): DataGridPerson[] {
    const list = Array.isArray(value) ? value : isEmpty(value) ? [] : [value];
    return list.filter((p): p is DataGridPerson => !!p && typeof p === "object" && typeof (p as DataGridPerson).id === "string");
}

/** A person's text: the name, or the id when there is none (never blank). */
export const personName = (person: DataGridPerson): string => (person.name ? person.name : person.id);

/** The files in a value: an array of `{ id, name, … }`. */
export function filesOf(value: unknown): DataGridFile[] {
    return (Array.isArray(value) ? value : []).filter((f): f is DataGridFile => !!f && typeof f === "object" && typeof (f as DataGridFile).id === "string" && typeof (f as DataGridFile).name === "string");
}

/** Reduces related values to one result. An empty set is empty (null), not 0, except `count`. */
export function aggregateValues(kind: DataGridAggregate, values: unknown[]): unknown {
    const present = values.filter((v) => !isEmpty(v));
    const numbers = present.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
    switch (kind) {
        case "count":
            return values.length;
        case "countUnique":
            return present.length === 0 ? null : new Set(present.map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v)))).size;
        case "sum":
            return numbers.length === 0 ? null : numbers.reduce((a, b) => a + b, 0);
        case "avg":
            return numbers.length === 0 ? null : numbers.reduce((a, b) => a + b, 0) / numbers.length;
        case "median": {
            if (numbers.length === 0) return null;
            const sorted = numbers.slice().sort((a, b) => a - b);
            const mid = sorted.length >> 1;
            return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        }
        case "min":
        case "max": {
            const pool = numbers.length === present.length ? numbers : present.filter((v): v is string => typeof v === "string");
            if (pool.length === 0) return null;
            return (pool as (number | string)[]).reduce((a, b) => ((kind === "min" ? b < a : b > a) ? b : a));
        }
        case "range":
            return numbers.length === 0 ? null : Math.max(...numbers) - Math.min(...numbers);
        case "percentTrue": {
            const booleans = values.filter((v): v is boolean => typeof v === "boolean");
            return booleans.length === 0 ? null : (booleans.filter(Boolean).length / booleans.length) * 100;
        }
        case "percentEmpty":
            return values.length === 0 ? null : ((values.length - present.length) / values.length) * 100;
    }
}

/** Whether a (parsed) value is unacceptable for the column's type; the grid refuses the edit. Empty is always acceptable. */
export function isInvalidForType(column: TypedColumn, value: unknown): boolean {
    if (isEmpty(value)) return false;
    switch (column.type) {
        case "number":
            return typeof value !== "number" || !Number.isFinite(value);
        case "link":
            return safeHref(linkParts(value)?.href) === null;
        case "date":
            return !isCivilDate(value);
        case "time":
            return !isCivilTime(value);
        case "time-zone":
            return !isZonedTime(value);
        case "select":
        case "radio":
            return !(column.options ?? []).some((o) => o.id === value);
        case "person":
            return peopleOf(value).length === 0;
        default:
            return false;
    }
}

const optionLabel = (column: TypedColumn, id: unknown): string => {
    const found = (column.options ?? []).find((o) => o.id === id);
    return found ? found.label : isEmpty(id) ? "" : String(id);
};

/** Formats a result by its declared type, so a rollup or formula of dates reads like a date. */
function resultFormatter(column: TypedColumn, locale: string | undefined): (value: unknown) => string {
    const type = column.resultType ?? "text";
    if (type === "number") {
        const formatter = locale || column.numberFormat ? new Intl.NumberFormat(locale, column.numberFormat) : null;
        return (v) => (typeof v === "number" && Number.isFinite(v) ? (formatter ? formatter.format(v) : String(v)) : isEmpty(v) ? "" : String(v));
    }
    if (type === "date") {
        const formatter = locale || column.dateFormat ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", ...column.dateFormat, timeZone: "UTC" }) : null;
        return (v) => {
            if (isEmpty(v)) return "";
            const date = civilDateToDate(v);
            return date ? (formatter ? formatter.format(date) : date.toISOString().slice(0, 10)) : String(v);
        };
    }
    return (v) => (isEmpty(v) ? "" : String(v));
}

/** Defaults a `type` gives its column. Anything the column sets itself replaces the matching default. */
function typeDefaults(column: TypedColumn, gridLocale: string | undefined): Partial<TypedColumn> {
    const locale = column.locale ?? gridLocale;
    switch (column.type) {
        case "text":
            return {
                align: "start",
                editor: "text",
                ...(locale ? { compare: (a, b) => new Intl.Collator(locale).compare(String(a), String(b)) } : {}),
            };
        case "number": {
            const formatter = locale || column.numberFormat ? new Intl.NumberFormat(locale, column.numberFormat) : null;
            return {
                align: "end",
                editor: "number",
                ...(formatter ? { format: (v) => (typeof v === "number" && Number.isFinite(v) ? formatter.format(v) : "") } : {}),
            };
        }
        case "link":
            return {
                align: "start",
                editor: "link",
                format: (v) => linkLabel(v),
                filterText: (v) => {
                    const link = linkParts(v);
                    return link ? `${link.label ?? ""} ${link.href}`.trim() : "";
                },
                compare: (a, b) => {
                    const x = linkLabel(a);
                    const y = linkLabel(b);
                    return locale ? new Intl.Collator(locale).compare(x, y) : x < y ? -1 : x > y ? 1 : 0;
                },
                exportValue: (row) => linkLabel(column.accessor ? column.accessor(row) : row[column.id]),
                parse: (draft, row) => {
                    const previous = linkParts(column.accessor ? column.accessor(row) : row[column.id]);
                    const href = draft.trim();
                    if (!href) return null;
                    return previous && typeof previous === "object" && (previous.label !== undefined || previous.external !== undefined)
                        ? { ...previous, href }
                        : href;
                },
            };
        case "date": {
            const formatter = locale || column.dateFormat
                ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", ...column.dateFormat, timeZone: "UTC" })
                : null;
            return {
                align: "start",
                editor: "date",
                format: (v) => {
                    if (isEmpty(v)) return "";
                    const date = civilDateToDate(v);
                    if (!date) return String(v);
                    return formatter ? formatter.format(date) : date.toISOString().slice(0, 10);
                },
                exportValue: (row) => civilDateToDate(column.accessor ? column.accessor(row) : row[column.id]),
            };
        }
        case "time": {
            const formatter = locale || column.timeFormat
                ? new Intl.DateTimeFormat(locale, { timeStyle: "short", ...column.timeFormat, timeZone: "UTC" })
                : null;
            return {
                align: "start",
                editor: "time",
                format: (v) => {
                    if (isEmpty(v)) return "";
                    if (!isCivilTime(v)) return String(v);
                    return formatter ? formatter.format(new Date(`1970-01-01T${v.length === 5 ? `${v}:00` : v}Z`)) : v;
                },
            };
        }
        case "time-zone": {
            const formatter = locale || column.timeFormat
                ? new Intl.DateTimeFormat(locale, { timeStyle: "short", ...column.timeFormat, timeZone: "UTC" })
                : null;
            const text = (v: unknown) => {
                if (isEmpty(v)) return "";
                if (!isZonedTime(v)) return String(v);
                const time = formatter ? formatter.format(new Date(`1970-01-01T${v.time.length === 5 ? `${v.time}:00` : v.time}Z`)) : v.time;
                return `${time} ${zoneLabel(v.timeZone, locale, column.referenceDate)}`;
            };
            return {
                align: "start",
                editor: "time-zone",
                format: text,
                compare: (a, b) => (zonedMinutes(a, column.referenceDate) ?? 0) - (zonedMinutes(b, column.referenceDate) ?? 0),
                exportValue: (row) => {
                    const v = column.accessor ? column.accessor(row) : row[column.id];
                    return isZonedTime(v) ? `${v.time} ${v.timeZone}` : null;
                },
            };
        }
        case "person": {
            const names = (v: unknown) => peopleOf(v).map(personName);
            const collator = locale ? new Intl.Collator(locale) : null;
            const order = (a: string, b: string) => (collator ? collator.compare(a, b) : a < b ? -1 : a > b ? 1 : 0);
            return {
                align: "start",
                editor: "person",
                format: (v) => names(v).join("; "),
                filterText: (v) => peopleOf(v).map((p) => `${personName(p)} ${p.email ?? ""}`.trim()).join(" "),
                compare: (a, b) => {
                    const x = names(a);
                    const y = names(b);
                    return order(x[0] ?? "", y[0] ?? "") || x.length - y.length;
                },
                exportValue: (row) => {
                    const value = column.accessor ? column.accessor(row) : row[column.id];
                    const parts = column.exportAs === "email" ? peopleOf(value).map((p) => p.email ?? "") : names(value);
                    const joined = parts.join("; ");
                    return joined.replace(/[;\s]/g, "") === "" ? null : joined;
                },
            };
        }
        case "file": {
            const names = (v: unknown) => filesOf(v).map((f) => f.name);
            const collator = locale ? new Intl.Collator(locale) : null;
            const order = (a: string, b: string) => (collator ? collator.compare(a, b) : a < b ? -1 : a > b ? 1 : 0);
            return {
                align: "start",
                format: (v) => names(v).join("; "),
                filterText: (v) => names(v).join(" "),
                compare: (a, b) => {
                    const x = names(a);
                    const y = names(b);
                    return order(x[0] ?? "", y[0] ?? "") || x.length - y.length;
                },
                exportValue: (row) => {
                    const joined = names(column.accessor ? column.accessor(row) : row[column.id]).join("; ");
                    return joined === "" ? null : joined;
                },
            };
        }
        case "select":
        case "radio": {
            const order = new Map((column.options ?? []).map((o, i) => [o.id, i]));
            return {
                align: "start",
                editor: column.type === "select" ? "select" : "radio",
                format: (v) => optionLabel(column, v),
                filterText: (v) => optionLabel(column, v),
                compare:
                    column.type === "radio" || column.sortBy === "order"
                        ? (a, b) => (order.get(a as string) ?? Infinity) - (order.get(b as string) ?? Infinity)
                        : (a, b) =>
                              locale
                                  ? new Intl.Collator(locale).compare(optionLabel(column, a), optionLabel(column, b))
                                  : optionLabel(column, a) < optionLabel(column, b)
                                    ? -1
                                    : optionLabel(column, a) > optionLabel(column, b)
                                      ? 1
                                      : 0,
                exportValue: (row) => {
                    const id = column.accessor ? column.accessor(row) : row[column.id];
                    return column.exportAs === "id" ? (isEmpty(id) ? null : id) : isEmpty(id) ? null : optionLabel(column, id);
                },
            };
        }
        default:
            return {};
    }
}

/**
 * The column with its type's defaults filled in under its own props. A column with no `type` is returned as is.
 * `rows` is every row: a `formula` hands it to the consumer's engine for references to other rows. A rollup's and a
 * formula's results are computed once per row each time the columns are resolved (`rows` or `columns` changed),
 * never per comparison or keystroke.
 */
export function resolveColumn<T extends TypedColumn>(column: T, gridLocale?: string, rows: Record<string, unknown>[] = []): T {
    if (!column.type) return column;
    const defaults = typeDefaults(column, gridLocale) as Record<string, unknown>;
    const own = Object.fromEntries(Object.entries(column).filter(([, v]) => v !== undefined));
    const resolved = { ...defaults, ...own } as Record<string, unknown>;
    const locale = column.locale ?? gridLocale;

    if (column.type === "rollup") {
        const relation = column.relation ?? (column.accessor ? (row: Record<string, unknown>) => column.accessor!(row) as unknown[] : (row: Record<string, unknown>) => row[column.id] as unknown[]);
        const cache = new WeakMap<object, unknown>();
        const format = resultFormatter(column, locale);
        resolved.accessor = (row: Record<string, unknown>) => {
            if (cache.has(row)) return cache.get(row);
            const related = relation(row);
            const values = Array.isArray(related) ? related : [];
            const result = column.reduce ? column.reduce(values, row) : aggregateValues(column.aggregate ?? "count", values);
            cache.set(row, result);
            return result;
        };
        resolved.editable = false;
        resolved.align = column.align ?? (column.resultType === "number" ? "end" : "start");
        if (column.format === undefined) resolved.format = (v: unknown) => format(v);
        if (column.exportValue === undefined) {
            resolved.exportValue = (row: Record<string, unknown>) => {
                const v = (resolved.accessor as (r: Record<string, unknown>) => unknown)(row);
                return column.resultType === "date" ? civilDateToDate(v) : isEmpty(v) ? null : v;
            };
        }
    } else if (column.type === "formula") {
        const source = column.accessor ?? ((row: Record<string, unknown>) => row[column.id]);
        const cache = new WeakMap<object, DataGridFormulaResult>();
        const format = resultFormatter(column, locale);
        const result = (row: Record<string, unknown>): DataGridFormulaResult => {
            let found = cache.get(row);
            if (!found) {
                const expression = source(row);
                if (isEmpty(expression)) found = { value: null };
                else if (typeof column.evaluate !== "function") found = { value: expression };
                else {
                    try {
                        found = column.evaluate(String(expression), { row, rows, columnId: column.id });
                    } catch (error) {
                        found = { error: error instanceof Error ? error.message : String(error) };
                    }
                }
                cache.set(row, found);
            }
            return found;
        };
        const valueOf = (row: Record<string, unknown>) => {
            const r = result(row);
            return "error" in r ? null : r.value;
        };
        resolved.source = source;
        resolved.errorOf = (row: Record<string, unknown>) => {
            const r = result(row);
            return "error" in r ? r.error : undefined;
        };
        resolved.accessor = valueOf;
        resolved.align = column.align ?? (column.resultType === "number" ? "end" : "start");
        if (column.format === undefined) {
            resolved.format = (v: unknown, row: Record<string, unknown>) => {
                const message = (resolved.errorOf as (r: Record<string, unknown>) => string | undefined)(row);
                return message !== undefined ? message : format(v);
            };
        }
        if (column.exportValue === undefined) {
            resolved.exportValue = (row: Record<string, unknown>) => {
                const message = (resolved.errorOf as (r: Record<string, unknown>) => string | undefined)(row);
                if (message !== undefined) return message;
                const v = valueOf(row);
                return column.resultType === "date" ? civilDateToDate(v) : isEmpty(v) ? null : v;
            };
        }
        if (column.filterText === undefined) {
            resolved.filterText = (v: unknown, row: Record<string, unknown>) =>
                (resolved.format as (v: unknown, row: Record<string, unknown>) => string)(v, row);
        }
    }
    return resolved as T;
}
