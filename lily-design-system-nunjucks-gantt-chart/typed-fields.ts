// Typed fields for the kanban board, Gantt chart and calendar: a field is a named bundle of display, edit and export
// defaults from the data grid's cell types, read from a record's `values[id]`. These are the framework-free pieces
// (resolve, read, format, draft, parse, validate, export); each component adds only its own markup and state.
// Plain data, no English, no default locale: with no `locale` a value shows as stored.

import { isInvalidForType, resolveColumn, type DataGridCellType, type TypedColumn } from "./cell-types";

/** A typed field. `header` names it everywhere (column header, label, export header). */
export type FieldDef = Omit<TypedColumn, "type"> & {
    /** Visible name of the field; also the header of its export column. */
    header: string;
    /** The kind of value: `text`, `number`, `link`, `date`, `time`, `select` or `radio` are editable; the others display and export only. */
    type?: DataGridCellType;
    /** Set `false` to keep this field out of an export. */
    exportable?: boolean;
    /** Accessible name of the field's editor. Defaults to `header`. */
    editLabel?: string;
};

/** A field with its type's defaults filled in. */
export type ResolvedField = FieldDef & TypedColumn;

/** The values of a record, by field id. */
export type FieldValues = Record<string, unknown> | undefined;

/** A field's editor draft: a text input's string, or a number input's number (null when empty). */
export type Draft = string | number | null;

const EDITABLE_TYPES = new Set(["text", "number", "link", "date", "time", "select", "radio"]);

/** The fields with type defaults (format, compare, export value) resolved. Call once per `fields` / `locale` change, never per record or keystroke. */
export function resolveFields(fields: FieldDef[] | undefined, locale?: string): ResolvedField[] {
    return (fields ?? []).map((f) => resolveColumn(f as ResolvedField, locale) as ResolvedField);
}

/** Whether the field's type has an editor here (the host still decides whether editing is on). */
export const isEditableField = (f: FieldDef): boolean => f.editable !== false && EDITABLE_TYPES.has(f.type ?? "text");

/** The editor control: `"text"`, `"number"`, `"date"`, `"time"`, `"select"` or `"radio"` (a select). */
export const editorKind = (f: FieldDef): string => f.editor ?? f.type ?? "text";

export function fieldValue(f: ResolvedField, values: FieldValues): unknown {
    const row = values ?? {};
    return f.accessor ? f.accessor(row) : row[f.id];
}

/** The text a value shows as; empty when there is no value. */
export function fieldText(f: ResolvedField, values: FieldValues): string {
    const value = fieldValue(f, values);
    if (value === null || value === undefined || value === "") return "";
    return f.format ? f.format(value, values ?? {}) : String(value);
}

/** The text an editor starts with. */
export function draftOf(f: ResolvedField, values: FieldValues): string {
    const value = fieldValue(f, values);
    if (value === null || value === undefined) return "";
    if (f.type === "link") return typeof value === "string" ? value : String((value as { href?: string }).href ?? "");
    return String(value);
}

/** The value an editor's draft stands for. */
export function parseDraft(f: ResolvedField, raw: Draft): unknown {
    // A number input's bound value arrives as a number (or null when empty), whatever the draft was typed as.
    const draft = raw === null || raw === undefined ? "" : String(raw);
    if (f.parse) return f.parse(draft, {});
    const kind = editorKind(f);
    if (kind === "number") return draft.trim() === "" ? null : Number(draft);
    if (kind === "date" || kind === "time" || kind === "select" || kind === "radio") return draft === "" ? null : draft;
    return draft;
}

/** What committing a draft does: refused as invalid for the type, or accepted (and whether it differs from what was there). */
export type EditOutcome = { invalid: true } | { invalid: false; value: unknown; previous: unknown; changed: boolean; text: string };

export function evaluateEdit(f: ResolvedField, values: FieldValues, raw: Draft): EditOutcome {
    const value = parseDraft(f, raw);
    if (isInvalidForType(f, value)) return { invalid: true };
    const previous = fieldValue(f, values);
    return { invalid: false, value, previous, changed: value !== previous, text: value === null || value === undefined ? "" : String(value) };
}

/** One field for an export: typed values stay numbers, booleans and dates; everything else is the text shown. */
export function exportFieldCell(f: ResolvedField, values: FieldValues): unknown {
    if (f.exportValue) return f.exportValue(values ?? {});
    const value = fieldValue(f, values);
    if (value === null || value === undefined) return null;
    if (typeof value === "number" || typeof value === "boolean" || value instanceof Date) return value;
    return fieldText(f, values);
}

/** The fields an export includes. */
export const exportableFields = (fields: ResolvedField[]): ResolvedField[] => fields.filter((f) => f.exportable !== false);

/** Which field a Tab / Shift+Tab from `fieldId` moves to: the next (previous) editable field among `editable`, or undefined past the end. */
export function neighbourField(editable: ResolvedField[], fieldId: string, backwards: boolean): ResolvedField | undefined {
    const at = editable.findIndex((x) => x.id === fieldId);
    return editable[at + (backwards ? -1 : 1)];
}
