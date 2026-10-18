import { NgTemplateOutlet } from "@angular/common";
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Injector,
  afterNextRender,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
} from "@angular/core";
import {
  IconButton,
  KanbanTable,
  KanbanTableBody,
  KanbanTableHead,
  KanbanTableRow,
  KanbanTableTD,
  KanbanTableTH,
  Listbox,
  Mark,
  SearchInput,
} from "@lilydesignsystem/angular-headless";
import { copyToClipboard, downloadBlob, exportBlob, exportFilename, toClipboardText, type ExportFormat } from "./export-data";
import { highlightSegments, matchesSearch } from "./search-text";
import { isRtl, logicalKey } from "./direction";
import { gridMove, pageStepFor } from "./grid-navigation";
import { EMPTY_HISTORY, historyKey, recordEdit, redoEdit, undoEdit, type EditHistory } from "./edit-history";
import { findTypeaheadMatch, isTypeaheadKey, nextTypeaheadState, type TypeaheadState } from "./typeahead";
import {
  draftOf,
  editorKind,
  evaluateEdit,
  exportFieldCell,
  exportableFields,
  fieldText as fieldTextOf,
  isEditableField,
  neighbourField,
  resolveFields,
  type Draft,
  type FieldDef,
  type ResolvedField,
} from "./typed-fields";

/**
 * A typed field a card carries (an owner, a due date, an estimate): a bundle of display, sort and export defaults from
 * the data grid's cell types, read from `card.values[id]`. Plain data; the board shows it as text.
 */
export type KanbanField = FieldDef;

/** What `exportHandler` and the `exportFile` output receive. Return `false` from `exportHandler` to take over the download. */
export type KanbanExport = { format: ExportFormat; filename: string; cardCount: number; blob: Blob };

/** What the `titleEdit` output carries: the card, its new title, and the title it had. */
export type KanbanTitleEdit = { cardId: string; title: string; previous: string };

/** What the `fieldEdit` output carries. */
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

/** What the `cardTemplate` receives (`let-card="card"`, `let-label="label"` …). */
export type KanbanCardContext = { card: KanbanCard; label: string; column: KanbanColumn; pending: boolean };

/** What the `columnHeaderTemplate` / `columnFooterTemplate` receive: the column and every card in it (unfiltered). */
export type KanbanColumnContext = { column: KanbanColumn; cards: KanbanCard[]; count: number };

/**
 * Every field is optional, but its presence gates the control it
 * names — no baked-in English fallback, matching every other helper's
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
  /** Accessible name of a card's title editor: (the card's current title). Defaults to the title. */
  titleEditor?: (cardTitle: string) => string;
  /** Announced after a title edit: (previous title, new title). */
  titleEditAnnouncement?: (previous: string, title: string) => string;
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

/** Payload of the `reorder` output. */
export type KanbanReorderEvent = {
  cardId: string;
  /** 0-based index within the card's own column. */
  toIndex: number;
};

/** Payload of the `move` output. */
export type KanbanMoveEvent = {
  cardId: string;
  toColumnId: string;
  /** 0-based position in the visible column; present only when a pointer drop landed on a card. */
  toIndex?: number;
  /** The destination lane; present only when a drop landed in a lane's cell. */
  toLaneId?: string;
};

type UndoStep = { cardId: string; fromColumnId: string; toColumnId: string };

type RenderItem =
  | { kind: "spacer"; height: number; key: string }
  | { kind: "lane"; lane: KanbanLane; key: string }
  | { kind: "row"; rowIndex: number; laneId: string; laneRow: number; key: string };

/** Payload of the `moveError` output. */
export type KanbanMoveErrorEvent = { cardId: string; toColumnId: string; error: unknown };

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextKanbanBoardId(): string {
  uid += 1;
  return `kanban-board-${uid}`;
}

/**
 * KanbanBoard — a headless, interactive kanban board.
 *
 * Composes `@lilydesignsystem/angular-headless`'s `KanbanTable` family
 * (a real npm dependency, unmodified) for the grid's own markup, and
 * `IconButton`/`Listbox` (the same headless pair every `*-picker`
 * composes) for a per-card "Move to…" action menu — the WCAG 2.5.7 /
 * Atlassian Pragmatic-Drag-and-Drop-backed keyboard alternative to
 * drag-only card movement. Pointer drag-and-drop is supplementary. See
 * `spec/index.md` for the full contract.
 */
@Component({
  selector: "lily-kanban-board",
  standalone: true,
  imports: [
    IconButton,
    Mark,
    SearchInput,
    KanbanTable,
    KanbanTableBody,
    KanbanTableHead,
    KanbanTableRow,
    KanbanTableTD,
    KanbanTableTH,
    Listbox,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #rootEl
      class="kanban-board {{ className() }}"
      [attr.data-readonly]="readonly() ? '' : null"
      [attr.data-field-layout]="fieldLayout() === 'compact' ? 'compact' : null"
    >
      @if (labels().search; as searchLabel) {
        @if (showSearchLabel()) {
          <label class="kanban-board-search-label" [attr.for]="searchFieldId">{{ searchLabel }}</label>
        }
        <lily-search-input
          className="kanban-board-search"
          [label]="searchLabel"
          [value]="search()"
          (valueChange)="search.set($event)"
          (keydown)="onSearchKeydown($event)"
        />
      }
      @if (hasExportButtons()) {
        <div class="kanban-board-export" role="group" [attr.aria-label]="labels().export ?? null">
          @if (labels().copy; as copy) {
            <button type="button" class="kanban-board-export-button" data-kanban-export-format="copy" [disabled]="exportCards().length === 0" (click)="runExport('copy')">{{ copy }}</button>
          }
          @if (labels().exportCsv; as csv) {
            <button type="button" class="kanban-board-export-button" data-kanban-export-format="csv" [disabled]="exportCards().length === 0" (click)="runExport('csv')">{{ csv }}</button>
          }
          @if (labels().exportTsv; as tsv) {
            <button type="button" class="kanban-board-export-button" data-kanban-export-format="tsv" [disabled]="exportCards().length === 0" (click)="runExport('tsv')">{{ tsv }}</button>
          }
          @if (labels().exportExcel; as excel) {
            <button type="button" class="kanban-board-export-button" data-kanban-export-format="xlsx" [disabled]="exportCards().length === 0" (click)="runExport('xlsx')">{{ excel }}</button>
          }
        </div>
      }
      @if (undoable() && labels().undo; as undoLabel) {
        @if (!readonly()) {
          <button type="button" class="kanban-board-undo-button" [disabled]="undoStack().length === 0" (click)="undo()">{{ undoLabel }}</button>
        }
      }
      <!-- The scroll area is structural: a virtualized board renders only the rows in view inside it. -->
      <div
        #scrollEl
        [class]="virtualize() ? 'kanban-board-scroll' : 'kanban-board-body'"
        [style.height.px]="virtualize()?.height ?? null"
        [style.overflow]="virtualize() ? 'auto' : null"
        (scroll)="onScroll($event)"
      >
      <lily-kanban-table
        [label]="label()"
        (keydown)="onGridKeydown($event)"
        (focusin)="onGridFocusin($event)"
      >
        @if (caption()) {
          <!-- KanbanTable has no "caption" input (Angular headless
               deviation from the Svelte contract); a <caption> element
               is valid projected content as the table's first child,
               so this needs no headless-component change. -->
          <caption class="kanban-board-caption">{{ caption() }}</caption>
        }
        <thead lily-kanban-table-head>
          <tr lily-kanban-table-row>
            @for (column of orderedColumns(); track column.id) {
              @let count = cardCountFor(column.id);
              @let overLimit = isOverLimit(column, count);
              <th
                lily-kanban-table-th
                [attr.data-over-limit]="overLimit ? '' : null"
                [attr.data-collapsed]="isCollapsed(column.id) ? '' : null"
                [attr.data-hidden-count]="hiddenCountFor(column.id) > 0 ? hiddenCountFor(column.id) : null"
                [attr.data-flag]="column.flag ?? null"
                [attr.data-accent]="column.accent ?? null"
                [attr.draggable]="movableColumns() ? 'true' : null"
                (dragstart)="onHeaderDragStart(column, $event)"
                (dragover)="onHeaderDragOver($event)"
                (drop)="onHeaderDrop(column, $event)"
              >
                @if (labels().collapseColumn; as collapseColumn) {
                  <button
                    type="button"
                    class="kanban-board-collapse-button"
                    [attr.aria-expanded]="!isCollapsed(column.id)"
                    [attr.aria-label]="collapseColumn(column, isCollapsed(column.id))"
                    (click)="toggleCollapsed(column)"
                  >{{ isCollapsed(column.id) ? "▸" : "▾" }}</button>
                }
                {{ column.title }}
                @if (column.flag) {
                  <span class="kanban-board-column-flag">{{ column.flag }}</span>
                }
                @if (columnHeaderTemplate(); as headerTpl) {
                  <ng-container
                    [ngTemplateOutlet]="headerTpl"
                    [ngTemplateOutletContext]="{ column: column, cards: cardsByColumn().get(column.id) ?? [], count: count }"
                  />
                }
                @if (labels().cardCount) {
                  <span class="kanban-board-count">{{ labels().cardCount!(count) }}</span>
                }
                @if (overLimit && labels().overLimit) {
                  <span class="kanban-board-wip-warning">{{
                    labels().overLimit!(count, column.wipLimit ?? 0)
                  }}</span>
                }
                @if (labels().addCard; as addCard) {
                  @if (!readonly()) {
                    <button
                      type="button"
                      class="kanban-board-add-button"
                      [attr.aria-label]="addCard(column)"
                      (click)="addCardRequested.emit(column.id)"
                    >+</button>
                  }
                }
              </th>
            }
          </tr>
        </thead>
        <tbody lily-kanban-table-body>
          @for (item of renderItems(); track item.key) {
            @if (item.kind === "spacer") {
              <tr class="kanban-board-spacer" aria-hidden="true" [style.height.px]="item.height"><td [attr.colspan]="orderedColumns().length"></td></tr>
            } @else if (item.kind === "lane") {
              <tr lily-kanban-table-row data-lane-row="">
                <th
                  class="kanban-board-lane"
                  scope="rowgroup"
                  [attr.colspan]="orderedColumns().length"
                  [attr.data-lane-id]="item.lane.id"
                  [attr.data-collapsed]="isLaneCollapsed(item.lane.id) ? '' : null"
                >
                  @if (labels().collapseLane; as collapseLane) {
                    <button
                      type="button"
                      class="kanban-board-lane-toggle"
                      [attr.aria-expanded]="!isLaneCollapsed(item.lane.id)"
                      [attr.aria-label]="collapseLane(item.lane, isLaneCollapsed(item.lane.id))"
                      (click)="toggleLane(item.lane)"
                    >{{ isLaneCollapsed(item.lane.id) ? "▸" : "▾" }}</button>
                  }
                  <span class="kanban-board-lane-title">{{ item.lane.title }}</span>
                  @if (labels().laneCount; as laneCount) {
                    <span class="kanban-board-lane-count">{{ laneCount(item.lane, laneCardCount(item.lane.id)) }}</span>
                  }
                </th>
              </tr>
            } @else {
            @let rowIndex = item.rowIndex;
            <tr
              lily-kanban-table-row
              [attr.aria-rowindex]="virtualize() ? slotIndexOfRow(rowIndex) + 2 : null"
              [attr.data-lane-id]="hasLanes() ? item.laneId : null"
            >
              @for (column of orderedColumns(); track column.id; let colIndex = $index) {
                @let card = cardAt(colIndex, rowIndex);
                <td
                  lily-kanban-table-td
                  [attr.data-row]="rowIndex"
                  [attr.data-selected]="card && selectable() && isSelected(card.id) ? '' : null"
                  [attr.aria-selected]="card && selectable() && isSelected(card.id) ? 'true' : null"
                  [attr.data-dragging]="card && draggingGroup().includes(card.id) ? '' : null"
                  (click)="onCellClick($event, card)"
                  [attr.data-col]="colIndex"
                  [attr.data-card-id]="card?.id ?? null"
                  [attr.data-collapsed]="isCollapsed(column.id) ? '' : null"
                  [attr.data-locked]="card?.locked ? '' : null"
                  [attr.data-pending]="card && isPending(card.id) ? '' : null"
                  [attr.aria-busy]="card && isPending(card.id) ? 'true' : null"
                  [attr.data-flag]="card?.flag ?? null"
                  [attr.data-accent]="column.accent ?? null"
                  [attr.data-empty]="!card && !hasLanes() && rowIndex === 0 && labels().emptyColumn && isEmptyColumn(column) ? '' : null"
                  [attr.data-drop-target]="dropTarget() === rowIndex + '-' + colIndex && !dropBlocked() ? '' : null"
                  [attr.data-drop-blocked]="dropTarget() === rowIndex + '-' + colIndex && dropBlocked() ? '' : null"
                  [attr.aria-describedby]="card?.flag ? flagId(card.id) : null"
                  [attr.tabindex]="isFocused(rowIndex, colIndex) ? 0 : -1"
                  (dragover)="onColumnDragOver($event, column, rowIndex, colIndex)"
                  (dragleave)="dropTarget.set(null); dropBlocked.set(false)"
                  (drop)="onColumnDrop(column, rowIndex, $event)"
                >
                  @if (card) {
                    <!-- Supplementary pointer-drag handle inside an
                         already-interactive gridcell; the accessible
                         move path is the button/listbox below. -->
                    <span
                      class="kanban-board-card-title"
                      [attr.draggable]="readonly() || card.locked || card.draggable === false || editingTitle()?.cardId === card.id ? null : 'true'"
                      (dragstart)="onCardDragStart(card, $event)"
                      (dragend)="onCardDragEnd()"
                      (dblclick)="startTitleEdit(card)"
                    >
                      @if (editingTitle(); as et) {
                        @if (et.cardId === card.id) {
                          <input
                            class="kanban-board-title-editor"
                            type="text"
                            [attr.aria-label]="labels().titleEditor ? labels().titleEditor!(cardLabel()(card)) : cardLabel()(card)"
                            [value]="et.draft"
                            (input)="onTitleEditorInput($event)"
                            (keydown)="onTitleEditorKeydown($event)"
                            (blur)="commitTitleEdit(false)"
                          />
                        }
                      }
                      @if (editingTitle()?.cardId !== card.id) {
                        @if (cardTemplate(); as cardTpl) {
                          <ng-container
                            [ngTemplateOutlet]="cardTpl"
                            [ngTemplateOutletContext]="{ card: card, label: cardLabel()(card), column: column, pending: isPending(card.id) }"
                          />
                        } @else if (card.href) {
                          <a class="kanban-board-card-link" [href]="card.href"><ng-container *ngTemplateOutlet="titleText; context: { card: card }" /></a>
                        } @else {
                          <ng-container *ngTemplateOutlet="titleText; context: { card: card }" />
                        }
                      }
                    </span>
                    @if (!cardTemplate()) {
                      @if (card.subtitle) {
                        <span class="kanban-board-card-subtitle">{{ card.subtitle }}</span>
                      }
                      @if (card.badges?.length) {
                        <span class="kanban-board-card-badges">
                          @for (badge of card.badges; track badge) {
                            <span class="kanban-board-card-badge">{{ badge }}</span>
                          }
                        </span>
                      }
                    }
                    @if (!cardTemplate() && resolvedFields().length > 0) {
                      <span class="kanban-board-card-fields">
                        @for (f of resolvedFields(); track f.id) {
                          @let text = fieldText(f, card);
                          @let editable = isFieldEditable(f, card);
                          @if (editing(); as ed) {
                            @if (ed.cardId === card.id && ed.fieldId === f.id) {
                              <span class="kanban-board-card-field" [attr.data-field]="f.id" data-editing="">
                                <span class="kanban-board-card-field-name" [id]="fieldNameId(card.id, f.id)">{{ f.header }}</span>{{ " " }}
                                @if (kindOf(f) === "select" || kindOf(f) === "radio") {
                                  <select
                                    class="kanban-board-field-editor"
                                    [attr.aria-label]="f.editLabel ?? f.header"
                                    [attr.aria-invalid]="ed.invalid ? 'true' : null"
                                    [value]="editorValue(ed.draft)"
                                    (change)="onEditorSelectChange($event)"
                                    (keydown)="onEditorKeydown($event)"
                                    (blur)="commitFieldEdit(false)"
                                  >
                                    <option value=""></option>
                                    @for (option of f.options ?? []; track option.id) {
                                      <option [value]="option.id" [disabled]="option.disabled ?? false" [selected]="option.id === editorValue(ed.draft)">{{ option.label }}</option>
                                    }
                                  </select>
                                } @else {
                                  <input
                                    class="kanban-board-field-editor"
                                    [attr.aria-label]="f.editLabel ?? f.header"
                                    [attr.aria-invalid]="ed.invalid ? 'true' : null"
                                    [type]="kindOf(f) === 'number' ? 'number' : kindOf(f) === 'date' ? 'date' : kindOf(f) === 'time' ? 'time' : 'text'"
                                    [attr.inputmode]="kindOf(f) === 'number' ? 'decimal' : null"
                                    [value]="editorValue(ed.draft)"
                                    (input)="onEditorInput($event)"
                                    (keydown)="onEditorKeydown($event)"
                                    (blur)="commitFieldEdit(false)"
                                  />
                                }
                              </span>
                            } @else if (text !== "" || editable) {
                              <ng-container *ngTemplateOutlet="fieldView; context: { f: f, card: card, text: text, editable: editable }" />
                            }
                          } @else if (text !== "" || editable) {
                            <ng-container *ngTemplateOutlet="fieldView; context: { f: f, card: card, text: text, editable: editable }" />
                          }
                        }
                      </span>
                    }
                    @if (card.flag) {
                      <span class="kanban-board-card-flag" [id]="flagId(card.id)">{{ card.flag }}</span>
                    }
                    <!-- Gated on labels.moveButton: an unnamed button is worse than
                         none, and Enter/Space on the cell opens the menu either way. -->
                    @if (labels().moveButton; as moveButton) {
                      @if (!readonly() && !card.locked) {
                      <lily-icon-button
                        [label]="moveButton(card)"
                        baseClass="kanban-board-move-button"
                        ariaHaspopup="listbox"
                        [ariaExpanded]="openCardId() === card.id"
                        [ariaControls]="openCardId() === card.id ? moveListId : ''"
                        [tabIndex]="-1"
                        (click)="openCardId() === card.id ? closeMoveMenu(card.id) : openMoveMenu(card)"
                      >
                        &#8644;
                      </lily-icon-button>
                      }
                    }
                    @if (openCardId() === card.id) {
                      <lily-listbox
                        #moveListEl
                        [elementId]="moveListId"
                        baseClass="kanban-board-move-list"
                        [label]="labels().moveMenuLabel ?? cardLabel()(card)"
                        navigation="active-descendant"
                        [clamp]="true"
                        [(activeIndex)]="moveActiveIndex"
                        (activate)="chooseDestination(card, $event)"
                        (escape)="closeMoveMenu(card.id)"
                        (tabOut)="closeMoveMenu(card.id, false)"
                      >
                        @for (destination of moveTargets(card); track destination.id; let i = $index) {
                          <li
                            class="kanban-board-move-option"
                            [id]="moveOptionId(i)"
                            role="option"
                            [attr.aria-selected]="destination.id === card.columnId"
                            [attr.aria-disabled]="isRefused(card, destination) ? 'true' : null"
                            [attr.data-active]="i === moveActiveIndex() ? '' : null"
                            (click)="moveCard(card, destination)"
                          >
                            {{ destination.title }}
                          </li>
                        }
                      </lily-listbox>
                    }
                  } @else if (!hasLanes() && rowIndex === 0 && labels().emptyColumn && isEmptyColumn(column)) {
                    <span class="kanban-board-empty">{{ labels().emptyColumn!(column) }}</span>
                  }
                </td>
              }
            </tr>
            }
          }
        </tbody>
        @if (columnFooterTemplate(); as footerTpl) {
          <tfoot class="kanban-table-foot">
            <tr class="kanban-table-row">
              @for (column of orderedColumns(); track column.id) {
                <td class="kanban-table-td kanban-board-column-footer" [attr.data-accent]="column.accent ?? null">
                  <ng-container
                    [ngTemplateOutlet]="footerTpl"
                    [ngTemplateOutletContext]="{ column: column, cards: cardsByColumn().get(column.id) ?? [], count: cardCountFor(column.id) }"
                  />
                </td>
              }
            </tr>
          </tfoot>
        }
      </lily-kanban-table>
      </div>

      <p class="kanban-board-status" aria-live="polite">{{ statusMessage() }}</p>
    </div>
    <ng-template #titleText let-card="card">
      @if (searching()) {
        @for (part of titleSegments(card); track $index) {
          @if (part.match) {<lily-mark className="kanban-board-match">{{ part.text }}</lily-mark>} @else {{{ part.text }}}
        }
      } @else {{{ cardLabel()(card) }}}
    </ng-template>

    <ng-template #fieldView let-f="f" let-card="card" let-text="text" let-editable="editable">
      <span class="kanban-board-card-field" [attr.data-field]="f.id" [attr.data-type]="f.type ?? 'text'">
        <span class="kanban-board-card-field-name" [id]="fieldNameId(card.id, f.id)">{{ f.header }}</span>{{ " " }}
        @if (editable) {
          <button
            type="button"
            class="kanban-board-field-button"
            [id]="fieldValueId(card.id, f.id)"
            tabindex="-1"
            [attr.aria-labelledby]="fieldNameId(card.id, f.id) + ' ' + fieldValueId(card.id, f.id)"
            (click)="startFieldEdit(card, f)"
          >{{ text }}</button>
        } @else {
          <span class="kanban-board-card-field-value">{{ text }}</span>
        }
      </span>
    </ng-template>
  `,
})
export class KanbanBoard implements AfterViewInit, AfterViewChecked {
  /** Accessible name for the board, passed through to KanbanTable. */
  readonly label = input.required<string>();
  /** Optional visible caption, passed through to KanbanTable. */
  readonly caption = input<string>("");
  /** Column definitions. */
  readonly columns = input.required<KanbanColumn[]>();
  /** Card data. */
  readonly cards = input.required<KanbanCard[]>();
  /** Resolves a card to its display label. Defaults to `card.title`. */
  readonly cardLabel = input<(card: KanbanCard) => string>(
    (card: KanbanCard) => card.title,
  );
  /** Extra attributes on each card's cell (for example `data-priority`); merged after Lily's own. */
  readonly cardAttrs = input<((card: KanbanCard) => Record<string, string>) | undefined>(undefined);
  /** Hides cards for which it returns false. Counts, WIP limits and over-limit warnings still use every card; a filtered column carries `data-hidden-count`. */
  readonly filter = input<((card: KanbanCard) => boolean) | undefined>(undefined);
  /** Orders the cards shown within each column (a stable sort). */
  readonly compare = input<((a: KanbanCard, b: KanbanCard) => number) | undefined>(undefined);
  /** The columns a card may move to (its own column is always shown). The move menu offers only these; drops and keyboard moves elsewhere are refused. */
  readonly allowedColumns = input<((card: KanbanCard) => string[]) | undefined>(undefined);
  /**
   * An async move: awaited when a card moves. The card shows in its new column at once with `data-pending` and `aria-busy` and goes back
   * if the promise rejects (`labels.moveFailed`, the `moveError` output). The `move` output is emitted either way.
   */
  readonly moveHandler = input<((event: KanbanMoveEvent) => void | Promise<unknown>) | undefined>(undefined);
  /** Board-level search, two-way bindable: shows only cards whose text contains it (case-insensitive). Combines with `filter`. */
  readonly search = model<string>("");
  /** The text `search` looks in. Defaults to the label, subtitle and badges. */
  readonly searchText = input<((card: KanbanCard) => string) | undefined>(undefined);
  /** A template replacing a card's title content (context: `card`, `label`, `column`, `pending`). */
  readonly cardTemplate = input<TemplateRef<KanbanCardContext> | undefined>(undefined);
  /** A template rendered in each column's header after its title and flag. */
  readonly columnHeaderTemplate = input<TemplateRef<KanbanColumnContext> | undefined>(undefined);
  /** A template rendered in a `<tfoot>` cell per column: sums per stage. */
  readonly columnFooterTemplate = input<TemplateRef<KanbanColumnContext> | undefined>(undefined);
  /** Swimlanes: horizontal bands of rows. Each card sits in the lane named by `card.laneId` (the first lane when absent). A drop into another lane's cell changes the lane: `move` carries `toLaneId`. */
  readonly lanes = input<KanbanLane[] | undefined>(undefined);
  /** Ids of collapsed swimlanes. Two-way bindable: `[(collapsedLanes)]`. A collapsed lane keeps its header row (and count) but renders no card rows. */
  readonly collapsedLanes = model<string[]>([]);
  /** Several cards can be selected and moved together: Ctrl/Cmd+click or the `x` key toggles the card under the cursor. */
  readonly selectable = input<boolean>(false);
  /** The selected card ids. Two-way bindable: `[(selected)]`. */
  readonly selected = model<string[]>([]);
  /** Text for the drag preview (one card, or the whole selection): `setDragImage` gets an element with this text (class `kanban-board-drag-preview`). */
  readonly dragPreviewText = input<((cards: KanbanCard[]) => string) | undefined>(undefined);
  /** Remember successful moves so Ctrl/Cmd+Z (and `labels.undo`'s button) can take them back. A selection move is one undo step. */
  readonly undoable = input<boolean>(false);
  /** Columns can be reordered: drag a header onto another, or Alt+Shift+ArrowLeft/Right on any cell of the column. */
  readonly movableColumns = input<boolean>(false);
  /** Column ids in display order. Two-way bindable: `[(columnOrder)]`; columns it does not name follow in their own order. */
  readonly columnOrder = model<string[]>([]);
  /** Renders only the rows in view. The board gets a scroll area of `height` px; every row is assumed `rowHeight` px tall (lane headers count as a row). */
  readonly virtualize = input<{ rowHeight: number; height: number; overscan?: number } | undefined>(undefined);
  /** Veto a move (a hard WIP limit, a workflow rule). Refused columns show `aria-disabled` in the move menu. `toLane` is the swimlane the card would land in (the card's own lane unless it is dropped into another), so a rule can depend on the owner as well as the column. */
  readonly canMove = input<((card: KanbanCard, toColumn: KanbanColumn, toLane?: KanbanLane) => boolean) | undefined>(
    undefined,
  );
  /** With swimlanes: may a card be dropped into another lane? Default true. False refuses every cross-lane drop (the cue shows "not allowed"), whatever `canMove` says. */
  readonly allowLaneChange = input<boolean>(true);
  /** Show `labels.search` as visible text beside the search field (`.kanban-board-search-label`), not only as its accessible name. The text is the same string, so the visible label is part of the name (WCAG 2.5.3). */
  readonly showSearchLabel = input<boolean>(false);
  /** How typed fields sit under a card's title. `compact` sets `data-field-layout="compact"` on the board so CSS can put each field's name and value on one line; the markup is the same either way. Default stacked. */
  readonly fieldLayout = input<"stacked" | "compact">("stacked");
  /** Disable every mutating interaction: move menu, drag and reorder. Navigation still works. */
  readonly readonly = input<boolean>(false);
  /** Ids of collapsed columns. Two-way bindable: `[(collapsedColumns)]`. A collapsed column keeps its header and count but shows no cards. */
  readonly collapsedColumns = model<string[]>([]);
  /** User-facing strings. See KanbanLabels — presence gates each control. */
  readonly labels = input<KanbanLabels>({});
  /** Typed fields shown under each card's title, read from `card.values`. Editable types edit in place (click the value, or F2 on the card for the first editable field; Tab moves to the next) when `editableFields` is on. */
  readonly fields = input<KanbanField[] | undefined>(undefined);
  /** Locale for number and date fields. Never defaulted. */
  readonly locale = input<string | undefined>(undefined);
  /** Turns field editing on (and not `readonly`). It stands in for "a `fieldEdit` listener is attached", which an Angular output cannot report. */
  readonly editableFields = input<boolean>(false);
  /** Turns title editing on (and not `readonly`): double-click a card's title, or F2 on the card; Enter or leaving the field commits, Escape cancels, an empty title is refused. Lily changes nothing itself; the consumer renames the card on `titleEdit`. Not for cards with a link (`href`) or a `cardTemplate`. */
  readonly editableTitles = input<boolean>(false);
  /** The file name without its extension. Default `"kanban-board"`. */
  readonly exportFilename = input<string>("kanban-board");
  /** What an export holds: `"view"` (default) is every card the search and filter leave, column by column; `"selected"` is only the selected cards. */
  readonly exportScope = input<"view" | "selected">("view");
  /** Called before the download with the finished file. Return `false` to skip the built-in download. */
  readonly exportHandler = input<((file: KanbanExport) => boolean | void) | undefined>(undefined);
  /** Called before a copy puts text on the clipboard. Return `false` to take over (nothing is copied). The `copy` output fires first. */
  readonly copyHandler = input<((copy: { text: string; rowCount: number }) => boolean | void) | undefined>(undefined);
  /** Extra CSS class on the root. */
  readonly className = input<string>("");

  /** Fires after a card moves to a new column, by pointer or by the move menu. */
  readonly move = output<KanbanMoveEvent>();

  /** Fires when Alt+ArrowUp/Down moves a card within its column. The consumer reorders `cards`. */
  readonly reorder = output<KanbanReorderEvent>();

  /** Fires with the column id when its add-card button is pressed. The consumer adds the card (Lily ships no editor). */
  readonly addCardRequested = output<string>();

  /** Fires with each accepted field edit. The consumer updates `cards`. */
  readonly fieldEdit = output<KanbanFieldEdit>();
  /** A card's title was renamed in place (needs `editableTitles`). */
  readonly titleEdit = output<KanbanTitleEdit>();

  /** Fires with an export file, before it is saved. */
  readonly exportFile = output<KanbanExport>();
  readonly copy = output<{ text: string; rowCount: number }>();

  /** Fires when an async `moveHandler` rejects, after the card has gone back. */
  readonly moveError = output<KanbanMoveErrorEvent>();

  private readonly baseId = nextKanbanBoardId();
  /** The id tying the visible search label to the search field. */
  protected readonly searchFieldId = `${this.baseId}-search`;
  /** The headless SearchInput takes no `id`, so the field is given it after each render that could have changed the field. */
  private readonly searchFieldIdentity = effect(() => {
    if (!this.labels().search) return;
    this.showSearchLabel();
    this.afterRender(() => {
      const field = this.rootRef().nativeElement.querySelector<HTMLInputElement>("input.kanban-board-search");
      if (field) field.id = this.searchFieldId;
    });
  });
  protected readonly moveListId = `${this.baseId}-move-list`;
  protected moveOptionId(index: number): string {
    return `${this.baseId}-move-option-${index}`;
  }

  private readonly rootRef = viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly listRef = viewChild<Listbox>("moveListEl");
  private readonly scrollRef = viewChild<ElementRef<HTMLDivElement>>("scrollEl");

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly injector = inject(Injector);

  protected readonly statusMessage = signal("");
  protected readonly focusedRow = signal(0);
  protected readonly focusedCol = signal(0);

  /** The card whose move menu is open, if any. */
  protected readonly openCardId = signal<string | null>(null);
  protected readonly moveActiveIndex = signal(-1);

  private draggingCardId: string | null = null;
  private draggingColumnId: string | null = null;
  protected readonly draggingGroup = signal<string[]>([]);
  protected readonly scrollTop = signal(0);
  protected readonly undoStack = signal<UndoStep[][]>([]);
  /** The cell a dragged card is over, for `data-drop-target` styling. */
  protected readonly dropTarget = signal<string | null>(null);
  /** Cards moved optimistically by an async `moveHandler` that has not settled: id → destination column. */
  protected readonly optimistic = signal<Record<string, string>>({});
  protected isPending(cardId: string): boolean {
    return cardId in this.optimistic();
  }
  protected flagId(cardId: string): string {
    return `${this.baseId}-flag-${cardId}`;
  }

  /**
   * Angular's headless `KanbanTable` (unlike the Svelte reference this
   * package ports) does not set `role="grid"` on its rendered
   * `<table>` — confirmed by reading KanbanTable.ts; no `role`
   * attribute appears anywhere in it. `KanbanTable` is on the
   * "do not modify" list for this port, so the WAI-ARIA APG Grid role
   * is applied here instead, once, right after the view renders — a
   * plain DOM write Angular's own change detection does not track (and
   * so will not remove on a later check), the same "consumer patches
   * the rendered DOM" approach `data-grid`'s own roving-tabindex query
   * already uses in this component. See spec/index.md §3 and
   * CHANGELOG.md.
   */
  ngAfterViewInit(): void {
    this.rootRef()
      .nativeElement.querySelector("table.kanban-table")
      ?.setAttribute("role", "grid");
  }

  /** `cardAttrs` has no template spread in Angular: the attributes are written onto each card's cell after every check. */
  ngAfterViewChecked(): void {
    // `KanbanTable` takes no aria passthrough in Angular, so the table's own aria state is written here too.
    const table = this.rootRef().nativeElement.querySelector("table.kanban-table");
    if (table) {
      if (this.selectable()) table.setAttribute("aria-multiselectable", "true");
      else table.removeAttribute("aria-multiselectable");
      if (this.virtualize()) table.setAttribute("aria-rowcount", String(this.slots().length + 1));
      else table.removeAttribute("aria-rowcount");
    }
    const attrs = this.cardAttrs();
    if (!attrs) return;
    const byId = new Map(this.cards().map((c) => [c.id, c]));
    for (const el of this.rootRef().nativeElement.querySelectorAll<HTMLElement>("[data-card-id]")) {
      const card = byId.get(el.dataset["cardId"] ?? "");
      if (!card) continue;
      for (const [name, value] of Object.entries(attrs(card))) el.setAttribute(name, value);
    }
  }

  // Columns in display order: those named in `columnOrder` first, the rest after in their own order.
  protected readonly orderedColumns = computed(() => {
    const order = this.columnOrder();
    const columns = this.columns();
    if (order.length === 0) return columns;
    const rank = (id: string) => (order.indexOf(id) === -1 ? order.length : order.indexOf(id));
    return columns
      .map((c, i) => ({ c, i }))
      .sort((a, b) => rank(a.c.id) - rank(b.c.id) || a.i - b.i)
      .map((x) => x.c);
  });

  protected readonly cardsByColumn = computed(() => {
    const map = new Map<string, KanbanCard[]>();
    const optimistic = this.optimistic();
    for (const column of this.orderedColumns()) map.set(column.id, []);
    for (const card of this.cards()) {
      const effective = card.id in optimistic ? { ...card, columnId: optimistic[card.id] } : card;
      map.get(effective.columnId)?.push(effective);
    }
    return map;
  });

  // What the grid shows: the filtered, sorted view. Counts and WIP limits use `cardsByColumn` (every card).
  protected readonly shownByColumn = computed(() => {
    const map = new Map<string, KanbanCard[]>();
    const filter = this.filter();
    const compare = this.compare();
    const query = this.search();
    const searching = query.trim() !== "";
    const text =
      this.searchText() ??
      ((c: KanbanCard) => [this.cardLabel()(c), c.subtitle ?? "", ...(c.badges ?? []), ...this.resolvedFields().map((f) => fieldTextOf(f, c.values))].join(" "));
    for (const [id, list] of this.cardsByColumn()) {
      let shown = filter ? list.filter(filter) : list.slice();
      if (searching) shown = shown.filter((c) => matchesSearch(text(c), query));
      if (compare) shown = shown.sort(compare);
      map.set(id, shown);
    }
    return map;
  });

  protected readonly effectiveCards = computed(() => {
    const optimistic = this.optimistic();
    return this.cards().map((c) => (c.id in optimistic ? { ...c, columnId: optimistic[c.id] } : c));
  });

  protected hiddenCountFor(columnId: string): number {
    return this.cardCountFor(columnId) - (this.shownByColumn().get(columnId)?.length ?? 0);
  }

  protected isEmptyColumn(column: KanbanColumn): boolean {
    return !this.isCollapsed(column.id) && (this.shownByColumn().get(column.id)?.length ?? 0) === 0;
  }

  protected isCollapsed(columnId: string): boolean {
    return this.collapsedColumns().includes(columnId);
  }

  protected toggleCollapsed(column: KanbanColumn): void {
    this.collapsedColumns.set(
      this.isCollapsed(column.id)
        ? this.collapsedColumns().filter((id) => id !== column.id)
        : [...this.collapsedColumns(), column.id],
    );
  }

  protected isLaneCollapsed(laneId: string): boolean {
    return this.collapsedLanes().includes(laneId);
  }

  protected toggleLane(lane: KanbanLane): void {
    this.collapsedLanes.set(
      this.isLaneCollapsed(lane.id)
        ? this.collapsedLanes().filter((id) => id !== lane.id)
        : [...this.collapsedLanes(), lane.id],
    );
  }

  /** Every card in a lane (the search/filter view still applies). */
  protected laneCardCount(laneId: string): number {
    let n = 0;
    for (const column of this.orderedColumns()) n += this.cellCards().get(`${column.id}\u0000${laneId}`)?.length ?? 0;
    return n;
  }

  // ---- Rows: one band per lane (a single anonymous band without `lanes`) ----
  protected readonly hasLanes = computed(() => (this.lanes()?.length ?? 0) > 0);
  private laneOf(card: KanbanCard): string {
    return this.hasLanes() ? (card.laneId ?? this.lanes()![0].id) : "";
  }
  private readonly cellCards = computed(() => {
    const map = new Map<string, KanbanCard[]>();
    for (const [colId, list] of this.shownByColumn()) {
      for (const card of list) {
        const key = `${colId}\u0000${this.laneOf(card)}`;
        const group = map.get(key);
        if (group) group.push(card);
        else map.set(key, [card]);
      }
    }
    return map;
  });
  protected readonly slots = computed<RenderItem[]>(() => {
    const out: RenderItem[] = [];
    const lanes = this.lanes();
    const bands: KanbanLane[] = this.hasLanes() ? lanes! : [{ id: "", title: "" }];
    let rowIndex = 0;
    for (const lane of bands) {
      if (this.hasLanes()) out.push({ kind: "lane", lane, key: `lane:${lane.id}` });
      // A collapsed lane keeps its header and shows no card rows.
      if (this.hasLanes() && this.isLaneCollapsed(lane.id)) continue;
      let rows = 0;
      for (const column of this.orderedColumns()) {
        if (this.isCollapsed(column.id)) continue;
        rows = Math.max(rows, this.cellCards().get(`${column.id}\u0000${lane.id}`)?.length ?? 0);
      }
      // A lane keeps at least one row so a card can be dropped into it; without lanes a row exists for an
      // empty column's message even when no column has a card to show.
      if (this.hasLanes()) rows = Math.max(rows, 1);
      else if (rows === 0 && this.labels().emptyColumn && this.orderedColumns().some((c) => this.isEmptyColumn(c))) rows = 1;
      for (let laneRow = 0; laneRow < rows; laneRow++) {
        out.push({ kind: "row", rowIndex, laneId: lane.id, laneRow, key: `row:${rowIndex}` });
        rowIndex++;
      }
    }
    return out;
  });
  private readonly rowSlots = computed(() =>
    this.slots().filter((x): x is Extract<RenderItem, { kind: "row" }> => x.kind === "row"),
  );
  protected readonly maxRows = computed(() => this.rowSlots().length);

  // The roving cursor, clamped to the cells that exist now: a move can shrink
  // the board, and a cursor left on a vanished row would take the grid out of
  // the tab order altogether.
  protected readonly activeRow = computed(() => Math.min(this.focusedRow(), this.maxRows() - 1));
  protected readonly activeCol = computed(() =>
    Math.min(this.focusedCol(), this.orderedColumns().length - 1),
  );

  // ---- Windowing (virtualize) ----
  // Row index → slot index, built once per layout so a row does not scan `slots` to find itself.
  private readonly slotIndexByRow = computed(() => {
    const map = new Map<number, number>();
    this.slots().forEach((x, i) => {
      if (x.kind === "row") map.set(x.rowIndex, i);
    });
    return map;
  });
  protected slotIndexOfRow(rowIndex: number): number {
    return this.slotIndexByRow().get(rowIndex) ?? -1;
  }
  protected readonly renderItems = computed<RenderItem[]>(() => {
    const all = this.slots();
    const v = this.virtualize();
    if (!v) return all;
    const overscan = v.overscan ?? 3;
    const top = this.scrollTop();
    const start = Math.max(0, Math.floor(top / v.rowHeight) - overscan);
    const end = Math.min(all.length, Math.ceil((top + v.height) / v.rowHeight) + overscan);
    const indices = new Set<number>();
    for (let i = start; i < end; i++) indices.add(i);
    // The roving tab stop's row always renders, so the grid never leaves the tab order.
    const active = this.slotIndexOfRow(this.activeRow());
    if (active >= 0) indices.add(active);
    const out: RenderItem[] = [];
    let previous = -1;
    for (const index of [...indices].sort((a, b) => a - b)) {
      if (index - previous > 1) out.push({ kind: "spacer", height: (index - previous - 1) * v.rowHeight, key: `spacer:${previous}` });
      out.push(all[index]);
      previous = index;
    }
    if (all.length - 1 - previous > 0) out.push({ kind: "spacer", height: (all.length - 1 - previous) * v.rowHeight, key: `spacer:${previous}` });
    return out;
  });

  protected onScroll(event: Event): void {
    if (this.virtualize()) this.scrollTop.set((event.currentTarget as HTMLElement).scrollTop);
  }

  /** Bring a row into the scroll area (virtualized boards render only what is in view). */
  private revealRow(rowIndex: number): void {
    const v = this.virtualize();
    if (!v) return;
    const slotIndex = this.slotIndexOfRow(rowIndex);
    if (slotIndex < 0) return;
    const top = slotIndex * v.rowHeight;
    const current = this.scrollTop();
    let next = current;
    if (top < current) next = top;
    else if (top + v.rowHeight > current + v.height) next = top + v.rowHeight - v.height;
    if (next !== current) {
      this.scrollTop.set(next);
      const el = this.scrollRef()?.nativeElement;
      if (el) el.scrollTop = next;
    }
  }

  protected cardCountFor(columnId: string): number {
    return this.cardsByColumn().get(columnId)?.length ?? 0;
  }

  protected isOverLimit(column: KanbanColumn, count: number): boolean {
    return column.wipLimit != null && count > column.wipLimit;
  }

  protected cardAt(colIndex: number, rowIndex: number): KanbanCard | undefined {
    const column = this.orderedColumns()[colIndex];
    const slot = this.rowSlots()[rowIndex];
    if (!column || !slot || this.isCollapsed(column.id)) return undefined;
    return this.cellCards().get(`${column.id}\u0000${slot.laneId}`)?.[slot.laneRow];
  }

  protected isFocused(rowIndex: number, colIndex: number): boolean {
    return this.activeRow() === rowIndex && this.activeCol() === colIndex;
  }

  private announce(message: string | undefined): void {
    if (message) this.statusMessage.set(message);
  }

  protected readonly searching = computed(() => this.search().trim() !== "");
  protected titleSegments(card: KanbanCard) {
    return highlightSegments(this.cardLabel()(card), this.search());
  }

  /** Announce how many cards match after the search changes (not on the first run). */
  private searchAnnounced = false;
  private readonly searchAnnouncement = effect(() => {
    this.search();
    const matched = [...this.shownByColumn().values()].reduce((n, list) => n + list.length, 0);
    if (!this.searchAnnounced) {
      this.searchAnnounced = true;
      return;
    }
    this.announce(this.labels().searchAnnouncement?.(matched, this.cards().length));
  });

  // ---------------------------------------------------------------
  // Typed fields, inline editing, export
  // ---------------------------------------------------------------

  // Type defaults (format, compare, export value) resolved once per `fields` / `locale` change, never per card or keystroke.
  protected readonly resolvedFields = computed(() => resolveFields(this.fields(), this.locale()));
  protected isFieldEditable(f: KanbanField, card: KanbanCard): boolean {
    return this.editableFields() && !this.readonly() && !card.locked && isEditableField(f);
  }
  protected fieldText(f: ResolvedField, card: KanbanCard): string {
    return fieldTextOf(f, card.values);
  }
  protected kindOf(f: KanbanField): ReturnType<typeof editorKind> {
    return editorKind(f);
  }
  protected editorValue(draft: Draft): string {
    return String(draft ?? "");
  }
  protected fieldNameId(cardId: string, fieldId: string): string {
    return `${this.baseId}-fn-${cardId}-${fieldId}`;
  }
  protected fieldValueId(cardId: string, fieldId: string): string {
    return `${this.baseId}-fv-${cardId}-${fieldId}`;
  }

  /** The field being edited, if any: the draft is the editor's text. */
  protected readonly editing = signal<{ cardId: string; fieldId: string; draft: Draft; invalid?: boolean } | null>(null);
  /** Accepted field edits, for Ctrl/Cmd+Z once there is no move left to undo. The consumer owns the data, so an undo is reported through `fieldEdit`. */
  private history: EditHistory = EMPTY_HISTORY;

  protected startFieldEdit(card: KanbanCard, f: ResolvedField): void {
    if (!this.isFieldEditable(f, card)) return;
    this.openCardId.set(null);
    this.moveActiveIndex.set(-1);
    this.editing.set({ cardId: card.id, fieldId: f.id, draft: draftOf(f, card.values) });
    this.cdr.detectChanges();
    this.afterRender(() => {
      const editor = this.rootRef().nativeElement.querySelector<HTMLInputElement>(".kanban-board-field-editor");
      editor?.focus({ preventScroll: true });
      if (editor && "select" in editor && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
    });
  }

  /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
  protected commitFieldEdit(refocus = true): boolean {
    const current = this.editing();
    if (!current) return true;
    const { cardId, fieldId, draft } = current;
    const card = this.effectiveCards().find((c) => c.id === cardId);
    const f = this.resolvedFields().find((x) => x.id === fieldId);
    if (!card || !f) {
      this.editing.set(null);
      return true;
    }
    const outcome = evaluateEdit(f, card.values, draft);
    if (outcome.invalid) {
      this.editing.set({ ...current, invalid: true });
      this.announce((outcome.message ? this.labels().editRefused?.(this.cardLabel()(card), f.header, outcome.message) : undefined) ?? this.labels().editInvalid?.(this.cardLabel()(card), f.header));
      return false;
    }
    this.editing.set(null);
    if (outcome.changed) {
      this.history = recordEdit(this.history, { ownerId: cardId, fieldId, value: outcome.value, previous: outcome.previous });
      this.fieldEdit.emit({ cardId, fieldId, value: outcome.value, previous: outcome.previous });
      this.announce(this.labels().editAnnouncement?.(this.cardLabel()(card), f.header, outcome.text));
    }
    if (refocus) this.afterRender(() => this.focusCard(cardId));
    return true;
  }

  // ---- In-place title editing (`editableTitles` + `titleEdit`) ----

  protected readonly editingTitle = signal<{ cardId: string; draft: string } | null>(null);
  private isTitleEditable(card: KanbanCard): boolean {
    return this.editableTitles() && !this.readonly() && !card.locked && !card.href && !this.cardTemplate();
  }

  protected startTitleEdit(card: KanbanCard): void {
    if (!this.isTitleEditable(card)) return;
    this.openCardId.set(null);
    this.moveActiveIndex.set(-1);
    this.editingTitle.set({ cardId: card.id, draft: this.cardLabel()(card) });
    this.cdr.detectChanges();
    this.afterRender(() => {
      const editor = this.rootRef().nativeElement.querySelector<HTMLInputElement>(".kanban-board-title-editor");
      editor?.focus({ preventScroll: true });
      editor?.select();
    });
  }

  protected commitTitleEdit(refocus = true): void {
    const current = this.editingTitle();
    if (!current) return;
    this.editingTitle.set(null);
    const card = this.effectiveCards().find((c) => c.id === current.cardId);
    const title = current.draft.trim();
    if (card && title !== "" && title !== this.cardLabel()(card)) {
      const previous = this.cardLabel()(card);
      this.titleEdit.emit({ cardId: current.cardId, title, previous });
      this.announce(this.labels().titleEditAnnouncement?.(previous, title));
    }
    if (refocus) this.afterRender(() => this.focusCard(current.cardId));
  }

  protected onTitleEditorInput(event: Event): void {
    const current = this.editingTitle();
    if (current) this.editingTitle.set({ ...current, draft: (event.target as HTMLInputElement).value });
  }

  protected onTitleEditorKeydown(event: KeyboardEvent): void {
    event.stopPropagation();
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
      event.preventDefault();
      this.commitTitleEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      const current = this.editingTitle();
      this.editingTitle.set(null);
      if (current) this.afterRender(() => this.focusCard(current.cardId));
    }
  }

  /** Put an earlier field value back, or re-apply it, through `fieldEdit`. */
  private stepHistory(direction: "undo" | "redo"): void {
    const step = direction === "undo" ? undoEdit(this.history) : redoEdit(this.history);
    if (!step.record) return;
    this.history = step.history;
    const { ownerId, fieldId, value, previous } = step.record;
    const restored = direction === "undo" ? previous : value;
    const replaced = direction === "undo" ? value : previous;
    this.fieldEdit.emit({ cardId: ownerId, fieldId, value: restored, previous: replaced });
    const card = this.effectiveCards().find((c) => c.id === ownerId);
    const f = this.resolvedFields().find((x) => x.id === fieldId);
    if (!card || !f) return;
    const text = restored === null || restored === undefined ? "" : f.format ? f.format(restored, { ...(card.values ?? {}), [fieldId]: restored }) : String(restored);
    this.announce((direction === "undo" ? this.labels().fieldUndoAnnouncement : this.labels().fieldRedoAnnouncement)?.(this.cardLabel()(card), f.header, text));
  }

  private cancelFieldEdit(): void {
    const current = this.editing();
    if (!current) return;
    this.editing.set(null);
    this.afterRender(() => this.focusCard(current.cardId));
  }

  /** Escape in the search field clears it. */
  protected onSearchKeydown(event: Event): void {
    const e = event as KeyboardEvent;
    if (e.key === "Escape" && this.search() !== "") {
      e.preventDefault();
      this.search.set("");
    }
  }

  protected onEditorInput(event: Event): void {
    const current = this.editing();
    if (current) this.editing.set({ ...current, draft: (event.target as HTMLInputElement).value, invalid: false });
  }

  protected onEditorSelectChange(event: Event): void {
    this.onEditorInput(event);
    this.commitFieldEdit();
  }

  protected onEditorKeydown(event: KeyboardEvent): void {
    // The editor owns its keys. While an IME composes, Enter and Escape belong to the IME: some browsers
    // report the confirming Enter with `isComposing` already false but keyCode 229.
    event.stopPropagation();
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
      event.preventDefault();
      this.commitFieldEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      this.cancelFieldEdit();
    } else if (event.key === "Tab" && this.editing()) {
      // Tab commits and moves to the card's next (Shift+Tab: previous) editable field; past the last, it moves on.
      const current = this.editing()!;
      const card = this.effectiveCards().find((c) => c.id === current.cardId);
      const next = card ? neighbourField(this.resolvedFields().filter((x) => this.isFieldEditable(x, card)), current.fieldId, event.shiftKey) : undefined;
      if (card && next) {
        event.preventDefault();
        if (this.commitFieldEdit(false)) this.startFieldEdit(card, next);
      } else {
        this.commitFieldEdit(false);
      }
    }
  }

  protected readonly exportCards = computed(() => {
    const out: KanbanCard[] = [];
    const scope = this.exportScope();
    for (const column of this.orderedColumns()) {
      for (const card of this.shownByColumn().get(column.id) ?? []) if (scope !== "selected" || this.isSelected(card.id)) out.push(card);
    }
    return out;
  });
  protected readonly hasExportButtons = computed(() => {
    const l = this.labels();
    return !!l.exportHeaders && !!(l.copy || l.exportCsv || l.exportTsv || l.exportExcel);
  });

  private async finishCopy(table: { headers: string[]; rows: unknown[][] }): Promise<void> {
    const text = toClipboardText(table);
    const copied = { text, rowCount: table.rows.length };
    this.copy.emit(copied);
    if (this.copyHandler()?.(copied) === false) return;
    const ok = await copyToClipboard(text);
    this.announce(ok ? this.labels().copyAnnouncement?.(table.rows.length) : this.labels().copyFailed);
  }

  protected runExport(format: ExportFormat | "copy"): void {
    const h = this.labels().exportHeaders;
    if (!h) return;
    const exportFields = exportableFields(this.resolvedFields());
    const headers = [h.title, h.column];
    if (this.hasLanes() && h.lane) headers.push(h.lane);
    if (h.subtitle) headers.push(h.subtitle);
    if (h.badges) headers.push(h.badges);
    if (h.flag) headers.push(h.flag);
    for (const f of exportFields) headers.push(f.header);
    const columnTitle = new Map(this.columns().map((c) => [c.id, c.title]));
    const laneTitle = new Map((this.lanes() ?? []).map((l) => [l.id, l.title]));
    const rows = this.exportCards().map((card) => {
      const cells: unknown[] = [this.cardLabel()(card), columnTitle.get(card.columnId) ?? card.columnId];
      if (this.hasLanes() && h.lane) cells.push(laneTitle.get(this.laneOf(card)) ?? "");
      if (h.subtitle) cells.push(card.subtitle ?? null);
      if (h.badges) cells.push((card.badges ?? []).join("; "));
      if (h.flag) cells.push(card.flag ?? null);
      for (const f of exportFields) cells.push(exportFieldCell(f, card.values));
      return cells;
    });
    if (format === "copy") {
      void this.finishCopy({ headers, rows });
      return;
    }
    const filename = exportFilename(this.exportFilename(), format);
    const blob = exportBlob({ headers, rows }, format, { sheetName: this.exportFilename() });
    const file: KanbanExport = { format, filename, cardCount: rows.length, blob };
    this.exportFile.emit(file);
    if (this.exportHandler()?.(file) === false) return;
    downloadBlob(blob, filename);
    this.announce(this.labels().exportAnnouncement?.(format, rows.length, filename));
  }

  // ---------------------------------------------------------------
  // Move menu (keyboard + pointer share this)
  // ---------------------------------------------------------------

  /** Choosing the card's own column is not a move: the menu just closes. */
  protected isRefused(card: KanbanCard, toColumn: KanbanColumn, extra = 0, toLaneId?: string): boolean {
    const laneChange = this.hasLanes() && toLaneId !== undefined && toLaneId !== this.laneOf(card);
    if (laneChange && !this.allowLaneChange()) return true;
    const sameColumn = toColumn.id === card.columnId;
    if (sameColumn && !laneChange) return false;
    const allowed = this.allowedColumns();
    if (!sameColumn && allowed && !allowed(card).includes(toColumn.id)) return true;
    const toLane = this.hasLanes() ? this.lanes()!.find((l) => l.id === (toLaneId ?? this.laneOf(card))) : undefined;
    const canMove = this.canMove();
    if (canMove && !canMove(card, toColumn, toLane)) return true;
    return (
      !sameColumn &&
      !!toColumn.strictLimit &&
      toColumn.wipLimit != null &&
      this.cardCountFor(toColumn.id) + extra >= toColumn.wipLimit
    );
  }

  /** The columns the move menu offers for `card`: its own, and the ones it may move to. */
  protected moveTargets(card: KanbanCard): KanbanColumn[] {
    const allowed = this.allowedColumns();
    if (!allowed) return this.orderedColumns();
    const ids = allowed(card);
    return this.orderedColumns().filter((c) => c.id === card.columnId || ids.includes(c.id));
  }

  private recordUndo(group: UndoStep[]): void {
    if (!this.undoable() || group.length === 0) return;
    this.undoStack.update((stack) => [...stack.slice(-49), group]);
  }

  /** Resolves true when the move went through (no handler, a synchronous one, or a promise that resolved). */
  private async runMove(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number, toLaneId?: string, silent = false): Promise<boolean> {
    const event: KanbanMoveEvent = { cardId: card.id, toColumnId: toColumn.id };
    if (toIndex !== undefined) event.toIndex = toIndex;
    if (toLaneId !== undefined) event.toLaneId = toLaneId;
    this.move.emit(event);
    const result = this.moveHandler()?.(event);
    if (!result || typeof (result as Promise<unknown>).then !== "function") {
      if (!silent) this.announce(this.labels().moveAnnouncement?.(this.cardLabel()(card), toColumn.title));
      return true;
    }
    this.optimistic.update((o) => ({ ...o, [card.id]: toColumn.id }));
    if (!silent) this.announce(this.labels().movePending?.(this.cardLabel()(card), toColumn.title));
    try {
      await result;
      if (!silent) this.announce(this.labels().moveAnnouncement?.(this.cardLabel()(card), toColumn.title));
      return true;
    } catch (error) {
      this.announce(this.labels().moveFailed?.(this.cardLabel()(card), toColumn.title, error));
      this.moveError.emit({ cardId: card.id, toColumnId: toColumn.id, error });
      return false;
    } finally {
      this.optimistic.update((o) => {
        const { [card.id]: _settled, ...rest } = o;
        return rest;
      });
      this.cdr.markForCheck();
    }
  }

  // ---- Selection: several cards move together ----
  private readonly selectedSet = computed(() => new Set(this.selected()));
  protected isSelected(cardId: string): boolean {
    return this.selectedSet().has(cardId);
  }

  private toggleSelected(cardId: string): void {
    this.selected.set(
      this.isSelected(cardId) ? this.selected().filter((id) => id !== cardId) : [...this.selected(), cardId],
    );
  }

  protected onCellClick(event: MouseEvent, card: KanbanCard | undefined): void {
    if (this.selectable() && (event.ctrlKey || event.metaKey) && card && !this.readonly()) {
      event.preventDefault();
      this.toggleSelected(card.id);
    }
  }

  /** The cards that move when `card` moves: the whole selection when `card` is in it, else just `card`. */
  private movingGroup(card: KanbanCard): KanbanCard[] {
    if (!this.selectable() || !this.isSelected(card.id) || this.selected().length < 2) return [card];
    return this.effectiveCards().filter((c) => this.isSelected(c.id));
  }

  private async moveGroup(group: KanbanCard[], toColumn: KanbanColumn): Promise<void> {
    const moved: UndoStep[] = [];
    let admitted = 0;
    const runs: Promise<boolean>[] = [];
    for (const member of group) {
      if (member.locked || this.isPending(member.id) || member.columnId === toColumn.id) continue;
      if (this.isRefused(member, toColumn, admitted)) {
        this.announce(this.labels().moveBlocked?.(this.cardLabel()(member), toColumn.title));
        continue;
      }
      admitted += 1;
      const from = member.columnId;
      runs.push(
        this.runMove(member, toColumn, undefined, undefined, true).then((ok) => {
          if (ok) moved.push({ cardId: member.id, fromColumnId: from, toColumnId: toColumn.id });
          return ok;
        }),
      );
    }
    if (runs.length === 0) return;
    this.announce(this.labels().moveManyAnnouncement?.(runs.length, toColumn.title));
    this.selected.set([]);
    await Promise.all(runs);
    this.recordUndo(moved);
  }

  // ---- Undo ----
  protected async undo(): Promise<void> {
    if (!this.undoable() || this.readonly()) return;
    let stack = this.undoStack();
    while (stack.length > 0) {
      const group = stack[stack.length - 1];
      stack = stack.slice(0, -1);
      this.undoStack.set(stack);
      const live = group
        .map((m) => ({ m, card: this.effectiveCards().find((c) => c.id === m.cardId) }))
        .filter((x): x is { m: UndoStep; card: KanbanCard } => !!x.card && x.card.columnId === x.m.toColumnId && !x.card.locked);
      if (live.length === 0) continue; // nothing of this step is where it was left: try the one before
      for (const { m, card } of live) {
        const back = this.orderedColumns().find((c) => c.id === m.fromColumnId);
        if (back) await this.runMove(card, back, undefined, undefined, true);
      }
      if (live.length === 1) {
        const back = this.orderedColumns().find((c) => c.id === live[0].m.fromColumnId);
        this.announce(this.labels().undoAnnouncement?.(this.cardLabel()(live[0].card), back?.title ?? ""));
      } else {
        this.announce(this.labels().undoManyAnnouncement?.(live.length));
      }
      return;
    }
  }

  protected moveCard(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number, toLaneId?: string): void {
    if (this.readonly() || card.locked || this.isPending(card.id)) return;
    const group = this.movingGroup(card);
    if (group.length > 1) {
      void this.moveGroup(group, toColumn);
      this.closeMoveMenu(card.id);
      return;
    }
    if (this.isRefused(card, toColumn, 0, toLaneId)) {
      this.announce(this.labels().moveBlocked?.(this.cardLabel()(card), toColumn.title));
      this.closeMoveMenu(card.id);
      return;
    }
    if (toColumn.id !== card.columnId || (toLaneId !== undefined && toLaneId !== this.laneOf(card))) {
      const from = card.columnId;
      void this.runMove(card, toColumn, toIndex, toLaneId).then((ok) => {
        if (ok && toColumn.id !== from) this.recordUndo([{ cardId: card.id, fromColumnId: from, toColumnId: toColumn.id }]);
      });
    }
    this.closeMoveMenu(card.id);
  }

  protected chooseDestination(card: KanbanCard, index: number): void {
    const destination = this.moveTargets(card)[index];
    if (destination) this.moveCard(card, destination);
  }

  protected openMoveMenu(card: KanbanCard): void {
    if (this.readonly() || card.locked) return;
    this.openCardId.set(card.id);
    const currentIndex = this.moveTargets(card).findIndex((c) => c.id === card.columnId);
    this.moveActiveIndex.set(currentIndex >= 0 ? currentIndex : 0);
    // Render first, focus second: the listbox does not exist in the DOM
    // until change detection runs.
    this.cdr.detectChanges();
    this.afterRender(() => this.listRef()?.focus({ preventScroll: true }));
  }

  protected closeMoveMenu(cardId: string, refocus = true): void {
    if (this.openCardId() === null) return;
    this.openCardId.set(null);
    this.moveActiveIndex.set(-1);
    if (refocus) this.afterRender(() => this.focusCard(cardId));
  }

  /** Run after the next render, when the DOM matches the state just set. */
  private afterRender(fn: () => void): void {
    afterNextRender(fn, { injector: this.injector });
  }

  /**
   * Focus a card wherever it is now — after a move the consumer's `cards`
   * has put it in another column. Each card's cell is found by its own id,
   * not through a shared reference (that would resolve to whichever card
   * rendered last). The roving cursor follows it, and focus lands on its
   * move button, or on its cell when there is no button.
   */
  private focusCard(cardId: string): void {
    const cell = Array.from(
      this.rootRef().nativeElement.querySelectorAll<HTMLElement>("[data-card-id]"),
    ).find((el) => el.dataset["cardId"] === cardId);
    if (!cell) return;
    this.focusedRow.set(Number(cell.dataset["row"]));
    this.focusedCol.set(Number(cell.dataset["col"]));
    this.cdr.detectChanges();
    (cell.querySelector<HTMLElement>(".kanban-board-move-button") ?? cell).focus({
      preventScroll: true,
    });
  }

  // ---------------------------------------------------------------
  // Pointer drag-and-drop (supplementary, never the only path)
  // ---------------------------------------------------------------

  protected onCardDragStart(card: KanbanCard, event: DragEvent): void {
    if (card.locked) {
      event.preventDefault();
      return;
    }
    this.draggingCardId = card.id;
    event.dataTransfer?.setData("text/plain", card.id);
    const group = this.movingGroup(card);
    this.draggingGroup.set(group.map((c) => c.id));
    const root = this.rootRef().nativeElement;
    const previewText = this.dragPreviewText();
    if (previewText && event.dataTransfer?.setDragImage) {
      const preview = document.createElement("div");
      preview.className = "kanban-board-drag-preview";
      preview.textContent = previewText(group);
      preview.style.position = "absolute";
      preview.style.top = "-1000px";
      root.appendChild(preview);
      event.dataTransfer.setDragImage(preview, 0, 0);
      setTimeout(() => preview.remove(), 0);
    }
  }

  protected onCardDragEnd(): void {
    this.draggingGroup.set([]);
    this.dropTarget.set(null);
    this.dropBlocked.set(false);
  }

  // ---- Column reordering ----
  private moveColumnTo(columnId: string, toIndex: number): boolean {
    const ids = this.orderedColumns().map((c) => c.id);
    const from = ids.indexOf(columnId);
    const to = Math.min(Math.max(toIndex, 0), ids.length - 1);
    if (from === -1 || from === to) return false;
    ids.splice(to, 0, ...ids.splice(from, 1));
    this.columnOrder.set(ids);
    const column = this.columns().find((c) => c.id === columnId);
    if (column) this.announce(this.labels().columnMoveAnnouncement?.(column.title, to + 1, ids.length));
    return true;
  }

  protected onHeaderDragStart(column: KanbanColumn, event: DragEvent): void {
    if (!this.movableColumns()) return;
    this.draggingColumnId = column.id;
    event.dataTransfer?.setData("text/plain", column.id);
  }

  protected onHeaderDragOver(event: DragEvent): void {
    if (this.movableColumns() && this.draggingColumnId) event.preventDefault();
  }

  protected onHeaderDrop(column: KanbanColumn, event: DragEvent): void {
    if (!this.movableColumns()) return;
    event.preventDefault();
    const id = this.draggingColumnId;
    this.draggingColumnId = null;
    if (!id || id === column.id) return;
    const to = this.orderedColumns().findIndex((c) => c.id === column.id);
    if (to >= 0) this.moveColumnTo(id, to);
  }

  /** Whether the cell a dragged card is over would refuse it (`canMove`, `allowedColumns`, a strict WIP limit): the live "can't drop here" cue. */
  protected readonly dropBlocked = signal(false);

  protected onColumnDragOver(event: DragEvent, column: KanbanColumn, rowIndex: number, colIndex: number): void {
    if (!this.draggingCardId || this.readonly()) return;
    const card = this.cards().find((c) => c.id === this.draggingCardId);
    const slot = this.rowSlots()[rowIndex];
    const blocked = !!card && this.isRefused(card, column, Math.max(0, this.draggingGroup().length - 1), this.hasLanes() && slot ? slot.laneId : undefined);
    this.dropBlocked.set(blocked);
    this.dropTarget.set(`${rowIndex}-${colIndex}`);
    // A refused drop is not a drop target: leaving dragover un-prevented makes the browser show its "not allowed" cursor.
    if (blocked) {
      if (event.dataTransfer) event.dataTransfer.dropEffect = "none";
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  }

  protected onColumnDrop(column: KanbanColumn, rowIndex: number, event: DragEvent): void {
    event.preventDefault();
    const cardId = this.draggingCardId ?? event.dataTransfer?.getData("text/plain");
    this.draggingCardId = null;
    this.draggingGroup.set([]);
    this.dropTarget.set(null);
    this.dropBlocked.set(false);
    if (this.readonly()) return;
    const card = this.cards().find((c) => c.id === cardId);
    if (!card) return;
    const slot = this.rowSlots()[rowIndex];
    const dropLane = this.hasLanes() && slot ? slot.laneId : undefined;
    const shown = (slot ? this.cellCards().get(`${column.id}\u0000${slot.laneId}`) : this.shownByColumn().get(column.id)) ?? [];
    const overCard = slot ? shown[slot.laneRow] : shown[rowIndex];
    const dropIndex = slot ? slot.laneRow : rowIndex;
    if (card.columnId === column.id && this.hasLanes() && dropLane !== undefined && dropLane !== this.laneOf(card)) {
      // Dropped into another lane of its own column: only the lane changes.
      this.moveCard(card, column, undefined, dropLane);
      return;
    }
    if (card.columnId === column.id) {
      // Dropped on another card of its own column: reorder to that position.
      const from = shown.findIndex((c) => c.id === card.id);
      if (overCard && from >= 0 && from !== dropIndex) {
        this.reorder.emit({ cardId: card.id, toIndex: dropIndex });
        this.announce(this.labels().reorderAnnouncement?.(this.cardLabel()(card), dropIndex + 1, shown.length));
      }
      return;
    }
    this.moveCard(card, column, overCard ? dropIndex : undefined, dropLane);
  }

  // ---------------------------------------------------------------
  // Roving-tabindex grid keyboard navigation (WAI-ARIA APG Grid pattern)
  // ---------------------------------------------------------------

  private focusActiveCell(): void {
    queueMicrotask(() => {
      this.rootRef()
        .nativeElement.querySelector<HTMLElement>('.kanban-table-td[tabindex="0"]')
        ?.focus({ preventScroll: true });
    });
  }

  private moveFocus(row: number, col: number): void {
    this.focusedCol.set(Math.min(Math.max(col, 0), this.orderedColumns().length - 1));
    const nextRow = Math.min(Math.max(row, 0), this.maxRows() - 1);
    this.focusedRow.set(nextRow);
    this.revealRow(nextRow);
    this.cdr.detectChanges();
    this.focusActiveCell();
  }

  /** The cursor follows focus however it arrives — a click, or a consumer's own focus(). */
  protected onGridFocusin(event: FocusEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    this.focusedRow.set(Number(cell.dataset["row"]));
    this.focusedCol.set(Number(cell.dataset["col"]));
  }

  private reorderCard(delta: 1 | -1): void {
    if (this.readonly()) return;
    const card = this.cardAt(this.activeCol(), this.activeRow());
    if (!card || card.locked) return;
    const slot = this.rowSlots()[this.activeRow()];
    const total = (slot ? this.cellCards().get(`${card.columnId}\u0000${slot.laneId}`) : this.shownByColumn().get(card.columnId))?.length ?? 0;
    const laneRow = slot ? slot.laneRow : this.activeRow();
    const toIndex = laneRow + delta;
    if (toIndex < 0 || toIndex >= total) return;
    this.reorder.emit({ cardId: card.id, toIndex });
    this.announce(this.labels().reorderAnnouncement?.(this.cardLabel()(card), toIndex + 1, total));
    this.afterRender(() => this.focusCard(card.id));
  }

  private typeahead: TypeaheadState = { prefix: "", at: 0 };

  protected onGridKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    // The open move menu owns its own keys; letting them bubble here moved the
    // grid cursor (and focus) out of the menu, and Enter reopened it after a move.
    if (target.closest(".kanban-board-move-list")) return;
    if (target.closest(".kanban-board-field-editor")) return;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    // The horizontal arrows are visual: in a right-to-left layout the next column is on the left, so ArrowLeft goes forward.
    const key = logicalKey(event.key, isRtl(cell));
    // Ctrl/Cmd+Z undoes the last move while there is one (`undoable`), then the last field edit; Ctrl/Cmd+Shift+Z and Ctrl+Y redo field edits.
    const historyAction = this.editableFields() && !this.readonly() ? historyKey(event) : null;
    if (this.undoable() && ctrlOrMeta && !event.altKey && !event.shiftKey && (event.key === "z" || event.key === "Z") && this.undoStack().length > 0) {
      event.preventDefault();
      void this.undo();
      return;
    }
    if (historyAction) {
      event.preventDefault();
      this.stepHistory(historyAction);
      return;
    }
    if (this.undoable() && ctrlOrMeta && !event.altKey && !event.shiftKey && (event.key === "z" || event.key === "Z")) {
      event.preventDefault();
      void this.undo();
      return;
    }
    if (this.movableColumns() && event.altKey && event.shiftKey && (key === "ArrowLeft" || key === "ArrowRight")) {
      // Alt+Shift+ArrowLeft/Right: move this cell's column (the keyboard twin of dragging its header).
      event.preventDefault();
      const column = this.orderedColumns()[this.activeCol()];
      const to = this.activeCol() + (key === "ArrowLeft" ? -1 : 1);
      if (column && this.moveColumnTo(column.id, to)) {
        this.focusedCol.set(to);
        this.cdr.detectChanges();
        this.focusActiveCell();
      }
      return;
    }
    if (event.altKey && (key === "ArrowLeft" || key === "ArrowRight")) {
      // Alt+ArrowLeft/Right: move the card to the neighbouring column (the keyboard twin of dragging it there).
      event.preventDefault();
      const card = this.cardAt(this.activeCol(), this.activeRow());
      const destination = this.orderedColumns()[this.activeCol() + (key === "ArrowLeft" ? -1 : 1)];
      if (card && destination) this.moveCard(card, destination);
      return;
    }
    if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
      this.reorderCard(event.key === "ArrowUp" ? -1 : 1);
      return;
    }
    if (event.key === "F2" && this.editableTitles()) {
      // F2 with title editing on: rename the card (its fields are edited by clicking them or Tab from the title).
      const card = this.cardAt(this.activeCol(), this.activeRow());
      if (card && this.isTitleEditable(card)) {
        event.preventDefault();
        this.startTitleEdit(card);
        return;
      }
    }
    if (event.key === "F2" && this.editableFields()) {
      // F2: edit the card's first editable field (the keyboard twin of clicking its value).
      const card = this.cardAt(this.activeCol(), this.activeRow());
      const first = card ? this.resolvedFields().find((f) => this.isFieldEditable(f, card)) : undefined;
      if (card && first) {
        event.preventDefault();
        this.startFieldEdit(card, first);
      }
      return;
    }
    // Type-ahead in the focused column: letters typed in quick succession move to the next card whose label starts with them.
    // A lone "x" stays the select shortcut when cards are selectable; it joins a prefix already in progress.
    if (isTypeaheadKey(event)) {
      const now = Date.now();
      const continuing = this.typeahead.prefix !== "" && now - this.typeahead.at <= 700;
      const isSelectKey = this.selectable() && (event.key === "x" || event.key === "X");
      if (continuing || !isSelectKey) {
        const state = nextTypeaheadState(this.typeahead, event.key, now, 700);
        const labelsInColumn = Array.from({ length: this.maxRows() }, (_, row) => {
          const card = this.cardAt(this.activeCol(), row);
          return card ? this.cardLabel()(card) : "";
        });
        const hit = findTypeaheadMatch(labelsInColumn, this.activeRow(), state.prefix);
        if (hit !== -1) {
          this.typeahead = state;
          event.preventDefault();
          this.moveFocus(hit, this.activeCol());
          return;
        }
      }
    }
    if (this.selectable() && !ctrlOrMeta && !event.altKey && (event.key === "x" || event.key === "X")) {
      const card = this.cardAt(this.activeCol(), this.activeRow());
      if (card && !this.readonly()) {
        event.preventDefault();
        this.toggleSelected(card.id);
      }
      return;
    }
    const move = gridMove(
      event,
      { row: this.activeRow(), col: this.activeCol() },
      { firstRow: 0, lastRow: this.maxRows() - 1, lastCol: this.orderedColumns().length - 1, pageStep: pageStepFor(this.virtualize()), homeEnd: "column", rtl: isRtl(cell) },
    );
    if (move) {
      event.preventDefault();
      this.moveFocus(move.row, move.col);
      return;
    }
    switch (key) {
      case "Enter":
      case " ": {
        event.preventDefault();
        const card = this.cardAt(this.activeCol(), this.activeRow());
        if (card) this.openMoveMenu(card);
        break;
      }
    }
  }
}
