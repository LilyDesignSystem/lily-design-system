import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import {
  KanbanBoard,
  type KanbanCard,
  type KanbanColumn,
  type KanbanLabels,
  type KanbanMoveEvent,
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
    expect(document.activeElement?.className).toContain("kanban-board-move-button");
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
