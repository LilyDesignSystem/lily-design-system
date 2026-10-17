/**
 * `<kanban-board>` — Lily Design System HTML helper.
 *
 * See `./spec/index.md` for the canonical contract. This file implements
 * the custom-element class but does NOT register it. The `index.ts`
 * barrel registers it on import.
 *
 * A headless interactive kanban board: cards move between columns by
 * pointer drag-and-drop or, independently, by a keyboard-accessible
 * per-card "Move to…" menu — never drag-only (WCAG 2.5.7). WAI-ARIA APG
 * Grid roving-tabindex keyboard navigation across a rectangular grid
 * (columns × the largest column's card count).
 *
 * The table structure (`kanban-table`/`kanban-table-th`/
 * `kanban-table-td`/…) is this catalog's markup CONTRACT, documented in
 * `@lilydesignsystem/html-headless`'s `components/kanban-table*.html`
 * reference files — those are static templates, not JS classes, so this
 * element builds the class names/attributes they document by hand,
 * exclusively via `document.createElement`/`appendChild` (never
 * `innerHTML`/template strings: a `thead`/`tbody`/`tr`/`th`/`td` start
 * tag is silently dropped by the HTML parser whenever it isn't already
 * inside a real `<table>`'s own insertion mode, for `innerHTML` exactly
 * as for literal light-DOM children).
 *
 * The move menu reuses `@lilydesignsystem/html-headless`'s
 * `ListboxController` for its keyboard behaviour, the same module
 * `theme-picker` composes for its own dropdown.
 */
import { ListboxController } from "@lilydesignsystem/html-headless/components/listbox-controller.js";
import { copyToClipboard, downloadBlob, exportBlob, exportFilename, toClipboardText, type ExportFormat } from "./export-data.js";
import { highlightSegments, matchesSearch } from "./search-text.js";
import { isRtl, logicalKey } from "./direction.js";
import { gridMove, pageStepFor } from "./grid-navigation.js";
import { EMPTY_HISTORY, historyKey, recordEdit, redoEdit, undoEdit, type EditHistory } from "./edit-history.js";
import { findTypeaheadMatch, isTypeaheadKey, nextTypeaheadState, type TypeaheadState } from "./typeahead.js";
import {
    draftOf,
    editorKind,
    evaluateEdit,
    exportFieldCell,
    exportableFields,
    fieldText,
    isEditableField,
    neighbourField,
    resolveFields,
    type Draft,
    type FieldDef,
    type ResolvedField,
} from "./typed-fields.js";

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * A typed field a card carries (an owner, a due date, an estimate): a bundle of display, sort and export defaults from
 * the data grid's cell types, read from `card.values[id]`. Plain data; the board shows it as text.
 */
export type KanbanField = FieldDef;

/** What `onExport` and the `exportfile` event receive. Return `false` from `onExport` to take over the download. */
export type KanbanExport = { format: ExportFormat; filename: string; cardCount: number; blob: Blob };

/** What `onFieldEdit` and the `fieldedit` event carry. */
export type KanbanFieldEdit = { cardId: string; fieldId: string; value: unknown; previous: unknown };

export type KanbanColumn = {
    /** Stable column identifier. */
    id: string;
    /** Visible column title. */
    title: string;
    /** Work-in-progress limit; the column warns when its card count exceeds this. */
    wipLimit?: number;
    /** A hard limit: a move into this column is refused once it holds `wipLimit` cards. */
    strictLimit?: boolean;
    /** A non-colour status for the column (for example "Over capacity"): visible text in its header and `data-flag`. */
    flag?: string;
    /** A hook for per-column colour: becomes `data-accent` on the header and every cell. Lily sets no colour. */
    accent?: string;
};

/** A swimlane: a horizontal band of rows (an owner, an account) that cards are grouped into. */
export type KanbanLane = {
    /** Stable lane identifier. */
    id: string;
    /** Visible lane title. */
    title: string;
};

export type KanbanCard = {
    /** Stable card identifier. */
    id: string;
    /** The column this card currently belongs to. */
    columnId: string;
    /** Visible card title. */
    title: string;
    /** A locked card cannot be moved, dragged or reordered (`data-locked` on its cell); it still counts toward WIP limits. */
    locked?: boolean;
    /** A second line under the title (a priority, "source · score", an amount). */
    subtitle?: string;
    /** Short labels shown under the subtitle (each a `.kanban-board-card-badge`). */
    badges?: string[];
    /** A non-colour status (for example "SLA breached"): visible text, `data-flag`, and linked to the cell with `aria-describedby`. */
    flag?: string;
    /** Makes the title a link to the record (`<a href>`). */
    href?: string;
    /** `false` stops pointer dragging this card while keeping the move menu and keyboard moves. */
    draggable?: boolean;
    /** The swimlane this card sits in (an id from `lanes`); the first lane when absent. */
    laneId?: string;
    /** Values of the board's `fields`, by field id. */
    values?: Record<string, unknown>;
};

/** What `renderCard` receives. */
export type KanbanCardContext = { card: KanbanCard; label: string; column: KanbanColumn; pending: boolean };

/** What `renderColumnHeader` / `renderColumnFooter` receive: the column and every card in it (unfiltered). */
export type KanbanColumnContext = { column: KanbanColumn; cards: KanbanCard[]; count: number };

/**
 * Every field is optional, but its presence gates the control it names —
 * no baked-in English fallback, matching every other helper's
 * label-gating convention. See spec/index.md §5.
 */
export type KanbanLabels = {
    /** Accessible name of the export button group. Gates the group (with at least one of the three buttons). */
    export?: string;
    /** Visible text of the CSV, TSV and Excel export buttons. Each gates its button. */
    exportCsv?: string;
    exportTsv?: string;
    exportExcel?: string;
    /** Announced after an export: (format, how many cards, file name). */
    exportAnnouncement?: (format: ExportFormat, cardCount: number, filename: string) => string;
    /** Visible text of the copy button, which puts the export (header row first, tab-separated) on the clipboard for pasting into a spreadsheet. Gates the button (with `exportHeaders`). */
    copy?: string;
    /** Announced after a copy: (how many rows). */
    copyAnnouncement?: (rowCount: number) => string;
    /** Announced when the clipboard could not be written. */
    copyFailed?: string;
    /** Announced after the search changes: (matching cards, all cards). */
    searchAnnouncement?: (matchCount: number, totalCount: number) => string;
    /** Headers of the export's own columns (card title, column, lane, subtitle, badges, flag). An export needs `exportHeaders`; there is no English default. */
    exportHeaders?: { title: string; column: string; lane?: string; subtitle?: string; badges?: string; flag?: string };
    /** Announced after a field edit: (card title, field header, the new text). */
    editAnnouncement?: (cardTitle: string, fieldHeader: string, text: string) => string;
    /** Announced when an edit is refused as invalid for the field's type: (card title, field header). */
    editInvalid?: (cardTitle: string, fieldHeader: string) => string;
    /** Announced when a field's `validate` refuses a value: (card title, field header, the reason). Falls back to `editInvalid`. */
    editRefused?: (cardTitle: string, fieldHeader: string, message: string) => string;
    /** Announced after Ctrl/Cmd+Z puts an earlier field value back: (card title, field header, the restored text). */
    fieldUndoAnnouncement?: (cardTitle: string, fieldHeader: string, text: string) => string;
    /** Announced after Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies a field edit: (card title, field header, the text). */
    fieldRedoAnnouncement?: (cardTitle: string, fieldHeader: string, text: string) => string;
    cardCount?: (count: number) => string;
    overLimit?: (count: number, limit: number) => string;
    moveButton?: (card: KanbanCard) => string;
    moveMenuLabel?: string;
    moveAnnouncement?: (cardTitle: string, columnTitle: string) => string;
    /** Announced when `canMove` refuses a move. */
    moveBlocked?: (cardTitle: string, columnTitle: string) => string;
    /** Announced after Alt+ArrowUp/Down reorders a card; `position` is 1-based. */
    reorderAnnouncement?: (cardTitle: string, position: number, total: number) => string;
    /** Accessible name for a column's collapse toggle. Gates the toggle. */
    collapseColumn?: (column: KanbanColumn, collapsed: boolean) => string;
    /** Accessible name for a column's add-card button. Gates the button. */
    addCard?: (column: KanbanColumn) => string;
    /** Message shown in an empty column (a column with no cards to show). Gates the message. */
    emptyColumn?: (column: KanbanColumn) => string;
    /** Announced while an async `moveHandler` is pending: (card title, column title). */
    movePending?: (cardTitle: string, columnTitle: string) => string;
    /** Announced when an async `moveHandler` rejects and the card goes back: (card title, column title, the rejection). */
    moveFailed?: (cardTitle: string, columnTitle: string, error: unknown) => string;
    /** Accessible name for a lane's collapse toggle: (lane, collapsed). Gates the toggle. */
    collapseLane?: (lane: KanbanLane, collapsed: boolean) => string;
    /** Visible card count in a lane header: (lane, how many cards). Gates the count. */
    laneCount?: (lane: KanbanLane, count: number) => string;
    /** Accessible name of the board's search field. Gates the field. */
    search?: string;
    /** Announced after several selected cards move together: (how many moved, destination column title). */
    moveManyAnnouncement?: (count: number, columnTitle: string) => string;
    /** Visible text of the undo button. Gates the button (with `undoable`). */
    undo?: string;
    /** Announced after an undo: (card title, column it went back to). */
    undoAnnouncement?: (cardTitle: string, columnTitle: string) => string;
    /** Announced after undoing a group of moves: (how many). */
    undoManyAnnouncement?: (count: number) => string;
    /** Announced after a column moves: (column title, 1-based position, how many columns). */
    columnMoveAnnouncement?: (columnTitle: string, position: number, count: number) => string;
};

type UndoStep = { cardId: string; fromColumnId: string; toColumnId: string };

type Slot =
    | { kind: "lane"; lane: KanbanLane }
    | { kind: "row"; rowIndex: number; laneId: string; laneRow: number };

type Layout = {
    /** Row index → slot index, so a row does not scan `slots` to find itself. */
    slotIndexByRow: Map<number, number>;
    cardsByColumn: Map<string, KanbanCard[]>;
    cell: Map<string, KanbanCard[]>;
    slots: Slot[];
    rows: Extract<Slot, { kind: "row" }>[];
    maxRows: number;
};

/** Detail of the `reordercard` event, paired with the `onReorder` property. */
export type KanbanBoardReorderDetail = {
    cardId: string;
    /** 0-based index within the card's own column. */
    toIndex: number;
};

/** Detail of the `movecard` event, paired with the `onMove` property. */
export type KanbanBoardMoveDetail = {
    cardId: string;
    toColumnId: string;
    /** 0-based position in the visible column; present only when a pointer drop landed on a card. */
    toIndex?: number;
    /** The destination lane; present only when a drop landed in a lane's cell. */
    toLaneId?: string;
};

/** Mirrors the observed attributes / properties for typing convenience. */
export type KanbanBoardProps = {
    label: string;
    caption?: string;
    columns: KanbanColumn[];
    cards: KanbanCard[];
    cardLabel?: (card: KanbanCard) => string;
    onMove?: (cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string) => void;
    moveHandler?: (cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string) => void | Promise<unknown>;
    lanes?: KanbanLane[];
    selectable?: boolean;
    selected?: string[];
    onSelectionChange?: (selected: string[]) => void;
    dragPreviewText?: (cards: KanbanCard[]) => string;
    undoable?: boolean;
    movableColumns?: boolean;
    columnOrder?: string[];
    onColumnOrderChange?: (order: string[]) => void;
    virtualize?: { rowHeight: number; height: number; overscan?: number };
    onMoveError?: (cardId: string, toColumnId: string, error: unknown) => void;
    allowedColumns?: (card: KanbanCard) => string[];
    filter?: (card: KanbanCard) => boolean;
    compare?: (a: KanbanCard, b: KanbanCard) => number;
    cardAttrs?: (card: KanbanCard) => Record<string, string>;
    searchText?: (card: KanbanCard) => string;
    onReorder?: (cardId: string, toIndex: number) => void;
    canMove?: (card: KanbanCard, toColumn: KanbanColumn) => boolean;
    readonly?: boolean;
    collapsedColumns?: string[];
    onCollapsedChange?: (collapsedColumns: string[]) => void;
    collapsedLanes?: string[];
    onCollapsedLanesChange?: (collapsedLanes: string[]) => void;
    onAddCard?: (columnId: string) => void;
    labels?: KanbanLabels;
    fields?: KanbanField[];
    locale?: string;
    onFieldEdit?: (edit: KanbanFieldEdit) => void;
    editableFields?: boolean;
    exportFilename?: string;
    exportScope?: "view" | "selected";
    onExport?: (file: KanbanExport) => boolean | void;
    class?: string;
};

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextKanbanBoardId(): string {
    uid += 1;
    return `kanban-board-${uid}`;
}

const defaultCardLabel = (card: KanbanCard): string => card.title;

/** Custom-element class implementing `<kanban-board>`. */
export class KanbanBoard extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "caption", "class", "readonly", "search"];
    }

    // Backing storage for property-only members (arrays of objects and
    // functions can't be attributes — the same rule `date-time-picker`'s
    // §4.3 documents for its own `labels`/`shortcuts`/callbacks).
    #columns: KanbanColumn[] = [];
    /** Columns in display order: those named in `columnOrder` first, the rest after in their own order. */
    #ordered(): KanbanColumn[] {
        const order = this.#columnOrder;
        if (order.length === 0) return this.#columns;
        const rank = (id: string) => (order.indexOf(id) === -1 ? order.length : order.indexOf(id));
        return this.#columns
            .map((c, i) => ({ c, i }))
            .sort((a, b) => rank(a.c.id) - rank(b.c.id) || a.i - b.i)
            .map((x) => x.c);
    }
    #cards: KanbanCard[] = [];
    #cardLabel: (card: KanbanCard) => string = defaultCardLabel;
    #onMove: ((cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string) => void) | undefined;
    #moveHandler: ((cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string) => void | Promise<unknown>) | undefined;
    #lanes: KanbanLane[] | undefined;
    #selectable = false;
    #selected: string[] = [];
    #onSelectionChange: ((selected: string[]) => void) | undefined;
    #dragPreviewText: ((cards: KanbanCard[]) => string) | undefined;
    #undoable = false;
    #onCopy?: (copy: { text: string; rowCount: number }) => boolean | void;
    #history: EditHistory = EMPTY_HISTORY;
    #typeahead: TypeaheadState = { prefix: "", at: 0 };
    #dropBlocked = false;
    #undoStack: UndoStep[][] = [];
    #undoBtn: HTMLButtonElement | null = null;
    #movableColumns = false;
    #columnOrder: string[] = [];
    #onColumnOrderChange: ((order: string[]) => void) | undefined;
    #virtualize: { rowHeight: number; height: number; overscan?: number } | undefined;
    #scrollTop = 0;
    #scrollEl: HTMLDivElement | null = null;
    #windowSig = "";
    #draggingColumnId: string | null = null;
    #onMoveError: ((cardId: string, toColumnId: string, error: unknown) => void) | undefined;
    #allowedColumns: ((card: KanbanCard) => string[]) | undefined;
    #filter: ((card: KanbanCard) => boolean) | undefined;
    #compare: ((a: KanbanCard, b: KanbanCard) => number) | undefined;
    #cardAttrs: ((card: KanbanCard) => Record<string, string>) | undefined;
    #searchText: ((card: KanbanCard) => string) | undefined;
    /** Cards moved optimistically by an async `moveHandler` that has not settled: id → destination column. */
    #optimistic: Record<string, string> = {};
    #dropTarget: string | null = null;
    #onReorder: ((cardId: string, toIndex: number) => void) | undefined;
    #canMove: ((card: KanbanCard, toColumn: KanbanColumn) => boolean) | undefined;
    #labels: KanbanLabels = {};
    #collapsed: string[] = [];
    #onCollapsedChange: ((collapsedColumns: string[]) => void) | undefined;
    #collapsedLanes: string[] = [];
    #onCollapsedLanesChange: ((collapsedLanes: string[]) => void) | undefined;
    #onAddCard: ((columnId: string) => void) | undefined;
    #fields: KanbanField[] | undefined;
    #resolvedFields: ResolvedField[] = [];
    #locale: string | undefined;
    #onFieldEdit: ((edit: KanbanFieldEdit) => void) | undefined;
    #editableFields = false;
    #exportFilename = "kanban-board";
    #exportScope: "view" | "selected" = "view";
    #onExport: ((file: KanbanExport) => boolean | void) | undefined;
    /** The field being edited, if any: the draft is the editor's text, kept current by the editor's own events (no re-render per keystroke). */
    #editing: { cardId: string; fieldId: string; draft: Draft; invalid?: boolean } | null = null;
    /** The cards a render shows, kept for export. */
    #exportCards: KanbanCard[] = [];

    // Rendered-DOM references.
    #rootEl: HTMLDivElement | null = null;
    #statusEl: HTMLParagraphElement | null = null;
    #statusMessage = "";

    // Roving-tabindex cursor (WAI-ARIA APG Grid pattern).
    #focusedRow = 0;
    #focusedCol = 0;
    // `"row-col"` -> the <td>. Rebuilt every #render(); read on every
    // focus move so moving the cursor never needs a structural rebuild.
    #cellEls = new Map<string, HTMLTableCellElement>();

    // Per-card move-button reference, keyed by card id — NOT a single
    // shared variable. Every other framework catalog's kanban-board port
    // independently found the same latent bug in the Svelte reference:
    // binding one shared element reference across every card's button
    // refocuses whichever card mounted last, not the card whose menu
    // closed. A `Map<cardId, button>` makes that bug structurally
    // impossible here — see kanban-board.test.ts's dedicated regression
    // test and spec/index.md §10.
    #moveButtonEls = new Map<string, HTMLButtonElement>();

    // Move menu (at most one open at a time).
    #openCardId: string | null = null;
    #moveListEl: HTMLUListElement | null = null;
    #moveOptionEls: HTMLLIElement[] = [];
    #moveController: ListboxController | null = null;

    // Pointer drag-and-drop (supplementary, never the only path).
    #draggingCardId: string | null = null;

    readonly #baseId = nextKanbanBoardId();

    // ---- Property accessors ----

    get label(): string {
        return this.getAttribute("label") ?? "";
    }
    set label(v: string) {
        this.setAttribute("label", v);
    }

    get caption(): string {
        return this.getAttribute("caption") ?? "";
    }
    set caption(v: string) {
        if (v) this.setAttribute("caption", v);
        else this.removeAttribute("caption");
    }

    get columns(): KanbanColumn[] {
        return [...this.#columns];
    }
    set columns(v: KanbanColumn[]) {
        this.#columns = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    get cards(): KanbanCard[] {
        return [...this.#cards];
    }
    set cards(v: KanbanCard[]) {
        this.#cards = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    get cardLabel(): (card: KanbanCard) => string {
        return this.#cardLabel;
    }
    set cardLabel(fn: ((card: KanbanCard) => string) | undefined) {
        this.#cardLabel = fn ?? defaultCardLabel;
        this.#render();
    }

    get onMove(): ((cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string) => void) | undefined {
        return this.#onMove;
    }
    set onMove(fn: ((cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string) => void) | undefined) {
        this.#onMove = fn;
    }

    /** Swimlanes: horizontal bands of rows. Each card sits in the lane named by `card.laneId` (the first lane when absent). A drop into another lane's cell changes the lane: `onMove` / `movecard` carry the lane id. */
    get lanes(): KanbanLane[] | undefined {
        return this.#lanes ? [...this.#lanes] : undefined;
    }
    set lanes(v: KanbanLane[] | undefined) {
        this.#lanes = Array.isArray(v) ? v.slice() : undefined;
        this.#render();
    }

    /** Several cards can be selected and moved together: Ctrl/Cmd+click or the `x` key toggles the card under the cursor. */
    get selectable(): boolean {
        return this.#selectable;
    }
    set selectable(v: boolean) {
        this.#selectable = !!v;
        this.#render();
    }

    /** The selected card ids; the `selectionchange` event and `onSelectionChange` report changes. */
    get selected(): string[] {
        return [...this.#selected];
    }
    set selected(v: string[]) {
        this.#selected = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    get onSelectionChange(): ((selected: string[]) => void) | undefined {
        return this.#onSelectionChange;
    }
    set onSelectionChange(fn: ((selected: string[]) => void) | undefined) {
        this.#onSelectionChange = fn;
    }

    /** Text for the drag preview (one card, or the whole selection): `setDragImage` gets an element with this text (class `kanban-board-drag-preview`). */
    get dragPreviewText(): ((cards: KanbanCard[]) => string) | undefined {
        return this.#dragPreviewText;
    }
    set dragPreviewText(fn: ((cards: KanbanCard[]) => string) | undefined) {
        this.#dragPreviewText = fn;
    }

    /** Remember successful moves so Ctrl/Cmd+Z (and `labels.undo`'s button) can take them back. A selection move is one undo step. */
    get undoable(): boolean {
        return this.#undoable;
    }
    set undoable(v: boolean) {
        this.#undoable = !!v;
        this.#render();
    }

    /** Columns can be reordered: drag a header onto another, or Alt+Shift+ArrowLeft/Right on any cell of the column. */
    get movableColumns(): boolean {
        return this.#movableColumns;
    }
    set movableColumns(v: boolean) {
        this.#movableColumns = !!v;
        this.#render();
    }

    /** Column ids in display order; columns it does not name follow in their own order. `columnorderchange` / `onColumnOrderChange` report changes. */
    get columnOrder(): string[] {
        return [...this.#columnOrder];
    }
    set columnOrder(v: string[]) {
        this.#columnOrder = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    get onColumnOrderChange(): ((order: string[]) => void) | undefined {
        return this.#onColumnOrderChange;
    }
    set onColumnOrderChange(fn: ((order: string[]) => void) | undefined) {
        this.#onColumnOrderChange = fn;
    }

    /** Renders only the rows in view. The board gets a scroll area of `height` px; every row is assumed `rowHeight` px tall (lane headers count as a row). */
    get virtualize(): { rowHeight: number; height: number; overscan?: number } | undefined {
        return this.#virtualize;
    }
    set virtualize(v: { rowHeight: number; height: number; overscan?: number } | undefined) {
        this.#virtualize = v;
        this.#render();
    }

    get onReorder(): ((cardId: string, toIndex: number) => void) | undefined {
        return this.#onReorder;
    }
    set onReorder(fn: ((cardId: string, toIndex: number) => void) | undefined) {
        this.#onReorder = fn;
    }

    /** Ids of collapsed columns: a collapsed column keeps its header and count but shows no cards. */
    get collapsedColumns(): string[] {
        return [...this.#collapsed];
    }
    set collapsedColumns(v: string[]) {
        this.#collapsed = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    get onCollapsedChange(): ((collapsedColumns: string[]) => void) | undefined {
        return this.#onCollapsedChange;
    }
    set onCollapsedChange(fn: ((collapsedColumns: string[]) => void) | undefined) {
        this.#onCollapsedChange = fn;
    }

    /** Ids of collapsed swimlanes: a collapsed lane keeps its header row (and count) but renders no card rows. */
    get collapsedLanes(): string[] {
        return [...this.#collapsedLanes];
    }
    set collapsedLanes(v: string[]) {
        this.#collapsedLanes = Array.isArray(v) ? v.slice() : [];
        this.#render();
    }

    get onCollapsedLanesChange(): ((collapsedLanes: string[]) => void) | undefined {
        return this.#onCollapsedLanesChange;
    }
    set onCollapsedLanesChange(fn: ((collapsedLanes: string[]) => void) | undefined) {
        this.#onCollapsedLanesChange = fn;
    }

    /** Typed fields shown under each card's title, read from `card.values`. Editable types edit in place (click the value, or F2 on the card for the first editable field; Tab moves to the next) when `onFieldEdit` is set or `editableFields` is on. */
    get fields(): KanbanField[] | undefined {
        return this.#fields ? [...this.#fields] : undefined;
    }
    set fields(v: KanbanField[] | undefined) {
        this.#fields = Array.isArray(v) ? v.slice() : undefined;
        this.#resolvedFields = resolveFields(this.#fields, this.#locale);
        this.#render();
    }

    /** Locale for number and date fields. Never defaulted. */
    get locale(): string | undefined {
        return this.#locale;
    }
    set locale(v: string | undefined) {
        this.#locale = v || undefined;
        this.#resolvedFields = resolveFields(this.#fields, this.#locale);
        this.#render();
    }

    /** Called with each accepted field edit; the consumer updates `cards`. Setting it turns field editing on. The `fieldedit` event reports the same edit. */
    get onFieldEdit(): ((edit: KanbanFieldEdit) => void) | undefined {
        return this.#onFieldEdit;
    }
    set onFieldEdit(fn: ((edit: KanbanFieldEdit) => void) | undefined) {
        this.#onFieldEdit = fn;
        this.#render();
    }

    /** Turns field editing on without `onFieldEdit` (for a consumer that only listens to the `fieldedit` event; an element cannot see its own listeners). */
    get editableFields(): boolean {
        return this.#editableFields;
    }
    set editableFields(v: boolean) {
        this.#editableFields = !!v;
        this.#render();
    }

    /** The file name without its extension. Default `"kanban-board"`. */
    get exportFilename(): string {
        return this.#exportFilename;
    }
    set exportFilename(v: string) {
        this.#exportFilename = v || "kanban-board";
    }

    /** What an export holds: `"view"` (default) is every card the search and filter leave, column by column; `"selected"` is only the selected cards. */
    get exportScope(): "view" | "selected" {
        return this.#exportScope;
    }
    set exportScope(v: "view" | "selected") {
        this.#exportScope = v === "selected" ? "selected" : "view";
        this.#render();
    }

    /** Called before the download with the finished file. Return `false` to skip the built-in download. The `exportfile` event reports the same file. */
    get onExport(): ((file: KanbanExport) => boolean | void) | undefined {
        return this.#onExport;
    }
    set onExport(fn: ((file: KanbanExport) => boolean | void) | undefined) {
        this.#onExport = fn;
    }

    /** Called with the column id when its add-card button is pressed; the consumer adds the card. */
    get onAddCard(): ((columnId: string) => void) | undefined {
        return this.#onAddCard;
    }
    set onAddCard(fn: ((columnId: string) => void) | undefined) {
        this.#onAddCard = fn;
    }

    /** Veto a move (a hard WIP limit, a workflow rule). Refused columns show `aria-disabled` in the move menu. */
    /** Called when a card moves. `toIndex` is given only when a pointer drop landed on a card. */
    get moveHandler(): ((cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string) => void | Promise<unknown>) | undefined {
        return this.#moveHandler;
    }
    /**
     * An async move: awaited when a card moves. The card shows in its new column at once with `data-pending` and `aria-busy`
     * and goes back if the promise rejects (`labels.moveFailed`, `onMoveError`, the `moveerror` event). `onMove` and `movecard` fire either way.
     */
    set moveHandler(fn: ((cardId: string, toColumnId: string, toIndex?: number, toLaneId?: string) => void | Promise<unknown>) | undefined) {
        this.#moveHandler = fn;
    }

    get onMoveError(): ((cardId: string, toColumnId: string, error: unknown) => void) | undefined {
        return this.#onMoveError;
    }
    set onMoveError(fn: ((cardId: string, toColumnId: string, error: unknown) => void) | undefined) {
        this.#onMoveError = fn;
    }

    /** The columns a card may move to (its own column is always shown). The move menu offers only these; drops and keyboard moves elsewhere are refused. */
    get allowedColumns(): ((card: KanbanCard) => string[]) | undefined {
        return this.#allowedColumns;
    }
    set allowedColumns(fn: ((card: KanbanCard) => string[]) | undefined) {
        this.#allowedColumns = fn;
        this.#render();
    }

    /** Hides cards for which it returns false. Counts, WIP limits and over-limit warnings still use every card; a filtered column carries `data-hidden-count`. */
    get filter(): ((card: KanbanCard) => boolean) | undefined {
        return this.#filter;
    }
    set filter(fn: ((card: KanbanCard) => boolean) | undefined) {
        this.#filter = fn;
        this.#render();
    }

    /** Orders the cards shown within each column (a stable sort). */
    get compare(): ((a: KanbanCard, b: KanbanCard) => number) | undefined {
        return this.#compare;
    }
    set compare(fn: ((a: KanbanCard, b: KanbanCard) => number) | undefined) {
        this.#compare = fn;
        this.#render();
    }

    /** Extra attributes on each card's cell (for example `data-priority`); merged after Lily's own. */
    get cardAttrs(): ((card: KanbanCard) => Record<string, string>) | undefined {
        return this.#cardAttrs;
    }
    set cardAttrs(fn: ((card: KanbanCard) => Record<string, string>) | undefined) {
        this.#cardAttrs = fn;
        this.#render();
    }

    /** Called before a copy puts text on the clipboard. Return `false` to take over (nothing is copied). The `copy` event fires first. */
    get onCopy(): ((copy: { text: string; rowCount: number }) => boolean | void) | undefined {
        return this.#onCopy;
    }
    set onCopy(fn: ((copy: { text: string; rowCount: number }) => boolean | void) | undefined) {
        this.#onCopy = fn;
    }

    /** Board-level search (attribute `search`): shows only cards whose text contains every word of it (any order, ignoring case and diacritics) and wraps matches in the card's title in `<mark class="kanban-board-match">`. Escape in the field clears it. */
    get search(): string {
        return this.getAttribute("search") ?? "";
    }
    set search(v: string) {
        this.setAttribute("search", v);
    }

    /** The text `search` looks in. Defaults to the label, subtitle, badges and every field's text. */
    get searchText(): ((card: KanbanCard) => string) | undefined {
        return this.#searchText;
    }
    set searchText(fn: ((card: KanbanCard) => string) | undefined) {
        this.#searchText = fn;
    }

    /** Replaces a card's title content. Return the node to put inside the title element. */
    renderCard?: (ctx: KanbanCardContext) => Node;
    /** Rendered in each column's header after its title and flag. */
    renderColumnHeader?: (ctx: KanbanColumnContext) => Node;
    /** Rendered in a `<tfoot>` cell per column: sums per stage. */
    renderColumnFooter?: (ctx: KanbanColumnContext) => Node;

    get canMove(): ((card: KanbanCard, toColumn: KanbanColumn) => boolean) | undefined {
        return this.#canMove;
    }
    set canMove(fn: ((card: KanbanCard, toColumn: KanbanColumn) => boolean) | undefined) {
        this.#canMove = fn;
        this.#render();
    }

    /** Disable every mutating interaction: move menu, drag and reorder. Navigation still works. */
    get readonly(): boolean {
        return this.hasAttribute("readonly");
    }
    set readonly(v: boolean) {
        if (v) this.setAttribute("readonly", "");
        else this.removeAttribute("readonly");
    }

    get labels(): KanbanLabels {
        return { ...this.#labels };
    }
    set labels(v: KanbanLabels | undefined) {
        this.#labels = v && typeof v === "object" ? { ...v } : {};
        this.#render();
    }

    /** Is any card's move menu currently open? Read-only. */
    get moveMenuOpen(): boolean {
        return this.#openCardId !== null;
    }

    // ---- Public, overridable rendering hook ----

    /**
     * Build the content of a card's move-menu trigger button. Default: a
     * bundled swap-arrows SVG, `aria-hidden`, so the accessible name comes
     * from `labels.moveButton` alone — the same "no font-dependent glyph"
     * rule `theme-picker`/`share-picker` follow for their own buttons.
     */
    renderMoveButtonIcon(): Node {
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("class", "kanban-board-move-icon");
        svg.setAttribute("viewBox", "0 0 16 16");
        svg.setAttribute("width", "1rem");
        svg.setAttribute("height", "1rem");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.6");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute(
            "d",
            "M2 5h9m0 0-3-3m3 3-3 3M14 11H5m0 0 3-3m-3 3 3 3",
        );
        svg.appendChild(path);
        return svg;
    }

    // ---- Lifecycle ----

    connectedCallback(): void {
        this.#render();
    }

    attributeChangedCallback(name: string, oldValue?: string | null, newValue?: string | null): void {
        switch (name) {
            case "label":
            case "caption":
            case "class":
            case "readonly":
                this.#render();
                break;
            case "search": {
                this.#render();
                // Announce how many cards match after the search changes (not when it is first set).
                if (this.isConnected && (oldValue ?? "") !== (newValue ?? "")) {
                    let matched = 0;
                    for (const list of this.#cardsByColumn().values()) matched += list.length;
                    this.#announce(this.#labels.searchAnnouncement?.(matched, this.#cards.length));
                }
                break;
            }
            default:
                break;
        }
    }

    disconnectedCallback(): void {
        this.#moveController?.destroy();
        this.#moveController = null;
    }

    // ---- Derived data ----

    /** Every card per column, optimistic moves applied (counts and WIP limits use this). */
    #allByColumn(): Map<string, KanbanCard[]> {
        const map = new Map<string, KanbanCard[]>();
        for (const column of this.#ordered()) map.set(column.id, []);
        for (const card of this.#cards) {
            const effective = card.id in this.#optimistic ? { ...card, columnId: this.#optimistic[card.id] } : card;
            map.get(effective.columnId)?.push(effective);
        }
        return map;
    }

    /** What the grid shows: the filtered, searched, sorted view. */
    #cardsByColumn(): Map<string, KanbanCard[]> {
        const map = new Map<string, KanbanCard[]>();
        const query = this.search;
        const searching = query.trim() !== "";
        const text =
            this.#searchText ??
            ((c: KanbanCard) => [this.#cardLabel(c), c.subtitle ?? "", ...(c.badges ?? []), ...this.#resolvedFields.map((f) => fieldText(f, c.values))].join(" "));
        for (const [id, list] of this.#allByColumn()) {
            let shown = this.#filter ? list.filter(this.#filter) : list.slice();
            if (searching) shown = shown.filter((c) => matchesSearch(text(c), query));
            if (this.#compare) shown = shown.sort(this.#compare);
            map.set(id, shown);
        }
        return map;
    }

    #isEmptyColumn(column: KanbanColumn, cardsByColumn: Map<string, KanbanCard[]>): boolean {
        return !this.#collapsed.includes(column.id) && (cardsByColumn.get(column.id)?.length ?? 0) === 0;
    }

    #laneOf(card: KanbanCard): string {
        return this.#lanes && this.#lanes.length > 0 ? (card.laneId ?? this.#lanes[0].id) : "";
    }

    /** Rows: one band per lane (a single anonymous band without `lanes`). */
    #layout(): Layout {
        const cardsByColumn = this.#cardsByColumn();
        const hasLanes = !!this.#lanes && this.#lanes.length > 0;
        const cell = new Map<string, KanbanCard[]>();
        for (const [colId, list] of cardsByColumn) {
            for (const card of list) {
                const key = `${colId}\u0000${this.#laneOf(card)}`;
                const group = cell.get(key);
                if (group) group.push(card);
                else cell.set(key, [card]);
            }
        }
        const slots: Slot[] = [];
        const bands: KanbanLane[] = hasLanes ? this.#lanes! : [{ id: "", title: "" }];
        let rowIndex = 0;
        for (const lane of bands) {
            if (hasLanes) slots.push({ kind: "lane", lane });
            // A collapsed lane keeps its header and shows no card rows.
            if (hasLanes && this.#collapsedLanes.includes(lane.id)) continue;
            let rows = 0;
            for (const column of this.#ordered()) {
                if (this.#collapsed.includes(column.id)) continue;
                rows = Math.max(rows, cell.get(`${column.id}\u0000${lane.id}`)?.length ?? 0);
            }
            // A lane keeps at least one row so a card can be dropped into it; without lanes a row exists for an
            // empty column's message even when no column has a card to show.
            if (hasLanes) rows = Math.max(rows, 1);
            else if (rows === 0 && this.#labels.emptyColumn && this.#ordered().some((c) => this.#isEmptyColumn(c, cardsByColumn))) rows = 1;
            for (let laneRow = 0; laneRow < rows; laneRow++) slots.push({ kind: "row", rowIndex: rowIndex++, laneId: lane.id, laneRow });
        }
        const rows = slots.filter((x): x is Extract<Slot, { kind: "row" }> => x.kind === "row");
        const slotIndexByRow = new Map<number, number>();
        slots.forEach((x, i) => {
            if (x.kind === "row") slotIndexByRow.set(x.rowIndex, i);
        });
        return { slotIndexByRow, cardsByColumn, cell, slots, rows, maxRows: rows.length };
    }

    #cardAt(colIndex: number, rowIndex: number, layout: Layout): KanbanCard | undefined {
        const column = this.#ordered()[colIndex];
        const slot = layout.rows[rowIndex];
        if (!column || !slot || this.#collapsed.includes(column.id)) return undefined;
        return layout.cell.get(`${column.id}\u0000${slot.laneId}`)?.[slot.laneRow];
    }

    /** The slot indices to render: the window in view, plus the roving tab stop's row (everything without `virtualize`). */
    #windowIndices(layout: Layout): number[] {
        const v = this.#virtualize;
        const all = layout.slots;
        if (!v) return all.map((_, i) => i);
        const overscan = v.overscan ?? 3;
        const start = Math.max(0, Math.floor(this.#scrollTop / v.rowHeight) - overscan);
        const end = Math.min(all.length, Math.ceil((this.#scrollTop + v.height) / v.rowHeight) + overscan);
        const indices = new Set<number>();
        for (let i = start; i < end; i++) indices.add(i);
        const active = layout.slotIndexByRow.get(Math.min(this.#focusedRow, layout.maxRows - 1)) ?? -1;
        if (active >= 0) indices.add(active);
        return [...indices].sort((a, b) => a - b);
    }

    /** Bring a row into the scroll area (virtualized boards render only what is in view). */
    #revealRow(rowIndex: number, layout: Layout): void {
        const v = this.#virtualize;
        if (!v) return;
        const slotIndex = layout.slotIndexByRow.get(rowIndex) ?? -1;
        if (slotIndex < 0) return;
        const top = slotIndex * v.rowHeight;
        let next = this.#scrollTop;
        if (top < this.#scrollTop) next = top;
        else if (top + v.rowHeight > this.#scrollTop + v.height) next = top + v.rowHeight - v.height;
        if (next === this.#scrollTop) return;
        this.#scrollTop = next;
        if (this.#scrollEl) this.#scrollEl.scrollTop = next;
        if (this.#windowIndices(layout).join(",") !== this.#windowSig) this.#render();
    }

    #onScroll(): void {
        const v = this.#virtualize;
        if (!v || !this.#scrollEl) return;
        this.#scrollTop = this.#scrollEl.scrollTop;
        const layout = this.#layout();
        if (this.#windowIndices(layout).join(",") === this.#windowSig) return;
        // The rebuild replaces the cells: keep focus on the cursor's cell if it was there.
        const hadFocus = !!document.activeElement && this.contains(document.activeElement) && !!(document.activeElement as HTMLElement).closest("[data-row][data-col]");
        this.#render();
        if (hadFocus) this.#cellEls.get(`${this.#focusedRow}-${this.#focusedCol}`)?.focus({ preventScroll: true });
    }

    #toggleCollapsed(column: KanbanColumn): void {
        this.#collapsed = this.#collapsed.includes(column.id)
            ? this.#collapsed.filter((id) => id !== column.id)
            : [...this.#collapsed, column.id];
        this.#onCollapsedChange?.([...this.#collapsed]);
        this.dispatchEvent(
            new CustomEvent<string[]>("collapsechange", { detail: [...this.#collapsed], bubbles: true, composed: true }),
        );
        this.#render();
    }

    #toggleLane(lane: KanbanLane): void {
        this.#collapsedLanes = this.#collapsedLanes.includes(lane.id)
            ? this.#collapsedLanes.filter((id) => id !== lane.id)
            : [...this.#collapsedLanes, lane.id];
        this.#onCollapsedLanesChange?.([...this.#collapsedLanes]);
        this.dispatchEvent(
            new CustomEvent<string[]>("lanecollapsechange", { detail: [...this.#collapsedLanes], bubbles: true, composed: true }),
        );
        this.#render();
    }

    #announce(message: string | undefined): void {
        if (!message) return;
        this.#statusMessage = message;
        if (this.#statusEl) this.#statusEl.textContent = message;
    }

    // ---- Typed fields, inline editing, export ----

    #isFieldEditable(f: KanbanField, card: KanbanCard): boolean {
        return (!!this.#onFieldEdit || this.#editableFields) && !this.readonly && !card.locked && isEditableField(f);
    }

    #findCard(cardId: string): KanbanCard | undefined {
        return this.#cards.find((c) => c.id === cardId) ?? [...this.#allByColumn().values()].flat().find((c) => c.id === cardId);
    }

    #startFieldEdit(card: KanbanCard, f: ResolvedField): void {
        if (!this.#isFieldEditable(f, card)) return;
        this.#editing = { cardId: card.id, fieldId: f.id, draft: draftOf(f, card.values) };
        this.#render();
        const editor = this.querySelector<HTMLInputElement>(".kanban-board-field-editor");
        editor?.focus({ preventScroll: true });
        if (editor && "select" in editor && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
    }

    /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
    #commitFieldEdit(refocus = true): boolean {
        const current = this.#editing;
        if (!current) return true;
        const { cardId, fieldId, draft } = current;
        const card = this.#findCard(cardId);
        const f = this.#resolvedFields.find((x) => x.id === fieldId);
        if (!card || !f) {
            this.#editing = null;
            this.#render();
            return true;
        }
        const outcome = evaluateEdit(f, card.values, draft);
        if (outcome.invalid) {
            this.#editing = { ...current, invalid: true };
            this.#announce((outcome.message ? this.#labels.editRefused?.(this.#cardLabel(card), f.header, outcome.message) : undefined) ?? this.#labels.editInvalid?.(this.#cardLabel(card), f.header));
            this.#render();
            this.querySelector<HTMLElement>(".kanban-board-field-editor")?.focus({ preventScroll: true });
            return false;
        }
        this.#editing = null;
        if (outcome.changed) {
            this.#history = recordEdit(this.#history, { ownerId: cardId, fieldId, value: outcome.value, previous: outcome.previous });
            const edit: KanbanFieldEdit = { cardId, fieldId, value: outcome.value, previous: outcome.previous };
            this.#onFieldEdit?.(edit);
            this.dispatchEvent(new CustomEvent<KanbanFieldEdit>("fieldedit", { detail: edit, bubbles: true, composed: true }));
            this.#statusMessage = this.#labels.editAnnouncement?.(this.#cardLabel(card), f.header, outcome.text) ?? this.#statusMessage;
        }
        this.#render();
        if (refocus) this.#focusCard(cardId);
        return true;
    }

    /** Put an earlier field value back, or re-apply it, through `onFieldEdit` and the `fieldedit` event. */
    #stepHistory(direction: "undo" | "redo"): void {
        const step = direction === "undo" ? undoEdit(this.#history) : redoEdit(this.#history);
        if (!step.record) return;
        this.#history = step.history;
        const { ownerId, fieldId, value, previous } = step.record;
        const restored = direction === "undo" ? previous : value;
        const replaced = direction === "undo" ? value : previous;
        const edit: KanbanFieldEdit = { cardId: ownerId, fieldId, value: restored, previous: replaced };
        this.#onFieldEdit?.(edit);
        this.dispatchEvent(new CustomEvent<KanbanFieldEdit>("fieldedit", { detail: edit, bubbles: true, composed: true }));
        const card = this.#findCard(ownerId);
        const f = this.#resolvedFields.find((x) => x.id === fieldId);
        if (!card || !f) return;
        const text = restored === null || restored === undefined ? "" : f.format ? f.format(restored, { ...(card.values ?? {}), [fieldId]: restored }) : String(restored);
        this.#announce((direction === "undo" ? this.#labels.fieldUndoAnnouncement : this.#labels.fieldRedoAnnouncement)?.(this.#cardLabel(card), f.header, text));
    }

    #cancelFieldEdit(): void {
        const current = this.#editing;
        if (!current) return;
        this.#editing = null;
        this.#render();
        this.#focusCard(current.cardId);
    }

    #onEditorKeydown(event: KeyboardEvent): void {
        // The editor owns its keys. While an IME composes, Enter and Escape belong to the IME: some browsers
        // report the confirming Enter with `isComposing` already false but keyCode 229.
        event.stopPropagation();
        if (event.isComposing || event.keyCode === 229) return;
        if (event.key === "Enter") {
            event.preventDefault();
            this.#commitFieldEdit();
        } else if (event.key === "Escape") {
            event.preventDefault();
            this.#cancelFieldEdit();
        } else if (event.key === "Tab" && this.#editing) {
            // Tab commits and moves to the card's next (Shift+Tab: previous) editable field; past the last, it moves on.
            const current = this.#editing;
            const card = this.#findCard(current.cardId);
            const next = card
                ? neighbourField(this.#resolvedFields.filter((x) => this.#isFieldEditable(x, card)), current.fieldId, event.shiftKey)
                : undefined;
            if (card && next) {
                event.preventDefault();
                if (this.#commitFieldEdit(false)) this.#startFieldEdit(this.#findCard(card.id) ?? card, next);
            } else {
                this.#commitFieldEdit(false);
            }
        }
    }

    /** The one field's node: its name and either the value, a button that opens the editor, or the editor itself. */
    /** A card's title, with the words the search matched wrapped in `<mark class="mark kanban-board-match">`. */
    #fillTitle(node: HTMLElement, card: KanbanCard): void {
        const label = this.#cardLabel(card);
        if (this.search.trim() === "") {
            node.textContent = label;
            return;
        }
        for (const part of highlightSegments(label, this.search)) {
            if (!part.match) {
                node.append(document.createTextNode(part.text));
                continue;
            }
            const mark = document.createElement("mark");
            mark.className = "mark kanban-board-match";
            mark.textContent = part.text;
            node.append(mark);
        }
    }

    #fieldNode(card: KanbanCard, f: ResolvedField): HTMLElement | null {
        const text = fieldText(f, card.values);
        const editable = this.#isFieldEditable(f, card);
        const nameId = `${this.#baseId}-fn-${card.id}-${f.id}`;
        const valueId = `${this.#baseId}-fv-${card.id}-${f.id}`;
        const isEditing = !!this.#editing && this.#editing.cardId === card.id && this.#editing.fieldId === f.id;
        if (!isEditing && text === "" && !editable) return null;
        const span = document.createElement("span");
        span.className = "kanban-board-card-field";
        span.setAttribute("data-field", f.id);
        const name = document.createElement("span");
        name.className = "kanban-board-card-field-name";
        name.id = nameId;
        name.textContent = f.header;
        span.appendChild(name);
        span.appendChild(document.createTextNode(" "));
        if (isEditing) {
            span.setAttribute("data-editing", "");
            const kind = editorKind(f);
            const editing = this.#editing!;
            if (kind === "select" || kind === "radio") {
                const select = document.createElement("select");
                select.className = "kanban-board-field-editor";
                select.setAttribute("aria-label", f.editLabel ?? f.header);
                if (editing.invalid) select.setAttribute("aria-invalid", "true");
                const blank = document.createElement("option");
                blank.value = "";
                select.appendChild(blank);
                for (const option of f.options ?? []) {
                    const o = document.createElement("option");
                    o.value = option.id;
                    o.disabled = !!option.disabled;
                    o.textContent = option.label;
                    select.appendChild(o);
                }
                select.value = String(editing.draft ?? "");
                select.addEventListener("keydown", (e) => this.#onEditorKeydown(e));
                select.addEventListener("change", () => {
                    editing.draft = select.value;
                    this.#commitFieldEdit();
                });
                select.addEventListener("blur", () => this.#commitFieldEdit(false));
                span.appendChild(select);
            } else {
                const input = document.createElement("input");
                input.className = "kanban-board-field-editor";
                input.setAttribute("aria-label", f.editLabel ?? f.header);
                if (editing.invalid) input.setAttribute("aria-invalid", "true");
                input.type = kind === "number" ? "number" : kind === "date" ? "date" : kind === "time" ? "time" : "text";
                if (kind === "number") input.setAttribute("inputmode", "decimal");
                input.value = String(editing.draft ?? "");
                input.addEventListener("input", () => {
                    editing.draft = input.value;
                    editing.invalid = false;
                    input.removeAttribute("aria-invalid");
                });
                input.addEventListener("keydown", (e) => this.#onEditorKeydown(e));
                input.addEventListener("blur", () => this.#commitFieldEdit(false));
                span.appendChild(input);
            }
            return span;
        }
        span.setAttribute("data-type", f.type ?? "text");
        if (editable) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "kanban-board-field-button";
            button.id = valueId;
            button.setAttribute("tabindex", "-1");
            button.setAttribute("aria-labelledby", `${nameId} ${valueId}`);
            button.textContent = text;
            button.addEventListener("click", () => this.#startFieldEdit(card, f));
            span.appendChild(button);
        } else {
            const value = document.createElement("span");
            value.className = "kanban-board-card-field-value";
            value.textContent = text;
            span.appendChild(value);
        }
        return span;
    }

    async #finishCopy(table: { headers: string[]; rows: unknown[][] }): Promise<void> {
        const text = toClipboardText(table);
        const copied = { text, rowCount: table.rows.length };
        this.dispatchEvent(new CustomEvent("copy", { detail: copied, bubbles: true, composed: true }));
        if (this.#onCopy?.(copied) === false) return;
        const ok = await copyToClipboard(text);
        this.#announce(ok ? this.#labels.copyAnnouncement?.(table.rows.length) : this.#labels.copyFailed);
    }

    #runExport(format: ExportFormat | "copy"): void {
        const h = this.#labels.exportHeaders;
        if (!h) return;
        const hasLanes = !!this.#lanes && this.#lanes.length > 0;
        const exportFields = exportableFields(this.#resolvedFields);
        const headers = [h.title, h.column];
        if (hasLanes && h.lane) headers.push(h.lane);
        if (h.subtitle) headers.push(h.subtitle);
        if (h.badges) headers.push(h.badges);
        if (h.flag) headers.push(h.flag);
        for (const f of exportFields) headers.push(f.header);
        const columnTitle = new Map(this.#columns.map((c) => [c.id, c.title]));
        const laneTitle = new Map((this.#lanes ?? []).map((l) => [l.id, l.title]));
        const rows = this.#exportCards.map((card) => {
            const cells: unknown[] = [this.#cardLabel(card), columnTitle.get(card.columnId) ?? card.columnId];
            if (hasLanes && h.lane) cells.push(laneTitle.get(this.#laneOf(card)) ?? "");
            if (h.subtitle) cells.push(card.subtitle ?? null);
            if (h.badges) cells.push((card.badges ?? []).join("; "));
            if (h.flag) cells.push(card.flag ?? null);
            for (const f of exportFields) cells.push(exportFieldCell(f, card.values));
            return cells;
        });
        if (format === "copy") {
            void this.#finishCopy({ headers, rows });
            return;
        }
        const filename = exportFilename(this.#exportFilename, format);
        const blob = exportBlob({ headers, rows }, format, { sheetName: this.#exportFilename });
        const file: KanbanExport = { format, filename, cardCount: rows.length, blob };
        this.dispatchEvent(new CustomEvent<KanbanExport>("exportfile", { detail: file, bubbles: true, composed: true }));
        if (this.#onExport?.(file) === false) return;
        downloadBlob(blob, filename);
        this.#announce(this.#labels.exportAnnouncement?.(format, rows.length, filename));
    }

    // ---- Move (keyboard + pointer share this) ----

    /**
     * Choosing the card's own column is not a move: the menu just closes.
     * A real move closes the menu first, then tells the consumer — whose
     * `cards` update rebuilds the board — and then focuses the card wherever
     * it now is, so focus is never left on a node the rebuild removed.
     */
    #isRefused(card: KanbanCard, toColumn: KanbanColumn, extra = 0): boolean {
        if (toColumn.id === card.columnId) return false;
        if (this.#allowedColumns && !this.#allowedColumns(card).includes(toColumn.id)) return true;
        if (this.#canMove && !this.#canMove(card, toColumn)) return true;
        return (
            !!toColumn.strictLimit &&
            toColumn.wipLimit != null &&
            (this.#allByColumn().get(toColumn.id)?.length ?? 0) + extra >= toColumn.wipLimit
        );
    }

    /** The columns the move menu offers for `card`: its own, and the ones it may move to. */
    #moveTargets(card: KanbanCard): KanbanColumn[] {
        if (!this.#allowedColumns) return this.#ordered();
        const allowed = this.#allowedColumns(card);
        return this.#ordered().filter((c) => c.id === card.columnId || allowed.includes(c.id));
    }

    #recordUndo(group: UndoStep[]): void {
        if (!this.#undoable || group.length === 0) return;
        this.#undoStack = [...this.#undoStack.slice(-49), group];
        this.#syncUndo();
    }

    #syncUndo(): void {
        if (this.#undoBtn) this.#undoBtn.disabled = this.#undoStack.length === 0;
    }

    /** Resolves true when the move went through (no handler, a synchronous one, or a promise that resolved). */
    async #runMove(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number, toLaneId?: string, silent = false): Promise<boolean> {
        if (toLaneId !== undefined) this.#onMove?.(card.id, toColumn.id, toIndex, toLaneId);
        else if (toIndex === undefined) this.#onMove?.(card.id, toColumn.id);
        else this.#onMove?.(card.id, toColumn.id, toIndex);
        const detail: KanbanBoardMoveDetail = { cardId: card.id, toColumnId: toColumn.id };
        if (toIndex !== undefined) detail.toIndex = toIndex;
        if (toLaneId !== undefined) detail.toLaneId = toLaneId;
        this.dispatchEvent(new CustomEvent<KanbanBoardMoveDetail>("movecard", { detail, bubbles: true, composed: true }));
        const result = this.#moveHandler
            ? toLaneId !== undefined
                ? this.#moveHandler(card.id, toColumn.id, toIndex, toLaneId)
                : toIndex === undefined
                  ? this.#moveHandler(card.id, toColumn.id)
                  : this.#moveHandler(card.id, toColumn.id, toIndex)
            : undefined;
        if (!result || typeof (result as Promise<unknown>).then !== "function") {
            if (!silent) this.#announce(this.#labels.moveAnnouncement?.(this.#cardLabel(card), toColumn.title));
            this.#focusCard(card.id);
            return true;
        }
        this.#optimistic = { ...this.#optimistic, [card.id]: toColumn.id };
        if (!silent) this.#statusMessage = this.#labels.movePending?.(this.#cardLabel(card), toColumn.title) ?? this.#statusMessage;
        this.#render();
        let ok = true;
        try {
            await result;
            if (!silent) this.#statusMessage = this.#labels.moveAnnouncement?.(this.#cardLabel(card), toColumn.title) ?? this.#statusMessage;
        } catch (error) {
            ok = false;
            this.#statusMessage = this.#labels.moveFailed?.(this.#cardLabel(card), toColumn.title, error) ?? this.#statusMessage;
            this.#onMoveError?.(card.id, toColumn.id, error);
            this.dispatchEvent(
                new CustomEvent("moveerror", {
                    detail: { cardId: card.id, toColumnId: toColumn.id, error },
                    bubbles: true,
                    composed: true,
                }),
            );
        } finally {
            const { [card.id]: _settled, ...rest } = this.#optimistic;
            this.#optimistic = rest;
            this.#render();
        }
        return ok;
    }

    // ---- Selection: several cards move together ----

    #setSelection(next: string[]): void {
        this.#selected = next;
        this.#onSelectionChange?.([...next]);
        this.dispatchEvent(new CustomEvent<string[]>("selectionchange", { detail: [...next], bubbles: true, composed: true }));
        this.#render();
    }

    #toggleSelected(cardId: string): void {
        this.#setSelection(
            this.#selected.includes(cardId) ? this.#selected.filter((id) => id !== cardId) : [...this.#selected, cardId],
        );
        // The rebuild replaced the cells: put focus back on the cursor's cell.
        this.#cellEls.get(`${this.#focusedRow}-${this.#focusedCol}`)?.focus({ preventScroll: true });
    }

    /** The cards that move when `card` moves: the whole selection when `card` is in it, else just `card`. */
    #movingGroup(card: KanbanCard): KanbanCard[] {
        if (!this.#selectable || !this.#selected.includes(card.id) || this.#selected.length < 2) return [card];
        const all = [...this.#allByColumn().values()].flat();
        return all.filter((c) => this.#selected.includes(c.id));
    }

    async #moveGroup(group: KanbanCard[], toColumn: KanbanColumn): Promise<void> {
        const moved: UndoStep[] = [];
        let admitted = 0;
        const runs: Promise<boolean>[] = [];
        for (const member of group) {
            if (member.locked || member.id in this.#optimistic || member.columnId === toColumn.id) continue;
            if (this.#isRefused(member, toColumn, admitted)) {
                this.#announce(this.#labels.moveBlocked?.(this.#cardLabel(member), toColumn.title));
                continue;
            }
            admitted += 1;
            const from = member.columnId;
            runs.push(
                this.#runMove(member, toColumn, undefined, undefined, true).then((ok) => {
                    if (ok) moved.push({ cardId: member.id, fromColumnId: from, toColumnId: toColumn.id });
                    return ok;
                }),
            );
        }
        if (runs.length === 0) return;
        this.#announce(this.#labels.moveManyAnnouncement?.(runs.length, toColumn.title));
        this.#setSelection([]);
        await Promise.all(runs);
        this.#recordUndo(moved);
    }

    // ---- Undo ----

    async #undo(): Promise<void> {
        if (!this.#undoable || this.readonly) return;
        while (this.#undoStack.length > 0) {
            const group = this.#undoStack[this.#undoStack.length - 1];
            this.#undoStack = this.#undoStack.slice(0, -1);
            this.#syncUndo();
            const all = [...this.#allByColumn().values()].flat();
            const live = group
                .map((m) => ({ m, card: all.find((c) => c.id === m.cardId) }))
                .filter((x): x is { m: UndoStep; card: KanbanCard } => !!x.card && x.card.columnId === x.m.toColumnId && !x.card.locked);
            if (live.length === 0) continue; // nothing of this step is where it was left: try the one before
            for (const { m, card } of live) {
                const back = this.#ordered().find((c) => c.id === m.fromColumnId);
                if (back) await this.#runMove(card, back, undefined, undefined, true);
            }
            if (live.length === 1) {
                const back = this.#ordered().find((c) => c.id === live[0].m.fromColumnId);
                this.#announce(this.#labels.undoAnnouncement?.(this.#cardLabel(live[0].card), back?.title ?? ""));
            } else {
                this.#announce(this.#labels.undoManyAnnouncement?.(live.length));
            }
            return;
        }
    }

    #moveCard(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number, toLaneId?: string): void {
        if (this.readonly || card.locked || card.id in this.#optimistic) return;
        const group = this.#movingGroup(card);
        if (group.length > 1) {
            this.#closeMoveMenu(false);
            void this.#moveGroup(group, toColumn);
            return;
        }
        if (this.#isRefused(card, toColumn)) {
            this.#closeMoveMenu();
            this.#announce(this.#labels.moveBlocked?.(this.#cardLabel(card), toColumn.title));
            return;
        }
        const laneChange = toLaneId !== undefined && toLaneId !== this.#laneOf(card);
        if (toColumn.id === card.columnId && !laneChange) {
            this.#closeMoveMenu();
            return;
        }
        this.#closeMoveMenu(false);
        const from = card.columnId;
        void this.#runMove(card, toColumn, toIndex, toLaneId).then((ok) => {
            if (ok && toColumn.id !== from) this.#recordUndo([{ cardId: card.id, fromColumnId: from, toColumnId: toColumn.id }]);
        });
    }

    /** The cell holding a card, found by its id wherever the card now is. */
    #cellForCard(cardId: string): HTMLTableCellElement | undefined {
        for (const cell of this.#cellEls.values()) {
            if (cell.dataset.cardId === cardId) return cell;
        }
        return undefined;
    }

    /**
     * Move the roving cursor to a card and focus it: its move button, or its
     * cell when there is no button.
     */
    #focusCard(cardId: string): void {
        const cell = this.#cellForCard(cardId);
        if (!cell) return;
        this.#setActiveCell(Number(cell.dataset.row), Number(cell.dataset.col));
        const target = this.#moveButtonEls.get(cardId) ?? cell;
        target.focus({ preventScroll: true });
    }

    #openMoveMenu(card: KanbanCard): void {
        if (this.readonly || card.locked) return;
        // Only one move menu at a time; closing any other first also
        // exercises the same per-card-button lookup as a normal close.
        if (this.#openCardId && this.#openCardId !== card.id) {
            this.#closeMoveMenu(false);
        }
        const cell = this.#cellForCard(card.id);
        if (!cell) return;
        // The button exists only when labels.moveButton names it; Enter/Space
        // on the cell opens the menu either way.
        const button = this.#moveButtonEls.get(card.id);
        const listId = `${this.#baseId}-move-list`;

        this.#openCardId = card.id;
        button?.setAttribute("aria-expanded", "true");
        button?.setAttribute("aria-controls", listId);

        const list = document.createElement("ul");
        list.id = listId;
        list.className = "kanban-board-move-list";
        list.setAttribute("role", "listbox");
        // Named by the card itself when no menu label is given.
        list.setAttribute("aria-label", this.#labels.moveMenuLabel ?? this.#cardLabel(card));
        list.setAttribute("tabindex", "-1");

        const optionEls: HTMLLIElement[] = [];
        this.#moveTargets(card).forEach((destination, i) => {
            const li = document.createElement("li");
            li.className = "kanban-board-move-option";
            li.id = `${this.#baseId}-move-option-${i}`;
            li.setAttribute("role", "option");
            li.setAttribute(
                "aria-selected",
                String(destination.id === card.columnId),
            );
            if (this.#isRefused(card, destination)) li.setAttribute("aria-disabled", "true");
            li.textContent = destination.title;
            li.addEventListener("click", () => this.#moveCard(card, destination));
            list.appendChild(li);
            optionEls.push(li);
        });

        cell.appendChild(list);
        this.#moveListEl = list;
        this.#moveOptionEls = optionEls;

        const syncActive = (index: number): void => {
            optionEls.forEach((el, i) => {
                if (i === index) el.setAttribute("data-active", "");
                else el.removeAttribute("data-active");
            });
            if (index >= 0 && optionEls[index]) {
                list.setAttribute("aria-activedescendant", optionEls[index].id);
            } else {
                list.removeAttribute("aria-activedescendant");
            }
        };

        this.#moveController = new ListboxController({
            root: list,
            clamp: true,
            getOptionLabel: (option) => option.textContent ?? "",
            onActiveIndexChange: syncActive,
            onActivate: (index) => {
                const destination = this.#moveTargets(card)[index];
                if (destination) this.#moveCard(card, destination);
            },
            onEscape: () => this.#closeMoveMenu(),
            onTabOut: () => {
                // Focus the button first, then close without refocusing —
                // matches theme-picker's own onTabOut: hiding the focused
                // list first would drop focus to <body>, and the browser
                // would then compute Tab's default target from the top of
                // the document instead of from here.
                (button ?? cell).focus({ preventScroll: true });
                this.#closeMoveMenu(false);
            },
        });

        const currentIndex = this.#ordered().findIndex((c) => c.id === card.columnId);
        this.#moveController.setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
        syncActive(this.#moveController.activeIndex);
        list.focus({ preventScroll: true });
    }

    #closeMoveMenu(refocus = true): void {
        if (this.#openCardId === null) return;
        const cardId = this.#openCardId;
        this.#openCardId = null;
        this.#moveController?.destroy();
        this.#moveController = null;
        this.#moveListEl?.remove();
        this.#moveListEl = null;
        this.#moveOptionEls = [];

        // Looked up per-card via the Map, never a shared scalar — the
        // fix for the cross-catalog move-menu refocus bug (see the field
        // comment on #moveButtonEls and spec/index.md §10).
        const button = this.#moveButtonEls.get(cardId);
        button?.setAttribute("aria-expanded", "false");
        button?.removeAttribute("aria-controls");
        if (refocus) this.#focusCard(cardId);
    }

    // ---- Pointer drag-and-drop (supplementary, never the only path) ----

    #onCardDragStart(card: KanbanCard, event: DragEvent): void {
        if (card.locked) {
            event.preventDefault();
            return;
        }
        this.#draggingCardId = card.id;
        event.dataTransfer?.setData("text/plain", card.id);
        const group = this.#movingGroup(card);
        for (const member of group) this.#cellForCard(member.id)?.setAttribute("data-dragging", "");
        if (this.#dragPreviewText && event.dataTransfer?.setDragImage && this.#rootEl) {
            const preview = document.createElement("div");
            preview.className = "kanban-board-drag-preview";
            preview.textContent = this.#dragPreviewText(group);
            preview.style.position = "absolute";
            preview.style.top = "-1000px";
            this.#rootEl.appendChild(preview);
            event.dataTransfer.setDragImage(preview, 0, 0);
            setTimeout(() => preview.remove(), 0);
        }
    }

    #onCardDragEnd(): void {
        this.#draggingCardId = null;
        this.#dropBlocked = false;
        this.querySelectorAll("[data-drop-blocked]").forEach((el) => el.removeAttribute("data-drop-blocked"));
        this.querySelectorAll("[data-dragging]").forEach((el) => el.removeAttribute("data-dragging"));
        this.querySelectorAll("[data-drop-target]").forEach((el) => el.removeAttribute("data-drop-target"));
    }

    // ---- Column reordering ----

    #moveColumnTo(columnId: string, toIndex: number): boolean {
        const ids = this.#ordered().map((c) => c.id);
        const from = ids.indexOf(columnId);
        const to = Math.min(Math.max(toIndex, 0), ids.length - 1);
        if (from === -1 || from === to) return false;
        ids.splice(to, 0, ...ids.splice(from, 1));
        this.#columnOrder = ids;
        this.#onColumnOrderChange?.([...ids]);
        this.dispatchEvent(new CustomEvent<string[]>("columnorderchange", { detail: [...ids], bubbles: true, composed: true }));
        const column = this.#columns.find((c) => c.id === columnId);
        if (column) this.#announce(this.#labels.columnMoveAnnouncement?.(column.title, to + 1, ids.length));
        this.#render();
        return true;
    }

    #onColumnDragOver(event: DragEvent, td: HTMLElement, column: KanbanColumn, rowIndex: number, colIndex: number): void {
        if (!this.#draggingCardId || this.readonly) return;
        const card = this.#findCard(this.#draggingCardId);
        const dragging = this.querySelectorAll("[data-dragging]").length;
        const blocked = !!card && this.#isRefused(card, column, Math.max(0, dragging - 1));
        this.#dropBlocked = blocked;
        this.#dropTarget = `${rowIndex}-${colIndex}`;
        this.querySelectorAll("[data-drop-target], [data-drop-blocked]").forEach((el) => {
            el.removeAttribute("data-drop-target");
            el.removeAttribute("data-drop-blocked");
        });
        td.setAttribute(blocked ? "data-drop-blocked" : "data-drop-target", "");
        // A refused drop is not a drop target: leaving dragover un-prevented makes the browser show its "not allowed" cursor.
        if (blocked) {
            if (event.dataTransfer) event.dataTransfer.dropEffect = "none";
            return;
        }
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    }

    #onColumnDrop(column: KanbanColumn, rowIndex: number, event: DragEvent): void {
        event.preventDefault();
        const cardId = this.#draggingCardId ?? event.dataTransfer?.getData("text/plain");
        this.#draggingCardId = null;
        this.#dropTarget = null;
        this.#dropBlocked = false;
        this.querySelectorAll("[data-drop-target], [data-drop-blocked]").forEach((el) => {
            el.removeAttribute("data-drop-target");
            el.removeAttribute("data-drop-blocked");
        });
        this.querySelectorAll("[data-dragging]").forEach((el) => el.removeAttribute("data-dragging"));
        if (this.readonly) return;
        const card = this.#cards.find((c) => c.id === cardId);
        if (!card) return;
        const layout = this.#layout();
        const slot = layout.rows[rowIndex];
        const hasLanes = !!this.#lanes && this.#lanes.length > 0;
        const dropLane = hasLanes && slot ? slot.laneId : undefined;
        const shown = (slot ? layout.cell.get(`${column.id}\u0000${slot.laneId}`) : layout.cardsByColumn.get(column.id)) ?? [];
        const overCard = slot ? shown[slot.laneRow] : shown[rowIndex];
        const dropIndex = slot ? slot.laneRow : rowIndex;
        if (card.columnId === column.id && hasLanes && dropLane !== undefined && dropLane !== this.#laneOf(card)) {
            // Dropped into another lane of its own column: only the lane changes.
            this.#moveCard(card, column, undefined, dropLane);
            return;
        }
        if (card.columnId === column.id) {
            // Dropped on another card of its own column: reorder to that position.
            const from = shown.findIndex((c) => c.id === card.id);
            if (overCard && from >= 0 && from !== dropIndex) {
                this.#onReorder?.(card.id, dropIndex);
                this.dispatchEvent(
                    new CustomEvent<KanbanBoardReorderDetail>("reordercard", {
                        detail: { cardId: card.id, toIndex: dropIndex },
                        bubbles: true,
                        composed: true,
                    }),
                );
                this.#announce(this.#labels.reorderAnnouncement?.(this.#cardLabel(card), dropIndex + 1, shown.length));
            }
            return;
        }
        this.#moveCard(card, column, overCard ? dropIndex : undefined, dropLane);
    }

    // ---- Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern) ----

    #setActiveCell(row: number, col: number): HTMLTableCellElement | undefined {
        const oldCell = this.#cellEls.get(`${this.#focusedRow}-${this.#focusedCol}`);
        oldCell?.setAttribute("tabindex", "-1");

        this.#focusedRow = row;
        this.#focusedCol = col;

        const newCell = this.#cellEls.get(`${row}-${col}`);
        newCell?.setAttribute("tabindex", "0");
        return newCell;
    }

    #moveFocus(row: number, col: number, layout: Layout): void {
        const clampedCol = Math.min(Math.max(col, 0), Math.max(this.#ordered().length - 1, 0));
        const clampedRow = Math.min(Math.max(row, 0), Math.max(layout.maxRows - 1, 0));
        let cell = this.#setActiveCell(clampedRow, clampedCol);
        if (this.#virtualize) {
            this.#focusedRow = clampedRow;
            this.#revealRow(clampedRow, layout);
            // The target row may have been outside the rendered window: the reveal re-renders.
            if (!cell || !cell.isConnected) {
                this.#render();
                cell = this.#cellEls.get(`${clampedRow}-${clampedCol}`);
            }
        }
        cell?.focus({ preventScroll: true });
    }

    /** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
    #onGridFocusin(event: FocusEvent): void {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        this.#setActiveCell(Number(cell.dataset.row), Number(cell.dataset.col));
    }

    #reorderCard(delta: 1 | -1, layout: Layout): void {
        if (this.readonly) return;
        const card = this.#cardAt(this.#focusedCol, this.#focusedRow, layout);
        if (!card || card.locked) return;
        const slot = layout.rows[this.#focusedRow];
        const total = (slot ? layout.cell.get(`${card.columnId}\u0000${slot.laneId}`) : layout.cardsByColumn.get(card.columnId))?.length ?? 0;
        const laneRow = slot ? slot.laneRow : this.#focusedRow;
        const toIndex = laneRow + delta;
        if (toIndex < 0 || toIndex >= total) return;
        this.#onReorder?.(card.id, toIndex);
        this.dispatchEvent(
            new CustomEvent<KanbanBoardReorderDetail>("reordercard", {
                detail: { cardId: card.id, toIndex },
                bubbles: true,
                composed: true,
            }),
        );
        this.#announce(this.#labels.reorderAnnouncement?.(this.#cardLabel(card), toIndex + 1, total));
        this.#focusCard(card.id);
    }

    #onGridKeydown(event: KeyboardEvent): void {
        const target = event.target as HTMLElement;
        // The open move menu owns its own keys; letting them bubble here moved the
        // grid cursor (and focus) out of the menu, and Enter reopened it after a move.
        if (target.closest(".kanban-board-move-list")) return;
        if (target.closest(".kanban-board-field-editor")) return;
        const cell = target.closest<HTMLElement>("[data-row][data-col]");
        if (!cell) return;
        const layout = this.#layout();
        const maxRows = layout.maxRows;
        const ctrlOrMeta = event.ctrlKey || event.metaKey;
        // The horizontal arrows are visual: in a right-to-left layout the next column is on the left, so ArrowLeft goes forward.
        const key = logicalKey(event.key, isRtl(cell));
        // Ctrl/Cmd+Z undoes the last move while there is one (`undoable`), then the last field edit; Ctrl/Cmd+Shift+Z and Ctrl+Y redo field edits.
        const historyAction = (this.#onFieldEdit || this.#editableFields) && !this.readonly ? historyKey(event) : null;
        if (this.#undoable && ctrlOrMeta && !event.altKey && !event.shiftKey && (event.key === "z" || event.key === "Z") && this.#undoStack.length > 0) {
            event.preventDefault();
            void this.#undo();
            return;
        }
        if (historyAction) {
            event.preventDefault();
            this.#stepHistory(historyAction);
            return;
        }
        if (this.#undoable && ctrlOrMeta && !event.altKey && !event.shiftKey && (event.key === "z" || event.key === "Z")) {
            event.preventDefault();
            void this.#undo();
            return;
        }
        if (this.#movableColumns && event.altKey && event.shiftKey && (key === "ArrowLeft" || key === "ArrowRight")) {
            // Alt+Shift+ArrowLeft/Right: move this cell's column (the keyboard twin of dragging its header).
            event.preventDefault();
            const column = this.#ordered()[this.#focusedCol];
            const to = this.#focusedCol + (key === "ArrowLeft" ? -1 : 1);
            if (column && this.#moveColumnTo(column.id, to)) {
                this.#focusedCol = to;
                this.#render();
                this.#cellEls.get(`${this.#focusedRow}-${this.#focusedCol}`)?.focus({ preventScroll: true });
            }
            return;
        }
        if (event.key === "F2" && (this.#onFieldEdit || this.#editableFields)) {
            // F2: edit the card's first editable field (the keyboard twin of clicking its value).
            const card = this.#cardAt(this.#focusedCol, this.#focusedRow, layout);
            const first = card ? this.#resolvedFields.find((f) => this.#isFieldEditable(f, card)) : undefined;
            if (card && first) {
                event.preventDefault();
                this.#startFieldEdit(card, first);
            }
            return;
        }
        // Type-ahead in the focused column: letters typed in quick succession move to the next card whose label starts with them.
        // A lone "x" stays the select shortcut when cards are selectable; it joins a prefix already in progress.
        if (isTypeaheadKey(event) && !event.altKey) {
            const now = Date.now();
            const continuing = this.#typeahead.prefix !== "" && now - this.#typeahead.at <= 700;
            const isSelectKey = this.#selectable && (event.key === "x" || event.key === "X");
            if (continuing || !isSelectKey) {
                const state = nextTypeaheadState(this.#typeahead, event.key, now, 700);
                const labelsInColumn = Array.from({ length: maxRows }, (_, row) => {
                    const c = this.#cardAt(this.#focusedCol, row, layout);
                    return c ? this.#cardLabel(c) : "";
                });
                const hit = findTypeaheadMatch(labelsInColumn, this.#focusedRow, state.prefix);
                if (hit !== -1) {
                    this.#typeahead = state;
                    event.preventDefault();
                    this.#moveFocus(hit, this.#focusedCol, layout);
                    return;
                }
            }
        }
        if (this.#selectable && !ctrlOrMeta && !event.altKey && (event.key === "x" || event.key === "X")) {
            const selectable = this.#cardAt(this.#focusedCol, this.#focusedRow, layout);
            if (selectable && !this.readonly) {
                event.preventDefault();
                this.#toggleSelected(selectable.id);
            }
            return;
        }
        if (event.altKey && (key === "ArrowLeft" || key === "ArrowRight")) {
            // Alt+ArrowLeft/Right: move the card to the neighbouring column (the keyboard twin of dragging it there).
            event.preventDefault();
            const card = this.#cardAt(this.#focusedCol, this.#focusedRow, layout);
            const destination = this.#ordered()[this.#focusedCol + (key === "ArrowLeft" ? -1 : 1)];
            if (card && destination) this.#moveCard(card, destination);
            return;
        }
        if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
            event.preventDefault();
            this.#reorderCard(event.key === "ArrowUp" ? -1 : 1, layout);
            return;
        }
        const move = gridMove(
            event,
            { row: this.#focusedRow, col: this.#focusedCol },
            { firstRow: 0, lastRow: maxRows - 1, lastCol: this.#ordered().length - 1, pageStep: pageStepFor(this.#virtualize), homeEnd: "column", rtl: isRtl(cell) },
        );
        if (move) {
            event.preventDefault();
            this.#moveFocus(move.row, move.col, layout);
            return;
        }
        switch (key) {
            case "Enter":
            case " ": {
                event.preventDefault();
                const card = this.#cardAt(this.#focusedCol, this.#focusedRow, layout);
                if (card) this.#openMoveMenu(card);
                break;
            }
            default:
                break;
        }
    }

    // ---- Rendering ----

    #render(): void {
        if (!this.isConnected) return;

        // A structural rebuild cannot preserve the open move menu's DOM
        // (its list lives inside a <td> that is about to be replaced).
        this.#moveController?.destroy();
        this.#moveController = null;
        this.#openCardId = null;
        this.#moveListEl = null;
        this.#moveOptionEls = [];
        this.#cellEls = new Map();
        this.#moveButtonEls = new Map();

        const extraClass = this.getAttribute("class") ?? "";
        const root = document.createElement("div");
        root.className = `kanban-board ${extraClass}`.trim();
        if (this.readonly) root.setAttribute("data-readonly", "");

        const table = document.createElement("table");
        table.className = "kanban-table";
        table.setAttribute("role", "grid");
        table.setAttribute("aria-label", this.label);
        if (this.#selectable) table.setAttribute("aria-multiselectable", "true");
        table.addEventListener("keydown", (event) =>
            this.#onGridKeydown(event as KeyboardEvent),
        );
        table.addEventListener("focusin", (event) => this.#onGridFocusin(event as FocusEvent));

        if (this.caption) {
            const caption = document.createElement("caption");
            caption.textContent = this.caption;
            table.appendChild(caption);
        }

        const layout = this.#layout();
        const cardsByColumn = layout.cardsByColumn;
        const allByColumn = this.#allByColumn();
        const selectedSet = new Set(this.#selected);
        this.#exportCards = [];
        for (const column of this.#ordered()) {
            for (const card of cardsByColumn.get(column.id) ?? []) if (this.#exportScope !== "selected" || selectedSet.has(card.id)) this.#exportCards.push(card);
        }
        const maxRows = layout.maxRows;
        const hasLanes = !!this.#lanes && this.#lanes.length > 0;
        if (this.#virtualize) table.setAttribute("aria-rowcount", String(layout.slots.length + 1));

        if (this.#labels.search) {
            const input = document.createElement("input");
            input.type = "search";
            input.className = "search-input kanban-board-search";
            input.setAttribute("aria-label", this.#labels.search);
            input.value = this.search;
            input.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && this.search !== "") {
                    e.preventDefault();
                    this.setAttribute("search", "");
                    this.querySelector<HTMLInputElement>(".kanban-board-search")?.focus();
                }
            });
            input.addEventListener("input", () => {
                this.setAttribute("search", input.value);
                const again = this.querySelector<HTMLInputElement>(".kanban-board-search");
                again?.focus();
                again?.setSelectionRange(input.value.length, input.value.length);
            });
            root.appendChild(input);
        }

        // Clamp the roving cursor to whatever the new data still has.
        this.#focusedCol = Math.min(Math.max(this.#focusedCol, 0), Math.max(this.#ordered().length - 1, 0));
        this.#focusedRow = Math.min(Math.max(this.#focusedRow, 0), Math.max(maxRows - 1, 0));

        const thead = document.createElement("thead");
        thead.className = "kanban-table-head";
        const headRow = document.createElement("tr");
        headRow.className = "kanban-table-row";

        for (const column of this.#ordered()) {
            const count = allByColumn.get(column.id)?.length ?? 0;
            const hidden = count - (cardsByColumn.get(column.id)?.length ?? 0);
            const overLimit = column.wipLimit != null && count > column.wipLimit;
            const th = document.createElement("th");
            th.className = "kanban-table-th";
            if (this.#movableColumns) {
                th.setAttribute("draggable", "true");
                th.addEventListener("dragstart", (event) => {
                    this.#draggingColumnId = column.id;
                    (event as DragEvent).dataTransfer?.setData("text/plain", column.id);
                });
                th.addEventListener("dragover", (event) => {
                    if (this.#draggingColumnId) event.preventDefault();
                });
                th.addEventListener("drop", (event) => {
                    event.preventDefault();
                    const id = this.#draggingColumnId;
                    this.#draggingColumnId = null;
                    if (!id || id === column.id) return;
                    const to = this.#ordered().findIndex((c) => c.id === column.id);
                    if (to >= 0) this.#moveColumnTo(id, to);
                });
            }
            if (hidden > 0) th.setAttribute("data-hidden-count", String(hidden));
            if (column.flag) th.setAttribute("data-flag", column.flag);
            if (column.accent) th.setAttribute("data-accent", column.accent);
            if (overLimit) th.setAttribute("data-over-limit", "");
            const isCollapsed = this.#collapsed.includes(column.id);
            if (isCollapsed) th.setAttribute("data-collapsed", "");
            if (this.#labels.collapseColumn) {
                const toggle = document.createElement("button");
                toggle.type = "button";
                toggle.className = "kanban-board-collapse-button";
                toggle.setAttribute("aria-expanded", String(!isCollapsed));
                toggle.setAttribute("aria-label", this.#labels.collapseColumn(column, isCollapsed));
                toggle.textContent = isCollapsed ? "▸" : "▾";
                toggle.addEventListener("click", () => this.#toggleCollapsed(column));
                th.appendChild(toggle);
            }
            th.appendChild(document.createTextNode(column.title));
            if (column.flag) {
                const flag = document.createElement("span");
                flag.className = "kanban-board-column-flag";
                flag.textContent = column.flag;
                th.appendChild(flag);
            }
            if (this.renderColumnHeader) {
                th.appendChild(this.renderColumnHeader({ column, cards: allByColumn.get(column.id) ?? [], count }));
            }
            if (this.#labels.cardCount) {
                const span = document.createElement("span");
                span.className = "kanban-board-count";
                span.textContent = this.#labels.cardCount(count);
                th.appendChild(span);
            }
            if (overLimit && this.#labels.overLimit) {
                const span = document.createElement("span");
                span.className = "kanban-board-wip-warning";
                span.textContent = this.#labels.overLimit(count, column.wipLimit ?? 0);
                th.appendChild(span);
            }
            if (this.#labels.addCard && !this.readonly) {
                const add = document.createElement("button");
                add.type = "button";
                add.className = "kanban-board-add-button";
                add.setAttribute("aria-label", this.#labels.addCard(column));
                add.textContent = "+";
                add.addEventListener("click", () => {
                    this.#onAddCard?.(column.id);
                    this.dispatchEvent(
                        new CustomEvent<string>("addcard", { detail: column.id, bubbles: true, composed: true }),
                    );
                });
                th.appendChild(add);
            }
            headRow.appendChild(th);
        }
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        tbody.className = "kanban-table-body";

        const windowIdx = this.#windowIndices(layout);
        this.#windowSig = windowIdx.join(",");
        const rowHeight = this.#virtualize?.rowHeight ?? 0;
        let previousIdx = -1;
        const spacer = (rows: number): void => {
            const tr = document.createElement("tr");
            tr.className = "kanban-board-spacer";
            tr.setAttribute("aria-hidden", "true");
            tr.style.height = `${rows * rowHeight}px`;
            const td = document.createElement("td");
            td.colSpan = this.#ordered().length;
            tr.appendChild(td);
            tbody.appendChild(tr);
        };
        for (const slotIndex of windowIdx) {
            if (this.#virtualize && slotIndex - previousIdx > 1) spacer(slotIndex - previousIdx - 1);
            previousIdx = slotIndex;
            const item = layout.slots[slotIndex];
            if (item.kind === "lane") {
                const laneRow = document.createElement("tr");
                laneRow.className = "kanban-table-row";
                laneRow.setAttribute("data-lane-row", "");
                const laneTh = document.createElement("th");
                laneTh.className = "kanban-board-lane";
                laneTh.setAttribute("scope", "rowgroup");
                laneTh.colSpan = this.#ordered().length;
                laneTh.setAttribute("data-lane-id", item.lane.id);
                const laneCollapsed = this.#collapsedLanes.includes(item.lane.id);
                if (laneCollapsed) laneTh.setAttribute("data-collapsed", "");
                if (this.#labels.collapseLane) {
                    const toggle = document.createElement("button");
                    toggle.type = "button";
                    toggle.className = "kanban-board-lane-toggle";
                    toggle.setAttribute("aria-expanded", String(!laneCollapsed));
                    toggle.setAttribute("aria-label", this.#labels.collapseLane(item.lane, laneCollapsed));
                    toggle.textContent = laneCollapsed ? "▸" : "▾";
                    toggle.addEventListener("click", () => this.#toggleLane(item.lane));
                    laneTh.appendChild(toggle);
                }
                const laneTitle = document.createElement("span");
                laneTitle.className = "kanban-board-lane-title";
                laneTitle.textContent = item.lane.title;
                laneTh.appendChild(laneTitle);
                if (this.#labels.laneCount) {
                    let laneCards = 0;
                    for (const column of this.#ordered()) laneCards += layout.cell.get(`${column.id}\u0000${item.lane.id}`)?.length ?? 0;
                    const laneCountEl = document.createElement("span");
                    laneCountEl.className = "kanban-board-lane-count";
                    laneCountEl.textContent = this.#labels.laneCount(item.lane, laneCards);
                    laneTh.appendChild(laneCountEl);
                }
                laneRow.appendChild(laneTh);
                tbody.appendChild(laneRow);
                continue;
            }
            const rowIndex = item.rowIndex;
            const tr = document.createElement("tr");
            tr.className = "kanban-table-row";
            if (this.#virtualize) tr.setAttribute("aria-rowindex", String(slotIndex + 2));
            if (hasLanes) tr.setAttribute("data-lane-id", item.laneId);

            this.#ordered().forEach((column, colIndex) => {
                const card = this.#cardAt(colIndex, rowIndex, layout);
                const td = document.createElement("td");
                td.className = "kanban-table-td";
                td.setAttribute("data-row", String(rowIndex));
                td.setAttribute("data-col", String(colIndex));
                if (this.#collapsed.includes(column.id)) td.setAttribute("data-collapsed", "");
                const active = this.#focusedRow === rowIndex && this.#focusedCol === colIndex;
                td.setAttribute("tabindex", active ? "0" : "-1");
                if (card) {
                    td.setAttribute("aria-label", this.#cardLabel(card));
                    td.dataset.cardId = card.id;
                }
                if (column.accent) td.setAttribute("data-accent", column.accent);
                if (card?.locked) td.setAttribute("data-locked", "");
                if (card && this.#selectable && selectedSet.has(card.id)) {
                    td.setAttribute("data-selected", "");
                    td.setAttribute("aria-selected", "true");
                }
                if (this.#selectable) {
                    td.addEventListener("click", (event) => {
                        if ((event.ctrlKey || event.metaKey) && card && !this.readonly) {
                            event.preventDefault();
                            this.#toggleSelected(card.id);
                        }
                    });
                }
                if (card && card.id in this.#optimistic) {
                    td.setAttribute("data-pending", "");
                    td.setAttribute("aria-busy", "true");
                }
                if (card?.flag) {
                    td.setAttribute("data-flag", card.flag);
                    td.setAttribute("aria-describedby", `${this.#baseId}-flag-${card.id}`);
                }
                if (!card && !hasLanes && rowIndex === 0 && this.#labels.emptyColumn && this.#isEmptyColumn(column, cardsByColumn)) {
                    td.setAttribute("data-empty", "");
                }
                td.addEventListener("dragover", (event) =>
                    this.#onColumnDragOver(event as DragEvent, td, column, rowIndex, colIndex),
                );
                td.addEventListener("dragleave", () => {
                    td.removeAttribute("data-drop-target");
                    td.removeAttribute("data-drop-blocked");
                });
                td.addEventListener("drop", (event) =>
                    this.#onColumnDrop(column, rowIndex, event as DragEvent),
                );
                if (card && this.#cardAttrs) {
                    for (const [name, value] of Object.entries(this.#cardAttrs(card))) td.setAttribute(name, value);
                }

                if (card) {
                    const titleSpan = document.createElement("span");
                    titleSpan.className = "kanban-board-card-title";
                    if (!this.readonly && !card.locked && card.draggable !== false) titleSpan.setAttribute("draggable", "true");
                    if (this.renderCard) {
                        titleSpan.appendChild(
                            this.renderCard({ card, label: this.#cardLabel(card), column, pending: card.id in this.#optimistic }),
                        );
                    } else if (card.href) {
                        const link = document.createElement("a");
                        link.className = "kanban-board-card-link";
                        link.href = card.href;
                        this.#fillTitle(link, card);
                        titleSpan.appendChild(link);
                    } else {
                        this.#fillTitle(titleSpan, card);
                    }
                    titleSpan.addEventListener("dragstart", (event) =>
                        this.#onCardDragStart(card, event as DragEvent),
                    );
                    titleSpan.addEventListener("dragend", () => this.#onCardDragEnd());
                    td.appendChild(titleSpan);
                    if (!this.renderCard) {
                        if (card.subtitle) {
                            const sub = document.createElement("span");
                            sub.className = "kanban-board-card-subtitle";
                            sub.textContent = card.subtitle;
                            td.appendChild(sub);
                        }
                        if (card.badges?.length) {
                            const badges = document.createElement("span");
                            badges.className = "kanban-board-card-badges";
                            for (const badge of card.badges) {
                                const b = document.createElement("span");
                                b.className = "kanban-board-card-badge";
                                b.textContent = badge;
                                badges.appendChild(b);
                            }
                            td.appendChild(badges);
                        }
                    }
                    if (!this.renderCard && this.#resolvedFields.length > 0) {
                        const fieldsEl = document.createElement("span");
                        fieldsEl.className = "kanban-board-card-fields";
                        for (const f of this.#resolvedFields) {
                            const node = this.#fieldNode(card, f);
                            if (node) fieldsEl.appendChild(node);
                        }
                        td.appendChild(fieldsEl);
                    }
                    if (card.flag) {
                        const flag = document.createElement("span");
                        flag.className = "kanban-board-card-flag";
                        flag.id = `${this.#baseId}-flag-${card.id}`;
                        flag.textContent = card.flag;
                        td.appendChild(flag);
                    }

                    // Gated on labels.moveButton: an unnamed button is worse than
                    // none, and Enter/Space on the cell opens the menu either way.
                    if (this.#labels.moveButton && !this.readonly && !card.locked) {
                        const button = document.createElement("button");
                        button.type = "button";
                        button.className = "kanban-board-move-button";
                        button.setAttribute("aria-label", this.#labels.moveButton(card));
                        button.setAttribute("aria-haspopup", "listbox");
                        button.setAttribute("aria-expanded", "false");
                        button.setAttribute("tabindex", "-1");
                        button.appendChild(this.renderMoveButtonIcon());
                        button.addEventListener("click", () => {
                            if (this.#openCardId === card.id) this.#closeMoveMenu();
                            else this.#openMoveMenu(card);
                        });
                        td.appendChild(button);
                        this.#moveButtonEls.set(card.id, button);
                    }
                }

                if (!card && !hasLanes && rowIndex === 0 && this.#labels.emptyColumn && this.#isEmptyColumn(column, cardsByColumn)) {
                    const empty = document.createElement("span");
                    empty.className = "kanban-board-empty";
                    empty.textContent = this.#labels.emptyColumn(column);
                    td.appendChild(empty);
                }
                tr.appendChild(td);
                this.#cellEls.set(`${rowIndex}-${colIndex}`, td);
            });

            tbody.appendChild(tr);
        }
        if (this.#virtualize && layout.slots.length - 1 - previousIdx > 0) spacer(layout.slots.length - 1 - previousIdx);
        table.appendChild(tbody);
        if (this.renderColumnFooter) {
            const tfoot = document.createElement("tfoot");
            tfoot.className = "kanban-table-foot";
            const frow = document.createElement("tr");
            frow.className = "kanban-table-row";
            for (const column of this.#ordered()) {
                const fcell = document.createElement("td");
                fcell.className = "kanban-table-td kanban-board-column-footer";
                if (column.accent) fcell.setAttribute("data-accent", column.accent);
                const cardsAll = allByColumn.get(column.id) ?? [];
                fcell.appendChild(this.renderColumnFooter({ column, cards: cardsAll, count: cardsAll.length }));
                frow.appendChild(fcell);
            }
            tfoot.appendChild(frow);
            table.appendChild(tfoot);
        }
        if (this.#labels.exportHeaders && (this.#labels.copy || this.#labels.exportCsv || this.#labels.exportTsv || this.#labels.exportExcel)) {
            const group = document.createElement("div");
            group.className = "kanban-board-export";
            group.setAttribute("role", "group");
            if (this.#labels.export) group.setAttribute("aria-label", this.#labels.export);
            const formats: [ExportFormat | "copy", string | undefined][] = [
                ["copy", this.#labels.copy],
                ["csv", this.#labels.exportCsv],
                ["tsv", this.#labels.exportTsv],
                ["xlsx", this.#labels.exportExcel],
            ];
            for (const [format, text] of formats) {
                if (!text) continue;
                const button = document.createElement("button");
                button.type = "button";
                button.className = "kanban-board-export-button";
                button.setAttribute("data-kanban-export-format", format);
                button.disabled = this.#exportCards.length === 0;
                button.textContent = text;
                button.addEventListener("click", () => this.#runExport(format));
                group.appendChild(button);
            }
            root.appendChild(group);
        }
        this.#undoBtn = null;
        if (this.#undoable && this.#labels.undo && !this.readonly) {
            const undoBtn = document.createElement("button");
            undoBtn.type = "button";
            undoBtn.className = "kanban-board-undo-button";
            undoBtn.textContent = this.#labels.undo;
            undoBtn.disabled = this.#undoStack.length === 0;
            undoBtn.addEventListener("click", () => void this.#undo());
            root.appendChild(undoBtn);
            this.#undoBtn = undoBtn;
        }
        // The scroll area is structural: a virtualized board renders only the rows in view inside it.
        const scroll = document.createElement("div");
        scroll.className = this.#virtualize ? "kanban-board-scroll" : "kanban-board-body";
        if (this.#virtualize) {
            scroll.style.height = `${this.#virtualize.height}px`;
            scroll.style.overflow = "auto";
            scroll.addEventListener("scroll", () => this.#onScroll());
        }
        scroll.appendChild(table);
        root.appendChild(scroll);
        this.#scrollEl = scroll;

        const status = document.createElement("p");
        status.className = "kanban-board-status";
        status.setAttribute("aria-live", "polite");
        status.textContent = this.#statusMessage;
        root.appendChild(status);

        this.replaceChildren(root);
        this.#rootEl = root;
        this.#statusEl = status;
        if (this.#virtualize) scroll.scrollTop = this.#scrollTop;
    }
}
