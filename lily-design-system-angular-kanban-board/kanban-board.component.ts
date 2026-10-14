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
} from "@lilydesignsystem/angular-headless";

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
  /** Accessible name of the board's search field. Gates the field. */
  search?: string;
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
};

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
    >
      @if (labels().search; as searchLabel) {
        <input
          type="search"
          class="kanban-board-search"
          [attr.aria-label]="searchLabel"
          [value]="search()"
          (input)="search.set($any($event.target).value)"
        />
      }
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
            @for (column of columns(); track column.id) {
              @let count = cardCountFor(column.id);
              @let overLimit = isOverLimit(column, count);
              <th
                lily-kanban-table-th
                [attr.data-over-limit]="overLimit ? '' : null"
                [attr.data-collapsed]="isCollapsed(column.id) ? '' : null"
                [attr.data-hidden-count]="hiddenCountFor(column.id) > 0 ? hiddenCountFor(column.id) : null"
                [attr.data-flag]="column.flag ?? null"
                [attr.data-accent]="column.accent ?? null"
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
          @for (rowIndex of rowIndexes(); track rowIndex) {
            <tr lily-kanban-table-row>
              @for (column of columns(); track column.id; let colIndex = $index) {
                @let card = cardAt(colIndex, rowIndex);
                <td
                  lily-kanban-table-td
                  [attr.data-row]="rowIndex"
                  [attr.data-col]="colIndex"
                  [attr.data-card-id]="card?.id ?? null"
                  [attr.data-collapsed]="isCollapsed(column.id) ? '' : null"
                  [attr.data-locked]="card?.locked ? '' : null"
                  [attr.data-pending]="card && isPending(card.id) ? '' : null"
                  [attr.aria-busy]="card && isPending(card.id) ? 'true' : null"
                  [attr.data-flag]="card?.flag ?? null"
                  [attr.data-accent]="column.accent ?? null"
                  [attr.data-empty]="!card && rowIndex === 0 && labels().emptyColumn && isEmptyColumn(column) ? '' : null"
                  [attr.data-drop-target]="dropTarget() === rowIndex + '-' + colIndex ? '' : null"
                  [attr.aria-describedby]="card?.flag ? flagId(card.id) : null"
                  [attr.tabindex]="isFocused(rowIndex, colIndex) ? 0 : -1"
                  (dragover)="onColumnDragOver($event, rowIndex, colIndex)"
                  (dragleave)="dropTarget.set(null)"
                  (drop)="onColumnDrop(column, rowIndex, $event)"
                >
                  @if (card) {
                    <!-- Supplementary pointer-drag handle inside an
                         already-interactive gridcell; the accessible
                         move path is the button/listbox below. -->
                    <span
                      class="kanban-board-card-title"
                      [attr.draggable]="readonly() || card.locked || card.draggable === false ? null : 'true'"
                      (dragstart)="onCardDragStart(card, $event)"
                    >
                      @if (cardTemplate(); as cardTpl) {
                        <ng-container
                          [ngTemplateOutlet]="cardTpl"
                          [ngTemplateOutletContext]="{ card: card, label: cardLabel()(card), column: column, pending: isPending(card.id) }"
                        />
                      } @else if (card.href) {
                        <a class="kanban-board-card-link" [href]="card.href">{{ cardLabel()(card) }}</a>
                      } @else {
                        {{ cardLabel()(card) }}
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
                  } @else if (rowIndex === 0 && labels().emptyColumn && isEmptyColumn(column)) {
                    <span class="kanban-board-empty">{{ labels().emptyColumn!(column) }}</span>
                  }
                </td>
              }
            </tr>
          }
        </tbody>
        @if (columnFooterTemplate(); as footerTpl) {
          <tfoot class="kanban-table-foot">
            <tr class="kanban-table-row">
              @for (column of columns(); track column.id) {
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

      <p class="kanban-board-status" aria-live="polite">{{ statusMessage() }}</p>
    </div>
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
  /** Veto a move (a hard WIP limit, a workflow rule). Refused columns show `aria-disabled` in the move menu. */
  readonly canMove = input<((card: KanbanCard, toColumn: KanbanColumn) => boolean) | undefined>(
    undefined,
  );
  /** Disable every mutating interaction: move menu, drag and reorder. Navigation still works. */
  readonly readonly = input<boolean>(false);
  /** Ids of collapsed columns. Two-way bindable: `[(collapsedColumns)]`. A collapsed column keeps its header and count but shows no cards. */
  readonly collapsedColumns = model<string[]>([]);
  /** User-facing strings. See KanbanLabels — presence gates each control. */
  readonly labels = input<KanbanLabels>({});
  /** Extra CSS class on the root. */
  readonly className = input<string>("");

  /** Fires after a card moves to a new column, by pointer or by the move menu. */
  readonly move = output<KanbanMoveEvent>();

  /** Fires when Alt+ArrowUp/Down moves a card within its column. The consumer reorders `cards`. */
  readonly reorder = output<KanbanReorderEvent>();

  /** Fires with the column id when its add-card button is pressed. The consumer adds the card (Lily ships no editor). */
  readonly addCardRequested = output<string>();

  /** Fires when an async `moveHandler` rejects, after the card has gone back. */
  readonly moveError = output<KanbanMoveErrorEvent>();

  private readonly baseId = nextKanbanBoardId();
  protected readonly moveListId = `${this.baseId}-move-list`;
  protected moveOptionId(index: number): string {
    return `${this.baseId}-move-option-${index}`;
  }

  private readonly rootRef = viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly listRef = viewChild<Listbox>("moveListEl");

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly injector = inject(Injector);

  protected readonly statusMessage = signal("");
  protected readonly focusedRow = signal(0);
  protected readonly focusedCol = signal(0);

  /** The card whose move menu is open, if any. */
  protected readonly openCardId = signal<string | null>(null);
  protected readonly moveActiveIndex = signal(-1);

  private draggingCardId: string | null = null;
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
    const attrs = this.cardAttrs();
    if (!attrs) return;
    const byId = new Map(this.cards().map((c) => [c.id, c]));
    for (const el of this.rootRef().nativeElement.querySelectorAll<HTMLElement>("[data-card-id]")) {
      const card = byId.get(el.dataset["cardId"] ?? "");
      if (!card) continue;
      for (const [name, value] of Object.entries(attrs(card))) el.setAttribute(name, value);
    }
  }

  protected readonly cardsByColumn = computed(() => {
    const map = new Map<string, KanbanCard[]>();
    const optimistic = this.optimistic();
    for (const column of this.columns()) map.set(column.id, []);
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
    const needle = this.search().trim().toLowerCase();
    const text =
      this.searchText() ??
      ((c: KanbanCard) => [this.cardLabel()(c), c.subtitle ?? "", ...(c.badges ?? [])].join(" "));
    for (const [id, list] of this.cardsByColumn()) {
      let shown = filter ? list.filter(filter) : list.slice();
      if (needle) shown = shown.filter((c) => text(c).toLowerCase().includes(needle));
      if (compare) shown = shown.sort(compare);
      map.set(id, shown);
    }
    return map;
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

  // A collapsed column shows no cards, so it does not count towards the board's height.
  // A row exists for an empty column's message even when no column has a card to show.
  protected readonly maxRows = computed(() =>
    Math.max(
      this.columns().reduce(
        (max, column) =>
          Math.max(max, this.isCollapsed(column.id) ? 0 : (this.shownByColumn().get(column.id)?.length ?? 0)),
        0,
      ),
      this.labels().emptyColumn && this.columns().some((c) => this.isEmptyColumn(c)) ? 1 : 0,
    ),
  );

  // The roving cursor, clamped to the cells that exist now: a move can shrink
  // the board, and a cursor left on a vanished row would take the grid out of
  // the tab order altogether.
  protected readonly activeRow = computed(() => Math.min(this.focusedRow(), this.maxRows() - 1));
  protected readonly activeCol = computed(() =>
    Math.min(this.focusedCol(), this.columns().length - 1),
  );

  protected readonly rowIndexes = computed(() =>
    Array.from({ length: this.maxRows() }, (_, i) => i),
  );

  protected cardCountFor(columnId: string): number {
    return this.cardsByColumn().get(columnId)?.length ?? 0;
  }

  protected isOverLimit(column: KanbanColumn, count: number): boolean {
    return column.wipLimit != null && count > column.wipLimit;
  }

  protected cardAt(colIndex: number, rowIndex: number): KanbanCard | undefined {
    const column = this.columns()[colIndex];
    if (!column || this.isCollapsed(column.id)) return undefined;
    return this.shownByColumn().get(column.id)?.[rowIndex];
  }

  protected isFocused(rowIndex: number, colIndex: number): boolean {
    return this.activeRow() === rowIndex && this.activeCol() === colIndex;
  }

  private announce(message: string | undefined): void {
    if (message) this.statusMessage.set(message);
  }

  // ---------------------------------------------------------------
  // Move menu (keyboard + pointer share this)
  // ---------------------------------------------------------------

  /** Choosing the card's own column is not a move: the menu just closes. */
  protected isRefused(card: KanbanCard, toColumn: KanbanColumn): boolean {
    if (toColumn.id === card.columnId) return false;
    const allowed = this.allowedColumns();
    if (allowed && !allowed(card).includes(toColumn.id)) return true;
    const canMove = this.canMove();
    if (canMove && !canMove(card, toColumn)) return true;
    return (
      !!toColumn.strictLimit &&
      toColumn.wipLimit != null &&
      this.cardCountFor(toColumn.id) >= toColumn.wipLimit
    );
  }

  /** The columns the move menu offers for `card`: its own, and the ones it may move to. */
  protected moveTargets(card: KanbanCard): KanbanColumn[] {
    const allowed = this.allowedColumns();
    if (!allowed) return this.columns();
    const ids = allowed(card);
    return this.columns().filter((c) => c.id === card.columnId || ids.includes(c.id));
  }

  private async runMove(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number): Promise<void> {
    const event: KanbanMoveEvent =
      toIndex === undefined ? { cardId: card.id, toColumnId: toColumn.id } : { cardId: card.id, toColumnId: toColumn.id, toIndex };
    this.move.emit(event);
    const result = this.moveHandler()?.(event);
    if (!result || typeof (result as Promise<unknown>).then !== "function") {
      this.announce(this.labels().moveAnnouncement?.(this.cardLabel()(card), toColumn.title));
      return;
    }
    this.optimistic.update((o) => ({ ...o, [card.id]: toColumn.id }));
    this.announce(this.labels().movePending?.(this.cardLabel()(card), toColumn.title));
    try {
      await result;
      this.announce(this.labels().moveAnnouncement?.(this.cardLabel()(card), toColumn.title));
    } catch (error) {
      this.announce(this.labels().moveFailed?.(this.cardLabel()(card), toColumn.title, error));
      this.moveError.emit({ cardId: card.id, toColumnId: toColumn.id, error });
    } finally {
      this.optimistic.update((o) => {
        const { [card.id]: _settled, ...rest } = o;
        return rest;
      });
      this.cdr.markForCheck();
    }
  }

  protected moveCard(card: KanbanCard, toColumn: KanbanColumn, toIndex?: number): void {
    if (this.readonly() || card.locked || this.isPending(card.id)) return;
    if (this.isRefused(card, toColumn)) {
      this.announce(this.labels().moveBlocked?.(this.cardLabel()(card), toColumn.title));
      this.closeMoveMenu(card.id);
      return;
    }
    if (toColumn.id !== card.columnId) {
      void this.runMove(card, toColumn, toIndex);
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
  }

  protected onColumnDragOver(event: DragEvent, rowIndex: number, colIndex: number): void {
    if (!this.draggingCardId || this.readonly()) return;
    event.preventDefault();
    this.dropTarget.set(`${rowIndex}-${colIndex}`);
  }

  protected onColumnDrop(column: KanbanColumn, rowIndex: number, event: DragEvent): void {
    event.preventDefault();
    const cardId = this.draggingCardId ?? event.dataTransfer?.getData("text/plain");
    this.draggingCardId = null;
    this.dropTarget.set(null);
    if (this.readonly()) return;
    const card = this.cards().find((c) => c.id === cardId);
    if (!card) return;
    const shown = this.shownByColumn().get(column.id) ?? [];
    const overCard = shown[rowIndex];
    if (card.columnId === column.id) {
      // Dropped on another card of its own column: reorder to that position.
      const from = shown.findIndex((c) => c.id === card.id);
      if (overCard && from >= 0 && from !== rowIndex) {
        this.reorder.emit({ cardId: card.id, toIndex: rowIndex });
        this.announce(this.labels().reorderAnnouncement?.(this.cardLabel()(card), rowIndex + 1, shown.length));
      }
      return;
    }
    this.moveCard(card, column, overCard ? rowIndex : undefined);
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
    this.focusedCol.set(Math.min(Math.max(col, 0), this.columns().length - 1));
    this.focusedRow.set(Math.min(Math.max(row, 0), this.maxRows() - 1));
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
    const total = this.shownByColumn().get(card.columnId)?.length ?? 0;
    const toIndex = this.activeRow() + delta;
    if (toIndex < 0 || toIndex >= total) return;
    this.reorder.emit({ cardId: card.id, toIndex });
    this.announce(this.labels().reorderAnnouncement?.(this.cardLabel()(card), toIndex + 1, total));
    this.afterRender(() => this.focusCard(card.id));
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    // The open move menu owns its own keys; letting them bubble here moved the
    // grid cursor (and focus) out of the menu, and Enter reopened it after a move.
    if (target.closest(".kanban-board-move-list")) return;
    const cell = target.closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    if (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      // Alt+ArrowLeft/Right: move the card to the neighbouring column (the keyboard twin of dragging it there).
      event.preventDefault();
      const card = this.cardAt(this.activeCol(), this.activeRow());
      const destination = this.columns()[this.activeCol() + (event.key === "ArrowLeft" ? -1 : 1)];
      if (card && destination) this.moveCard(card, destination);
      return;
    }
    if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
      this.reorderCard(event.key === "ArrowUp" ? -1 : 1);
      return;
    }
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        this.moveFocus(this.activeRow() - 1, this.activeCol());
        break;
      case "ArrowDown":
        event.preventDefault();
        this.moveFocus(this.activeRow() + 1, this.activeCol());
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.moveFocus(this.activeRow(), this.activeCol() - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        this.moveFocus(this.activeRow(), this.activeCol() + 1);
        break;
      case "Home":
        event.preventDefault();
        if (ctrlOrMeta) this.moveFocus(0, 0);
        else this.moveFocus(0, this.activeCol());
        break;
      case "End":
        event.preventDefault();
        if (ctrlOrMeta) this.moveFocus(this.maxRows() - 1, this.columns().length - 1);
        else this.moveFocus(this.maxRows() - 1, this.activeCol());
        break;
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
