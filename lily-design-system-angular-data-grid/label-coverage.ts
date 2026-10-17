/**
 * Which `labels` a grid needs, by what it renders — so an app can check that it has supplied every string for its locale, and a
 * grid can say, in development, which control it is about to leave unnamed. Lily ships no English: a missing label is a control with
 * no name, or an announcement that is never made, never English text. Pure, so it is unit-tested on its own.
 */

/** What the grid is showing, as far as labels are concerned. */
export type LabelFeatures = {
    /** `selectionMode` is not `none`. */
    selection?: boolean;
    /** `pageSize` is set. */
    pagination?: boolean;
    /** Some column is `hidable`. */
    hidableColumns?: boolean;
    /** Some column is `resizable`. */
    resizableColumns?: boolean;
    /** Some column is editable (`onCellEdit` is set). */
    editing?: boolean;
    /** Some column is `sortable`. */
    sorting?: boolean;
    /** The search field is wanted (the field itself is gated by `labels.search`). */
    search?: boolean;
    /** Export or copy buttons are wanted. */
    exporting?: boolean;
};

/** Labels that **name a control**: without one the control is unnamed to a screen reader (or not rendered at all). */
export const CONTROL_LABELS = {
    selection: ["selectAll", "selectionColumn", "selectRow"],
    pagination: ["previousPage", "nextPage", "pageStatus"],
    hidableColumns: ["columnVisibility", "columnVisibilityOption"],
    resizableColumns: ["resizeHandle"],
    editing: ["editCell", "cellEditor"],
    search: ["search"],
    exporting: ["export"],
} as const;

/** Labels that make an **announcement** through the live region: without one the change is silent. */
export const ANNOUNCEMENT_LABELS = {
    sorting: ["sortAnnouncement"],
    search: ["filterAnnouncement"],
    selection: ["selectionAnnouncement"],
    pagination: ["pageAnnouncement"],
    editing: ["editAnnouncement", "editCancelAnnouncement", "editError", "undoAnnouncement", "redoAnnouncement"],
    exporting: ["exportAnnouncement", "copyAnnouncement", "copyFailed"],
} as const;

export type LabelKind = "control" | "announcement";

/** Every label key the features in use call for, with its kind. */
export function requiredLabels(features: LabelFeatures): { key: string; kind: LabelKind }[] {
    const out: { key: string; kind: LabelKind }[] = [];
    const add = (table: Record<string, readonly string[]>, kind: LabelKind) => {
        for (const feature of Object.keys(table) as (keyof LabelFeatures)[]) {
            if (!features[feature]) continue;
            for (const key of table[feature]) if (!out.some((o) => o.key === key)) out.push({ key, kind });
        }
    };
    add(CONTROL_LABELS, "control");
    add(ANNOUNCEMENT_LABELS, "announcement");
    return out;
}

/** The required labels that are absent (`undefined`, `null` or an empty string) from `labels`. */
export function missingLabels(features: LabelFeatures, labels: Record<string, unknown> | undefined): { key: string; kind: LabelKind }[] {
    return requiredLabels(features).filter(({ key }) => {
        const value = labels?.[key];
        return value === undefined || value === null || value === "";
    });
}
