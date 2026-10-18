// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { autoInit, initKanbanBoard } from "./kanban-board.client.js";

// ---------------------------------------------------------------------
// Nunjucks env that can resolve both "./kanban-board.njk" (this
// package) and "lily-design-system-nunjucks-headless/components/…"
// (a real npm dependency; the repo root is the second search path so
// the bare specifier resolves the same way it would from an installed
// node_modules — see kanban-board.njk's own header comment and
// picker-bar.test.ts's identical two-search-path setup for its own
// sibling-package imports).
// ---------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, ".."); // every sibling subproject sits here
const env = nunjucks.configure([__dirname, repoRoot], {
  autoescape: true,
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true,
});

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "In Progress", wipLimit: 1 },
  { id: "done", title: "Done" },
];

const CARDS = [
  { id: "c1", columnId: "todo", title: "Card One" },
  { id: "c2", columnId: "todo", title: "Card Two" },
  { id: "c3", columnId: "doing", title: "Card Three" },
  { id: "c4", columnId: "doing", title: "Card Four" },
];

const LABELS = {
  cardCount: "{count} cards",
  overLimit: "Over limit: {count}/{limit}",
  moveButton: "Move {card}",
  moveMenuLabel: "Move to column",
};

function renderMacro(opts: Record<string, unknown>): string {
  const src =
    `{% from "./kanban-board.njk" import kanbanBoard %}` +
    `{{ kanbanBoard(opts) }}`;
  return env.renderString(src, { opts });
}

function renderMacroWithCaller(
  opts: Record<string, unknown>,
  body: string,
): string {
  const src =
    `{% from "./kanban-board.njk" import kanbanBoard %}` +
    `{% call kanbanBoard(opts) %}${body}{% endcall %}`;
  return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body.querySelector(
    "[data-lily-kanban-board-root]",
  ) as HTMLElement;
}

function defaultOpts(overrides: Record<string, unknown> = {}) {
  return {
    label: "Sprint board",
    columns: COLUMNS,
    cards: CARDS,
    ...overrides,
  };
}

function bodyRows(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll(".kanban-table-body > .kanban-table-row"));
}

function tabbableCells(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll('.kanban-table-td[tabindex="0"]'));
}

function setup(
  opts: Record<string, unknown> = {},
  initOpts: Record<string, unknown> = {},
) {
  const root = mountIntoBody(renderMacro(defaultOpts(opts)));
  const controller = initKanbanBoard(root, initOpts);
  return { root, controller };
}

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
  el.dispatchEvent(
    new KeyboardEvent("keydown", { key: k, bubbles: true, ...init }),
  );
}

function click(el: Element) {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

// jsdom does not implement the DragEvent constructor, so a plain Event
// with a `dataTransfer` property attached stands in for one — the
// client only ever reads `event.dataTransfer`, never anything else
// DragEvent-specific.
function dragEvent(type: string, dataTransfer: unknown): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
  return event;
}

function moveButtonFor(root: HTMLElement, cardId: string): HTMLButtonElement {
  return root.querySelector(
    `[data-lily-kanban-board-move-button][data-lily-kanban-board-card-id="${cardId}"]`,
  ) as HTMLButtonElement;
}

function moveListFor(root: HTMLElement, cardId: string): HTMLElement {
  return root.querySelector(
    `[data-lily-kanban-board-move-list][data-lily-kanban-board-card-id="${cardId}"]`,
  ) as HTMLElement;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("KanbanBoard — macro markup (§8.1–§8.4)", () => {
  test("§8.1 renders a kanban-board root wrapping a role=grid labelled by `label`", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    expect(root.tagName).toBe("DIV");
    expect(root.classList.contains("kanban-board")).toBe(true);
    const grid = root.querySelector(".kanban-table") as HTMLElement;
    expect(grid.getAttribute("role")).toBe("grid");
    expect(grid.getAttribute("aria-label")).toBe("Sprint board");
  });

  test("§8.2 renders column titles and, when labels.cardCount is set, a derived count", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ labels: LABELS })));
    const headers = root.querySelectorAll(".kanban-table-th");
    expect(headers[0].textContent).toContain("To Do");
    expect(headers[0].textContent).toContain("2 cards");
    expect(headers[2].textContent).toContain("0 cards");
  });

  test("§8.2 no card count renders when labels.cardCount is absent", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    expect(root.querySelector(".kanban-board-count")).toBeNull();
  });

  test("§8.3 a column over its wipLimit carries data-over-limit and the warning text", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ labels: LABELS })));
    const headers = root.querySelectorAll(".kanban-table-th");
    expect(headers[1].hasAttribute("data-over-limit")).toBe(true);
    expect(headers[1].textContent).toContain("Over limit: 2/1");
    expect(headers[0].hasAttribute("data-over-limit")).toBe(false);
    expect(headers[2].hasAttribute("data-over-limit")).toBe(false);
  });

  test("§8.3 wipLimit of exactly 0 is a real limit, not treated as absent", () => {
    const root = mountIntoBody(
      renderMacro(
        defaultOpts({
          columns: [{ id: "todo", title: "To Do", wipLimit: 0 }],
          cards: [{ id: "c1", columnId: "todo", title: "Card One" }],
          labels: LABELS,
        }),
      ),
    );
    const header = root.querySelector(".kanban-table-th") as HTMLElement;
    expect(header.hasAttribute("data-over-limit")).toBe(true);
  });

  test("§8.4 the body is rectangular: row count equals the largest column's card count", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    expect(bodyRows(root)).toHaveLength(2); // todo and doing both have 2 cards
    const doneCells = bodyRows(root).map(
      (row) => row.querySelectorAll(".kanban-table-td")[2],
    );
    for (const cell of doneCells) {
      expect(cell.textContent?.trim()).toBe("");
      expect(cell.hasAttribute("data-lily-kanban-board-card-id")).toBe(false);
    }
  });
});

describe("KanbanBoard — roving-tabindex keyboard navigation (§8.5, §8.6)", () => {
  test("§8.5 exactly one body cell carries tabindex=0, and arrows move it and clamp", () => {
    const { root } = setup();
    expect(tabbableCells(root)).toHaveLength(1);
    expect(tabbableCells(root)[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("0");

    key(tabbableCells(root)[0], "ArrowRight");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("1");

    // Clamp: ArrowUp past the first row stays on the first row.
    key(tabbableCells(root)[0], "ArrowUp");
    expect(tabbableCells(root)).toHaveLength(1);
    expect(tabbableCells(root)[0].getAttribute("data-row")).toBe("0");
  });

  test("§8.6 Home/End move within the column; Ctrl+Home/Ctrl+End move to the grid's ends", () => {
    const { root } = setup();
    key(tabbableCells(root)[0], "ArrowRight");
    key(tabbableCells(root)[0], "End");
    expect(tabbableCells(root)[0].getAttribute("data-row")).toBe("1");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("1");

    key(tabbableCells(root)[0], "Home", { ctrlKey: true });
    expect(tabbableCells(root)[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("0");

    key(tabbableCells(root)[0], "End", { ctrlKey: true });
    expect(tabbableCells(root)[0].getAttribute("data-row")).toBe("1");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("2");
  });

  test("§8.5 clamp also holds at the grid's right/bottom edges", () => {
    const { root } = setup();
    key(tabbableCells(root)[0], "End", { ctrlKey: true });
    key(tabbableCells(root)[0], "ArrowRight");
    key(tabbableCells(root)[0], "ArrowDown");
    expect(tabbableCells(root)[0].getAttribute("data-row")).toBe("1");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("2");
  });
});

describe("KanbanBoard — move menu (§8.7, §8.8, §8.9)", () => {
  test("§8.7 Enter on a focused card opens its own move menu", () => {
    const { root } = setup({ labels: LABELS });
    key(tabbableCells(root)[0], "Enter");
    const button = moveButtonFor(root, "c1");
    const list = moveListFor(root, "c1");
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(list.hidden).toBe(false);
    expect(list.getAttribute("aria-label")).toBe("Move to column");
    expect(list.querySelectorAll('[role="option"]')).toHaveLength(3);
  });

  test("§8.7 Space also opens the move menu", () => {
    const { root } = setup({ labels: LABELS });
    key(tabbableCells(root)[0], " ");
    expect(moveButtonFor(root, "c1").getAttribute("aria-expanded")).toBe("true");
  });

  test("§8.8 choosing a destination calls onMove, closes the menu, and refocuses the move button", () => {
    const onMove = vi.fn();
    const { root } = setup({ labels: LABELS }, { onMove });
    key(tabbableCells(root)[0], "Enter");
    const list = moveListFor(root, "c1");
    const doneOption = Array.from(
      list.querySelectorAll('[role="option"]'),
    ).find((o) => o.textContent === "Done") as HTMLElement;
    click(doneOption);
    expect(onMove).toHaveBeenCalledWith("c1", "done");
    expect(list.hidden).toBe(true);
    expect(moveButtonFor(root, "c1").getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(moveButtonFor(root, "c1"));
  });

  test("§8.9 Escape closes the move menu without calling onMove", () => {
    const onMove = vi.fn();
    const { root } = setup({ labels: LABELS }, { onMove });
    key(tabbableCells(root)[0], "Enter");
    const list = moveListFor(root, "c1");
    key(list, "Escape");
    expect(onMove).not.toHaveBeenCalled();
    expect(list.hidden).toBe(true);
  });
});

describe("KanbanBoard — shared-ref regression (rigor requirement)", () => {
  // Every other framework catalog's port of this component found the
  // same latent bug in the Svelte canonical: its move-menu binds a
  // single shared button reference across every card, so closing one
  // card's menu can refocus whichever card mounted last, not the card
  // whose own menu closed. This regression test opens and closes TWO
  // different cards' menus in sequence and asserts each one refocuses
  // its OWN button — it would fail immediately against an
  // implementation that tracked "the last opened button" in one
  // shared variable instead of looking it up by card id.
  test("closing card 1's menu refocuses card 1's button; closing card 2's refocuses card 2's", () => {
    const { root } = setup({ labels: LABELS });
    const button1 = moveButtonFor(root, "c1");
    const button3 = moveButtonFor(root, "c3");

    key(tabbableCells(root)[0], "Enter"); // opens card c1's menu
    key(moveListFor(root, "c1"), "Escape");
    expect(document.activeElement).toBe(button1);

    // Move the roving-tabindex cursor to card c3 (row 0, col 1) and
    // open ITS menu.
    key(tabbableCells(root)[0], "ArrowRight");
    key(tabbableCells(root)[0], "Enter"); // opens card c3's menu
    key(moveListFor(root, "c3"), "Escape");
    expect(document.activeElement).toBe(button3);
    expect(document.activeElement).not.toBe(button1);
  });

  test("only one card's menu is open at a time; opening a second closes the first", () => {
    const { root } = setup({ labels: LABELS });
    click(moveButtonFor(root, "c1"));
    expect(moveListFor(root, "c1").hidden).toBe(false);
    click(moveButtonFor(root, "c3"));
    expect(moveListFor(root, "c1").hidden).toBe(true);
    expect(moveListFor(root, "c1").getAttribute("aria-expanded" as never)).toBeNull();
    expect(moveButtonFor(root, "c1").getAttribute("aria-expanded")).toBe("false");
    expect(moveListFor(root, "c3").hidden).toBe(false);
  });
});

describe("KanbanBoard — pointer drag-and-drop (§8.10)", () => {
  test("§8.10 dropping a card on another column's cell calls onMove", () => {
    const onMove = vi.fn();
    const { root } = setup({}, { onMove });
    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
    const cardHandle = root.querySelector(
      '[data-lily-kanban-board-card-handle][data-lily-kanban-board-card-id="c1"]',
    ) as HTMLElement;
    cardHandle.dispatchEvent(dragEvent("dragstart", dataTransfer));

    const doneCell = bodyRows(root)[0].querySelectorAll(".kanban-table-td")[2];
    doneCell.dispatchEvent(dragEvent("drop", dataTransfer));
    expect(onMove).toHaveBeenCalledWith("c1", "done");
  });
});

describe("KanbanBoard — announcements and extra attributes (§8.11, §8.12)", () => {
  test("§8.11 a successful move announces via labels.moveAnnouncement", () => {
    const moveAnnouncement = vi.fn(
      (cardTitle: string, columnTitle: string) => `${cardTitle} moved to ${columnTitle}`,
    );
    const { root } = setup({ labels: LABELS }, { labels: { moveAnnouncement } });
    key(tabbableCells(root)[0], "Enter");
    const list = moveListFor(root, "c1");
    const doneOption = Array.from(
      list.querySelectorAll('[role="option"]'),
    ).find((o) => o.textContent === "Done") as HTMLElement;
    click(doneOption);
    expect(moveAnnouncement).toHaveBeenCalledWith("Card One", "Done");
    expect(root.querySelector(".kanban-board-status")?.textContent).toBe(
      "Card One moved to Done",
    );
  });

  test("§8.11 no announcement fires when moveAnnouncement is absent", () => {
    const { root } = setup({ labels: LABELS });
    key(tabbableCells(root)[0], "Enter");
    key(document.activeElement!, "Enter");
    expect(root.querySelector(".kanban-board-status")?.textContent).toBe("");
  });

  test("§8.12 extra attributes spread onto the root", () => {
    const root = mountIntoBody(
      renderMacro(
        defaultOpts({ attributes: { "data-testid": "board-root" } }),
      ),
    );
    expect(root.getAttribute("data-testid")).toBe("board-root");
  });
});

describe("KanbanBoard — label-presence-gates-control / no hardcoded strings (§8.13)", () => {
  test("§8.13 moveMenuLabel absent names the menu by its card, not a baked-in string", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    const list = moveListFor(root, "c1");
    expect(list.getAttribute("aria-label")).toBe("Card One");
  });

  test("§8.13 without labels.moveButton no unnamed move button renders", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    expect(root.querySelector(".kanban-board-move-button")).toBeNull();
  });

  test("§8.13 moveButton template substitutes the card's title via {card}", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ labels: LABELS })));
    expect(moveButtonFor(root, "c1").getAttribute("aria-label")).toBe("Move Card One");
    expect(moveButtonFor(root, "c3").getAttribute("aria-label")).toBe("Move Card Three");
  });

  test("§8.13 a custom {% call %} glyph replaces the default glyph on every move button", () => {
    const html = renderMacroWithCaller(defaultOpts({ labels: LABELS }), `<span class="my-glyph">M</span>`);
    const root = mountIntoBody(html);
    const buttons = root.querySelectorAll(".kanban-board-move-button");
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((button) => {
      expect(button.querySelector(".my-glyph")).not.toBeNull();
    });
  });
});

describe("KanbanBoard — autoInit and destroy", () => {
  test("autoInit wires every root on the page", () => {
    const html1 = renderMacro(defaultOpts({ name: "a" }));
    const html2 = renderMacro(
      defaultOpts({
        name: "b",
        columns: [{ id: "x", title: "X" }],
        cards: [{ id: "z1", columnId: "x", title: "Z" }],
      }),
    );
    document.body.innerHTML = html1 + html2;
    const controllers = autoInit();
    expect(controllers).toHaveLength(2);
  });

  test("destroy() detaches the listeners", () => {
    const { root, controller } = setup({ labels: LABELS });
    controller.destroy();
    key(tabbableCells(root)[0], "Enter");
    expect(moveButtonFor(root, "c1").getAttribute("aria-expanded")).toBe("false");
  });
});

describe("KanbanBoard — focus and move edge cases", () => {
  function option(list: HTMLElement, name: string): HTMLElement {
    return Array.from(list.querySelectorAll<HTMLElement>('[role="option"]')).find(
      (el) => el.textContent?.trim() === name,
    )!;
  }

  test("§8.14 keys pressed in the open move menu do not move the grid cursor or focus", () => {
    const { root } = setup({ labels: LABELS });
    key(tabbableCells(root)[0], "Enter");
    const list = moveListFor(root, "c1");
    expect(document.activeElement).toBe(list);
    key(list, "ArrowDown");
    key(list, "ArrowRight");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("0");
    expect(document.activeElement).toBe(list);
  });

  test("§8.14 choosing a destination in the menu does not reopen it", () => {
    const { root } = setup({ labels: LABELS });
    key(tabbableCells(root)[0], "Enter");
    const list = moveListFor(root, "c1");
    key(list, "ArrowDown");
    key(list, "Enter");
    expect(list.hidden).toBe(true);
  });

  test("§8.15 choosing the card's own column, or dropping it there, is not a move", () => {
    const onMove = vi.fn();
    const { root } = setup({ labels: LABELS }, { onMove });
    key(tabbableCells(root)[0], "Enter");
    click(option(moveListFor(root, "c1"), "To Do"));
    expect(moveListFor(root, "c1").hidden).toBe(true);

    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
    const handle = root.querySelector('[data-lily-kanban-board-card-handle][data-lily-kanban-board-card-id="c1"]')!;
    handle.dispatchEvent(dragEvent("dragstart", dataTransfer));
    bodyRows(root)[1].querySelectorAll(".kanban-table-td")[0].dispatchEvent(dragEvent("drop", dataTransfer));
    expect(onMove).not.toHaveBeenCalled();
  });

  test("§8.16 focusing a cell by pointer moves the cursor there", () => {
    const { root } = setup();
    const cell = bodyRows(root)[1].querySelectorAll<HTMLElement>(".kanban-table-td")[1];
    cell.focus();
    expect(tabbableCells(root)).toEqual([cell]);
    key(cell, "ArrowUp");
    expect(tabbableCells(root)[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells(root)[0].getAttribute("data-col")).toBe("1");
  });

  test("§8.13 without labels.moveButton the cell opens the menu and Escape refocuses the cell", () => {
    const { root } = setup();
    const cell = tabbableCells(root)[0];
    key(cell, "Enter");
    const list = moveListFor(root, "c1");
    expect(list.hidden).toBe(false);
    key(list, "Escape");
    expect(document.activeElement).toBe(cell);
  });

  test("§8.3 a column exactly at its wipLimit is not over it", () => {
    const root = mountIntoBody(
      renderMacro(defaultOpts({ cards: CARDS.filter((c) => c.id !== "c4"), labels: LABELS })),
    );
    const headers = root.querySelectorAll("[data-lily-kanban-board-column-id]");
    expect(headers[1].hasAttribute("data-over-limit")).toBe(false);
  });
});

describe("KanbanBoard — reorder, veto and read-only (§8.17–§8.21)", () => {
  const key = (el: Element, k: string, opts: KeyboardEventInit = {}) =>
    el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...opts }));
  const tabbable = () => document.querySelector<HTMLElement>('.kanban-table-td[tabindex="0"]')!;
  const status = () => document.querySelector("[data-lily-kanban-board-status]")?.textContent;

  test("§8.17 Alt+ArrowDown calls onReorder and announces it", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ labels: LABELS })));
    const onReorder = vi.fn();
    initKanbanBoard(root, {
      onReorder,
      labels: { reorderAnnouncement: (t: string, p: number, n: number) => `${t} is ${p} of ${n}` },
    });
    key(tabbable(), "ArrowDown", { altKey: true });
    expect(onReorder).toHaveBeenCalledWith("c1", 1);
    expect(status()).toBe("Card One is 2 of 2");
  });

  test("§8.18 Alt+Arrow at the column edge does not call onReorder", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    const onReorder = vi.fn();
    initKanbanBoard(root, { onReorder });
    key(tabbable(), "ArrowUp", { altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
  });

  test("§8.19 canMove refuses a move: no onMove, an announcement, aria-disabled option", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ labels: LABELS })));
    const onMove = vi.fn();
    initKanbanBoard(root, {
      onMove,
      canMove: (_cardId: string, toColumnId: string) => toColumnId !== "done",
      labels: { moveBlocked: (t: string, c: string) => `${t} cannot go to ${c}` },
    });
    key(tabbable(), "Enter");
    const list = document.querySelector<HTMLElement>('[data-lily-kanban-board-move-list]:not([hidden])')!;
    const option = Array.from(list.querySelectorAll<HTMLElement>('[role="option"]')).find(
      (o) => o.textContent === "Done",
    )!;
    expect(option.getAttribute("aria-disabled")).toBe("true");
    option.click();
    expect(onMove).not.toHaveBeenCalled();
    expect(status()).toBe("Card One cannot go to Done");
  });

  test("§8.20 readonly: no move button, no menu, no drag, no reorder", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ labels: LABELS, readonly: true })));
    const onReorder = vi.fn();
    initKanbanBoard(root, { onReorder });
    expect(document.querySelector(".kanban-board-move-button")).toBeNull();
    expect(document.querySelector(".kanban-board-move-list")).toBeNull();
    key(tabbable(), "Enter");
    key(tabbable(), "ArrowDown", { altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
    expect(document.querySelector("[draggable='true']")).toBeNull();
    expect(root.hasAttribute("data-readonly")).toBe(true);
  });

  test("§8.21 readonly keeps arrow-key navigation", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ readonly: true })));
    initKanbanBoard(root, {});
    key(tabbable(), "ArrowRight");
    expect(tabbable().getAttribute("data-col")).toBe("1");
  });
});

describe("kanban-board — collapse, add card, hard limits (§8.22–§8.30)", () => {
  const collapseLabels = {
    ...LABELS,
    collapseColumn: "Collapse {column}",
    expandColumn: "Expand {column}",
  };
  const named = (name: string) =>
    Array.from(document.querySelectorAll("button")).find((b) => b.getAttribute("aria-label") === name) as HTMLElement;
  const text = () => document.body.textContent ?? "";
  const headers = () => Array.from(document.querySelectorAll("th[data-lily-kanban-board-column-id]")) as HTMLElement[];
  const stat = () => document.querySelector("[data-lily-kanban-board-status]")?.textContent;
  const option = (root: HTMLElement, title: string) => {
    key(tabbableCells(root)[0], "Enter");
    return Array.from(root.querySelectorAll(".kanban-board-move-option")).find(
      (o) => o.textContent === title && !o.closest("[hidden]"),
    ) as HTMLElement;
  };

  test("§8.22 no collapse toggle without labels.collapseColumn", () => {
    setup();
    expect(document.querySelector(".kanban-board-collapse-button")).toBeNull();
  });

  test("§8.23 the toggle collapses a column: aria-expanded flips, cards leave the DOM, the count remains, expand restores", () => {
    const onCollapsedChange = vi.fn();
    setup({ labels: collapseLabels }, { onCollapsedChange });
    expect(named("Collapse To Do").getAttribute("aria-expanded")).toBe("true");
    expect(text()).toContain("Card One");
    click(named("Collapse To Do"));
    expect(named("Collapse To Do").getAttribute("aria-expanded")).toBe("false");
    expect(text()).not.toContain("Card One");
    expect(headers()[0].textContent).toContain("2 cards");
    expect(headers()[0].hasAttribute("data-collapsed")).toBe(true);
    expect(onCollapsedChange).toHaveBeenCalledWith(["todo"]);
    click(named("Collapse To Do"));
    expect(text()).toContain("Card One");
    expect(headers()[0].hasAttribute("data-collapsed")).toBe(false);
  });

  test("§8.24 collapsedColumns starts a column collapsed at SSR and the client keeps its cards out", () => {
    const { root } = setup({ labels: collapseLabels, collapsedColumns: ["todo"] });
    expect(headers()[0].hasAttribute("data-collapsed")).toBe(true);
    expect(text()).not.toContain("Card One");
    const cells = Array.from(root.querySelectorAll<HTMLElement>(".kanban-table-td")).filter((c) => c.dataset.col === "0");
    expect(cells.every((c) => c.hasAttribute("data-collapsed"))).toBe(true);
  });

  test("§8.25 the board's height ignores collapsed columns", () => {
    const { root } = setup({ labels: collapseLabels, collapsedColumns: ["todo", "doing"] });
    expect(bodyRows(root).filter((r) => !r.hidden)).toHaveLength(0);
  });

  test("§8.26 labels.addCard renders an add button per column that calls onAddCard and fires addcard", () => {
    const onAddCard = vi.fn();
    const { root } = setup({ labels: { addCard: "Add to {column}" } }, { onAddCard });
    const events: string[] = [];
    root.addEventListener("addcard", (e) => events.push((e as CustomEvent<string>).detail));
    click(named("Add to In Progress"));
    expect(onAddCard).toHaveBeenCalledWith("doing");
    expect(events).toEqual(["doing"]);
  });

  test("§8.27 no add button without labels.addCard, and none when readonly", () => {
    setup();
    expect(document.querySelector(".kanban-board-add-button")).toBeNull();
    document.body.innerHTML = "";
    setup({ readonly: true, labels: { addCard: "Add to {column}" } });
    expect(document.querySelector(".kanban-board-add-button")).toBeNull();
  });

  test("§8.28 strictLimit refuses a move into a full column, announces it, marks the option aria-disabled", () => {
    const onMove = vi.fn();
    const { root } = setup(
      { columns: [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true }] },
      { onMove, labels: { moveBlocked: (t: string, c: string) => `${t} cannot go to ${c}` } },
    );
    const o = option(root, "In Progress");
    expect(o.getAttribute("aria-disabled")).toBe("true");
    click(o);
    expect(onMove).not.toHaveBeenCalled();
    expect(stat()).toBe("Card One cannot go to In Progress");
  });

  test("§8.29 strictLimit allows a move while the column is under its limit", () => {
    const onMove = vi.fn();
    const { root } = setup(
      { columns: [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 3, strictLimit: true }] },
      { onMove },
    );
    click(option(root, "In Progress"));
    expect(onMove).toHaveBeenCalledWith("c1", "doing");
  });

  test("§8.30 without strictLimit a full column still accepts moves", () => {
    const onMove = vi.fn();
    const { root } = setup({}, { onMove });
    click(option(root, "In Progress"));
    expect(onMove).toHaveBeenCalledWith("c1", "doing");
  });
});

describe("kanban-board — round 3 and consumer capabilities (§8.31–§8.62)", () => {
  const rich = [
    { id: "c1", columnId: "todo", title: "Card One", subtitle: "Source · 80", badges: ["P1", "VIP"], flag: "SLA breached", href: "/t/1" },
    { id: "c2", columnId: "todo", title: "Card Two" },
    { id: "c3", columnId: "doing", title: "Card Three" },
  ];
  const cols = [
    { id: "todo", title: "To Do", flag: "Over capacity", accent: "red", headerHtml: "<i data-header>x</i>", footerHtml: "<i data-footer>sum</i>" },
    { id: "doing", title: "In Progress" },
    { id: "done", title: "Done" },
  ];
  const cell = (id: string) => document.querySelector<HTMLElement>(`[data-lily-kanban-board-card-id].kanban-table-td[data-lily-kanban-board-card-id="${id}"]`)!;
  const cellAt = (row: number, col: number) => document.querySelector<HTMLElement>(`.kanban-table-td[data-row="${row}"][data-col="${col}"]`)!;
  const heads = () => Array.from(document.querySelectorAll<HTMLElement>("th[data-lily-kanban-board-column-id]"));
  const stat = () => document.querySelector("[data-lily-kanban-board-status]")!.textContent;
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
  const menuOption = (root: HTMLElement, title: string) =>
    Array.from(root.querySelectorAll<HTMLElement>(".kanban-board-move-option")).find((o) => o.textContent === title && !o.closest("[hidden]"))!;

  test("§8.34–§8.38 drop on a card passes its position; on an empty cell appends; in its own column reorders; data-drop-target", () => {
    const onMove = vi.fn();
    const onReorder = vi.fn();
    setup({ cards: rich, columns: cols }, { onMove, onReorder });
    const d = { setData: () => {}, getData: () => "" };
    cellAt(0, 0).querySelector(".kanban-board-card-title")!.dispatchEvent(dragEvent("dragstart", d));
    cellAt(0, 1).dispatchEvent(dragEvent("dragover", d));
    expect(cellAt(0, 1).hasAttribute("data-drop-target")).toBe(true);
    cellAt(0, 1).dispatchEvent(dragEvent("drop", d));
    drag(cellAt(0, 0), cellAt(0, 2));
    drag(cellAt(0, 0), cellAt(1, 0));
    expect(onMove.mock.calls).toEqual([["c1", "doing", 0], ["c1", "done"]]);
    expect(onReorder).toHaveBeenCalledWith("c1", 1);
  });

  test("§8.39–§8.41 a locked card has data-locked, no move button, no drag, ignores Enter and Alt+Arrow; others still move", () => {
    const onMove = vi.fn();
    const onReorder = vi.fn();
    const { root } = setup({ cards: rich.map((c) => (c.id === "c1" ? { ...c, locked: true } : c)), columns: cols, labels: LABELS }, { onMove, onReorder });
    expect(cell("c1").hasAttribute("data-locked")).toBe(true);
    expect(cell("c1").querySelector(".kanban-board-move-button")).toBeNull();
    expect(cell("c1").querySelector("[draggable]")).toBeNull();
    key(cell("c1"), "Enter");
    expect(root.querySelector('[role="listbox"]:not([hidden])')).toBeNull();
    key(cell("c1"), "ArrowDown", { altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
    focusIn(cell("c2"));
    key(cell("c2"), "Enter");
    click(menuOption(root, "Done"));
    expect(onMove).toHaveBeenCalledWith("c2", "done");
  });

  test("§8.44–§8.46 Alt+ArrowRight moves to the next column, not past the first; a full hard-limited column refuses and announces", () => {
    const onMove = vi.fn();
    setup({ cards: rich, columns: cols }, { onMove });
    key(cellAt(0, 0), "ArrowLeft", { altKey: true });
    expect(onMove).not.toHaveBeenCalled();
    key(cellAt(0, 0), "ArrowRight", { altKey: true });
    expect(onMove).toHaveBeenCalledWith("c1", "doing");
    document.body.innerHTML = "";
    const refused = vi.fn();
    setup(
      { cards: CARDS, columns: [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true }] },
      { onMove: refused, labels: { moveBlocked: (t: string, c: string) => `${t} cannot go to ${c}` } },
    );
    key(cellAt(0, 0), "ArrowRight", { altKey: true });
    expect(refused).not.toHaveBeenCalled();
    expect(stat()).toBe("Card One cannot go to In Progress");
  });

  test("§8.47–§8.51 cards: attrs, subtitle, badges, link title, flag with aria-describedby; columns: flag, accent, headerHtml", () => {
    setup({ cards: rich.map((c) => (c.id === "c2" ? { ...c, attrs: { "data-priority": "low" } } : c)), columns: cols });
    expect(cell("c2").getAttribute("data-priority")).toBe("low");
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
    expect(heads()[0].querySelector("[data-header]")).toBeTruthy();
    expect(cell("c1").getAttribute("data-accent")).toBe("red");
  });

  test("§8.59 column footerHtml renders a footer cell per column", () => {
    setup({ cards: rich, columns: cols });
    expect(document.querySelectorAll("tfoot td")).toHaveLength(3);
    expect(document.querySelector("tfoot [data-footer]")!.textContent).toBe("sum");
  });

  test("§8.52–§8.53 card.allowedColumns limits the move menu; a keyboard move elsewhere is refused and announced", () => {
    const withAllowed = rich.map((c) => (c.id === "c1" ? { ...c, allowedColumns: ["doing"] } : c));
    const { root } = setup({ cards: withAllowed, columns: cols, labels: LABELS });
    key(cell("c1"), "Enter");
    expect(Array.from(root.querySelectorAll<HTMLElement>(".kanban-board-move-list:not([hidden]) [role=option]")).map((o) => o.textContent)).toEqual(["To Do", "In Progress"]);
    document.body.innerHTML = "";
    const onMove = vi.fn();
    setup({ cards: rich.map((c) => ({ ...c, allowedColumns: ["done"] })), columns: cols }, { onMove, labels: { moveBlocked: (t: string, c: string) => `${t} cannot go to ${c}` } });
    key(cellAt(0, 0), "ArrowRight", { altKey: true });
    expect(onMove).not.toHaveBeenCalled();
    expect(stat()).toBe("Card One cannot go to In Progress");
  });

  test("§8.54 card.draggable=false stops pointer dragging but keeps the move menu", () => {
    setup({ cards: rich.map((c) => (c.id === "c2" ? { ...c, draggable: false } : c)), columns: cols, labels: LABELS });
    expect(cell("c2").querySelector("[draggable]")).toBeNull();
    expect(cell("c2").querySelector(".kanban-board-move-button")).toBeTruthy();
  });

  test("§8.55 an async moveHandler marks the card cell data-pending and aria-busy, then clears on resolve", async () => {
    const d = deferred();
    setup({ cards: rich, columns: cols }, { moveHandler: () => d.promise, labels: { movePending: (t: string, c: string) => `Moving ${t} to ${c}`, moveAnnouncement: (t: string, c: string) => `${t} moved to ${c}` } });
    focusIn(cell("c2"));
    key(cell("c2"), "ArrowRight", { altKey: true });
    expect(cell("c2").getAttribute("data-pending")).toBe("");
    expect(cell("c2").getAttribute("aria-busy")).toBe("true");
    expect(stat()).toBe("Moving Card Two to In Progress");
    d.resolve();
    await flush();
    expect(cell("c2").hasAttribute("data-pending")).toBe(false);
    expect(stat()).toBe("Card Two moved to In Progress");
  });

  test("§8.56 a rejected moveHandler announces moveFailed and calls onMoveError; §8.57 a pending card cannot move again", async () => {
    const d = deferred();
    const handler = vi.fn(() => d.promise);
    const onMoveError = vi.fn();
    setup({ cards: rich, columns: cols }, { moveHandler: handler, onMoveError, labels: { moveFailed: (t: string, c: string) => `Could not move ${t} to ${c}` } });
    focusIn(cell("c2"));
    key(cell("c2"), "ArrowRight", { altKey: true });
    key(cell("c2"), "ArrowRight", { altKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
    d.reject(new Error("no"));
    await flush();
    expect(onMoveError).toHaveBeenCalledWith("c2", "doing", expect.any(Error));
    expect(stat()).toBe("Could not move Card Two to In Progress");
    expect(cell("c2").hasAttribute("data-pending")).toBe(false);
  });

  test("§8.58 without a moveHandler there is no pending state", () => {
    const onMove = vi.fn();
    setup({ cards: rich, columns: cols }, { onMove });
    focusIn(cell("c2"));
    key(cell("c2"), "ArrowRight", { altKey: true });
    expect(onMove).toHaveBeenCalledWith("c2", "doing");
    expect(document.querySelector("[data-pending]")).toBeNull();
  });

  test("§8.60–§8.61 labels.emptyColumn shows a message in an empty column, even when no column has cards; none without it", () => {
    const lab = { emptyColumn: "No cards in {column}" };
    setup({ cards: rich, columns: cols, labels: lab });
    expect(document.querySelector(".kanban-board-empty")!.textContent).toBe("No cards in Done");
    document.body.innerHTML = "";
    setup({ cards: [], columns: cols, labels: lab });
    expect(document.querySelectorAll(".kanban-board-empty")).toHaveLength(3);
    expect(document.querySelectorAll(".kanban-table-body > .kanban-table-row")).toHaveLength(1);
    document.body.innerHTML = "";
    setup({ cards: rich, columns: cols });
    expect(document.querySelector(".kanban-board-empty")).toBeNull();
  });

  test("§8.62 labels.search adds a search field that filters by title, subtitle and badges", () => {
    setup({ cards: rich, columns: cols, labels: { search: "Search cards" } });
    const input = document.querySelector<HTMLInputElement>('input[type="search"]')!;
    expect(input.getAttribute("aria-label")).toBe("Search cards");
    input.value = "vip";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(Array.from(document.querySelectorAll(".kanban-board-card-title")).map((e) => e.textContent?.trim())).toEqual(["Card One"]);
    expect(heads()[0].getAttribute("data-hidden-count")).toBe("1");
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(document.querySelectorAll(".kanban-board-card-title")).toHaveLength(3);
    expect(heads()[0].hasAttribute("data-hidden-count")).toBe(false);
  });
});

describe("KanbanBoard — 0.4.0 (§8.63–§8.83)", () => {
  const cell = (id: string) => document.querySelector<HTMLElement>(`.kanban-table-td[data-lily-kanban-board-card-id="${id}"]`)!;

  test("§8.63 selectable: x and Ctrl+click toggle, selectionchange fires, aria-multiselectable", () => {
    const onSelectionChange = vi.fn();
    const { root, controller } = setup({ selectable: true }, { onSelectionChange });
    const events: string[][] = [];
    root.addEventListener("selectionchange", (e) => events.push((e as CustomEvent<string[]>).detail));
    expect(root.querySelector("table")!.getAttribute("aria-multiselectable")).toBe("true");
    key(cell("c1"), "x");
    expect(cell("c1").hasAttribute("data-selected")).toBe(true);
    cell("c2").dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["c1", "c2"]);
    expect(events.at(-1)).toEqual(["c1", "c2"]);
    expect(controller.selected()).toEqual(["c1", "c2"]);
  });

  test("§8.64 moving a selected card moves the whole selection and announces once", () => {
    const onMove = vi.fn();
    const { root } = setup(
      { selectable: true, selected: ["c1", "c2"] },
      { onMove, labels: { moveManyAnnouncement: (n: number, c: string) => `${n} to ${c}` } },
    );
    key(cell("c1"), "ArrowRight", { altKey: true });
    expect(onMove.mock.calls.map((c) => [c[0], c[1]])).toEqual([["c1", "doing"], ["c2", "doing"]]);
    expect(root.querySelector(".kanban-board-status")!.textContent).toBe("2 to In Progress");
    expect(root.querySelector("[data-selected]")).toBeNull();
  });

  test("§8.65 undoable: Ctrl+Z calls onMove back with the original column", async () => {
    const onMove = vi.fn();
    const { root } = setup({ undoable: true, labels: { undo: "Undo" } }, { onMove });
    const button = root.querySelector<HTMLButtonElement>("[data-lily-kanban-board-undo]")!;
    expect(button.disabled).toBe(true);
    key(cell("c1"), "ArrowRight", { altKey: true });
    await new Promise((r) => setTimeout(r, 0));
    expect(button.disabled).toBe(false);
    key(cell("c1"), "z", { ctrlKey: true });
    await new Promise((r) => setTimeout(r, 0));
    expect(onMove.mock.calls.map((c) => [c[0], c[1]])).toEqual([["c1", "doing"], ["c1", "todo"]]);
    expect(button.disabled).toBe(true);
  });

  test("§8.66 movableColumns: Alt+Shift+ArrowRight reorders the columns in place", () => {
    const onColumnOrderChange = vi.fn();
    const { root, controller } = setup({ movableColumns: true }, { onColumnOrderChange });
    key(cell("c1"), "ArrowRight", { altKey: true, shiftKey: true });
    expect(onColumnOrderChange).toHaveBeenCalledWith(["doing", "todo", "done"]);
    expect(controller.columnOrder()).toEqual(["doing", "todo", "done"]);
    expect(cell("c1").getAttribute("data-col")).toBe("1");
    expect(root.querySelector(".kanban-table-th")!.textContent).toContain("In Progress");
  });

  test("§8.66b the macro's columnOrder is the starting order", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ columnOrder: ["done", "todo"] })));
    expect(Array.from(root.querySelectorAll(".kanban-table-th")).map((th) => th.getAttribute("data-lily-kanban-board-column-id"))).toEqual(["done", "todo", "doing"]);
  });

  test("§8.67 lanes: lane header rows, cards grouped by laneId", () => {
    const root = mountIntoBody(
      renderMacro(
        defaultOpts({
          cards: CARDS.map((x, i) => ({ ...x, laneId: i < 2 ? "a" : "b" })),
          lanes: [{ id: "a", title: "Alpha" }, { id: "b", title: "Beta" }],
        }),
      ),
    );
    expect(Array.from(root.querySelectorAll(".kanban-board-lane")).map((e) => e.textContent)).toEqual(["Alpha", "Beta"]);
  });

  test("§8.68 dropping into another lane's cell reports the lane id", () => {
    const onMove = vi.fn();
    const root = mountIntoBody(
      renderMacro(defaultOpts({ cards: [{ id: "c1", columnId: "todo", title: "One", laneId: "a" }], lanes: [{ id: "a", title: "A" }, { id: "b", title: "B" }] })),
    );
    initKanbanBoard(root, { onMove });
    const dt = { setData: vi.fn(), getData: () => "c1" };
    root.querySelector("[data-lily-kanban-board-card-handle]")!.dispatchEvent(dragEvent("dragstart", dt));
    root.querySelector('[data-row="1"][data-col="1"]')!.dispatchEvent(dragEvent("drop", dt));
    expect(onMove).toHaveBeenCalledWith("c1", "doing", undefined, "b");
  });

  test("§8.69 virtualize keeps only the rows in view, with spacers and aria-rowcount", () => {
    const many = Array.from({ length: 100 }, (_, i) => ({ id: `k${i}`, columnId: "todo", title: `K${i}` }));
    const root = mountIntoBody(renderMacro(defaultOpts({ cards: many, virtualize: { rowHeight: 20, height: 100 } })));
    expect(root.querySelector("table")!.getAttribute("aria-rowcount")).toBe("101");
    expect(root.querySelectorAll("[data-lily-kanban-board-card-id]").length).toBeGreaterThan(50); // SSR renders every row
    initKanbanBoard(root, {});
    expect(root.querySelector(".kanban-board-scroll")).toBeTruthy();
    expect(root.querySelectorAll(".kanban-table-td[data-lily-kanban-board-card-id]").length).toBeLessThan(20);
    expect(root.querySelector(".kanban-board-spacer")).toBeTruthy();
  });
});

describe("kanban-board — collapsible lanes (§8.91–§8.94)", () => {
  const laneDefs = [{ id: "ann", title: "Ann" }, { id: "bo", title: "Bo" }];
  const laneColumns = [{ id: "todo", title: "To do" }, { id: "doing", title: "Doing" }];
  const cardsInLanes = [
    { id: "c1", columnId: "todo", title: "One", laneId: "ann" },
    { id: "c2", columnId: "todo", title: "Two", laneId: "bo" },
    { id: "c3", columnId: "doing", title: "Three", laneId: "bo" },
  ];
  const laneLabels = { collapseLane: "Collapse {lane}", expandLane: "Expand {lane}", laneCount: "{count} cards in {lane}" };
  const lanesBoard = (opts: Record<string, unknown> = {}, init: Record<string, unknown> = {}) =>
    setup({ columns: laneColumns, cards: cardsInLanes, lanes: laneDefs, ...opts }, init);
  const named = (name: string) => Array.from(document.querySelectorAll("button")).find((b) => b.getAttribute("aria-label") === name) as HTMLButtonElement;
  const visibleCard = (id: string) => {
    const td = document.querySelector(`[data-lily-kanban-board-card-id="${id}"]`);
    return !!td && !td.closest("tr")!.hidden;
  };

  test("§8.91 labels.collapseLane gates a toggle with aria-expanded; clicking hides the lane's rows but keeps its header", () => {
    lanesBoard({ labels: laneLabels });
    expect(named("Collapse Bo").getAttribute("aria-expanded")).toBe("true");
    named("Collapse Bo").click();
    expect(named("Expand Bo").getAttribute("aria-expanded")).toBe("false");
    expect(visibleCard("c2")).toBe(false);
    expect(visibleCard("c1")).toBe(true);
    expect(document.querySelectorAll(".kanban-board-lane")).toHaveLength(2);
  });

  test("§8.92 no toggle without labels.collapseLane / expandLane", () => {
    lanesBoard();
    expect(document.querySelector(".kanban-board-lane-toggle")).toBeNull();
  });

  test("§8.93 collapsedLanes starts a lane collapsed; labels.laneCount shows its count; the change is reported", () => {
    const onLaneCollapseChange = vi.fn();
    const { root, controller } = lanesBoard({ collapsedLanes: ["bo"], labels: laneLabels }, { onLaneCollapseChange });
    const events: string[][] = [];
    root.addEventListener("lanecollapsechange", (e) => events.push((e as CustomEvent).detail));
    expect(visibleCard("c2")).toBe(false);
    expect(Array.from(document.querySelectorAll(".kanban-board-lane-count")).map((e) => e.textContent)).toEqual(["1 cards in Ann", "2 cards in Bo"]);
    expect(document.querySelector('[data-lane-id="bo"][data-collapsed]')).not.toBeNull();
    expect(controller.collapsedLanes()).toEqual(["bo"]);
    named("Expand Bo").click();
    expect(onLaneCollapseChange).toHaveBeenCalledWith([]);
    expect(events).toEqual([[]]);
    expect(visibleCard("c2")).toBe(true);
  });

  test("§8.94 collapsing every lane leaves a board with only headers, no crash", () => {
    lanesBoard({ collapsedLanes: ["ann", "bo"] });
    expect(Array.from(document.querySelectorAll(".kanban-table-body tr[data-lane-row]:not([data-lily-kanban-board-lane-row])")).every((tr) => (tr as HTMLElement).hidden)).toBe(true);
    expect(document.querySelectorAll(".kanban-board-lane")).toHaveLength(2);
  });

  test("§8.95 the roving tab stop is never in a hidden row, and ArrowDown steps over a collapsed lane", () => {
    const { root } = lanesBoard({
      collapsedLanes: ["bo"],
      columns: [{ id: "todo", title: "To do" }],
      cards: [
        { id: "a1", columnId: "todo", title: "A1", laneId: "ann" },
        { id: "b1", columnId: "todo", title: "B1", laneId: "bo" },
        { id: "c1", columnId: "todo", title: "C1", laneId: "cy" },
      ],
      lanes: [{ id: "ann", title: "Ann" }, { id: "bo", title: "Bo" }, { id: "cy", title: "Cy" }],
    });
    const stop = root.querySelector('.kanban-table-td[tabindex="0"]') as HTMLElement;
    expect(stop.closest("tr")!.hidden).toBe(false);
    stop.focus();
    key(stop, "ArrowDown");
    const next = root.querySelector('.kanban-table-td[tabindex="0"]') as HTMLElement;
    expect(next.getAttribute("data-lily-kanban-board-card-id")).toBe("c1");
  });
});

// ---- A small harness for the ported typed-fields suite: the macro renders, the client runs, real DOM events ----
function render(props: Record<string, unknown>): { root: HTMLElement; controller: ReturnType<typeof initKanbanBoard> } {
  const { onFieldEdit, onExport, fieldHooks, ...rest } = props as Record<string, unknown> & { labels?: Record<string, unknown> };
  const macro: Record<string, unknown> = { ...rest };
  if (onFieldEdit) macro["editableFields"] = true;
  // The search field renders only when `labels.search` names it.
  if (macro["search"] !== undefined) macro["labels"] = { search: "Search", ...((macro["labels"] as object) ?? {}) };
  const html = renderMacro(macro);
  const root = mountIntoBody(html);
  const controller = initKanbanBoard(root, { onFieldEdit, onExport, fieldHooks } as never);
  return { root, controller };
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
        exportAnnouncement: "{count} cards as {format}: {filename}",
        editAnnouncement: "{card} {field} is {value}",
        editInvalid: "{card}: bad {field}",
    };
    const base = { label: "B", columns: COLUMNS, cards: FCARDS, fields: FIELDS };
    const cellOf = (id: string) => document.querySelector<HTMLElement>(`[data-lily-kanban-board-card-id="${id}"]`)!;

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
        render({ ...base, fields: [{ id: "p", header: "P", type: "number" }], fieldHooks: { p: { parse: () => Number.NaN } }, cards: [{ id: "c1", columnId: "todo", title: "One", values: { p: 1 } }], onFieldEdit, labels: EXPORT_LABELS });
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
        // The macro renders every card's menu list hidden; an open one would not be `hidden`.
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

describe("kanban-board — swimlane move rules, visible search label and field layout (ported from Svelte)", () => {
  const lanes = [{ id: "a", title: "A" }, { id: "b", title: "B" }];
  const laneCards = [{ id: "c1", columnId: "todo", title: "One", laneId: "a" }];
  const board = (opts: Record<string, unknown>, init: Record<string, unknown> = {}) => {
    const root = mountIntoBody(renderMacro(defaultOpts({ cards: laneCards, lanes, ...opts })));
    initKanbanBoard(root, init);
    return root;
  };
  const startDrag = (root: HTMLElement) => {
    const dt = { setData: vi.fn(), getData: () => "c1", dropEffect: "" };
    root.querySelector("[data-lily-kanban-board-card-handle]")!.dispatchEvent(dragEvent("dragstart", dt));
    return dt;
  };
  const cellAt = (root: HTMLElement, row: number, col: number) => root.querySelector(`[data-row="${row}"][data-col="${col}"]`)!;

  test("canMove receives the lane id the card would land in", () => {
    const onMove = vi.fn();
    const canMove = vi.fn(() => true);
    const root = board({}, { onMove, canMove });
    cellAt(root, 1, 1).dispatchEvent(dragEvent("drop", startDrag(root)));
    expect(canMove).toHaveBeenLastCalledWith("c1", "doing", "b");
    expect(onMove).toHaveBeenCalledWith("c1", "doing", undefined, "b");
  });

  test("canMove can veto by lane: a card may not enter one owner's lane", () => {
    const onMove = vi.fn();
    const root = board({}, { onMove, canMove: (_id: string, _col: string, lane?: string) => lane !== "b" });
    cellAt(root, 1, 1).dispatchEvent(dragEvent("drop", startDrag(root)));
    expect(onMove).not.toHaveBeenCalled();
  });

  test("allowLaneChange: false refuses a cross-lane drop but still allows a move within the lane", () => {
    const onMove = vi.fn();
    const root = board({}, { onMove, allowLaneChange: false });
    const dt = startDrag(root);
    cellAt(root, 1, 1).dispatchEvent(dragEvent("dragover", dt));
    expect(cellAt(root, 1, 1).hasAttribute("data-drop-blocked")).toBe(true);
    cellAt(root, 1, 1).dispatchEvent(dragEvent("drop", dt));
    expect(onMove).not.toHaveBeenCalled();
    cellAt(root, 0, 1).dispatchEvent(dragEvent("drop", startDrag(root)));
    expect(onMove).toHaveBeenCalledWith("c1", "doing", undefined, "a");
  });

  test("showSearchLabel renders labels.search as visible text tied to the search field", () => {
    const root = board({ labels: { search: "Search cards" }, showSearchLabel: true });
    const visible = root.querySelector(".kanban-board-search-label")!;
    const input = root.querySelector("input.kanban-board-search") as HTMLInputElement;
    expect(visible.textContent).toBe("Search cards");
    expect(input.id).not.toBe("");
    expect(visible.getAttribute("for")).toBe(input.id);
    expect(input.getAttribute("aria-label")).toBe("Search cards");
  });

  test("without showSearchLabel there is no visible label text", () => {
    const root = board({ labels: { search: "Search cards" } });
    expect(root.querySelector(".kanban-board-search-label")).toBeNull();
  });

  test("fieldLayout=compact sets data-field-layout on the root; the default sets nothing", () => {
    expect(board({ fieldLayout: "compact" }).getAttribute("data-field-layout")).toBe("compact");
    document.body.innerHTML = "";
    expect(board({}).hasAttribute("data-field-layout")).toBe(false);
  });
});
