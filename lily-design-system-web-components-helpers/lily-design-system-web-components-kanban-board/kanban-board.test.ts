import { afterEach, describe, expect, test, vi } from "vitest";

import { KanbanBoard } from "./kanban-board.js";
import type { KanbanCard, KanbanColumn, KanbanLabels } from "./kanban-board.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-kanban-board")) {
  customElements.define("lily-kanban-board", KanbanBoard);
}

afterEach(() => {
  document.body.innerHTML = "";
});

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

function mount(props: {
  label?: string;
  caption?: string;
  columns?: KanbanColumn[];
  cards?: KanbanCard[];
  labels?: KanbanLabels;
  onMove?: (cardId: string, toColumnId: string) => void;
  attrs?: Record<string, string>;
}): KanbanBoard {
  const el = document.createElement("lily-kanban-board") as KanbanBoard;
  el.label = props.label ?? "Sprint board";
  if (props.caption) el.caption = props.caption;
  for (const [k, v] of Object.entries(props.attrs ?? {})) el.setAttribute(k, v);
  document.body.appendChild(el);
  el.columns = props.columns ?? COLUMNS;
  el.cards = props.cards ?? CARDS;
  if (props.labels) el.labels = props.labels;
  if (props.onMove) el.onMove = props.onMove;
  return el;
}

function bodyRows(): HTMLElement[] {
  return Array.from(document.querySelectorAll(".kanban-board tbody tr"));
}

function headers(): HTMLElement[] {
  return Array.from(document.querySelectorAll(".kanban-board thead th"));
}

function tabbableCells(): HTMLElement[] {
  return Array.from(document.querySelectorAll('.kanban-board-td[tabindex="0"]'));
}

function press(el: Element, key: string, extra: KeyboardEventInit = {}): void {
  el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...extra }));
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

function moveButtonFor(cardTitle: string): HTMLButtonElement {
  const span = Array.from(document.querySelectorAll(".kanban-board-card-title")).find(
    (s) => s.textContent === cardTitle,
  )!;
  const td = span.closest("td")!;
  return td.querySelector("lily-icon-button button")!;
}

function openListFor(cardTitle: string): HTMLUListElement {
  const span = Array.from(document.querySelectorAll(".kanban-board-card-title")).find(
    (s) => s.textContent === cardTitle,
  )!;
  const td = span.closest("td")!;
  return td.querySelector(".kanban-board-move-list:not([hidden])")!;
}

describe("KanbanBoard — markup (§8.1, §8.2, §8.3, §8.4)", () => {
  test("§8.1 renders a kanban-board root wrapping a role=grid labelled by `label`", () => {
    mount({});
    const root = document.querySelector(".kanban-board");
    expect(root).toBeTruthy();
    const grid = document.querySelector("table.kanban-table")!;
    expect(grid.getAttribute("role")).toBe("grid");
    expect(grid.getAttribute("aria-label")).toBe("Sprint board");
  });

  test("§8.2 renders column titles and, when labels.cardCount is set, a derived count", () => {
    mount({ labels: LABELS });
    expect(document.body.textContent).toContain("To Do");
    const hs = headers();
    expect(hs[0].textContent).toContain("2 cards");
    expect(hs[2].textContent).toContain("0 cards");
  });

  test("§8.2 no card count renders when labels.cardCount is absent", () => {
    mount({});
    expect(document.querySelector(".kanban-board-count")).toBeNull();
  });

  test("§8.3 a column over its wipLimit carries data-over-limit and the warning text", () => {
    mount({ labels: LABELS });
    const hs = headers();
    expect(hs[1].hasAttribute("data-over-limit")).toBe(true);
    expect(hs[1].textContent).toContain("Over limit: 2/1");
    expect(hs[0].hasAttribute("data-over-limit")).toBe(false);
    expect(hs[2].hasAttribute("data-over-limit")).toBe(false);
  });

  test("§8.4 the body is rectangular: row count equals the largest column's card count", () => {
    mount({});
    expect(bodyRows()).toHaveLength(2); // todo and doing both have 2 cards
    const doneCells = bodyRows().map((row) => row.querySelectorAll(".kanban-board-td")[2]);
    for (const cell of doneCells) {
      expect(cell.textContent?.trim()).toBe("");
    }
  });
});

describe("KanbanBoard — roving-tabindex keyboard navigation (§8.5, §8.6)", () => {
  test("§8.5 exactly one body cell carries tabindex=0, and arrows move it and clamp", () => {
    mount({});
    expect(tabbableCells()).toHaveLength(1);
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

    press(tabbableCells()[0], "ArrowRight");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

    // Clamp: ArrowUp past the first row stays on the first row.
    press(tabbableCells()[0], "ArrowUp");
    expect(tabbableCells()).toHaveLength(1);
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
  });

  test("§8.6 Home/End move within the column; Ctrl+Home/Ctrl+End move to the grid's ends", () => {
    mount({});
    press(tabbableCells()[0], "ArrowRight");
    press(tabbableCells()[0], "End");
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

    press(tabbableCells()[0], "Home", { ctrlKey: true });
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

    press(tabbableCells()[0], "End", { ctrlKey: true });
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("2");
  });
});

describe("KanbanBoard — move menu (§8.7, §8.8, §8.9)", () => {
  test("§8.7 Enter on a focused card opens its move menu", () => {
    mount({ labels: LABELS });
    press(tabbableCells()[0], "Enter");
    const button = moveButtonFor("Card One");
    expect(button.getAttribute("aria-label")).toBe("Move Card One");
    expect(button.getAttribute("aria-expanded")).toBe("true");
    const list = openListFor("Card One");
    expect(list.getAttribute("aria-label")).toBe("Move to column");
    expect(list.querySelectorAll('[role="option"]')).toHaveLength(3);
  });

  test("§8.8 choosing a destination calls onMove, closes the menu, and refocuses the move button", () => {
    const onMove = vi.fn();
    mount({ labels: LABELS, onMove });
    press(tabbableCells()[0], "Enter");
    const list = openListFor("Card One");
    const doneOption = Array.from(list.querySelectorAll('[role="option"]')).find((o) => o.textContent === "Done")!;
    click(doneOption);
    expect(onMove).toHaveBeenCalledWith("c1", "done");
    expect(document.querySelector(".kanban-board-move-list:not([hidden])")).toBeNull();
    expect(document.activeElement).toBe(moveButtonFor("Card One"));
  });

  test("§8.9 Escape closes the move menu without calling onMove", () => {
    const onMove = vi.fn();
    mount({ labels: LABELS, onMove });
    press(tabbableCells()[0], "Enter");
    const list = openListFor("Card One");
    press(list, "Escape");
    expect(onMove).not.toHaveBeenCalled();
    expect(document.querySelector(".kanban-board-move-list:not([hidden])")).toBeNull();
  });

  test("Arrow keys inside the open move menu do not also move the grid's roving-tabindex cursor (stopPropagation)", () => {
    mount({ labels: LABELS });
    press(tabbableCells()[0], "Enter"); // opens Card One's menu; grid cursor stays at row 0 col 0
    const list = openListFor("Card One");
    press(list, "ArrowDown");
    // The grid cursor must still be on the original cell — only the
    // listbox's own active option should have moved.
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");
    const activeOption = list.querySelector("[data-active]");
    expect(activeOption?.textContent).toBe("In Progress");
  });
});

describe("KanbanBoard — move-menu button identity, not a shared/last-mounted ref (§10)", () => {
  test("closing card one's menu refocuses card one's own button, even after card two's menu opened later", () => {
    const onMove = vi.fn();
    mount({ labels: LABELS, onMove });

    // Open and close card one's menu via Escape — refocuses card one's button.
    press(tabbableCells()[0], "Enter");
    press(openListFor("Card One"), "Escape");
    expect(document.activeElement).toBe(moveButtonFor("Card One"));

    // Move the grid cursor to card two and open/choose from its menu.
    press(tabbableCells()[0], "ArrowDown"); // now on row 1, col 0 = Card Two
    press(tabbableCells()[0], "Enter");
    const list = openListFor("Card Two");
    const doneOption = Array.from(list.querySelectorAll('[role="option"]')).find((o) => o.textContent === "Done")!;
    click(doneOption);

    expect(onMove).toHaveBeenCalledWith("c2", "done");
    // Focus must land on CARD TWO's button, not card one's (the
    // last-mounted-ref bug every other framework catalog's port found
    // and fixed in the Svelte reference).
    expect(document.activeElement).toBe(moveButtonFor("Card Two"));
    expect(document.activeElement).not.toBe(moveButtonFor("Card One"));
  });
});

describe("KanbanBoard — pointer drag-and-drop (§8.10)", () => {
  test("§8.10 dropping a card on another column's cell calls onMove", () => {
    const onMove = vi.fn();
    mount({ onMove });
    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
    const cardTitle = Array.from(document.querySelectorAll(".kanban-board-card-title")).find(
      (s) => s.textContent === "Card One",
    )!;
    // jsdom's DragEvent doesn't carry a writable dataTransfer, so
    // dispatch a plain Event and monkeypatch dataTransfer onto it.
    const dragStart = new Event("dragstart", { bubbles: true, cancelable: true }) as unknown as DragEvent;
    Object.defineProperty(dragStart, "dataTransfer", { value: dataTransfer });
    cardTitle.dispatchEvent(dragStart);

    const doneCell = bodyRows()[0].querySelectorAll(".kanban-board-td")[2];
    const drop = new Event("drop", { bubbles: true, cancelable: true }) as unknown as DragEvent;
    Object.defineProperty(drop, "dataTransfer", { value: dataTransfer });
    doneCell.dispatchEvent(drop);

    expect(onMove).toHaveBeenCalledWith("c1", "done");
  });
});

describe("KanbanBoard — announcements and extra attributes (§8.11, §8.12)", () => {
  test("§8.11 a successful move announces via labels.moveAnnouncement", () => {
    mount({ labels: LABELS });
    press(tabbableCells()[0], "Enter");
    const list = openListFor("Card One");
    const doneOption = Array.from(list.querySelectorAll('[role="option"]')).find((o) => o.textContent === "Done")!;
    click(doneOption);
    expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Card One moved to Done");
  });

  test("§8.11 no announcement fires when moveAnnouncement is absent", () => {
    mount({});
    press(tabbableCells()[0], "Enter");
    const list = openListFor("Card One");
    press(list, "Enter");
    expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");
  });

  test("§8.12 extra attributes spread onto the root", () => {
    mount({ attrs: { "data-testid": "board-root" } });
    expect(document.querySelector('[data-testid="board-root"]')).toBeTruthy();
  });
});

describe("KanbanBoard — no hardcoded strings (§8.13)", () => {
  test("§8.13 move button and listbox carry no text unless a label supplies it", () => {
    mount({});
    const button = moveButtonFor("Card One");
    expect(button.getAttribute("aria-label")).toBe("");
    press(tabbableCells()[0], "Enter");
    const list = openListFor("Card One");
    expect(list.getAttribute("aria-label")).toBe("");
  });
});
