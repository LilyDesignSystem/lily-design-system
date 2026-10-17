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
  test("§8.5 the roving tab stop is not announced as selection: no cell carries aria-selected", () => {
    mount({});
    expect(tabbableCells()).toHaveLength(1);
    expect(document.querySelectorAll("td[aria-selected]")).toHaveLength(0);
  });

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
    press(list, "ArrowDown");
    press(list, "Enter");
    expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");
  });

  test("§8.12 extra attributes spread onto the root", () => {
    mount({ attrs: { "data-testid": "board-root" } });
    expect(document.querySelector('[data-testid="board-root"]')).toBeTruthy();
  });
});

describe("KanbanBoard — no hardcoded strings (§8.13)", () => {
  test("§8.13 without labels there is no unnamed move button, and the menu is named by the card", () => {
    mount({});
    expect(document.querySelector(".kanban-board-move-button")).toBeNull();
    press(tabbableCells()[0], "Enter");
    const list = openListFor("Card One");
    expect(list.getAttribute("aria-label")).toBe("Card One");
  });
});

describe("KanbanBoard — focus, tab stop and move edge cases", () => {
  function option(list: HTMLElement, name: string): HTMLElement {
    return Array.from(list.querySelectorAll<HTMLElement>(".kanban-board-move-option")).find(
      (el) => el.textContent?.trim() === name,
    )!;
  }

  function dragEvent(type: string, dataTransfer: unknown): Event {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
    return event;
  }

  test("§8.8 after a move, focus and the tab stop follow the card to its new column", () => {
    const el = mount({ labels: LABELS });
    el.onMove = (id, columnId) => {
      el.cards = CARDS.map((c) => (c.id === id ? { ...c, columnId } : c));
    };
    press(tabbableCells()[0], "Enter");
    click(option(openListFor("Card One"), "Done"));
    expect(document.activeElement).toBe(moveButtonFor("Card One"));
    expect(tabbableCells()).toHaveLength(1);
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("2");
  });

  test("§8.15 choosing the card's own column, or dropping it there, is not a move", () => {
    const onMove = vi.fn();
    mount({ labels: LABELS, onMove });
    press(tabbableCells()[0], "Enter");
    click(option(openListFor("Card One"), "To Do"));
    expect(document.querySelector(".kanban-board-move-list:not([hidden])")).toBeNull();
    expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");

    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
    const title = Array.from(document.querySelectorAll(".kanban-board-card-title")).find(
      (el) => el.textContent === "Card One",
    )!;
    title.dispatchEvent(dragEvent("dragstart", dataTransfer));
    bodyRows()[1].querySelectorAll("td")[0].dispatchEvent(dragEvent("drop", dataTransfer));
    expect(onMove).not.toHaveBeenCalled();
  });

  test("§8.16 focusing a cell by pointer moves the cursor there", () => {
    mount({});
    const cell = bodyRows()[1].querySelectorAll<HTMLElement>("td")[1];
    cell.focus();
    expect(tabbableCells()).toEqual([cell]);
    press(cell, "ArrowUp");
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
  });

  test("§8.13 without labels.moveButton, Escape returns focus to the card's cell", () => {
    mount({});
    const cell = tabbableCells()[0];
    press(cell, "Enter");
    press(openListFor("Card One"), "Escape");
    expect(document.activeElement).toBe(cell);
  });

  test("§8.3 a column exactly at its wipLimit is not over it", () => {
    mount({ cards: CARDS.filter((c) => c.id !== "c4"), labels: LABELS });
    expect(headers()[1].hasAttribute("data-over-limit")).toBe(false);
  });
});

describe("KanbanBoard — reorder, veto and read-only (§8.17–§8.21)", () => {
  const status = () => document.querySelector(".kanban-board-status")?.textContent;

  test("§8.17 Alt+ArrowDown calls onReorder and announces it", () => {
    const onReorder = vi.fn();
    const el = mount({ labels: { reorderAnnouncement: (t, p, n) => `${t} is ${p} of ${n}` } });
    el.onReorder = onReorder;
    press(tabbableCells()[0], "ArrowDown", { altKey: true });
    expect(onReorder).toHaveBeenCalledWith("c1", 1);
    expect(status()).toBe("Card One is 2 of 2");
  });

  test("§8.18 Alt+Arrow at the column edge does not call onReorder", () => {
    const onReorder = vi.fn();
    const el = mount({});
    el.onReorder = onReorder;
    press(tabbableCells()[0], "ArrowUp", { altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
  });

  test("§8.19 canMove refuses a move: no onMove, an announcement, aria-disabled option", () => {
    const onMove = vi.fn();
    const el = mount({ labels: { ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` }, onMove });
    el.canMove = (_c, to) => to.id !== "done";
    press(tabbableCells()[0], "Enter");
    const option = Array.from(document.querySelectorAll(".kanban-board-move-option")).find(
      (o) => o.textContent === "Done" && !o.closest("[hidden]"),
    )!;
    expect(option.getAttribute("aria-disabled")).toBe("true");
    click(option);
    expect(onMove).not.toHaveBeenCalled();
    expect(status()).toBe("Card One cannot go to Done");
  });

  test("§8.20 readonly: no move button, no menu, no drag, no reorder", () => {
    const onReorder = vi.fn();
    const el = mount({ labels: LABELS });
    el.onReorder = onReorder;
    el.readonly = true;
    expect(document.querySelector("lily-icon-button")).toBeNull();
    press(tabbableCells()[0], "Enter");
    expect(document.querySelector(".kanban-board-move-list:not([hidden])")).toBeNull();
    press(tabbableCells()[0], "ArrowDown", { altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
    expect(document.querySelector("[draggable='true']")).toBeNull();
    expect(document.querySelector(".kanban-board")!.hasAttribute("data-readonly")).toBe(true);
  });

  test("§8.21 readonly keeps arrow-key navigation", () => {
    const el = mount({});
    el.readonly = true;
    press(tabbableCells()[0], "ArrowRight");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
  });
});

describe("KanbanBoard — collapse, add card, hard limits (§8.22–§8.30)", () => {
  const collapseLabels: KanbanLabels = {
    ...LABELS,
    collapseColumn: (c, collapsed) => `${collapsed ? "Expand" : "Collapse"} ${c.title}`,
  };
  const named = (name: string) =>
    Array.from(document.querySelectorAll("button")).find((b) => b.getAttribute("aria-label") === name) as HTMLElement;
  const text = () => document.body.textContent ?? "";
    const stat = () => document.querySelector(".kanban-board-status")?.textContent;
  const moveTo = (title: string) => {
    press(tabbableCells()[0], "Enter");
    const option = Array.from(document.querySelectorAll(".kanban-board-move-option")).find(
      (o) => o.textContent === title && !o.closest("[hidden]"),
    ) as HTMLElement;
    return option;
  };

  test("§8.22 no collapse toggle without labels.collapseColumn", () => {
    mount({});
    expect(document.querySelector(".kanban-board-collapse-button")).toBeNull();
  });

  test("§8.23 the toggle collapses a column: aria-expanded flips, cards are not rendered, the count remains", () => {
    const el = mount({ labels: collapseLabels });
    const onChange = vi.fn();
    el.onCollapsedChange = onChange;
    expect(named("Collapse To Do").getAttribute("aria-expanded")).toBe("true");
    expect(text()).toContain("Card One");
    click(named("Collapse To Do"));
    expect(named("Expand To Do").getAttribute("aria-expanded")).toBe("false");
    expect(text()).not.toContain("Card One");
    expect(headers()[0].textContent).toContain("2 cards");
    expect(headers()[0].hasAttribute("data-collapsed")).toBe(true);
    expect(onChange).toHaveBeenCalledWith(["todo"]);
  });

  test("§8.24 collapsedColumns starts a column collapsed; its cells carry data-collapsed", () => {
    const el = mount({ labels: LABELS });
    el.collapsedColumns = ["todo"];
    expect(text()).not.toContain("Card One");
    const cells = Array.from(document.querySelectorAll<HTMLElement>(".kanban-board-td")).filter((c) => c.dataset.col === "0");
    expect(cells.every((c) => c.hasAttribute("data-collapsed"))).toBe(true);
  });

  test("§8.25 the board's height ignores collapsed columns", () => {
    const el = mount({});
    expect(bodyRows()).toHaveLength(2);
    el.collapsedColumns = ["todo", "doing"];
    expect(bodyRows()).toHaveLength(0);
  });

  test("§8.26 addCard gates an add button per column that calls onAddCard and fires addcard", () => {
    const el = mount({ labels: { addCard: (c) => `Add to ${c.title}` } });
    const onAddCard = vi.fn();
    el.onAddCard = onAddCard;
    const events: string[] = [];
    el.addEventListener("addcard", (e) => events.push((e as CustomEvent<string>).detail));
    click(named("Add to In Progress"));
    expect(onAddCard).toHaveBeenCalledWith("doing");
    expect(events).toEqual(["doing"]);
  });

  test("§8.27 no add button without labels.addCard, and none when readonly", () => {
    mount({});
    expect(document.querySelector(".kanban-board-add-button")).toBeNull();
    document.body.replaceChildren();
    const el = mount({ labels: { addCard: (c) => `Add to ${c.title}` } });
    el.readonly = true;
    expect(document.querySelector(".kanban-board-add-button")).toBeNull();
  });

  test("§8.28 strictLimit refuses a move into a full column, announces it, marks the option aria-disabled", () => {
    const onMove = vi.fn();
    mount({
      columns: [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true }],
      labels: { ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` },
      onMove,
    });
    const option = moveTo("In Progress");
    expect(option.getAttribute("aria-disabled")).toBe("true");
    click(option);
    expect(onMove).not.toHaveBeenCalled();
    expect(stat()).toBe("Card One cannot go to In Progress");
  });

  test("§8.29 strictLimit allows a move while the column is under its limit", () => {
    const onMove = vi.fn();
    mount({
      columns: [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 3, strictLimit: true }],
      labels: LABELS,
      onMove,
    });
    click(moveTo("In Progress"));
    expect(onMove).toHaveBeenCalledWith("c1", "doing");
  });

  test("§8.30 without strictLimit a full column still accepts moves", () => {
    const onMove = vi.fn();
    mount({ labels: LABELS, onMove });
    click(moveTo("In Progress"));
    expect(onMove).toHaveBeenCalledWith("c1", "doing");
  });
});

describe("KanbanBoard — round 3 and consumer capabilities (§8.31–§8.62)", () => {
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
  const cell = (id: string) => document.querySelector<HTMLElement>(`[data-card-id="${id}"]`)!;
  const cellAt = (row: number, col: number) => document.querySelector<HTMLElement>(`.kanban-board-td[data-row="${row}"][data-col="${col}"]`)!;
  const titles = () => Array.from(document.querySelectorAll(".kanban-board-card-title")).map((e) => e.textContent?.trim());
  const status = () => document.querySelector(".kanban-board-status")!.textContent;
  const heads = () => Array.from(document.querySelectorAll<HTMLElement>(".kanban-board th"));
  const focusIn = (el: Element) => el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  const dragEvent = (type: string, d: unknown) => {
    const e = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperty(e, "dataTransfer", { value: d });
    return e;
  };
  const drag = (from: HTMLElement, to: HTMLElement) => {
    const d = { setData: () => {}, getData: () => "" };
    from.querySelector(".kanban-board-card-title")!.dispatchEvent(dragEvent("dragstart", d));
    to.dispatchEvent(dragEvent("dragover", d));
    to.dispatchEvent(dragEvent("drop", d));
  };
  const deferred = () => {
    let resolve!: () => void;
    let reject!: (e: unknown) => void;
    const promise = new Promise<void>((res, rej) => ((resolve = res), (reject = rej)));
    return { promise, resolve, reject };
  };
  const flush = () => new Promise((r) => setTimeout(r, 0));

  test("§8.31–§8.33 filter hides cards; counts and limits still use every card; data-hidden-count", () => {
    const el = mount({ labels: LABELS });
    el.filter = (c) => c.columnId !== "doing";
    expect(titles()).not.toContain("Card Three");
    expect(heads()[1].textContent).toContain("2 cards");
    expect(heads()[1].hasAttribute("data-over-limit")).toBe(true);
    expect(heads()[1].getAttribute("data-hidden-count")).toBe("2");
    expect(heads()[0].hasAttribute("data-hidden-count")).toBe(false);
  });

  test("§8.34 compare orders the cards within each column", () => {
    const el = mount({});
    el.compare = (a, b) => b.title.localeCompare(a.title);
    const todo = Array.from(document.querySelectorAll<HTMLElement>('.kanban-board-td[data-col="0"] .kanban-board-card-title')).map((e) => e.textContent?.trim());
    expect(todo).toEqual(["Card Two", "Card One"]);
  });

  test("§8.35–§8.37 drop on a card in another column passes its position; on an empty cell appends; in its own column reorders", () => {
    const onMove = vi.fn();
    const onReorder = vi.fn();
    const el = mount({ onMove });
    el.onReorder = onReorder;
    drag(cellAt(0, 0), cellAt(1, 1));
    drag(cellAt(0, 0), cellAt(0, 2));
    drag(cellAt(0, 0), cellAt(1, 0));
    expect(onMove.mock.calls).toEqual([["c1", "doing", 1], ["c1", "done"]]);
    expect(onReorder).toHaveBeenCalledWith("c1", 1);
  });

  test("§8.38 the cell under a dragged card carries data-drop-target; readonly refuses drops", () => {
    mount({});
    const d = { setData: () => {}, getData: () => "" };
    cellAt(0, 0).querySelector(".kanban-board-card-title")!.dispatchEvent(dragEvent("dragstart", d));
    cellAt(1, 1).dispatchEvent(dragEvent("dragover", d));
    expect(cellAt(1, 1).hasAttribute("data-drop-target")).toBe(true);
    document.body.replaceChildren();
    const onMove = vi.fn();
    const ro = mount({ onMove });
    ro.readonly = true;
    cellAt(0, 2).dispatchEvent(dragEvent("drop", d));
    expect(onMove).not.toHaveBeenCalled();
  });

  test("§8.39–§8.41 a locked card has data-locked, no move button, no drag, ignores Enter and Alt+Arrow; others still move", () => {
    const onMove = vi.fn();
    const onReorder = vi.fn();
    const el = mount({ labels: LABELS, cards: CARDS.map((c) => (c.id === "c1" ? { ...c, locked: true } : c)), onMove });
    el.onReorder = onReorder;
    expect(cellAt(0, 0).hasAttribute("data-locked")).toBe(true);
    expect(cellAt(0, 0).querySelector(".kanban-board-move-button")).toBeNull();
    expect(cellAt(0, 0).querySelector("[draggable]")).toBeNull();
    press(cellAt(0, 0), "Enter");
    expect(document.querySelector('[role="listbox"]:not([hidden])')).toBeNull();
    press(cellAt(0, 0), "ArrowDown", { altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
    focusIn(cellAt(1, 0));
    press(cellAt(1, 0), "Enter");
    click(Array.from(document.querySelectorAll(".kanban-board-move-option")).find((o) => o.textContent === "Done" && !o.closest("[hidden]"))!);
    expect(onMove).toHaveBeenCalledWith("c2", "done");
  });

  test("§8.44–§8.46 Alt+ArrowRight moves to the next column, not past the first; a full hard-limited column refuses and announces", () => {
    const onMove = vi.fn();
    mount({ onMove });
    press(cellAt(0, 0), "ArrowLeft", { altKey: true });
    expect(onMove).not.toHaveBeenCalled();
    press(cellAt(0, 0), "ArrowRight", { altKey: true });
    expect(onMove).toHaveBeenCalledWith("c1", "doing");
    document.body.replaceChildren();
    const refused = vi.fn();
    mount({
      columns: [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true }],
      labels: { ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` },
      onMove: refused,
    });
    press(cellAt(0, 0), "ArrowRight", { altKey: true });
    expect(refused).not.toHaveBeenCalled();
    expect(status()).toBe("Card One cannot go to In Progress");
  });

  test("§8.47 cardAttrs adds attributes to each card's cell", () => {
    const el = mount({});
    el.cardAttrs = (c) => ({ "data-priority": c.id === "c1" ? "high" : "low" });
    expect(cell("c1").getAttribute("data-priority")).toBe("high");
    expect(cell("c2").getAttribute("data-priority")).toBe("low");
  });

  test("§8.48 subtitle, badges and a link title render; §8.50 the flag is text, data-flag and aria-describedby; §8.51 column flag and accent", () => {
    mount({ cards: rich, columns: cols });
    expect(cell("c1").querySelector(".kanban-board-card-subtitle")!.textContent).toBe("Source · 80");
    expect(Array.from(cell("c1").querySelectorAll(".kanban-board-card-badge")).map((b) => b.textContent)).toEqual(["P1", "VIP"]);
    expect(cell("c1").querySelector("a.kanban-board-card-link")!.getAttribute("href")).toBe("/t/1");
    const flag = cell("c1").querySelector(".kanban-board-card-flag")!;
    expect(flag.textContent).toBe("SLA breached");
    expect(cell("c1").getAttribute("data-flag")).toBe("SLA breached");
    expect(cell("c1").getAttribute("aria-describedby")).toBe(flag.id);
    expect(heads()[0].getAttribute("data-flag")).toBe("Over capacity");
    expect(heads()[0].getAttribute("data-accent")).toBe("red");
    expect(heads()[0].querySelector(".kanban-board-column-flag")!.textContent).toBe("Over capacity");
    expect(cell("c1").getAttribute("data-accent")).toBe("red");
  });

  test("§8.49 renderCard replaces the title content; §8.59 renderColumnHeader and renderColumnFooter render per column", () => {
    const el = document.createElement("lily-kanban-board") as KanbanBoard;
    el.setAttribute("label", "B");
    el.renderCard = ({ label }) => Object.assign(document.createElement("b"), { textContent: `${label}!` });
    el.renderColumnHeader = ({ count }) => Object.assign(document.createElement("i"), { textContent: String(count) });
    el.renderColumnFooter = ({ column, count, cards }) =>
      Object.assign(document.createElement("i"), { textContent: `${column.id}:${count}:${cards.map((c) => c.id).join(",")}` });
    document.body.appendChild(el);
    el.columns = cols;
    el.cards = rich;
    expect(cell("c2").querySelector(".kanban-board-card-title")!.textContent).toBe("Card Two!");
    expect(document.querySelectorAll("tfoot td")).toHaveLength(3);
    expect(document.querySelector("tfoot td")!.textContent).toBe("todo:2:c1,c2");
    expect(heads()[1].textContent).toContain("1");
  });

  test("§8.52–§8.53 allowedColumns limits the move menu; a keyboard move elsewhere is refused and announced", () => {
    const el = mount({ labels: LABELS, cards: rich, columns: cols });
    el.allowedColumns = (c) => (c.id === "c1" ? ["doing"] : ["done"]);
    press(cell("c1"), "Enter");
    expect(Array.from(document.querySelectorAll('[role="option"]')).filter((o) => !o.closest("[hidden]")).map((o) => o.textContent)).toEqual(["To Do", "In Progress"]);
    document.body.replaceChildren();
    const onMove = vi.fn();
    const g = mount({ labels: { ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` }, onMove });
    g.allowedColumns = () => ["done"];
    press(cellAt(0, 0), "ArrowRight", { altKey: true });
    expect(onMove).not.toHaveBeenCalled();
    expect(status()).toBe("Card One cannot go to In Progress");
  });

  test("§8.54 card.draggable=false stops pointer dragging but keeps the move menu", () => {
    mount({ labels: LABELS, cards: CARDS.map((c) => (c.id === "c1" ? { ...c, draggable: false } : c)) });
    expect(cell("c1").querySelector("[draggable]")).toBeNull();
    expect(cell("c1").querySelector(".kanban-board-move-button")).toBeTruthy();
  });

  test("§8.55 an async moveHandler shows data-pending and aria-busy in the new column, then clears on resolve", async () => {
    const d = deferred();
    const el = mount({ cards: rich, columns: cols, labels: { ...LABELS, movePending: (t, c) => `Moving ${t} to ${c}` } });
    el.moveHandler = () => d.promise;
    focusIn(cell("c2"));
    press(cell("c2"), "ArrowRight", { altKey: true });
    await flush();
    expect(cell("c2").getAttribute("data-pending")).toBe("");
    expect(cell("c2").getAttribute("aria-busy")).toBe("true");
    expect(cell("c2").getAttribute("data-col")).toBe("1");
    expect(status()).toBe("Moving Card Two to In Progress");
    d.resolve();
    await flush();
    expect(cell("c2").hasAttribute("data-pending")).toBe(false);
  });

  test("§8.56 a rejected moveHandler sends the card back, announces moveFailed and calls onMoveError; §8.57 a pending card cannot move again", async () => {
    const d = deferred();
    const handler = vi.fn(() => d.promise);
    const onMoveError = vi.fn();
    const el = mount({ cards: rich, columns: cols, labels: { ...LABELS, moveFailed: (t, c) => `Could not move ${t} to ${c}` } });
    el.moveHandler = handler;
    el.onMoveError = onMoveError;
    focusIn(cell("c2"));
    press(cell("c2"), "ArrowRight", { altKey: true });
    await flush();
    press(cell("c2"), "ArrowRight", { altKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
    d.reject(new Error("no"));
    await flush();
    expect(cell("c2").getAttribute("data-col")).toBe("0");
    expect(onMoveError).toHaveBeenCalledWith("c2", "doing", expect.any(Error));
    expect(status()).toBe("Could not move Card Two to In Progress");
  });

  test("§8.58 without a moveHandler there is no pending state", () => {
    const onMove = vi.fn();
    mount({ cards: rich, columns: cols, onMove });
    focusIn(cell("c2"));
    press(cell("c2"), "ArrowRight", { altKey: true });
    expect(onMove).toHaveBeenCalledWith("c2", "doing");
    expect(document.querySelector("[data-pending]")).toBeNull();
  });

  test("§8.60–§8.61 labels.emptyColumn shows a message in an empty column, even when no column has cards; none without it", () => {
    const lab = { ...LABELS, emptyColumn: (c: KanbanColumn) => `No cards in ${c.title}` };
    mount({ cards: rich, columns: cols, labels: lab });
    expect(document.querySelector(".kanban-board-empty")!.textContent).toBe("No cards in Done");
    document.body.replaceChildren();
    mount({ cards: [], columns: cols, labels: lab });
    expect(document.querySelectorAll(".kanban-board-empty")).toHaveLength(3);
    expect(bodyRows()).toHaveLength(1);
    document.body.replaceChildren();
    mount({ cards: rich, columns: cols });
    expect(document.querySelector(".kanban-board-empty")).toBeNull();
  });

  test("§8.62 labels.search adds a search field that filters by label, subtitle and badges", () => {
    mount({ cards: rich, columns: cols, labels: { ...LABELS, search: "Search cards" } });
    const input = document.querySelector<HTMLInputElement>('input[type="search"]')!;
    expect(input.getAttribute("aria-label")).toBe("Search cards");
    input.value = "vip";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(titles()).toEqual(["Card One"]);
    expect(heads()[0].getAttribute("data-hidden-count")).toBe("1");
  });
});

describe("KanbanBoard — 0.4.0 (§8.63–§8.83)", () => {
  const cell = (id: string) => document.querySelector<HTMLElement>(`[data-card-id="${id}"]`)!;
  const focusCell = (id: string) => cell(id).dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

  test("§8.63 selectable: x and Ctrl+click toggle, selectionchange fires, aria-multiselectable", () => {
    const el = mount({});
    el.selectable = true;
    const changes: string[][] = [];
    el.addEventListener("selectionchange", (e) => changes.push((e as CustomEvent<string[]>).detail));
    expect(document.querySelector("table")!.getAttribute("aria-multiselectable")).toBe("true");
    focusCell("c1");
    press(cell("c1"), "x");
    expect(cell("c1").hasAttribute("data-selected")).toBe(true);
    cell("c2").dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true }));
    expect(changes.at(-1)).toEqual(["c1", "c2"]);
    expect(el.selected).toEqual(["c1", "c2"]);
  });

  test("§8.64 moving a selected card moves the whole selection and announces once", () => {
    const onMove = vi.fn();
    const el = mount({ onMove, labels: { moveManyAnnouncement: (n, c) => `${n} to ${c}` } });
    el.selectable = true;
    el.selected = ["c1", "c2"];
    focusCell("c1");
    press(cell("c1"), "ArrowRight", { altKey: true });
    expect(onMove.mock.calls.map((c) => [c[0], c[1]])).toEqual([["c1", "doing"], ["c2", "doing"]]);
    expect(document.querySelector(".kanban-board-status")!.textContent).toBe("2 to In Progress");
    expect(el.selected).toEqual([]);
  });

  test("§8.65 undoable: Ctrl+Z moves the card back", async () => {
    const moves: [string, string][] = [];
    const el = mount({});
    el.undoable = true;
    el.onMove = (id, col) => {
      moves.push([id, col]);
      el.cards = el.cards.map((c) => (c.id === id ? { ...c, columnId: col } : c));
    };
    focusCell("c1");
    press(cell("c1"), "ArrowRight", { altKey: true });
    await new Promise((r) => setTimeout(r, 0));
    press(tabbableCells()[0], "z", { ctrlKey: true });
    await new Promise((r) => setTimeout(r, 0));
    expect(moves).toEqual([["c1", "doing"], ["c1", "todo"]]);
  });

  test("§8.66 movableColumns: Alt+Shift+ArrowRight reorders columns", () => {
    const el = mount({});
    el.movableColumns = true;
    const orders: string[][] = [];
    el.addEventListener("columnorderchange", (e) => orders.push((e as CustomEvent<string[]>).detail));
    focusCell("c1");
    press(cell("c1"), "ArrowRight", { altKey: true, shiftKey: true });
    expect(orders.at(-1)).toEqual(["doing", "todo", "done"]);
    expect(headers()[0].textContent).toContain("In Progress");
  });

  test("§8.67 lanes: lane header rows, cards grouped by laneId", () => {
    const el = mount({});
    el.lanes = [{ id: "a", title: "Alpha" }, { id: "b", title: "Beta" }];
    el.cards = CARDS.map((x, i) => ({ ...x, laneId: i < 2 ? "a" : "b" }));
    expect(Array.from(document.querySelectorAll(".kanban-board-lane")).map((e) => e.textContent)).toEqual(["Alpha", "Beta"]);
  });

  test("§8.68 dropping into another lane's cell reports the lane id", () => {
    const onMove = vi.fn();
    const el = mount({ onMove, cards: [{ id: "c1", columnId: "todo", title: "One", laneId: "a" }] });
    el.lanes = [{ id: "a", title: "A" }, { id: "b", title: "B" }];
    document.querySelector(".kanban-board-card-title")!.dispatchEvent(new Event("dragstart", { bubbles: true }));
    document.querySelector('[data-row="1"][data-col="1"]')!.dispatchEvent(new Event("drop", { bubbles: true, cancelable: true }));
    expect(onMove).toHaveBeenCalledWith("c1", "doing", undefined, "b");
  });

  test("§8.69 virtualize renders a window with spacers and aria-rowcount", () => {
    const el = mount({ cards: Array.from({ length: 100 }, (_, i) => ({ id: `k${i}`, columnId: "todo", title: `K${i}` })) });
    el.virtualize = { rowHeight: 20, height: 100 };
    expect(document.querySelector(".kanban-board-scroll")).toBeTruthy();
    expect(document.querySelectorAll("[data-card-id]").length).toBeLessThan(20);
    expect(document.querySelector(".kanban-board-spacer")).toBeTruthy();
    expect(document.querySelector("table")!.getAttribute("aria-rowcount")).toBe("101");
  });
});

describe("lily-kanban-board — collapsible lanes (§8.91–§8.94)", () => {
    const laneDefs = [{ id: "ann", title: "Ann" }, { id: "bo", title: "Bo" }];
    const cardsInLanes: KanbanCard[] = [
        { id: "c1", columnId: "todo", title: "One", laneId: "ann" },
        { id: "c2", columnId: "todo", title: "Two", laneId: "bo" },
        { id: "c3", columnId: "doing", title: "Three", laneId: "bo" },
    ];
    const laneColumns: KanbanColumn[] = [{ id: "todo", title: "To do" }, { id: "doing", title: "Doing" }];
    const collapseLane = (lane: { title: string }, collapsed: boolean) => `${collapsed ? "Expand" : "Collapse"} ${lane.title}`;
    function board(extra: Partial<KanbanBoard> = {}): KanbanBoard {
        const el = mount({ columns: laneColumns, cards: cardsInLanes });
        el.lanes = laneDefs;
        Object.assign(el, extra);
        return el;
    }
    const byName = (name: string) => Array.from(document.querySelectorAll("button")).find((b) => b.getAttribute("aria-label") === name) as HTMLButtonElement;

    test("§8.91 labels.collapseLane gates a toggle with aria-expanded; clicking collapses the lane's rows but keeps its header", () => {
        board({ labels: { collapseLane } as KanbanLabels });
        expect(byName("Collapse Bo").getAttribute("aria-expanded")).toBe("true");
        byName("Collapse Bo").click();
        expect(byName("Expand Bo").getAttribute("aria-expanded")).toBe("false");
        expect(document.querySelector('[data-card-id="c2"]')).toBeNull();
        expect(document.querySelector('[data-card-id="c1"]')).not.toBeNull();
        expect(document.querySelectorAll(".kanban-board-lane")).toHaveLength(2);
    });

    test("§8.92 no toggle without labels.collapseLane", () => {
        board();
        expect(document.querySelector(".kanban-board-lane-toggle")).toBeNull();
    });

    test("§8.93 collapsedLanes starts a lane collapsed; labels.laneCount shows its card count; the change is reported", () => {
        const onChange = vi.fn();
        const el = board({ collapsedLanes: ["bo"], onCollapsedLanesChange: onChange, labels: { collapseLane, laneCount: (lane: { title: string }, n: number) => `${n} cards in ${lane.title}` } as KanbanLabels });
        const events: string[][] = [];
        el.addEventListener("lanecollapsechange", (e) => events.push((e as CustomEvent).detail));
        expect(document.querySelector('[data-card-id="c2"]')).toBeNull();
        expect(Array.from(document.querySelectorAll(".kanban-board-lane-count")).map((e) => e.textContent)).toEqual(["1 cards in Ann", "2 cards in Bo"]);
        expect(document.querySelector('[data-lane-id="bo"][data-collapsed]')).not.toBeNull();
        byName("Expand Bo").click();
        expect(onChange).toHaveBeenCalledWith([]);
        expect(events).toEqual([[]]);
        expect(document.querySelector('[data-card-id="c2"]')).not.toBeNull();
    });

    test("§8.94 collapsing every lane leaves a board with only headers (no body rows, no crash)", () => {
        board({ collapsedLanes: ["ann", "bo"] });
        expect(document.querySelectorAll(".kanban-table-body tr:not([data-lane-row])")).toHaveLength(0);
        expect(document.querySelectorAll(".kanban-board-lane")).toHaveLength(2);
    });
});

// ---- A small harness for the ported typed-fields suite: real DOM events on a real element ----
function render(props: Record<string, unknown>): HTMLElement & Record<string, unknown> {
    const el = document.createElement("lily-kanban-board") as HTMLElement & Record<string, unknown>;
    el.setAttribute("label", (props["label"] as string) ?? "Test");
    document.body.appendChild(el);
    for (const [key, value] of Object.entries(props)) {
        if (key === "label") continue;
        el[key] = value;
    }
    return el;
}

function cleanup(): void {
    document.body.replaceChildren();
}

const fireEvent = {
    async click(el: Element) { (el as HTMLElement).click(); await Promise.resolve(); },
    async input(el: Element, init: { target: { value: string } }) { (el as HTMLInputElement).value = init.target.value; el.dispatchEvent(new Event("input", { bubbles: true })); await Promise.resolve(); },
    async change(el: Element, init: { target: { value: string } }) { (el as HTMLInputElement).value = init.target.value; el.dispatchEvent(new Event("change", { bubbles: true })); await Promise.resolve(); },
    async keyDown(el: Element, init: KeyboardEventInit & { keyCode?: number }) { el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init })); await Promise.resolve(); },
    async scroll(el: Element) { el.dispatchEvent(new Event("scroll")); await Promise.resolve(); },
};

async function waitFor(assertion: () => void, timeout = 1000): Promise<void> {
    const deadline = Date.now() + timeout;
    for (;;) {
        try {
            assertion();
            return;
        } catch (error) {
            if (Date.now() > deadline) throw error;
            await new Promise((r) => setTimeout(r, 0));
        }
    }
}

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
        // The catalog renders every card's menu list hidden; an open one would not be `hidden`.
        expect(document.querySelector(".kanban-board-move-list:not([hidden])")).toBeNull();
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
        const onExport = vi.fn((_file: { format: string; filename: string; cardCount: number; blob: Blob }) => false as const);
        render({ ...base, labels: EXPORT_LABELS, onExport, ...props });
        await fireEvent.click(document.querySelector(`[data-kanban-export-format="${format}"]`)!);
        const file = onExport.mock.calls[0][0];
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

    test("§8.108 lanes add a lane column; saving announces unless onExport returns false; empty view disables the buttons", async () => {
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
