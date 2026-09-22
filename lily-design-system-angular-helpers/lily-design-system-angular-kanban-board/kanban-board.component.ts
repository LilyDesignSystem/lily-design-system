import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  computed,
  inject,
  input,
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
    <div #rootEl class="kanban-board {{ className() }}">
      <lily-kanban-table
        [label]="label()"
        (keydown)="onGridKeydown($event)"
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
              >
                {{ column.title }}
                @if (labels().cardCount) {
                  <span class="kanban-board-count">{{ labels().cardCount!(count) }}</span>
                }
                @if (overLimit && labels().overLimit) {
                  <span class="kanban-board-wip-warning">{{
                    labels().overLimit!(count, column.wipLimit ?? 0)
                  }}</span>
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
                  [attr.tabindex]="isFocused(rowIndex, colIndex) ? 0 : -1"
                  [attr.aria-selected]="isFocused(rowIndex, colIndex)"
                  (dragover)="onColumnDragOver($event)"
                  (drop)="onColumnDrop(column, $event)"
                >
                  @if (card) {
                    <!-- Supplementary pointer-drag handle inside an
                         already-interactive gridcell; the accessible
                         move path is the button/listbox below. -->
                    <span
                      class="kanban-board-card-title"
                      draggable="true"
                      (dragstart)="onCardDragStart(card, $event)"
                    >
                      {{ cardLabel()(card) }}
                    </span>
                    <lily-icon-button
                      [attr.data-card-id]="card.id"
                      [label]="labels().moveButton?.(card) ?? ''"
                      baseClass="kanban-board-move-button"
                      ariaHaspopup="listbox"
                      [ariaExpanded]="openCardId() === card.id"
                      [ariaControls]="openCardId() === card.id ? moveListId : ''"
                      [tabIndex]="-1"
                      (click)="openCardId() === card.id ? closeMoveMenu() : openMoveMenu(card)"
                    >
                      &#8644;
                    </lily-icon-button>
                    @if (openCardId() === card.id) {
                      <lily-listbox
                        #moveListEl
                        [elementId]="moveListId"
                        baseClass="kanban-board-move-list"
                        [label]="labels().moveMenuLabel ?? ''"
                        navigation="active-descendant"
                        [clamp]="true"
                        [(activeIndex)]="moveActiveIndex"
                        (activate)="chooseDestination(card, $event)"
                        (escape)="closeMoveMenu()"
                        (tabOut)="closeMoveMenu(false)"
                      >
                        @for (destination of columns(); track destination.id; let i = $index) {
                          <li
                            class="kanban-board-move-option"
                            [id]="moveOptionId(i)"
                            role="option"
                            [attr.aria-selected]="destination.id === card.columnId"
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
  /** User-facing strings. See KanbanLabels — presence gates each control. */
  readonly labels = input<KanbanLabels>({});
  /** Extra CSS class on the root. */
  readonly className = input<string>("");

  /** Fires after a card moves to a new column, by pointer or by the move menu. */
  readonly move = output<KanbanMoveEvent>();

  private readonly baseId = nextKanbanBoardId();
  protected readonly moveListId = `${this.baseId}-move-list`;
  protected moveOptionId(index: number): string {
    return `${this.baseId}-move-option-${index}`;
  }

  private readonly rootRef = viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly listRef = viewChild<Listbox>("moveListEl");

  private readonly cdr = inject(ChangeDetectorRef);

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

  protected readonly maxRows = computed(() =>
    this.columns().reduce(
      (max, column) => Math.max(max, this.cardsByColumn().get(column.id)?.length ?? 0),
      0,
    ),
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
    if (!column) return undefined;
    return this.cardsByColumn().get(column.id)?.[rowIndex];
  }

  protected isFocused(rowIndex: number, colIndex: number): boolean {
    return this.focusedRow() === rowIndex && this.focusedCol() === colIndex;
  }

  private announce(message: string | undefined): void {
    if (message) this.statusMessage.set(message);
  }

  // ---------------------------------------------------------------
  // Move menu (keyboard + pointer share this)
  // ---------------------------------------------------------------

  protected moveCard(card: KanbanCard, toColumn: KanbanColumn): void {
    this.move.emit({ cardId: card.id, toColumnId: toColumn.id });
    this.announce(this.labels().moveAnnouncement?.(this.cardLabel()(card), toColumn.title));
    this.closeMoveMenu();
  }

  protected chooseDestination(card: KanbanCard, index: number): void {
    const destination = this.columns()[index];
    if (destination) this.moveCard(card, destination);
  }

  protected openMoveMenu(card: KanbanCard): void {
    this.openCardId.set(card.id);
    const currentIndex = this.columns().findIndex((c) => c.id === card.columnId);
    this.moveActiveIndex.set(currentIndex >= 0 ? currentIndex : 0);
    // Render first, focus second: the listbox does not exist in the DOM
    // until change detection runs.
    this.cdr.detectChanges();
    queueMicrotask(() => this.listRef()?.focus({ preventScroll: true }));
  }

  protected closeMoveMenu(refocus = true): void {
    const cardId = this.openCardId();
    if (cardId === null) return;
    this.openCardId.set(null);
    this.moveActiveIndex.set(-1);
    if (refocus) {
      queueMicrotask(() => this.focusMoveButton(cardId));
    }
  }

  /**
   * Query the real rendered `<button>` for a specific card directly,
   * rather than a single shared `ViewChild` — a move button renders once
   * per card inside a `@for` loop, so a shared reference would resolve
   * to whichever card's button mounted last, not necessarily the one
   * whose menu just closed.
   */
  private focusMoveButton(cardId: string): void {
    const escaped =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(cardId)
        : cardId;
    this.rootRef()
      .nativeElement.querySelector<HTMLButtonElement>(`[data-card-id="${escaped}"] button`)
      ?.focus({ preventScroll: true });
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
    if (card) this.moveCard(card, column);
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

  protected onGridKeydown(event: KeyboardEvent): void {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row][data-col]");
    if (!cell) return;
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        this.moveFocus(this.focusedRow() - 1, this.focusedCol());
        break;
      case "ArrowDown":
        event.preventDefault();
        this.moveFocus(this.focusedRow() + 1, this.focusedCol());
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.moveFocus(this.focusedRow(), this.focusedCol() - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        this.moveFocus(this.focusedRow(), this.focusedCol() + 1);
        break;
      case "Home":
        event.preventDefault();
        if (ctrlOrMeta) this.moveFocus(0, 0);
        else this.moveFocus(0, this.focusedCol());
        break;
      case "End":
        event.preventDefault();
        if (ctrlOrMeta) this.moveFocus(this.maxRows() - 1, this.columns().length - 1);
        else this.moveFocus(this.maxRows() - 1, this.focusedCol());
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const card = this.cardAt(this.focusedCol(), this.focusedRow());
        if (card) this.openMoveMenu(card);
        break;
      }
    }
  }
}
