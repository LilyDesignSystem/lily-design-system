// Cell types for DataGrid: a `column.type` is a named bundle of defaults for the
// hooks a column already has (`format`, `compare`, `filterText`, `exportValue`,
// `align`, `editor`). Nothing here is new machinery: `resolveColumn` fills in
// what the column left out, and a column's own props always win.
//
// Values are plain data. Display is derived: no English, no default locale (with
// no `locale` a value shows as stored), no HTML, no icons. See
// spec/cell-types/index.md.

export type DataGridCellType = "text" | "number" | "link" | "date" | "time" | "select" | "radio";

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
    exportAs?: "label" | "id";
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
        case "select":
        case "radio":
            return !(column.options ?? []).some((o) => o.id === value);
        default:
            return false;
    }
}

const optionLabel = (column: TypedColumn, id: unknown): string => {
    const found = (column.options ?? []).find((o) => o.id === id);
    return found ? found.label : isEmpty(id) ? "" : String(id);
};

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

/** The column with its type's defaults filled in under its own props. A column with no `type` is returned as is. */
export function resolveColumn<T extends TypedColumn>(column: T, gridLocale?: string): T {
    if (!column.type) return column;
    const defaults = typeDefaults(column, gridLocale) as Record<string, unknown>;
    const own = Object.fromEntries(Object.entries(column).filter(([, v]) => v !== undefined));
    return { ...defaults, ...own } as T;
}
