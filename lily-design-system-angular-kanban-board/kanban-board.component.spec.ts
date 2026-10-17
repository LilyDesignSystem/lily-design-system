import { Component, input } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import {
  KanbanBoard,
  type KanbanCard,
  type KanbanColumn,
  type KanbanLabels,
  type KanbanMoveEvent,
  type KanbanMoveErrorEvent,
  type KanbanReorderEvent,
} from "./kanban-board.component";

const COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "In Progress", wipLimit: 1 },
  { id: "done", title: "Done" },
];

const CARDS: KanbanCard[] = [
  { id: "c1", columnId: "todo", title: "Card One" },
  { id: "c2", columnId: "todo", title: "Card Two" },
  { id: "c3", columnId: "doing", title: "Card Three" },
  { id: "c4", columnId: "doing", title: "Card Four" },
];

const LABELS: KanbanLabels = {
  cardCount: (count) => `${count} cards`,
  overLimit: (count, limit) => `Over limit: ${count}/${limit}`,
  moveButton: (card) => `Move ${card.title}`,
  moveMenuLabel: "Move to column",
  moveAnnouncement: (title, column) => `${title} moved to ${column}`,
};

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

let fixtures: ComponentFixture<unknown>[] = [];

function mount(
  inputs: Record<string, unknown> = {},
): ComponentFixture<KanbanBoard> {
  const fixture = TestBed.createComponent(KanbanBoard);
  fixture.componentRef.setInput("label", "Sprint board");
  fixture.componentRef.setInput("columns", COLUMNS);
  fixture.componentRef.setInput("cards", CARDS);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  fixtures.push(fixture);
  return fixture;
}

function bodyRows(fixture: ComponentFixture<unknown>): Element[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll(".kanban-table-body .kanban-table-row"),
  );
}

function tabbableCells(fixture: ComponentFixture<unknown>): Element[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('.kanban-table-td[tabindex="0"]'),
  );
}

function headers(fixture: ComponentFixture<unknown>): Element[] {
  return Array.from(fixture.nativeElement.querySelectorAll(".kanban-table-th"));
}

function press(
  fixture: ComponentFixture<unknown>,
  target: Element,
  key: string,
  extra: KeyboardEventInit = {},
): void {
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, ...extra }),
  );
  fixture.detectChanges();
}

function click(fixture: ComponentFixture<unknown>, target: Element): void {
  target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  fixture.detectChanges();
}

function dragEvent(type: string, dataTransfer: unknown): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
  return event;
}

afterEach(() => {
  for (const fixture of fixtures) fixture.destroy();
  fixtures = [];
});

describe("KanbanBoard — markup (§8.1, §8.2, §8.3, §8.4)", () => {
  test("§8.1 renders a kanban-board root wrapping a role=grid labelled by label", () => {
    const fixture = mount();
    const root = fixture.nativeElement.querySelector(".kanban-board");
    expect(root).toBeTruthy();
    const grid = fixture.nativeElement.querySelector("table.kanban-table");
    expect(grid.getAttribute("role")).toBe("grid");
    expect(grid.getAttribute("aria-label")).toBe("Sprint board");
  });

  test("§8.2 renders column titles and, when labels.cardCount is set, a derived count", () => {
    const fixture = mount({ labels: LABELS });
    expect((fixture.nativeElement.textContent ?? "")).toContain("To Do");
    const ths = headers(fixture);
    expect(ths[0].textContent).toContain("2 cards");
    expect(ths[2].textContent).toContain("0 cards");
  });

  test("§8.2 no card count renders when labels.cardCount is absent", () => {
    const fixture = mount();
    expect(fixture.nativeElement.querySelector(".kanban-board-count")).toBeNull();
  });

  test("§8.3 a column over its wipLimit carries data-over-limit and the warning text", () => {
    const fixture = mount({ labels: LABELS });
    const ths = headers(fixture);
    expect(ths[1].hasAttribute("data-over-limit")).toBe(true);
    expect(ths[1].textContent).toContain("Over limit: 2/1");
    expect(ths[0].hasAttribute("data-over-limit")).toBe(false);
    expect(ths[2].hasAttribute("data-over-limit")).toBe(false);
  });

  test("§8.4 the body is rectangular: row count equals the largest column's card count", () => {
    const fixture = mount();
    expect(bodyRows(fixture)).toHaveLength(2); // todo and doing both have 2 cards
    const doneCells = bodyRows(fixture).map(
      (row) => row.querySelectorAll(".kanban-table-td")[2],
    );
    for (const cell of doneCells) {
      expect(cell.textContent?.trim()).toBe("");
    }
  });
});

describe("KanbanBoard — roving-tabindex keyboard navigation (§8.5, §8.6)", () => {
  test("§8.5 the roving tab stop is not announced as selection: no cell carries aria-selected", () => {
    const fixture = mount();
    expect(tabbableCells(fixture)).toHaveLength(1);
    expect(fixture.nativeElement.querySelectorAll("td[aria-selected]")).toHaveLength(0);
  });

  test("§8.5 exactly one body cell carries tabindex=0, and arrows move it and clamp", () => {
    const fixture = mount();
    expect(tabbableCells(fixture)).toHaveLength(1);
    expect(tabbableCells(fixture)[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("0");

    press(fixture, tabbableCells(fixture)[0], "ArrowRight");
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("1");

    // Clamp: ArrowUp past the first row stays on the first row.
    press(fixture, tabbableCells(fixture)[0], "ArrowUp");
    expect(tabbableCells(fixture)).toHaveLength(1);
    expect(tabbableCells(fixture)[0].getAttribute("data-row")).toBe("0");
  });

  test("§8.6 Home/End move within the column; Ctrl+Home/Ctrl+End move to the grid's ends", () => {
    const fixture = mount();
    press(fixture, tabbableCells(fixture)[0], "ArrowRight");
    press(fixture, tabbableCells(fixture)[0], "End");
    expect(tabbableCells(fixture)[0].getAttribute("data-row")).toBe("1");
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("1");

    press(fixture, tabbableCells(fixture)[0], "Home", { ctrlKey: true });
    expect(tabbableCells(fixture)[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("0");

    press(fixture, tabbableCells(fixture)[0], "End", { ctrlKey: true });
    expect(tabbableCells(fixture)[0].getAttribute("data-row")).toBe("1");
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("2");
  });
});

describe("KanbanBoard — move menu (§8.7, §8.8, §8.9)", () => {
  test("§8.7 Enter on a focused card opens its move menu", () => {
    const fixture = mount({ labels: LABELS });
    press(fixture, tabbableCells(fixture)[0], "Enter");
    const button = fixture.nativeElement.querySelector(
      ".kanban-board-move-button",
    ) as HTMLButtonElement;
    expect(button.getAttribute("aria-label")).toBe("Move Card One");
    expect(button.getAttribute("aria-expanded")).toBe("true");
    const list = fixture.nativeElement.querySelector(".kanban-board-move-list");
    expect(list).toBeTruthy();
    expect(list.getAttribute("aria-label")).toBe("Move to column");
    expect(
      fixture.nativeElement.querySelectorAll(".kanban-board-move-option"),
    ).toHaveLength(3);
  });

  test("§8.8 choosing a destination emits move, closes the menu, and refocuses the move button", async () => {
    const fixture = mount({ labels: LABELS });
    const onMove = vi.fn();
    fixture.componentInstance.move.subscribe(onMove as (e: KanbanMoveEvent) => void);
    press(fixture, tabbableCells(fixture)[0], "Enter");
    const doneOption = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLElement>(".kanban-board-move-option"),
    ).find((el) => el.textContent?.trim() === "Done")!;
    click(fixture, doneOption);
    expect(onMove).toHaveBeenCalledWith({ cardId: "c1", toColumnId: "done" });
    expect(fixture.nativeElement.querySelector(".kanban-board-move-list")).toBeNull();
    await flush();
    fixture.detectChanges();
    // That card's own button, found by its id, not whichever card rendered last.
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Move Card One");
    // Not just *a* move button — specifically Card One's own button. All
    // four cards render a button sharing the same class, so a shared/
    // last-rendered-wins focus reference (a real bug caught in the
    // Svelte reference this package ports — see AGENTS.md) would still
    // satisfy the className-only assertion above but fail this one.
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Move Card One");
  });

  test("§8.9 Escape closes the move menu without emitting move", () => {
    const fixture = mount({ labels: LABELS });
    const onMove = vi.fn();
    fixture.componentInstance.move.subscribe(onMove as (e: KanbanMoveEvent) => void);
    press(fixture, tabbableCells(fixture)[0], "Enter");
    const list = fixture.nativeElement.querySelector(".kanban-board-move-list")!;
    press(fixture, list, "Escape");
    expect(onMove).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector(".kanban-board-move-list")).toBeNull();
  });
});

describe("KanbanBoard — pointer drag-and-drop (§8.10)", () => {
  test("§8.10 dropping a card on another column's cell emits move", () => {
    const fixture = mount();
    const onMove = vi.fn();
    fixture.componentInstance.move.subscribe(onMove as (e: KanbanMoveEvent) => void);
    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
    const cardTitle = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLElement>(".kanban-board-card-title"),
    ).find((el) => el.textContent?.trim() === "Card One")!;
    cardTitle.dispatchEvent(dragEvent("dragstart", dataTransfer));

    const doneCell = bodyRows(fixture)[0].querySelectorAll(".kanban-table-td")[2];
    doneCell.dispatchEvent(dragEvent("drop", dataTransfer));
    expect(onMove).toHaveBeenCalledWith({ cardId: "c1", toColumnId: "done" });
  });
});

describe("KanbanBoard — announcements and extra attributes (§8.11, §8.12)", () => {
  test("§8.11 a successful move announces via labels.moveAnnouncement", () => {
    const fixture = mount({ labels: LABELS });
    press(fixture, tabbableCells(fixture)[0], "Enter");
    const doneOption = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLElement>(".kanban-board-move-option"),
    ).find((el) => el.textContent?.trim() === "Done")!;
    click(fixture, doneOption);
    expect(
      fixture.nativeElement.querySelector(".kanban-board-status")?.textContent,
    ).toBe("Card One moved to Done");
  });

  test("§8.11 no announcement fires when moveAnnouncement is absent", () => {
    const fixture = mount();
    press(fixture, tabbableCells(fixture)[0], "Enter");
    const list = fixture.nativeElement.querySelector(".kanban-board-move-list")!;
    press(fixture, list, "ArrowDown");
    press(fixture, list, "Enter");
    expect(
      fixture.nativeElement.querySelector(".kanban-board-status")?.textContent,
    ).toBe("");
  });

  test("§8.12 extra attributes on the host tag (Angular always emits one; see AGENTS.md)", () => {
    const fixture = TestBed.createComponent(AttrHost);
    fixture.detectChanges();
    fixtures.push(fixture);
    expect(
      fixture.nativeElement.querySelector('[data-testid="board-root"]'),
    ).toBeTruthy();
  });
});

@Component({
  standalone: true,
  imports: [KanbanBoard],
  template: `
    <lily-kanban-board
      data-testid="board-root"
      label="Sprint board"
      [columns]="columns"
      [cards]="cards"
    />
  `,
})
class AttrHost {
  readonly columns = COLUMNS;
  readonly cards = CARDS;
}

describe("KanbanBoard — focus, tab stop and move edge cases", () => {
  function option(fixture: ComponentFixture<unknown>, name: string): HTMLElement {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(".kanban-board-move-option"),
    ).find((el) => el.textContent?.trim() === name)!;
  }

  function list(fixture: ComponentFixture<unknown>): HTMLElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(".kanban-board-move-list");
  }

  async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
    fixture.detectChanges();
    await flush();
    fixture.detectChanges();
  }

  test("§8.8 after a move, focus and the tab stop follow the card to its new column", async () => {
    const fixture = mount({ labels: LABELS });
    fixture.componentInstance.move.subscribe(({ cardId, toColumnId }) => {
      fixture.componentRef.setInput(
        "cards",
        CARDS.map((c) => (c.id === cardId ? { ...c, columnId: toColumnId } : c)),
      );
    });
    press(fixture, tabbableCells(fixture)[0], "Enter");
    click(fixture, option(fixture, "Done"));
    await settle(fixture);
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Move Card One");
    expect(tabbableCells(fixture)).toHaveLength(1);
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("2");
  });

  test("§8.14 keys pressed in the open move menu do not move the grid cursor or focus", async () => {
    const fixture = mount({ labels: LABELS });
    press(fixture, tabbableCells(fixture)[0], "Enter");
    await settle(fixture);
    const menu = list(fixture)!;
    expect(document.activeElement).toBe(menu);
    press(fixture, menu, "ArrowDown");
    press(fixture, menu, "ArrowRight");
    await settle(fixture);
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("0");
    expect(document.activeElement).toBe(menu);
  });

  test("§8.14 choosing a destination in the menu does not reopen it", async () => {
    const fixture = mount({ labels: LABELS });
    press(fixture, tabbableCells(fixture)[0], "Enter");
    press(fixture, list(fixture)!, "ArrowDown");
    press(fixture, list(fixture)!, "Enter");
    await settle(fixture);
    expect(list(fixture)).toBeNull();
  });

  test("§8.15 choosing the card's own column, or dropping it there, is not a move", () => {
    const fixture = mount({ labels: LABELS });
    const onMove = vi.fn();
    fixture.componentInstance.move.subscribe(onMove as (e: KanbanMoveEvent) => void);
    press(fixture, tabbableCells(fixture)[0], "Enter");
    click(fixture, option(fixture, "To Do"));
    expect(list(fixture)).toBeNull();
    expect(fixture.nativeElement.querySelector(".kanban-board-status")?.textContent).toBe("");

    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
    const title = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll(".kanban-board-card-title"),
    ).find((el) => el.textContent?.trim() === "Card One")!;
    title.dispatchEvent(dragEvent("dragstart", dataTransfer));
    bodyRows(fixture)[1].querySelectorAll(".kanban-table-td")[0].dispatchEvent(dragEvent("drop", dataTransfer));
    expect(onMove).not.toHaveBeenCalled();
  });

  test("§8.16 when the board shrinks under the cursor, one cell stays tabbable", () => {
    const fixture = mount();
    press(fixture, tabbableCells(fixture)[0], "End");
    expect(tabbableCells(fixture)[0].getAttribute("data-row")).toBe("1");
    fixture.componentRef.setInput("cards", CARDS.filter((c) => c.id !== "c2" && c.id !== "c4"));
    fixture.detectChanges();
    expect(bodyRows(fixture)).toHaveLength(1);
    expect(tabbableCells(fixture)).toHaveLength(1);
  });

  test("§8.16 focusing a cell by pointer moves the cursor there", () => {
    const fixture = mount();
    const cell = bodyRows(fixture)[1].querySelectorAll<HTMLElement>(".kanban-table-td")[1];
    cell.focus();
    fixture.detectChanges();
    expect(tabbableCells(fixture)).toEqual([cell]);
    press(fixture, cell, "ArrowUp");
    expect(tabbableCells(fixture)[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("1");
  });

  test("§8.13 without labels.moveButton there is no unnamed button; the menu is named by the card and Escape refocuses the cell", async () => {
    const fixture = mount();
    expect(fixture.nativeElement.querySelector(".kanban-board-move-button")).toBeNull();
    const cell = tabbableCells(fixture)[0] as HTMLElement;
    press(fixture, cell, "Enter");
    expect(list(fixture)!.getAttribute("aria-label")).toBe("Card One");
    press(fixture, list(fixture)!, "Escape");
    await settle(fixture);
    expect(document.activeElement).toBe(cell);
  });

  test("§8.3 a column exactly at its wipLimit is not over it", () => {
    const fixture = mount({ cards: CARDS.filter((c) => c.id !== "c4"), labels: LABELS });
    expect(headers(fixture)[1].hasAttribute("data-over-limit")).toBe(false);
  });
});

describe("KanbanBoard — reorder, veto and read-only (§8.17–§8.21)", () => {
  const status = (fixture: ComponentFixture<unknown>) =>
    fixture.nativeElement.querySelector(".kanban-board-status")?.textContent;

  test("§8.17 Alt+ArrowDown emits reorder and announces it", () => {
    const fixture = mount({
      labels: { reorderAnnouncement: (t: string, p: number, n: number) => `${t} is ${p} of ${n}` },
    });
    const onReorder = vi.fn();
    fixture.componentInstance.reorder.subscribe(onReorder as (e: KanbanReorderEvent) => void);
    press(fixture, tabbableCells(fixture)[0], "ArrowDown", { altKey: true });
    expect(onReorder).toHaveBeenCalledWith({ cardId: "c1", toIndex: 1 });
    expect(status(fixture)).toBe("Card One is 2 of 2");
  });

  test("§8.18 Alt+Arrow at the column edge emits nothing", () => {
    const fixture = mount();
    const onReorder = vi.fn();
    fixture.componentInstance.reorder.subscribe(onReorder as (e: KanbanReorderEvent) => void);
    press(fixture, tabbableCells(fixture)[0], "ArrowUp", { altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
  });

  test("§8.19 canMove refuses a move: no move event, an announcement, aria-disabled option", () => {
    const fixture = mount({
      labels: { ...LABELS, moveBlocked: (t: string, c: string) => `${t} cannot go to ${c}` },
      canMove: (_c: KanbanCard, to: KanbanColumn) => to.id !== "done",
    });
    const onMove = vi.fn();
    fixture.componentInstance.move.subscribe(onMove as (e: KanbanMoveEvent) => void);
    press(fixture, tabbableCells(fixture)[0], "Enter");
    const option = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLElement>(".kanban-board-move-option"),
    ).find((el) => el.textContent?.trim() === "Done")!;
    expect(option.getAttribute("aria-disabled")).toBe("true");
    click(fixture, option);
    expect(onMove).not.toHaveBeenCalled();
    expect(status(fixture)).toBe("Card One cannot go to Done");
  });

  test("§8.20 readonly: no move button, no menu, no drag, no reorder", () => {
    const fixture = mount({ labels: LABELS, readonly: true });
    const onReorder = vi.fn();
    fixture.componentInstance.reorder.subscribe(onReorder as (e: KanbanReorderEvent) => void);
    expect(fixture.nativeElement.querySelector(".kanban-board-move-button")).toBeNull();
    press(fixture, tabbableCells(fixture)[0], "Enter");
    expect(fixture.nativeElement.querySelector(".kanban-board-move-list")).toBeNull();
    press(fixture, tabbableCells(fixture)[0], "ArrowDown", { altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector("[draggable='true']")).toBeNull();
    expect(fixture.nativeElement.querySelector(".kanban-board").hasAttribute("data-readonly")).toBe(true);
  });

  test("§8.21 readonly keeps arrow-key navigation", () => {
    const fixture = mount({ readonly: true });
    press(fixture, tabbableCells(fixture)[0], "ArrowRight");
    expect(tabbableCells(fixture)[0].getAttribute("data-col")).toBe("1");
  });
});

describe("KanbanBoard — collapse, add card, hard limits (§8.22–§8.30)", () => {
  const collapseLabels: KanbanLabels = {
    ...LABELS,
    collapseColumn: (c, collapsed) => `${collapsed ? "Expand" : "Collapse"} ${c.title}`,
  };
  const buttonNamed = (f: ComponentFixture<unknown>, name: string) =>
    Array.from(f.nativeElement.querySelectorAll("button")).find(
      (b) => (b as HTMLElement).getAttribute("aria-label") === name,
    ) as HTMLElement;
  const text = (f: ComponentFixture<unknown>) => f.nativeElement.textContent as string;
  const status = (f: ComponentFixture<unknown>) =>
    f.nativeElement.querySelector(".kanban-board-status")?.textContent;

  test("§8.22 collapseColumn gates a toggle in each header; without it none renders", () => {
    const f = mount();
    expect(f.nativeElement.querySelector(".kanban-board-collapse-button")).toBeNull();
  });

  test("§8.23 the toggle collapses a column: aria-expanded flips, its cards are not rendered, its count remains", () => {
    const f = mount({ labels: collapseLabels });
    expect(buttonNamed(f, "Collapse To Do").getAttribute("aria-expanded")).toBe("true");
    expect(text(f)).toContain("Card One");
    click(f, buttonNamed(f, "Collapse To Do"));
    expect(buttonNamed(f, "Expand To Do").getAttribute("aria-expanded")).toBe("false");
    expect(text(f)).not.toContain("Card One");
    expect(headers(f)[0].textContent).toContain("2 cards");
    expect(headers(f)[0].hasAttribute("data-collapsed")).toBe(true);
  });

  test("§8.24 collapsedColumns starts a column collapsed, and its cells carry data-collapsed", () => {
    const f = mount({ collapsedColumns: ["todo"], labels: LABELS });
    expect(text(f)).not.toContain("Card One");
    const cells = Array.from(f.nativeElement.querySelectorAll(".kanban-table-td")) as HTMLElement[];
    expect(cells.filter((c) => c.dataset["col"] === "0").every((c) => c.hasAttribute("data-collapsed"))).toBe(true);
  });

  test("§8.25 the board's height ignores collapsed columns", () => {
    expect(bodyRows(mount())).toHaveLength(2);
    expect(bodyRows(mount({ collapsedColumns: ["todo", "doing"] }))).toHaveLength(0);
  });

  test("§8.26 addCard gates an add button per column that emits the column id", () => {
    const f = mount({ labels: { addCard: (c: KanbanColumn) => `Add to ${c.title}` } });
    const added: string[] = [];
    f.componentInstance.addCardRequested.subscribe((id) => added.push(id));
    click(f, buttonNamed(f, "Add to In Progress"));
    expect(added).toEqual(["doing"]);
  });

  test("§8.27 no add button without labels.addCard, and none when readonly", () => {
    expect(mount().nativeElement.querySelector(".kanban-board-add-button")).toBeNull();
    const f = mount({ readonly: true, labels: { addCard: (c: KanbanColumn) => `Add to ${c.title}` } });
    expect(f.nativeElement.querySelector(".kanban-board-add-button")).toBeNull();
  });

  test("§8.28 strictLimit refuses a move into a full column, announces it, and marks the option aria-disabled", () => {
    const columns: KanbanColumn[] = [
      { id: "todo", title: "To Do" },
      { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true },
    ];
    const f = mount({ columns, labels: { ...LABELS, moveBlocked: (t: string, c: string) => `${t} cannot go to ${c}` } });
    const onMove = vi.fn();
    f.componentInstance.move.subscribe(onMove as (e: KanbanMoveEvent) => void);
    press(f, tabbableCells(f)[0], "Enter");
    const option = Array.from(f.nativeElement.querySelectorAll<HTMLElement>(".kanban-board-move-option")).find(
      (el) => el.textContent?.trim() === "In Progress",
    )!;
    expect(option.getAttribute("aria-disabled")).toBe("true");
    click(f, option);
    expect(onMove).not.toHaveBeenCalled();
    expect(status(f)).toBe("Card One cannot go to In Progress");
  });

  test("§8.29 strictLimit allows a move while the column is under its limit", () => {
    const columns: KanbanColumn[] = [
      { id: "todo", title: "To Do" },
      { id: "doing", title: "In Progress", wipLimit: 3, strictLimit: true },
    ];
    const f = mount({ columns, labels: LABELS });
    const onMove = vi.fn();
    f.componentInstance.move.subscribe(onMove as (e: KanbanMoveEvent) => void);
    press(f, tabbableCells(f)[0], "Enter");
    click(
      f,
      Array.from(f.nativeElement.querySelectorAll<HTMLElement>(".kanban-board-move-option")).find(
        (el) => el.textContent?.trim() === "In Progress",
      )!,
    );
    expect(onMove).toHaveBeenCalledWith({ cardId: "c1", toColumnId: "doing" });
  });

  test("§8.30 without strictLimit a full column still accepts moves (the WIP limit is only a warning)", () => {
    const f = mount({ labels: LABELS });
    const onMove = vi.fn();
    f.componentInstance.move.subscribe(onMove as (e: KanbanMoveEvent) => void);
    press(f, tabbableCells(f)[0], "Enter");
    click(
      f,
      Array.from(f.nativeElement.querySelectorAll<HTMLElement>(".kanban-board-move-option")).find(
        (el) => el.textContent?.trim() === "In Progress",
      )!,
    );
    expect(onMove).toHaveBeenCalledWith({ cardId: "c1", toColumnId: "doing" });
  });
});

@Component({
  standalone: true,
  imports: [KanbanBoard],
  template: `
    <lily-kanban-board
      label="B"
      [columns]="columns()"
      [cards]="cards()"
      [cardTemplate]="cardTpl"
      [columnHeaderTemplate]="headerTpl"
      [columnFooterTemplate]="footerTpl"
    />
    <ng-template #cardTpl let-card="card" let-label="label"><b data-custom>{{ label }}!</b></ng-template>
    <ng-template #headerTpl let-count="count"><i data-header>{{ count }}</i></ng-template>
    <ng-template #footerTpl let-column="column" let-count="count" let-cards="cards"
      ><i [attr.data-footer]="column.id">{{ count }}:{{ cardIds(cards) }}</i></ng-template
    >
  `,
})
class TemplatesHost {
  readonly columns = input<KanbanColumn[]>([]);
  readonly cards = input<KanbanCard[]>([]);
  cardIds(cards: KanbanCard[]): string {
    return cards.map((c) => c.id).join(",");
  }
}

describe("KanbanBoard — filter, drop position, locked, Alt+Arrow, cardAttrs, card body, flags, allowed columns, async move, footer, empty, search", () => {
  const rich: KanbanCard[] = [
    { id: "c1", columnId: "todo", title: "Card One", subtitle: "Source · 80", badges: ["P1", "VIP"], flag: "SLA breached", href: "/t/1" },
    { id: "c2", columnId: "todo", title: "Card Two" },
    { id: "c3", columnId: "doing", title: "Card Three" },
  ];
  const cols: KanbanColumn[] = [
    { id: "todo", title: "To Do", flag: "Over capacity", accent: "red" },
    { id: "doing", title: "In Progress" },
    { id: "done", title: "Done" },
  ];
  const cell = (f: ComponentFixture<unknown>, id: string) =>
    f.nativeElement.querySelector(`[data-card-id="${id}"]`) as HTMLElement;
  const cellAt = (f: ComponentFixture<unknown>, row: number, col: number) =>
    f.nativeElement.querySelector(`.kanban-table-td[data-row="${row}"][data-col="${col}"]`) as HTMLElement;
  const titles = (f: ComponentFixture<unknown>) =>
    Array.from(f.nativeElement.querySelectorAll(".kanban-board-card-title")).map((e) => (e as HTMLElement).textContent?.trim());
  const status = (f: ComponentFixture<unknown>) => f.nativeElement.querySelector(".kanban-board-status").textContent;
  const focusIn = (f: ComponentFixture<unknown>, el: Element) => {
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    f.detectChanges();
  };
  const drag = (f: ComponentFixture<unknown>, from: HTMLElement, to: HTMLElement) => {
    const dt = { setData: () => {}, getData: () => "" };
    from.querySelector(".kanban-board-card-title")!.dispatchEvent(dragEvent("dragstart", dt));
    to.dispatchEvent(dragEvent("dragover", dt));
    to.dispatchEvent(dragEvent("drop", dt));
    f.detectChanges();
  };
  const deferred = () => {
    let resolve!: () => void;
    let reject!: (e: unknown) => void;
    const promise = new Promise<void>((res, rej) => ((resolve = res), (reject = rej)));
    return { promise, resolve, reject };
  };
  const moves = (f: ComponentFixture<KanbanBoard>) => {
    const out: KanbanMoveEvent[] = [];
    f.componentInstance.move.subscribe((e) => out.push(e));
    return out;
  };

  test("§8.31–§8.33 filter hides cards; counts and limits still use every card; data-hidden-count", () => {
    const f = mount({ labels: LABELS, filter: (c: KanbanCard) => c.columnId !== "doing" });
    const heads = headers(f);
    expect(titles(f)).not.toContain("Card Three");
    expect(heads[1].textContent).toContain("2 cards");
    expect(heads[1].hasAttribute("data-over-limit")).toBe(true);
    expect(heads[1].getAttribute("data-hidden-count")).toBe("2");
    expect(heads[0].hasAttribute("data-hidden-count")).toBe(false);
  });

  test("§8.34 compare orders the cards within each column", () => {
    const f = mount({ compare: (a: KanbanCard, b: KanbanCard) => b.title.localeCompare(a.title) });
    const todo = Array.from(f.nativeElement.querySelectorAll('.kanban-table-td[data-col="0"] .kanban-board-card-title')).map((e) => (e as HTMLElement).textContent?.trim());
    expect(todo).toEqual(["Card Two", "Card One"]);
  });

  test("§8.35–§8.37 drop on a card in another column passes its position; on an empty cell appends; in its own column reorders", () => {
    const f = mount();
    const m = moves(f);
    const reorders: KanbanReorderEvent[] = [];
    f.componentInstance.reorder.subscribe((e) => reorders.push(e));
    drag(f, cellAt(f, 0, 0), cellAt(f, 1, 1));
    drag(f, cellAt(f, 0, 0), cellAt(f, 0, 2));
    drag(f, cellAt(f, 0, 0), cellAt(f, 1, 0));
    expect(m).toEqual([{ cardId: "c1", toColumnId: "doing", toIndex: 1 }, { cardId: "c1", toColumnId: "done" }]);
    expect(reorders).toEqual([{ cardId: "c1", toIndex: 1 }]);
  });

  test("§8.38 the cell under a dragged card carries data-drop-target; readonly refuses drops", () => {
    const f = mount();
    const dt = { setData: () => {}, getData: () => "" };
    cellAt(f, 0, 0).querySelector(".kanban-board-card-title")!.dispatchEvent(dragEvent("dragstart", dt));
    cellAt(f, 1, 1).dispatchEvent(dragEvent("dragover", dt));
    f.detectChanges();
    expect(cellAt(f, 1, 1).hasAttribute("data-drop-target")).toBe(true);
    const g = mount({ readonly: true });
    const m = moves(g);
    cellAt(g, 0, 2).dispatchEvent(dragEvent("drop", dt));
    expect(m).toEqual([]);
  });

  test("§8.39–§8.41 a locked card has data-locked, no move button, no drag, ignores Enter and Alt+Arrow; others still move", () => {
    const f = mount({ labels: LABELS, cards: CARDS.map((c) => (c.id === "c1" ? { ...c, locked: true } : c)) });
    const m = moves(f);
    const reorders: KanbanReorderEvent[] = [];
    f.componentInstance.reorder.subscribe((e) => reorders.push(e));
    expect(cellAt(f, 0, 0).hasAttribute("data-locked")).toBe(true);
    expect(cellAt(f, 0, 0).querySelector(".kanban-board-move-button")).toBeNull();
    expect(cellAt(f, 0, 0).querySelector("[draggable]")).toBeNull();
    press(f, cellAt(f, 0, 0), "Enter");
    expect(f.nativeElement.querySelector('[role="listbox"]')).toBeNull();
    press(f, cellAt(f, 0, 0), "ArrowDown", { altKey: true });
    expect(reorders).toEqual([]);
    focusIn(f, cellAt(f, 1, 0));
    press(f, cellAt(f, 1, 0), "Enter");
    click(f, Array.from(f.nativeElement.querySelectorAll<HTMLElement>(".kanban-board-move-option")).find((el) => el.textContent?.trim() === "Done")!);
    expect(m).toEqual([{ cardId: "c2", toColumnId: "done" }]);
  });

  test("§8.44–§8.46 Alt+ArrowRight moves to the next column, not past the first; a full hard-limited column refuses and announces", () => {
    const f = mount();
    const m = moves(f);
    press(f, cellAt(f, 0, 0), "ArrowLeft", { altKey: true });
    expect(m).toEqual([]);
    press(f, cellAt(f, 0, 0), "ArrowRight", { altKey: true });
    expect(m).toEqual([{ cardId: "c1", toColumnId: "doing" }]);
    const cs = [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true }];
    const g = mount({ columns: cs, labels: { ...LABELS, moveBlocked: (t: string, c: string) => `${t} cannot go to ${c}` } });
    const m2 = moves(g);
    press(g, cellAt(g, 0, 0), "ArrowRight", { altKey: true });
    expect(m2).toEqual([]);
    expect(status(g)).toBe("Card One cannot go to In Progress");
  });

  test("§8.47 cardAttrs adds attributes to each card's cell", () => {
    const f = mount({ cardAttrs: (c: KanbanCard) => ({ "data-priority": c.id === "c1" ? "high" : "low" }) });
    f.detectChanges();
    expect(cell(f, "c1").getAttribute("data-priority")).toBe("high");
    expect(cell(f, "c2").getAttribute("data-priority")).toBe("low");
  });

  test("§8.48 subtitle, badges and a link title render; §8.50 the flag is text, data-flag and aria-describedby; §8.51 column flag and accent", () => {
    const f = mount({ cards: rich, columns: cols });
    expect(cell(f, "c1").querySelector(".kanban-board-card-subtitle")!.textContent).toBe("Source · 80");
    expect(Array.from(cell(f, "c1").querySelectorAll(".kanban-board-card-badge")).map((b) => b.textContent)).toEqual(["P1", "VIP"]);
    expect(cell(f, "c1").querySelector("a.kanban-board-card-link")!.getAttribute("href")).toBe("/t/1");
    const flag = cell(f, "c1").querySelector(".kanban-board-card-flag")!;
    expect(flag.textContent).toBe("SLA breached");
    expect(cell(f, "c1").getAttribute("data-flag")).toBe("SLA breached");
    expect(cell(f, "c1").getAttribute("aria-describedby")).toBe(flag.id);
    const th = headers(f)[0];
    expect(th.getAttribute("data-flag")).toBe("Over capacity");
    expect(th.getAttribute("data-accent")).toBe("red");
    expect(th.querySelector(".kanban-board-column-flag")!.textContent).toBe("Over capacity");
    expect(cell(f, "c1").getAttribute("data-accent")).toBe("red");
  });

  test("§8.49 the card template replaces the title content; §8.59 the header and footer templates render per column", () => {
    const f = TestBed.createComponent(TemplatesHost);
    f.componentRef.setInput("columns", cols);
    f.componentRef.setInput("cards", rich);
    f.detectChanges();
    fixtures.push(f);
    expect(cell(f, "c2").querySelector("[data-custom]")!.textContent).toBe("Card Two!");
    expect(f.nativeElement.querySelectorAll("tfoot td")).toHaveLength(3);
    expect(f.nativeElement.querySelector('[data-footer="todo"]').textContent).toBe("2:c1,c2");
    expect(f.nativeElement.querySelectorAll("[data-header]")[1].textContent).toBe("1");
  });

  test("§8.52–§8.53 allowedColumns limits the move menu; a keyboard move elsewhere is refused and announced", () => {
    const f = mount({ labels: LABELS, cards: rich, columns: cols, allowedColumns: (c: KanbanCard) => (c.id === "c1" ? ["doing"] : ["done"]) });
    press(f, cell(f, "c1"), "Enter");
    expect(Array.from(f.nativeElement.querySelectorAll('[role="option"]')).map((o) => (o as HTMLElement).textContent?.trim())).toEqual(["To Do", "In Progress"]);
    const g = mount({ allowedColumns: () => ["done"], labels: { ...LABELS, moveBlocked: (t: string, c: string) => `${t} cannot go to ${c}` } });
    const m = moves(g);
    press(g, cellAt(g, 0, 0), "ArrowRight", { altKey: true });
    expect(m).toEqual([]);
    expect(status(g)).toBe("Card One cannot go to In Progress");
  });

  test("§8.54 card.draggable=false stops pointer dragging but keeps the move menu", () => {
    const f = mount({ labels: LABELS, cards: CARDS.map((c) => (c.id === "c1" ? { ...c, draggable: false } : c)) });
    expect(cell(f, "c1").querySelector("[draggable]")).toBeNull();
    expect(cell(f, "c1").querySelector(".kanban-board-move-button")).toBeTruthy();
  });

  test("§8.55 an async moveHandler shows data-pending and aria-busy in the new column, then clears on resolve", async () => {
    const d = deferred();
    const f = mount({ cards: rich, columns: cols, moveHandler: () => d.promise, labels: { ...LABELS, movePending: (t: string, c: string) => `Moving ${t} to ${c}` } });
    const m = moves(f);
    focusIn(f, cell(f, "c2"));
    press(f, cell(f, "c2"), "ArrowRight", { altKey: true });
    await flush();
    f.detectChanges();
    expect(cell(f, "c2").getAttribute("data-pending")).toBe("");
    expect(cell(f, "c2").getAttribute("aria-busy")).toBe("true");
    expect(cell(f, "c2").getAttribute("data-col")).toBe("1");
    expect(status(f)).toBe("Moving Card Two to In Progress");
    expect(m).toEqual([{ cardId: "c2", toColumnId: "doing" }]);
    d.resolve();
    await flush();
    f.detectChanges();
    expect(cell(f, "c2").hasAttribute("data-pending")).toBe(false);
  });

  test("§8.56 a rejected moveHandler sends the card back, announces moveFailed and emits moveError; §8.57 a pending card cannot move again", async () => {
    const d = deferred();
    const handler = vi.fn(() => d.promise);
    const f = mount({ cards: rich, columns: cols, moveHandler: handler, labels: { ...LABELS, moveFailed: (t: string, c: string) => `Could not move ${t} to ${c}` } });
    const errors: KanbanMoveErrorEvent[] = [];
    f.componentInstance.moveError.subscribe((e) => errors.push(e));
    focusIn(f, cell(f, "c2"));
    press(f, cell(f, "c2"), "ArrowRight", { altKey: true });
    await flush();
    f.detectChanges();
    press(f, cell(f, "c2"), "ArrowRight", { altKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
    d.reject(new Error("no"));
    await flush();
    f.detectChanges();
    expect(cell(f, "c2").getAttribute("data-col")).toBe("0");
    expect(errors).toHaveLength(1);
    expect(errors[0].cardId).toBe("c2");
    expect(status(f)).toBe("Could not move Card Two to In Progress");
  });

  test("§8.58 without a moveHandler there is no pending state", () => {
    const f = mount({ cards: rich, columns: cols });
    const m = moves(f);
    focusIn(f, cell(f, "c2"));
    press(f, cell(f, "c2"), "ArrowRight", { altKey: true });
    expect(m).toEqual([{ cardId: "c2", toColumnId: "doing" }]);
    expect(f.nativeElement.querySelector("[data-pending]")).toBeNull();
  });

  test("§8.60–§8.61 labels.emptyColumn shows a message in an empty column, even when no column has cards; none without it", () => {
    const lab = { ...LABELS, emptyColumn: (c: KanbanColumn) => `No cards in ${c.title}` };
    const f = mount({ cards: rich, columns: cols, labels: lab });
    expect(f.nativeElement.querySelector(".kanban-board-empty").textContent).toBe("No cards in Done");
    const g = mount({ cards: [], columns: cols, labels: lab });
    expect(g.nativeElement.querySelectorAll(".kanban-board-empty")).toHaveLength(3);
    expect(bodyRows(g)).toHaveLength(1);
    const h = mount({ cards: rich, columns: cols });
    expect(h.nativeElement.querySelector(".kanban-board-empty")).toBeNull();
  });

  test("§8.62 labels.search adds a search field that filters by label, subtitle and badges", () => {
    const f = mount({ cards: rich, columns: cols, labels: { ...LABELS, search: "Search cards" } });
    const input = f.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    expect(input.getAttribute("aria-label")).toBe("Search cards");
    input.value = "vip";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    f.detectChanges();
    expect(titles(f)).toEqual(["Card One"]);
    expect(headers(f)[0].getAttribute("data-hidden-count")).toBe("1");
  });
});

describe("KanbanBoard — 0.4.0 (§8.63–§8.83)", () => {
  const cardEl = (f: ComponentFixture<unknown>, id: string) =>
    f.nativeElement.querySelector(`[data-card-id="${id}"]`) as HTMLElement;
  const focusCell = (f: ComponentFixture<unknown>, id: string) => {
    cardEl(f, id).dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    f.detectChanges();
  };

  test("§8.63 selectable: x and Ctrl+click toggle, aria-multiselectable", () => {
    const f = mount({ selectable: true });
    expect(f.nativeElement.querySelector("table")!.getAttribute("aria-multiselectable")).toBe("true");
    focusCell(f, "c1");
    press(f, cardEl(f, "c1"), "x");
    expect(cardEl(f, "c1").hasAttribute("data-selected")).toBe(true);
    cardEl(f, "c2").dispatchEvent(new MouseEvent("click", { bubbles: true, ctrlKey: true }));
    f.detectChanges();
    expect(f.componentInstance.selected()).toEqual(["c1", "c2"]);
  });

  test("§8.64 moving a selected card moves the whole selection and announces once", async () => {
    const f = mount({ selectable: true, selected: ["c1", "c2"], labels: { moveManyAnnouncement: (n: number, c: string) => `${n} to ${c}` } });
    const moves: KanbanMoveEvent[] = [];
    f.componentInstance.move.subscribe((e) => moves.push(e));
    focusCell(f, "c1");
    press(f, cardEl(f, "c1"), "ArrowRight", { altKey: true });
    await flush();
    f.detectChanges();
    expect(moves.map((m) => [m.cardId, m.toColumnId])).toEqual([["c1", "doing"], ["c2", "doing"]]);
    expect(f.nativeElement.querySelector(".kanban-board-status").textContent).toBe("2 to In Progress");
    expect(f.componentInstance.selected()).toEqual([]);
  });

  test("§8.65 undoable: Ctrl+Z moves the card back", async () => {
    const f = mount({ undoable: true });
    const moves: KanbanMoveEvent[] = [];
    f.componentInstance.move.subscribe((e) => moves.push(e));
    focusCell(f, "c1");
    press(f, cardEl(f, "c1"), "ArrowRight", { altKey: true });
    await flush();
    f.componentRef.setInput("cards", CARDS.map((x) => (x.id === "c1" ? { ...x, columnId: "doing" } : x)));
    f.detectChanges();
    press(f, tabbableCells(f)[0], "z", { ctrlKey: true });
    await flush();
    expect(moves.map((m) => [m.cardId, m.toColumnId])).toEqual([["c1", "doing"], ["c1", "todo"]]);
  });

  test("§8.66 movableColumns: Alt+Shift+ArrowRight reorders columns", () => {
    const f = mount({ movableColumns: true });
    focusCell(f, "c1");
    press(f, cardEl(f, "c1"), "ArrowRight", { altKey: true, shiftKey: true });
    f.detectChanges();
    expect(f.componentInstance.columnOrder()).toEqual(["doing", "todo", "done"]);
    expect(f.nativeElement.querySelector(".kanban-table-th").textContent).toContain("In Progress");
  });

  test("§8.67 lanes: lane header rows, cards grouped by laneId", () => {
    const f = mount({
      cards: CARDS.map((x, i) => ({ ...x, laneId: i < 2 ? "a" : "b" })),
      lanes: [{ id: "a", title: "Alpha" }, { id: "b", title: "Beta" }],
    });
    expect(Array.from(f.nativeElement.querySelectorAll(".kanban-board-lane")).map((e) => (e as Element).textContent)).toEqual(["Alpha", "Beta"]);
  });

  test("§8.68 dropping into another lane's cell emits move with the lane id", () => {
    const f = mount({
      cards: [{ id: "c1", columnId: "todo", title: "One", laneId: "a" }],
      lanes: [{ id: "a", title: "A" }, { id: "b", title: "B" }],
    });
    const moves: KanbanMoveEvent[] = [];
    f.componentInstance.move.subscribe((e) => moves.push(e));
    f.nativeElement.querySelector(".kanban-board-card-title").dispatchEvent(new Event("dragstart", { bubbles: true }));
    f.nativeElement.querySelector('[data-row="1"][data-col="1"]').dispatchEvent(new Event("drop", { bubbles: true, cancelable: true }));
    expect(moves).toEqual([{ cardId: "c1", toColumnId: "doing", toLaneId: "b" }]);
  });

  test("§8.69 virtualize renders a window with spacers and aria-rowcount", () => {
    const cards = Array.from({ length: 100 }, (_, i) => ({ id: `k${i}`, columnId: "todo", title: `K${i}` }));
    const f = mount({ cards, virtualize: { rowHeight: 20, height: 100 } });
    f.detectChanges();
    expect(f.nativeElement.querySelector(".kanban-board-scroll")).toBeTruthy();
    expect(f.nativeElement.querySelectorAll("[data-card-id]").length).toBeLessThan(20);
    expect(f.nativeElement.querySelector(".kanban-board-spacer")).toBeTruthy();
    expect(f.nativeElement.querySelector("table")!.getAttribute("aria-rowcount")).toBe("101");
  });
});

describe("KanbanBoard — collapsible lanes (§8.91–§8.94)", () => {
  const laneDefs = [{ id: "ann", title: "Ann" }, { id: "bo", title: "Bo" }];
  const cardsInLanes = [
    { id: "c1", columnId: "todo", title: "One", laneId: "ann" },
    { id: "c2", columnId: "todo", title: "Two", laneId: "bo" },
    { id: "c3", columnId: "doing", title: "Three", laneId: "bo" },
  ];
  const laneInputs = { columns: [{ id: "todo", title: "To do" }, { id: "doing", title: "Doing" }], lanes: laneDefs, cards: cardsInLanes };
  const byName = (f: ComponentFixture<unknown>, name: string) =>
    Array.from(f.nativeElement.querySelectorAll("button")).find((b) => (b as HTMLElement).getAttribute("aria-label") === name) as HTMLElement;
  const collapseLane = (lane: { title: string }, collapsed: boolean) => `${collapsed ? "Expand" : "Collapse"} ${lane.title}`;

  test("§8.91 labels.collapseLane gates a toggle with aria-expanded; clicking collapses the lane's rows but keeps its header", () => {
    const f = mount({ ...laneInputs, labels: { collapseLane } });
    expect(byName(f, "Collapse Bo").getAttribute("aria-expanded")).toBe("true");
    byName(f, "Collapse Bo").click();
    f.detectChanges();
    expect(byName(f, "Expand Bo").getAttribute("aria-expanded")).toBe("false");
    expect(f.nativeElement.querySelector('[data-card-id="c2"]')).toBeNull();
    expect(f.nativeElement.querySelector('[data-card-id="c1"]')).not.toBeNull();
    expect(f.nativeElement.querySelectorAll(".kanban-board-lane")).toHaveLength(2);
  });

  test("§8.92 no toggle without labels.collapseLane", () => {
    const f = mount(laneInputs);
    expect(f.nativeElement.querySelector(".kanban-board-lane-toggle")).toBeNull();
  });

  test("§8.93 collapsedLanes starts a lane collapsed; labels.laneCount shows its card count; the model updates", () => {
    const f = mount({ ...laneInputs, collapsedLanes: ["bo"], labels: { collapseLane, laneCount: (lane: { title: string }, n: number) => `${n} cards in ${lane.title}` } });
    expect(f.nativeElement.querySelector('[data-card-id="c2"]')).toBeNull();
    expect(Array.from(f.nativeElement.querySelectorAll(".kanban-board-lane-count")).map((e) => (e as HTMLElement).textContent)).toEqual(["1 cards in Ann", "2 cards in Bo"]);
    expect(f.nativeElement.querySelector('[data-lane-id="bo"][data-collapsed]')).not.toBeNull();
    byName(f, "Expand Bo").click();
    f.detectChanges();
    expect(f.componentInstance.collapsedLanes()).toEqual([]);
  });

  test("§8.94 collapsing every lane leaves a board with only headers (no body rows, no crash)", () => {
    const f = mount({ ...laneInputs, collapsedLanes: ["ann", "bo"] });
    expect(f.nativeElement.querySelectorAll(".kanban-table-body tr:not([data-lane-row])")).toHaveLength(0);
    expect(f.nativeElement.querySelectorAll(".kanban-board-lane")).toHaveLength(2);
  });
});

// ---- A small harness for the ported typed-fields suite: real DOM events, then a change-detection pass ----
let ported: ComponentFixture<KanbanBoard>[] = [];

/** Mounts the component, wiring the Svelte suite's callback props to outputs and inputs. */
function render(props: Record<string, unknown>): void {
  const fixture = TestBed.createComponent(KanbanBoard);
  const instance = fixture.componentInstance;
  fixture.componentRef.setInput("label", (props["label"] as string) ?? "Test");
  for (const [key, value] of Object.entries(props)) {
    if (key === "label") continue;
    if (key === "onFieldEdit") {
      fixture.componentRef.setInput("editableFields", true);
      instance.fieldEdit.subscribe(value as never);
    } else fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  ported.push(fixture);
}

function cleanup(): void {
  for (const f of ported) f.destroy();
  ported = [];
}

function settle(): void {
  for (const f of ported) f.detectChanges();
}

async function tick(): Promise<void> {
  settle();
  await new Promise((r) => setTimeout(r, 0));
  settle();
}

const fireEvent = {
  async click(el: Element) { (el as HTMLElement).click(); await tick(); },
  async input(el: Element, init: { target: { value: string } }) { (el as HTMLInputElement).value = init.target.value; el.dispatchEvent(new Event("input", { bubbles: true })); await tick(); },
  async change(el: Element, init: { target: { value: string } }) { (el as HTMLInputElement).value = init.target.value; el.dispatchEvent(new Event("change", { bubbles: true })); await tick(); },
  async keyDown(el: Element, init: KeyboardEventInit & { keyCode?: number }) { el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init })); await tick(); },
  async scroll(el: Element) { el.dispatchEvent(new Event("scroll")); await tick(); },
};

async function waitFor(assertion: () => void, timeout = 1000): Promise<void> {
  const deadline = Date.now() + timeout;
  for (;;) {
    try {
      assertion();
      return;
    } catch (error) {
      if (Date.now() > deadline) throw error;
      await tick();
    }
  }
}

afterEach(cleanup);

describe("KanbanBoard — typed fields, editing, export (§8.95–§8.108)", () => {
    const FIELDS = [
        { id: "owner", header: "Owner", type: "select" as const, options: [{ id: "a", label: "Ann" }, { id: "b", label: "Bo" }] },
        { id: "points", header: "Points", type: "number" as const },
        { id: "due", header: "Due", type: "date" as const },
    ];
    const FCARDS: KanbanCard[] = [
        { id: "c1", columnId: "todo", title: "One", subtitle: "sub", badges: ["x", "y"], flag: "Late", values: { owner: "a", points: 3, due: "2026-10-16" } },
        { id: "c2", columnId: "todo", title: "Two", values: { points: 5 } },
        { id: "c3", columnId: "done", title: "Three =cmd", values: { owner: "b" } },
    ];
    const EXPORT_LABELS: KanbanLabels = {
        export: "Export",
        exportCsv: "CSV",
        exportTsv: "TSV",
        exportExcel: "Excel",
        exportHeaders: { title: "Title", column: "Column", subtitle: "Sub", badges: "Badges", flag: "Flag" },
        exportAnnouncement: (f, n, name) => `${n} cards as ${f}: ${name}`,
        editAnnouncement: (t, h, text) => `${t} ${h} is ${text}`,
        editInvalid: (t, h) => `${t}: bad ${h}`,
    };
    const base = { label: "B", columns: COLUMNS, cards: FCARDS, fields: FIELDS };
    const cellOf = (id: string) => document.querySelector<HTMLElement>(`[data-card-id="${id}"]`)!;

    test("§8.95 fields render under the title as formatted text, named by their header", () => {
        render(base);
        const fields = cellOf("c1").querySelectorAll(".kanban-board-card-field");
        expect(Array.from(fields).map((f) => f.textContent?.replace(/\s+/g, " ").trim())).toEqual(["Owner Ann", "Points 3", "Due 2026-10-16"]);
        expect(cellOf("c3").querySelectorAll(".kanban-board-card-field")).toHaveLength(1); // empty fields stay out of read-only cards
    });

    test("§8.96 a field is editable only with onFieldEdit; read-only cards stay plain text", () => {
        render(base);
        expect(document.querySelector(".kanban-board-field-button")).toBeNull();
        document.body.innerHTML = "";
        render({ ...base, onFieldEdit: vi.fn(), readonly: true });
        expect(document.querySelector(".kanban-board-field-button")).toBeNull();
    });

    test("§8.97 clicking a value opens a typed editor; Enter commits the parsed value", async () => {
        const onFieldEdit = vi.fn();
        render({ ...base, onFieldEdit, labels: EXPORT_LABELS });
        await fireEvent.click(cellOf("c1").querySelectorAll<HTMLElement>(".kanban-board-field-button")[1]);
        const input = document.querySelector<HTMLInputElement>(".kanban-board-field-editor")!;
        expect(input.type).toBe("number");
        expect(input.getAttribute("aria-label")).toBe("Points");
        await fireEvent.input(input, { target: { value: "8" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onFieldEdit).toHaveBeenCalledWith({ cardId: "c1", fieldId: "points", value: 8, previous: 3 });
        expect(document.querySelector(".kanban-board-status")!.textContent).toBe("One Points is 8");
        expect(document.querySelector(".kanban-board-field-editor")).toBeNull();
    });

    test("§8.98 a select field edits through a select of its options", async () => {
        const onFieldEdit = vi.fn();
        render({ ...base, onFieldEdit });
        await fireEvent.click(cellOf("c2").querySelectorAll<HTMLElement>(".kanban-board-field-button")[0]);
        const select = document.querySelector<HTMLSelectElement>("select.kanban-board-field-editor")!;
        await fireEvent.change(select, { target: { value: "b" } });
        expect(onFieldEdit).toHaveBeenCalledWith({ cardId: "c2", fieldId: "owner", value: "b", previous: undefined });
    });

    test("§8.99 Escape cancels without reporting; an unchanged value reports nothing", async () => {
        const onFieldEdit = vi.fn();
        render({ ...base, onFieldEdit });
        const open = async () => fireEvent.click(cellOf("c1").querySelectorAll<HTMLElement>(".kanban-board-field-button")[1]);
        await open();
        await fireEvent.input(document.querySelector(".kanban-board-field-editor")!, { target: { value: "9" } });
        await fireEvent.keyDown(document.querySelector(".kanban-board-field-editor")!, { key: "Escape" });
        expect(onFieldEdit).not.toHaveBeenCalled();
        await open();
        await fireEvent.keyDown(document.querySelector(".kanban-board-field-editor")!, { key: "Enter" });
        expect(onFieldEdit).not.toHaveBeenCalled();
    });

    test("§8.100 a date field edits through a date input and commits the ISO date", async () => {
        const onFieldEdit = vi.fn();
        render({ ...base, onFieldEdit, labels: EXPORT_LABELS });
        await fireEvent.click(cellOf("c1").querySelectorAll<HTMLElement>(".kanban-board-field-button")[2]);
        const input = document.querySelector<HTMLInputElement>(".kanban-board-field-editor")!;
        // jsdom's date input drops an invalid string, so the draft is set through a custom parse.
        expect(input.type).toBe("date");
        await fireEvent.input(input, { target: { value: "2026-10-17" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onFieldEdit).toHaveBeenCalledWith({ cardId: "c1", fieldId: "due", value: "2026-10-17", previous: "2026-10-16" });
    });

    test("§8.101 an invalid number is refused", async () => {
        const onFieldEdit = vi.fn();
        render({ ...base, fields: [{ id: "p", header: "P", type: "number", parse: () => Number.NaN }], cards: [{ id: "c1", columnId: "todo", title: "One", values: { p: 1 } }], onFieldEdit, labels: EXPORT_LABELS });
        await fireEvent.click(document.querySelector(".kanban-board-field-button")!);
        await fireEvent.keyDown(document.querySelector(".kanban-board-field-editor")!, { key: "Enter" });
        expect(onFieldEdit).not.toHaveBeenCalled();
        expect(document.querySelector(".kanban-board-field-editor")).not.toBeNull();
        expect(document.querySelector(".kanban-board-status")!.textContent).toBe("One: bad P");
    });

    test("§8.102 F2 on a card edits its first editable field; the editor's keys do not reach the grid", async () => {
        render({ ...base, onFieldEdit: vi.fn() });
        await fireEvent.keyDown(cellOf("c1"), { key: "F2" });
        const editor = document.querySelector<HTMLElement>(".kanban-board-field-editor")!;
        expect(editor).not.toBeNull();
        await fireEvent.keyDown(editor, { key: "ArrowDown" });
        expect(document.querySelector(".kanban-board-move-list")).toBeNull();
    });

    test("§8.109 Tab commits and moves to the card's next editable field", async () => {
        const onFieldEdit = vi.fn();
        render({ ...base, onFieldEdit });
        await fireEvent.click(cellOf("c1").querySelectorAll<HTMLElement>(".kanban-board-field-button")[0]);
        await fireEvent.keyDown(document.querySelector(".kanban-board-field-editor")!, { key: "Tab" });
        expect(document.querySelector<HTMLInputElement>("input.kanban-board-field-editor")!.type).toBe("number");
        await fireEvent.keyDown(document.querySelector(".kanban-board-field-editor")!, { key: "Tab", shiftKey: true });
        expect(document.querySelector("select.kanban-board-field-editor")).not.toBeNull();
    });

    test("§8.103 IME: Enter while composing does not commit", async () => {
        const onFieldEdit = vi.fn();
        render({ ...base, fields: [{ id: "n", header: "N" }], cards: [{ id: "c1", columnId: "todo", title: "One", values: { n: "a" } }], onFieldEdit });
        await fireEvent.click(document.querySelector(".kanban-board-field-button")!);
        const input = document.querySelector<HTMLInputElement>(".kanban-board-field-editor")!;
        await fireEvent.input(input, { target: { value: "かな" } });
        await fireEvent.keyDown(input, { key: "Enter", isComposing: true });
        await fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
        expect(onFieldEdit).not.toHaveBeenCalled();
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onFieldEdit).toHaveBeenCalledWith({ cardId: "c1", fieldId: "n", value: "かな", previous: "a" });
    });

    test("§8.104 a locked card's fields are not editable", () => {
        render({ ...base, cards: [{ ...FCARDS[0], locked: true }], onFieldEdit: vi.fn() });
        expect(document.querySelector(".kanban-board-field-button")).toBeNull();
    });

    async function exported(props: Record<string, unknown> = {}, format: "csv" | "tsv" | "xlsx" = "csv") {
        const exportHandler = vi.fn((_file: { format: string; filename: string; cardCount: number; blob: Blob }) => false as const);
        render({ ...base, labels: EXPORT_LABELS, exportHandler, ...props });
        await fireEvent.click(document.querySelector(`[data-kanban-export-format="${format}"]`)!);
        const file = exportHandler.mock.calls[0][0];
        const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await file.blob.arrayBuffer());
        return { file, text };
    }

    test("§8.105 export buttons need a label and exportHeaders; each label gates its button", () => {
        render(base);
        expect(document.querySelector(".kanban-board-export")).toBeNull();
        document.body.innerHTML = "";
        render({ ...base, labels: { exportCsv: "CSV" } });
        expect(document.querySelector(".kanban-board-export")).toBeNull();
        document.body.innerHTML = "";
        render({ ...base, labels: { export: "Export", exportExcel: "Excel", exportHeaders: EXPORT_LABELS.exportHeaders } });
        expect(document.querySelector("[role=group][aria-label=Export]")).toBeTruthy();
        expect(document.querySelectorAll(".kanban-board-export-button")).toHaveLength(1);
    });

    test("§8.106 CSV holds title, column, subtitle, badges, flag and the typed fields, column by column, formula text defused", async () => {
        const { file, text } = await exported();
        expect(file.filename).toBe("kanban-board.csv");
        expect(file.cardCount).toBe(3);
        expect(text).toBe(
            "﻿Title,Column,Sub,Badges,Flag,Owner,Points,Due\r\n" +
                "One,To Do,sub,x; y,Late,Ann,3,2026-10-16\r\n" +
                "Two,To Do,,,,,5,\r\n" +
                "Three =cmd,Done,,,,Bo,,\r\n",
        );
    });

    test("§8.107 the view is exported: the search and filter apply; exportScope selected exports only the selection; exportable false drops a field", async () => {
        const searched = await exported({ search: "two" });
        expect(searched.file.cardCount).toBe(1);
        document.body.innerHTML = "";
        const picked = await exported({ selectable: true, selected: ["c3"], exportScope: "selected" });
        expect(picked.file.cardCount).toBe(1);
        document.body.innerHTML = "";
        const dropped = await exported({ fields: [{ ...FIELDS[0], exportable: false }, FIELDS[1]] });
        expect(dropped.text.split("\r\n")[0]).toBe("﻿Title,Column,Sub,Badges,Flag,Points");
    });

    test("§8.108 lanes add a lane column; saving announces unless exportHandler returns false; empty view disables the buttons", async () => {
        const lanes = [{ id: "l1", title: "Lane 1" }];
        const withLane = await exported({ lanes, labels: { ...EXPORT_LABELS, exportHeaders: { ...EXPORT_LABELS.exportHeaders!, lane: "Lane" } } });
        expect(withLane.text.split("\r\n")[0]).toBe("﻿Title,Column,Lane,Sub,Badges,Flag,Owner,Points,Due");
        document.body.innerHTML = "";
        const created: Blob[] = [];
        const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
        URL.createObjectURL = (b: Blob | MediaSource) => (created.push(b as Blob), "blob:test");
        URL.revokeObjectURL = () => {};
        try {
            render({ ...base, labels: EXPORT_LABELS });
            await fireEvent.click(document.querySelector('[data-kanban-export-format="tsv"]')!);
            expect(created).toHaveLength(1);
            expect(document.querySelector(".kanban-board-status")!.textContent).toBe("3 cards as tsv: kanban-board.tsv");
            document.body.innerHTML = "";
            render({ ...base, cards: [], labels: EXPORT_LABELS });
            expect((document.querySelector('[data-kanban-export-format="csv"]') as HTMLButtonElement).disabled).toBe(true);
        } finally {
            URL.createObjectURL = original.create;
            URL.revokeObjectURL = original.revoke;
        }
    });
});
