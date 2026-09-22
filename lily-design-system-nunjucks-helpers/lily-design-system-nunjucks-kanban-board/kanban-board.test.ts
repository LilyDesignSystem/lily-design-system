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
const repoRoot = path.join(__dirname, "..", "..");
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
  test("§8.13 moveMenuLabel absent renders an empty aria-label, not a baked-in string", () => {
    const root = mountIntoBody(renderMacro(defaultOpts()));
    const list = moveListFor(root, "c1");
    expect(list.getAttribute("aria-label")).toBe("");
  });

  test("§8.13 moveButton template substitutes the card's title via {card}", () => {
    const root = mountIntoBody(renderMacro(defaultOpts({ labels: LABELS })));
    expect(moveButtonFor(root, "c1").getAttribute("aria-label")).toBe("Move Card One");
    expect(moveButtonFor(root, "c3").getAttribute("aria-label")).toBe("Move Card Three");
  });

  test("§8.13 a custom {% call %} glyph replaces the default glyph on every move button", () => {
    const html = renderMacroWithCaller(defaultOpts(), `<span class="my-glyph">M</span>`);
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
