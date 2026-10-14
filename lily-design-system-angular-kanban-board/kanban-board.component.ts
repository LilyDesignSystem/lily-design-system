import {
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
};

export type KanbanCard = {
  /** Stable card identifier. */
  id: string;
  /** The column this card currently belongs to. */
  columnId: string;
  /** Visible card title. */
  title: string;
};

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
};

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #rootEl
      class="kanban-board {{ className() }}"
      [attr.data-readonly]="readonly() ? '' : null"
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
            @for (column of columns(); track column.id) {
              @let count = cardCountFor(column.id);
              @let overLimit = isOverLimit(column, count);
              <th
                lily-kanban-table-th
                [attr.data-over-limit]="overLimit ? '' : null"
                [attr.data-collapsed]="isCollapsed(column.id) ? '' : null"
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
                  [attr.tabindex]="isFocused(rowIndex, colIndex) ? 0 : -1"
                  (dragover)="onColumnDragOver($event)"
                  (drop)="onColumnDrop(column, $event)"
                >
                  @if (card) {
                    <!-- Supplementary pointer-drag handle inside an
                         already-interactive gridcell; the accessible
                         move path is the button/listbox below. -->
                    <span
                      class="kanban-board-card-title"
                      [attr.draggable]="readonly() ? null : 'true'"
                      (dragstart)="onCardDragStart(card, $event)"
                    >
                      {{ cardLabel()(card) }}
                    </span>
                    <!-- Gated on labels.moveButton: an unnamed button is worse than
                         none, and Enter/Space on the cell opens the menu either way. -->
                    @if (labels().moveButton; as moveButton) {
                      @if (!readonly()) {
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
                        @for (destination of columns(); track destination.id; let i = $index) {
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
                  }
                </td>
              }
            </tr>
          }
        </tbody>
      </lily-kanban-table>

      <p class="kanban-board-status" aria-live="polite">{{ statusMessage() }}</p>
    </div>
  `,
})
export class KanbanBoard implements AfterViewInit {
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

  protected readonly cardsByColumn = computed(() => {
    const map = new Map<string, KanbanCard[]>();
    for (const column of this.columns()) map.set(column.id, []);
    for (const card of this.cards()) {
      map.get(card.columnId)?.push(card);
    }
    return map;
  });

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
  protected readonly maxRows = computed(() =>
    this.columns().reduce(
      (max, column) =>
        Math.max(max, this.isCollapsed(column.id) ? 0 : (this.cardsByColumn().get(column.id)?.length ?? 0)),
      0,
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
    return this.cardsByColumn().get(column.id)?.[rowIndex];
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
    const canMove = this.canMove();
    if (canMove && !canMove(card, toColumn)) return true;
    return (
      !!toColumn.strictLimit &&
      toColumn.wipLimit != null &&
      this.cardCountFor(toColumn.id) >= toColumn.wipLimit
    );
  }

  protected moveCard(card: KanbanCard, toColumn: KanbanColumn): void {
    if (this.readonly()) return;
    if (this.isRefused(card, toColumn)) {
      this.announce(this.labels().moveBlocked?.(this.cardLabel()(card), toColumn.title));
      this.closeMoveMenu(card.id);
      return;
    }
    if (toColumn.id !== card.columnId) {
      this.move.emit({ cardId: card.id, toColumnId: toColumn.id });
      this.announce(this.labels().moveAnnouncement?.(this.cardLabel()(card), toColumn.title));
    }
    this.closeMoveMenu(card.id);
  }

  protected chooseDestination(card: KanbanCard, index: number): void {
    const destination = this.columns()[index];
    if (destination) this.moveCard(card, destination);
  }

  protected openMoveMenu(card: KanbanCard): void {
    if (this.readonly()) return;
    this.openCardId.set(card.id);
    const currentIndex = this.columns().findIndex((c) => c.id === card.columnId);
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
    this.draggingCardId = card.id;
    event.dataTransfer?.setData("text/plain", card.id);
  }

  protected onColumnDragOver(event: DragEvent): void {
    if (this.draggingCardId) event.preventDefault();
  }

  protected onColumnDrop(column: KanbanColumn, event: DragEvent): void {
    event.preventDefault();
    const cardId = this.draggingCardId ?? event.dataTransfer?.getData("text/plain");
    this.draggingCardId = null;
    const card = this.cards().find((c) => c.id === cardId);
    // Dropping a card back on its own column is not a move.
    if (card && card.columnId !== column.id) this.moveCard(card, column);
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
    if (!card) return;
    const total = this.cardsByColumn().get(card.columnId)?.length ?? 0;
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
