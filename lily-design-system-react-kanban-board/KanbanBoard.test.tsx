import * as React from "react";
import { act, render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import KanbanBoard from "./KanbanBoard";
import type { KanbanCard, KanbanColumn, KanbanLabels } from "./KanbanBoard";

afterEach(() => {
  cleanup();
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

function bodyRows(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll(".kanban-table-body .kanban-table-row"),
  );
}

function tabbableCells(): Element[] {
  return Array.from(
    document.querySelectorAll('.kanban-table-td[tabindex="0"]'),
  );
}

describe("KanbanBoard — markup (§8.1, §8.2, §8.3, §8.4)", () => {
  test("§8.1 renders a kanban-board root wrapping a role=grid labelled by `label`", () => {
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} />);
    const root = document.querySelector(".kanban-board");
    expect(root).toBeTruthy();
    const grid = screen.getByRole("grid");
    expect(grid.getAttribute("aria-label")).toBe("Sprint board");
  });

  test("§8.2 renders column titles and, when labels.cardCount is set, a derived count", () => {
    render(
      <KanbanBoard
        label="Sprint board"
        columns={COLUMNS}
        cards={CARDS}
        labels={LABELS}
      />,
    );
    expect(screen.getByText("To Do")).toBeTruthy();
    const headers = document.querySelectorAll(".kanban-table-th");
    expect(headers[0].textContent).toContain("2 cards");
    expect(headers[2].textContent).toContain("0 cards");
  });

  test("§8.2 no card count renders when labels.cardCount is absent", () => {
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} />);
    expect(document.querySelector(".kanban-board-count")).toBeNull();
  });

  test("§8.3 a column over its wipLimit carries data-over-limit and the warning text", () => {
    render(
      <KanbanBoard
        label="Sprint board"
        columns={COLUMNS}
        cards={CARDS}
        labels={LABELS}
      />,
    );
    const headers = document.querySelectorAll(".kanban-table-th");
    expect(headers[1].hasAttribute("data-over-limit")).toBe(true);
    expect(headers[1].textContent).toContain("Over limit: 2/1");
    expect(headers[0].hasAttribute("data-over-limit")).toBe(false);
    expect(headers[2].hasAttribute("data-over-limit")).toBe(false);
  });

  test("§8.4 the body is rectangular: row count equals the largest column's card count", () => {
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} />);
    expect(bodyRows()).toHaveLength(2); // todo and doing both have 2 cards
    const doneCells = bodyRows().map(
      (row) => row.querySelectorAll(".kanban-table-td")[2],
    );
    for (const cell of doneCells) {
      expect(cell.textContent?.trim()).toBe("");
    }
  });
});

describe("KanbanBoard — roving-tabindex keyboard navigation (§8.5, §8.6)", () => {
  test("§8.5 the roving tab stop is not announced as selection: no cell carries aria-selected", () => {
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} />);
    expect(tabbableCells()).toHaveLength(1);
    expect(document.querySelectorAll("td[aria-selected]")).toHaveLength(0);
  });

  test("§8.5 exactly one body cell carries tabindex=0, and arrows move it and clamp", () => {
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} />);
    expect(tabbableCells()).toHaveLength(1);
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

    // Clamp: ArrowUp past the first row stays on the first row.
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowUp" });
    expect(tabbableCells()).toHaveLength(1);
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
  });

  test("§8.6 Home/End move within the column; Ctrl+Home/Ctrl+End move to the grid's ends", () => {
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
    fireEvent.keyDown(tabbableCells()[0], { key: "End" });
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

    fireEvent.keyDown(tabbableCells()[0], { key: "Home", ctrlKey: true });
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");

    fireEvent.keyDown(tabbableCells()[0], { key: "End", ctrlKey: true });
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("2");
  });
});

describe("KanbanBoard — move menu (§8.7, §8.8, §8.9)", () => {
  test("§8.7 Enter on a focused card opens its move menu", () => {
    render(
      <KanbanBoard
        label="Sprint board"
        columns={COLUMNS}
        cards={CARDS}
        labels={LABELS}
      />,
    );
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    const button = screen.getByRole("button", { name: "Move Card One" });
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("listbox", { name: "Move to column" })).toBeTruthy();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  test("§8.8 choosing a destination calls onMove, closes the menu, and refocuses that card's move button", () => {
    const onMove = vi.fn();
    render(
      <KanbanBoard
        label="Sprint board"
        columns={COLUMNS}
        cards={CARDS}
        labels={LABELS}
        onMove={onMove}
      />,
    );
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    const cardOneButton = screen.getByRole("button", { name: "Move Card One" });
    const doneOption = screen.getByRole("option", { name: "Done" });
    fireEvent.click(doneOption);
    expect(onMove).toHaveBeenCalledWith("c1", "done");
    expect(screen.queryByRole("listbox")).toBeNull();
    // Real assertion this reference's own test does not make: focus must
    // return to Card One's OWN move button, not merely "a" move button —
    // see spec/index.md §12 for the per-card ref-map fix this exercises.
    expect(document.activeElement).toBe(cardOneButton);
  });

  test("§8.9 Escape closes the move menu without calling onMove", () => {
    const onMove = vi.fn();
    render(
      <KanbanBoard
        label="Sprint board"
        columns={COLUMNS}
        cards={CARDS}
        labels={LABELS}
        onMove={onMove}
      />,
    );
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    const listbox = screen.getByRole("listbox");
    fireEvent.keyDown(listbox, { key: "Escape" });
    expect(onMove).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});

describe("KanbanBoard — pointer drag-and-drop (§8.10)", () => {
  test("§8.10 dropping a card on another column's cell calls onMove", () => {
    const onMove = vi.fn();
    render(
      <KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} onMove={onMove} />,
    );
    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
    const cardTitle = screen.getByText("Card One");
    fireEvent.dragStart(cardTitle, { dataTransfer });

    const doneCell = bodyRows()[0].querySelectorAll(".kanban-table-td")[2];
    fireEvent.drop(doneCell, { dataTransfer });
    expect(onMove).toHaveBeenCalledWith("c1", "done");
  });
});

describe("KanbanBoard — announcements and extra attributes (§8.11, §8.12)", () => {
  test("§8.11 a successful move announces via labels.moveAnnouncement", () => {
    render(
      <KanbanBoard
        label="Sprint board"
        columns={COLUMNS}
        cards={CARDS}
        labels={LABELS}
      />,
    );
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    fireEvent.click(screen.getByRole("option", { name: "Done" }));
    expect(document.querySelector(".kanban-board-status")?.textContent).toBe(
      "Card One moved to Done",
    );
  });

  test("§8.11 no announcement fires when moveAnnouncement is absent", () => {
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    const listbox = screen.getByRole("listbox");
    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    fireEvent.keyDown(listbox, { key: "Enter" });
    expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");
  });

  test("§8.12 extra attributes spread onto the root", () => {
    render(
      <KanbanBoard
        label="Sprint board"
        columns={COLUMNS}
        cards={CARDS}
        data-testid="board-root"
      />,
    );
    expect(document.querySelector('[data-testid="board-root"]')).toBeTruthy();
  });
});

describe("KanbanBoard — focus, tab stop and move edge cases", () => {
  function Harness({ labels = LABELS }: { labels?: KanbanLabels }) {
    const [cards, setCards] = React.useState(CARDS);
    return (
      <KanbanBoard
        label="Sprint board"
        columns={COLUMNS}
        cards={cards}
        labels={labels}
        onMove={(id, columnId) =>
          setCards((all) => all.map((c) => (c.id === id ? { ...c, columnId } : c)))
        }
      />
    );
  }

  test("mounting the board does not take focus from the page", () => {
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} />);
    expect(document.activeElement).toBe(document.body);
  });

  test("§8.8 after a move, focus and the tab stop follow the card to its new column", () => {
    render(<Harness />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    fireEvent.click(screen.getByRole("option", { name: "Done" }));
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Move Card One" }));
    expect(tabbableCells()).toHaveLength(1);
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("2");
  });

  test("§8.14 keys pressed in the open move menu do not move the grid cursor or focus", () => {
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} labels={LABELS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    const listbox = screen.getByRole("listbox");
    expect(document.activeElement).toBe(listbox);
    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    fireEvent.keyDown(listbox, { key: "ArrowRight" });
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("0");
    expect(document.activeElement).toBe(listbox);
  });

  test("§8.14 choosing a destination in the menu does not reopen it", () => {
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} labels={LABELS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    const listbox = screen.getByRole("listbox");
    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    fireEvent.keyDown(listbox, { key: "Enter" });
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  test("§8.15 choosing the card's own column, or dropping it there, is not a move", () => {
    const onMove = vi.fn();
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} labels={LABELS} onMove={onMove} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    fireEvent.click(screen.getByRole("option", { name: "To Do" }));
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.querySelector(".kanban-board-status")?.textContent).toBe("");

    const dataTransfer = { setData: vi.fn(), getData: vi.fn(() => "c1") };
    fireEvent.dragStart(screen.getByText("Card One"), { dataTransfer });
    fireEvent.drop(bodyRows()[1].querySelectorAll(".kanban-table-td")[0], { dataTransfer });
    expect(onMove).not.toHaveBeenCalled();
  });

  test("§8.16 when the board shrinks under the cursor, one cell stays tabbable", () => {
    const { rerender } = render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "End" });
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("1");
    rerender(
      <KanbanBoard
        label="Sprint board"
        columns={COLUMNS}
        cards={CARDS.filter((c) => c.id !== "c2" && c.id !== "c4")}
      />,
    );
    expect(bodyRows()).toHaveLength(1);
    expect(tabbableCells()).toHaveLength(1);
  });

  test("§8.16 focusing a cell by pointer moves the cursor there", () => {
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} />);
    const cell = bodyRows()[1].querySelectorAll<HTMLElement>(".kanban-table-td")[1];
    fireEvent.focus(cell);
    expect(tabbableCells()).toEqual([cell]);
    fireEvent.keyDown(cell, { key: "ArrowUp" });
    expect(tabbableCells()[0].getAttribute("data-row")).toBe("0");
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
  });

  test("§8.13 without labels.moveButton there is no unnamed button; the menu is named by the card and Escape refocuses the cell", () => {
    render(<KanbanBoard label="Sprint board" columns={COLUMNS} cards={CARDS} />);
    expect(document.querySelector(".kanban-board-move-button")).toBeNull();
    const cell = tabbableCells()[0] as HTMLElement;
    fireEvent.keyDown(cell, { key: "Enter" });
    const listbox = screen.getByRole("listbox", { name: "Card One" });
    fireEvent.keyDown(listbox, { key: "Escape" });
    expect(document.activeElement).toBe(cell);
  });

  test("§8.3 a column exactly at its wipLimit is not over it", () => {
    render(
      <KanbanBoard
        label="Sprint board"
        columns={COLUMNS}
        cards={CARDS.filter((c) => c.id !== "c4")}
        labels={LABELS}
      />,
    );
    expect(document.querySelectorAll(".kanban-table-th")[1].hasAttribute("data-over-limit")).toBe(false);
  });
});

describe("KanbanBoard — reorder, veto and read-only (§8.17–§8.21)", () => {
  const base = { label: "Sprint board", columns: COLUMNS, cards: CARDS };

  test("§8.17 Alt+ArrowDown reorders within the column via onReorder and announces it", () => {
    const onReorder = vi.fn();
    const labels: KanbanLabels = {
      reorderAnnouncement: (t, p, n) => `${t} is ${p} of ${n}`,
    };
    render(<KanbanBoard {...base} onReorder={onReorder} labels={labels} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown", altKey: true });
    expect(onReorder).toHaveBeenCalledWith("c1", 1);
    expect(document.querySelector(".kanban-board-status")?.textContent).toBe(
      "Card One is 2 of 2",
    );
  });

  test("§8.18 Alt+Arrow at the column edge does not call onReorder", () => {
    const onReorder = vi.fn();
    render(<KanbanBoard {...base} onReorder={onReorder} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowUp", altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
  });

  test("§8.19 canMove refuses a move: no onMove, an announcement, aria-disabled option", () => {
    const onMove = vi.fn();
    const labels: KanbanLabels = {
      ...LABELS,
      moveBlocked: (t, c) => `${t} cannot go to ${c}`,
    };
    render(
      <KanbanBoard
        {...base}
        onMove={onMove}
        labels={labels}
        canMove={(_c, to) => to.id !== "done"}
      />,
    );
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    const option = screen.getByRole("option", { name: "Done" });
    expect(option.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(option);
    expect(onMove).not.toHaveBeenCalled();
    expect(document.querySelector(".kanban-board-status")?.textContent).toBe(
      "Card One cannot go to Done",
    );
  });

  test("§8.20 readonly: no move button, no menu, no drag, no reorder", () => {
    const onReorder = vi.fn();
    render(<KanbanBoard {...base} labels={LABELS} readonly onReorder={onReorder} />);
    expect(document.querySelector(".kanban-board-move-button")).toBeNull();
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    expect(screen.queryByRole("listbox")).toBeNull();
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown", altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
    expect(document.querySelector("[draggable='true']")).toBeNull();
    expect(document.querySelector(".kanban-board")!.hasAttribute("data-readonly")).toBe(true);
  });

  test("§8.21 readonly keeps arrow-key navigation", () => {
    render(<KanbanBoard {...base} readonly />);
    fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
    expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");
  });
});

describe("KanbanBoard — collapse, add card, hard limits (§8.22–§8.30)", () => {
  const base = { label: "Sprint board", columns: COLUMNS, cards: CARDS };
  const cells = () => Array.from(document.querySelectorAll<HTMLElement>(".kanban-table-td"));
  const toggle = (name: string) => screen.getByRole("button", { name });
  const collapseLabels: KanbanLabels = {
    ...LABELS,
    collapseColumn: (c, collapsed) => `${collapsed ? "Expand" : "Collapse"} ${c.title}`,
  };

  test("§8.22 collapseColumn gates a toggle in each header; without it none renders", () => {
    render(<KanbanBoard {...base} />);
    expect(document.querySelector(".kanban-board-collapse-button")).toBeNull();
  });

  test("§8.23 the toggle collapses a column: aria-expanded flips, its cards are not rendered, its count remains", () => {
    render(<KanbanBoard {...base} labels={collapseLabels} />);
    expect(toggle("Collapse To Do").getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Card One")).toBeTruthy();
    fireEvent.click(toggle("Collapse To Do"));
    expect(toggle("Expand To Do").getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("Card One")).toBeNull();
    expect(document.querySelectorAll(".kanban-table-th")[0].textContent).toContain("2 cards");
    expect(document.querySelectorAll(".kanban-table-th")[0].hasAttribute("data-collapsed")).toBe(true);
  });

  test("§8.24 collapsedColumns starts a column collapsed, and its cells carry data-collapsed", () => {
    render(<KanbanBoard {...base} collapsedColumns={["todo"]} labels={LABELS} />);
    expect(screen.queryByText("Card One")).toBeNull();
    expect(cells().filter((c) => c.dataset.col === "0").every((c) => c.hasAttribute("data-collapsed"))).toBe(true);
  });

  test("§8.25 the board's height ignores collapsed columns", () => {
    const { unmount } = render(<KanbanBoard {...base} />);
    expect(bodyRows()).toHaveLength(2);
    unmount();
    render(<KanbanBoard {...base} collapsedColumns={["todo", "doing"]} />);
    expect(bodyRows()).toHaveLength(0);
  });

  test("§8.26 addCard gates an add button per column that fires onAddCard with the column id", () => {
    const onAddCard = vi.fn();
    render(<KanbanBoard {...base} labels={{ addCard: (c) => `Add to ${c.title}` }} onAddCard={onAddCard} />);
    fireEvent.click(screen.getByRole("button", { name: "Add to In Progress" }));
    expect(onAddCard).toHaveBeenCalledWith("doing");
  });

  test("§8.27 no add button without labels.addCard, and none when readonly", () => {
    const a = render(<KanbanBoard {...base} />);
    expect(document.querySelector(".kanban-board-add-button")).toBeNull();
    a.unmount();
    render(<KanbanBoard {...base} readonly labels={{ addCard: (c) => `Add to ${c.title}` }} />);
    expect(document.querySelector(".kanban-board-add-button")).toBeNull();
  });

  test("§8.28 strictLimit refuses a move into a full column, announces it, and marks the option aria-disabled", () => {
    const onMove = vi.fn();
    const columns: KanbanColumn[] = [
      { id: "todo", title: "To Do" },
      { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true },
    ];
    render(
      <KanbanBoard
        {...base}
        columns={columns}
        onMove={onMove}
        labels={{ ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` }}
      />,
    );
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    const option = screen.getByRole("option", { name: "In Progress" });
    expect(option.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(option);
    expect(onMove).not.toHaveBeenCalled();
    expect(document.querySelector(".kanban-board-status")?.textContent).toBe("Card One cannot go to In Progress");
  });

  test("§8.29 strictLimit allows a move while the column is under its limit", () => {
    const onMove = vi.fn();
    const columns: KanbanColumn[] = [
      { id: "todo", title: "To Do" },
      { id: "doing", title: "In Progress", wipLimit: 3, strictLimit: true },
    ];
    render(<KanbanBoard {...base} columns={columns} onMove={onMove} labels={LABELS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    fireEvent.click(screen.getByRole("option", { name: "In Progress" }));
    expect(onMove).toHaveBeenCalledWith("c1", "doing");
  });

  test("§8.30 without strictLimit a full column still accepts moves (the WIP limit is only a warning)", () => {
    const onMove = vi.fn();
    render(<KanbanBoard {...base} onMove={onMove} labels={LABELS} />);
    fireEvent.keyDown(tabbableCells()[0], { key: "Enter" });
    fireEvent.click(screen.getByRole("option", { name: "In Progress" }));
    expect(onMove).toHaveBeenCalledWith("c1", "doing");
  });
});

describe("KanbanBoard — filter, drop position, locked cards, Alt+Arrow, cardAttrs (§8.31–§8.47)", () => {
  const base = { label: "Sprint board", columns: COLUMNS, cards: CARDS, labels: LABELS };
  const cell = (row: number, col: number) =>
    document.querySelector<HTMLElement>(`.kanban-table-td[data-row="${row}"][data-col="${col}"]`)!;
  const titles = () => Array.from(document.querySelectorAll(".kanban-board-card-title")).map((e) => e.textContent?.trim());
  const drag = (from: HTMLElement, to: HTMLElement) => {
    const dt = { setData: vi.fn(), getData: () => "" };
    fireEvent.dragStart(from.querySelector(".kanban-board-card-title")!, { dataTransfer: dt });
    fireEvent.dragOver(to, { dataTransfer: dt });
    fireEvent.drop(to, { dataTransfer: dt });
  };

  test("§8.31 filter hides cards; §8.32 counts and limits still use every card, with data-hidden-count", () => {
    render(<KanbanBoard {...base} filter={(c) => c.columnId !== "doing"} />);
    const heads = Array.from(document.querySelectorAll(".kanban-table-th"));
    expect(titles()).not.toContain("Card Three");
    expect(heads[1].textContent).toContain("2 cards");
    expect(heads[1].hasAttribute("data-over-limit")).toBe(true);
    expect(heads[1].getAttribute("data-hidden-count")).toBe("2");
    expect(heads[0].hasAttribute("data-hidden-count")).toBe(false);
  });

  test("§8.33 the board's height follows the filtered view", () => {
    render(<KanbanBoard {...base} filter={() => false} />);
    expect(document.querySelectorAll(".kanban-table-body .kanban-table-row")).toHaveLength(0);
  });

  test("§8.34 compare orders the cards within each column", () => {
    render(<KanbanBoard {...base} compare={(a, b) => b.title.localeCompare(a.title)} />);
    const todo = Array.from(document.querySelectorAll<HTMLElement>('.kanban-table-td[data-col="0"] .kanban-board-card-title')).map((e) => e.textContent?.trim());
    expect(todo).toEqual(["Card Two", "Card One"]);
  });

  test("§8.35 dropping on a card in another column passes its position; §8.36 on an empty cell appends", () => {
    const onMove = vi.fn();
    render(<KanbanBoard {...base} onMove={onMove} />);
    drag(cell(0, 0), cell(1, 1));
    expect(onMove).toHaveBeenLastCalledWith("c1", "doing", 1);
    drag(cell(0, 0), cell(0, 2));
    expect(onMove).toHaveBeenLastCalledWith("c1", "done");
  });

  test("§8.37 dropping on another card of its own column reorders", () => {
    const onReorder = vi.fn();
    render(<KanbanBoard {...base} onReorder={onReorder} />);
    drag(cell(0, 0), cell(1, 0));
    expect(onReorder).toHaveBeenCalledWith("c1", 1);
  });

  test("§8.38 the cell under a dragged card carries data-drop-target; readonly refuses drops", () => {
    const onMove = vi.fn();
    const { unmount } = render(<KanbanBoard {...base} onMove={onMove} />);
    const dt = { setData: vi.fn(), getData: () => "" };
    fireEvent.dragStart(cell(0, 0).querySelector(".kanban-board-card-title")!, { dataTransfer: dt });
    fireEvent.dragOver(cell(1, 1), { dataTransfer: dt });
    expect(cell(1, 1).hasAttribute("data-drop-target")).toBe(true);
    unmount();
    render(<KanbanBoard {...base} onMove={onMove} readonly />);
    fireEvent.drop(cell(0, 2), { dataTransfer: dt });
    expect(onMove).not.toHaveBeenCalled();
  });

  test("§8.39–§8.41 a locked card has data-locked, no move button, is not draggable, ignores Enter and Alt+Arrow, others still move", () => {
    const cards = CARDS.map((c) => (c.id === "c1" ? { ...c, locked: true } : c));
    const onMove = vi.fn();
    const onReorder = vi.fn();
    render(<KanbanBoard {...base} cards={cards} onMove={onMove} onReorder={onReorder} />);
    expect(cell(0, 0).hasAttribute("data-locked")).toBe(true);
    expect(cell(0, 0).querySelector(".kanban-board-move-button")).toBeNull();
    expect(cell(0, 0).querySelector("[draggable]")).toBeNull();
    expect(cell(1, 0).querySelector("[draggable='true']")).toBeTruthy();
    fireEvent.keyDown(cell(0, 0), { key: "Enter" });
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    fireEvent.keyDown(cell(0, 0), { key: "ArrowDown", altKey: true });
    expect(onReorder).not.toHaveBeenCalled();
    fireEvent.focus(cell(1, 0));
    fireEvent.keyDown(cell(1, 0), { key: "Enter" });
    fireEvent.click(screen.getByRole("option", { name: "Done" }));
    expect(onMove).toHaveBeenCalledWith("c2", "done");
  });

  test("§8.44 Alt+ArrowRight moves the card to the next column; Alt+ArrowLeft past the first does nothing", () => {
    const onMove = vi.fn();
    render(<KanbanBoard {...base} onMove={onMove} />);
    fireEvent.keyDown(cell(0, 0), { key: "ArrowLeft", altKey: true });
    expect(onMove).not.toHaveBeenCalled();
    fireEvent.keyDown(cell(0, 0), { key: "ArrowRight", altKey: true });
    expect(onMove).toHaveBeenLastCalledWith("c1", "doing");
  });

  test("§8.46 a hard-limited full column refuses the keyboard move and announces it", () => {
    const onMove = vi.fn();
    const cols = [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 2, strictLimit: true }];
    render(<KanbanBoard {...base} columns={cols} onMove={onMove} labels={{ ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` }} />);
    fireEvent.keyDown(cell(0, 0), { key: "ArrowRight", altKey: true });
    expect(onMove).not.toHaveBeenCalled();
    expect(document.querySelector(".kanban-board-status")!.textContent).toBe("Card One cannot go to In Progress");
  });

  test("§8.47 cardAttrs adds attributes to each card's cell", () => {
    render(<KanbanBoard {...base} cardAttrs={(c) => ({ "data-priority": c.id === "c1" ? "high" : "low" })} />);
    expect(document.querySelector('[data-card-id="c1"]')!.getAttribute("data-priority")).toBe("high");
    expect(document.querySelector('[data-card-id="c2"]')!.getAttribute("data-priority")).toBe("low");
  });
});

describe("KanbanBoard — card body, flags, allowed columns, async move, footers, empty message, search (§8.48–§8.62)", () => {
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
  const base = { label: "Board", columns: cols, cards: rich, labels: LABELS };
  const cell = (id: string) => document.querySelector<HTMLElement>(`[data-card-id="${id}"]`)!;
  const status = () => document.querySelector(".kanban-board-status")!.textContent;
  const deferred = () => {
    let resolve!: () => void;
    let reject!: (e: unknown) => void;
    const promise = new Promise<void>((res, rej) => ((resolve = res), (reject = rej)));
    return { promise, resolve, reject };
  };

  test("§8.48 subtitle, badges and a link title render; §8.50 the flag is text, data-flag and aria-describedby; §8.51 column flag and accent", () => {
    render(<KanbanBoard {...base} />);
    expect(cell("c1").querySelector(".kanban-board-card-subtitle")!.textContent).toBe("Source · 80");
    expect(Array.from(cell("c1").querySelectorAll(".kanban-board-card-badge")).map((b) => b.textContent)).toEqual(["P1", "VIP"]);
    expect(cell("c1").querySelector("a.kanban-board-card-link")!.getAttribute("href")).toBe("/t/1");
    const flag = cell("c1").querySelector(".kanban-board-card-flag")!;
    expect(flag.textContent).toBe("SLA breached");
    expect(cell("c1").getAttribute("data-flag")).toBe("SLA breached");
    expect(cell("c1").getAttribute("aria-describedby")).toBe(flag.id);
    const th = document.querySelector(".kanban-table-th")!;
    expect(th.getAttribute("data-flag")).toBe("Over capacity");
    expect(th.getAttribute("data-accent")).toBe("red");
    expect(th.querySelector(".kanban-board-column-flag")!.textContent).toBe("Over capacity");
    expect(cell("c1").getAttribute("data-accent")).toBe("red");
  });

  test("§8.49 renderCard replaces the title content; §8.59 columnHeader and columnFooter render per column", () => {
    render(
      <KanbanBoard
        {...base}
        renderCard={({ label }) => <b data-custom>{label}!</b>}
        columnHeader={({ count }) => <i data-header>{count}</i>}
        columnFooter={({ column, count, cards }) => <i data-footer={column.id}>{count}:{cards.map((c) => c.id).join(",")}</i>}
      />,
    );
    expect(cell("c2").querySelector("[data-custom]")!.textContent).toBe("Card Two!");
    expect(document.querySelectorAll("tfoot td")).toHaveLength(3);
    expect(document.querySelector('[data-footer="todo"]')!.textContent).toBe("2:c1,c2");
    expect(document.querySelectorAll("[data-header]")[1].textContent).toBe("1");
  });

  test("§8.52 allowedColumns limits the move menu; §8.53 a keyboard move elsewhere is refused and announced", () => {
    render(<KanbanBoard {...base} allowedColumns={(c) => (c.id === "c1" ? ["doing"] : ["done"])} />);
    fireEvent.keyDown(cell("c1"), { key: "Enter" });
    expect(screen.getAllByRole("option").map((o) => o.textContent?.trim())).toEqual(["To Do", "In Progress"]);
    cleanup();
    const onMove = vi.fn();
    render(<KanbanBoard {...base} onMove={onMove} allowedColumns={() => ["done"]} labels={{ ...LABELS, moveBlocked: (t, c) => `${t} cannot go to ${c}` }} />);
    fireEvent.keyDown(cell("c1"), { key: "ArrowRight", altKey: true });
    expect(onMove).not.toHaveBeenCalled();
    expect(status()).toBe("Card One cannot go to In Progress");
  });

  test("§8.54 card.draggable=false stops pointer dragging but keeps the move menu", () => {
    render(<KanbanBoard {...base} cards={rich.map((c) => (c.id === "c2" ? { ...c, draggable: false } : c))} />);
    expect(cell("c2").querySelector("[draggable]")).toBeNull();
    expect(cell("c2").querySelector(".kanban-board-move-button")).toBeTruthy();
  });

  test("§8.55 an async onMove shows data-pending and aria-busy in the new column, then clears on resolve", async () => {
    const d = deferred();
    render(<KanbanBoard {...base} onMove={() => d.promise} labels={{ ...LABELS, movePending: (t, c) => `Moving ${t} to ${c}` }} />);
    fireEvent.focus(cell("c2"));
    fireEvent.keyDown(cell("c2"), { key: "ArrowRight", altKey: true });
    await waitFor(() => expect(cell("c2").getAttribute("data-pending")).toBe(""));
    expect(cell("c2").getAttribute("aria-busy")).toBe("true");
    expect(cell("c2").getAttribute("data-col")).toBe("1");
    expect(status()).toBe("Moving Card Two to In Progress");
    d.resolve();
    await waitFor(() => expect(cell("c2").hasAttribute("data-pending")).toBe(false));
  });

  test("§8.56 a rejected async onMove sends the card back, announces moveFailed and calls onMoveError; §8.57 a pending card cannot move again", async () => {
    const d = deferred();
    const onMove = vi.fn(() => d.promise);
    const onMoveError = vi.fn();
    render(<KanbanBoard {...base} onMove={onMove} onMoveError={onMoveError} labels={{ ...LABELS, moveFailed: (t, c) => `Could not move ${t} to ${c}` }} />);
    fireEvent.focus(cell("c2"));
    fireEvent.keyDown(cell("c2"), { key: "ArrowRight", altKey: true });
    await waitFor(() => expect(cell("c2").getAttribute("data-col")).toBe("1"));
    fireEvent.keyDown(cell("c2"), { key: "ArrowRight", altKey: true });
    expect(onMove).toHaveBeenCalledTimes(1);
    d.reject(new Error("no"));
    await waitFor(() => expect(cell("c2").getAttribute("data-col")).toBe("0"));
    expect(onMoveError).toHaveBeenCalledWith("c2", "doing", expect.any(Error));
    expect(status()).toBe("Could not move Card Two to In Progress");
  });

  test("§8.58 a synchronous onMove behaves as before (no pending state)", () => {
    const onMove = vi.fn();
    render(<KanbanBoard {...base} onMove={onMove} />);
    fireEvent.focus(cell("c2"));
    fireEvent.keyDown(cell("c2"), { key: "ArrowRight", altKey: true });
    expect(onMove).toHaveBeenCalledWith("c2", "doing");
    expect(document.querySelector("[data-pending]")).toBeNull();
  });

  test("§8.60 labels.emptyColumn shows a message in an empty column, even when no column has cards; §8.61 none without it", () => {
    const lab = { ...LABELS, emptyColumn: (c: KanbanColumn) => `No cards in ${c.title}` };
    render(<KanbanBoard {...base} labels={lab} />);
    expect(document.querySelector(".kanban-board-empty")!.textContent).toBe("No cards in Done");
    cleanup();
    render(<KanbanBoard {...base} cards={[]} labels={lab} />);
    expect(document.querySelectorAll(".kanban-board-empty")).toHaveLength(3);
    expect(document.querySelectorAll(".kanban-table-body .kanban-table-row")).toHaveLength(1);
    cleanup();
    render(<KanbanBoard {...base} />);
    expect(document.querySelector(".kanban-board-empty")).toBeNull();
  });

  test("§8.62 labels.search adds a search field that filters by label, subtitle and badges", () => {
    render(<KanbanBoard {...base} labels={{ ...LABELS, search: "Search cards" }} />);
    const input = screen.getByRole("searchbox", { name: "Search cards" });
    fireEvent.change(input, { target: { value: "vip" } });
    expect(Array.from(document.querySelectorAll(".kanban-board-card-title")).map((e) => e.textContent?.trim())).toEqual(["Card One"]);
    expect(document.querySelector(".kanban-table-th")!.getAttribute("data-hidden-count")).toBe("1");
  });
});

describe("KanbanBoard — 0.4.0 (§8.63–§8.83)", () => {
  const b = { label: "Board", columns: [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress" }, { id: "done", title: "Done" }] as KanbanColumn[], cards: CARDS.map((c) => ({ ...c })) };
  const c = (id: string) => document.querySelector<HTMLElement>(`[data-card-id="${id}"]`)!;

  test("§8.63 selectable: x toggles, Ctrl+click toggles, aria-multiselectable", () => {
    const onSel = vi.fn();
    render(<KanbanBoard {...b} selectable onSelectionChange={onSel} />);
    expect(screen.getByRole("grid").getAttribute("aria-multiselectable")).toBe("true");
    fireEvent.focus(c("c1"));
    fireEvent.keyDown(c("c1"), { key: "x" });
    expect(c("c1").hasAttribute("data-selected")).toBe(true);
    fireEvent.click(c("c2"), { ctrlKey: true });
    expect(onSel).toHaveBeenLastCalledWith(["c1", "c2"]);
    fireEvent.click(c("c2"), { ctrlKey: true });
    expect(onSel).toHaveBeenLastCalledWith(["c1"]);
  });

  test("§8.64 moving a selected card moves the whole selection and announces once", () => {
    const onMove = vi.fn();
    render(<KanbanBoard {...b} selectable defaultSelected={["c1", "c2"]} onMove={onMove} labels={{ moveManyAnnouncement: (n, col) => `${n} to ${col}` }} />);
    fireEvent.focus(c("c1"));
    fireEvent.keyDown(c("c1"), { key: "ArrowRight", altKey: true });
    expect(onMove).toHaveBeenCalledTimes(2);
    expect(onMove).toHaveBeenCalledWith("c1", "doing");
    expect(onMove).toHaveBeenCalledWith("c2", "doing");
    expect(document.querySelector(".kanban-board-status")!.textContent).toBe("2 to In Progress");
    expect(document.querySelector("[data-selected]")).toBeNull();
  });

  test("§8.65 undoable: Ctrl+Z moves the card back through onMove", async () => {
    const calls: [string, string][] = [];
    function Host() {
      const [cards, setCards] = React.useState(b.cards.map((x) => ({ ...x })));
      return (
        <KanbanBoard
          {...b}
          cards={cards}
          undoable
          onMove={(id, col) => {
            calls.push([id, col]);
            setCards((cs) => cs.map((x) => (x.id === id ? { ...x, columnId: col } : x)));
          }}
        />
      );
    }
    render(<Host />);
    fireEvent.focus(c("c1"));
    fireEvent.keyDown(c("c1"), { key: "ArrowRight", altKey: true });
    await waitFor(() => expect(calls).toEqual([["c1", "doing"]]));
    fireEvent.keyDown(document.querySelector('.kanban-table-td[tabindex="0"]')!, { key: "z", ctrlKey: true });
    await waitFor(() => expect(calls).toEqual([["c1", "doing"], ["c1", "todo"]]));
  });

  test("§8.66 movableColumns: Alt+Shift+ArrowRight reorders columns", () => {
    const onOrder = vi.fn();
    render(<KanbanBoard {...b} movableColumns onColumnOrderChange={onOrder} />);
    fireEvent.focus(c("c1"));
    fireEvent.keyDown(c("c1"), { key: "ArrowRight", altKey: true, shiftKey: true });
    expect(onOrder).toHaveBeenCalledWith(["doing", "todo", "done"]);
    expect(Array.from(document.querySelectorAll(".kanban-table-th")).map((e) => e.textContent?.trim())[0]).toContain("In Progress");
  });

  test("§8.67 lanes: lane header rows, cards grouped by laneId", () => {
    const cards = b.cards.map((x, i) => ({ ...x, laneId: i < 2 ? "a" : "b" }));
    render(<KanbanBoard {...b} cards={cards} lanes={[{ id: "a", title: "Alpha" }, { id: "b", title: "Beta" }]} />);
    expect(Array.from(document.querySelectorAll(".kanban-board-lane")).map((e) => e.textContent)).toEqual(["Alpha", "Beta"]);
  });

  test("§8.68 dropping into another lane's cell calls onMove with the lane id", () => {
    const onMove = vi.fn();
    const cards = [{ id: "c1", columnId: "todo", title: "One", laneId: "a" }];
    render(<KanbanBoard {...b} cards={cards} lanes={[{ id: "a", title: "A" }, { id: "b", title: "B" }]} onMove={onMove} />);
    const target = document.querySelector<HTMLElement>('[data-row="1"][data-col="1"]')!;
    fireEvent.dragStart(document.querySelector(".kanban-board-card-title")!);
    fireEvent.drop(target);
    expect(onMove).toHaveBeenCalledWith("c1", "doing", undefined, "b");
  });

  test("§8.69 virtualize renders a window with spacers and aria-rowcount", () => {
    const cards = Array.from({ length: 100 }, (_, i) => ({ id: `k${i}`, columnId: "todo", title: `K${i}` }));
    render(<KanbanBoard {...b} cards={cards} virtualize={{ rowHeight: 20, height: 100 }} />);
    expect(document.querySelector(".kanban-board-scroll")).toBeTruthy();
    expect(document.querySelectorAll("[data-card-id]").length).toBeLessThan(20);
    expect(document.querySelector(".kanban-board-spacer")).toBeTruthy();
    expect(screen.getByRole("grid").getAttribute("aria-rowcount")).toBe("101");
  });
});

describe("KanbanBoard — collapsible lanes (§8.91–§8.94)", () => {
  afterEach(() => cleanup());
  const laneDefs = [{ id: "ann", title: "Ann" }, { id: "bo", title: "Bo" }];
  const cardsInLanes = [
    { id: "c1", columnId: "todo", title: "One", laneId: "ann" },
    { id: "c2", columnId: "todo", title: "Two", laneId: "bo" },
    { id: "c3", columnId: "doing", title: "Three", laneId: "bo" },
  ];
  const laneProps = { label: "Board", columns: [{ id: "todo", title: "To do" }, { id: "doing", title: "Doing" }], lanes: laneDefs, cards: cardsInLanes };

  test("§8.91 labels.collapseLane gates a toggle with aria-expanded; clicking collapses the lane's rows but keeps its header", () => {
    render(<KanbanBoard {...laneProps} labels={{ collapseLane: (lane, collapsed) => `${collapsed ? "Expand" : "Collapse"} ${lane.title}` }} />);
    const toggle = screen.getByRole("button", { name: "Collapse Bo" });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Expand Bo" }).getAttribute("aria-expanded")).toBe("false");
    expect(document.querySelector('[data-card-id="c2"]')).toBeNull();
    expect(document.querySelector('[data-card-id="c1"]')).not.toBeNull();
    expect(document.querySelectorAll(".kanban-board-lane")).toHaveLength(2);
  });

  test("§8.92 no toggle without labels.collapseLane", () => {
    render(<KanbanBoard {...laneProps} />);
    expect(document.querySelector(".kanban-board-lane-toggle")).toBeNull();
  });

  test("§8.93 collapsedLanes starts a lane collapsed; labels.laneCount shows its card count; onCollapsedLanesChange fires", () => {
    const onChange = vi.fn();
    render(<KanbanBoard {...laneProps} defaultCollapsedLanes={["bo"]} onCollapsedLanesChange={onChange} labels={{ laneCount: (lane, n) => `${n} cards in ${lane.title}`, collapseLane: (l, c) => `${c ? "Expand" : "Collapse"} ${l.title}` }} />);
    expect(document.querySelector('[data-card-id="c2"]')).toBeNull();
    expect(Array.from(document.querySelectorAll(".kanban-board-lane-count")).map((e) => e.textContent)).toEqual(["1 cards in Ann", "2 cards in Bo"]);
    expect(document.querySelector('[data-lane-id="bo"][data-collapsed]')).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Expand Bo" }));
    expect(onChange).toHaveBeenCalledWith([]);
    expect(document.querySelector('[data-card-id="c2"]')).not.toBeNull();
  });

  test("§8.94 collapsing every lane leaves a board with only headers (no body rows, no crash)", () => {
    render(<KanbanBoard {...laneProps} collapsedLanes={["ann", "bo"]} />);
    expect(document.querySelectorAll(".kanban-table-body tr:not([data-lane-row])")).toHaveLength(0);
    expect(document.querySelectorAll(".kanban-board-lane")).toHaveLength(2);
  });
});

describe("KanbanBoard — typed fields, editing, export (§8.95–§8.109)", () => {
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
  const buttons = (id: string) => cellOf(id).querySelectorAll<HTMLElement>(".kanban-board-field-button");
  const editor = () => document.querySelector<HTMLInputElement>(".kanban-board-field-editor")!;

  test("§8.95 fields render under the title as formatted text, named by their header", () => {
    render(<KanbanBoard {...base} />);
    const fields = cellOf("c1").querySelectorAll(".kanban-board-card-field");
    expect(Array.from(fields).map((f) => f.textContent?.replace(/\s+/g, " ").trim())).toEqual(["Owner Ann", "Points 3", "Due 2026-10-16"]);
    expect(cellOf("c3").querySelectorAll(".kanban-board-card-field")).toHaveLength(1);
  });

  test("§8.96 a field is editable only with onFieldEdit; read-only cards stay plain text", () => {
    const { unmount } = render(<KanbanBoard {...base} />);
    expect(document.querySelector(".kanban-board-field-button")).toBeNull();
    unmount();
    render(<KanbanBoard {...base} onFieldEdit={vi.fn()} readonly />);
    expect(document.querySelector(".kanban-board-field-button")).toBeNull();
  });

  test("§8.97 clicking a value opens a typed editor; Enter commits the parsed value", () => {
    const onFieldEdit = vi.fn();
    render(<KanbanBoard {...base} onFieldEdit={onFieldEdit} labels={EXPORT_LABELS} />);
    fireEvent.click(buttons("c1")[1]);
    expect(editor().type).toBe("number");
    expect(editor().getAttribute("aria-label")).toBe("Points");
    expect(document.activeElement).toBe(editor());
    fireEvent.change(editor(), { target: { value: "8" } });
    fireEvent.keyDown(editor(), { key: "Enter" });
    expect(onFieldEdit).toHaveBeenCalledWith({ cardId: "c1", fieldId: "points", value: 8, previous: 3 });
    expect(document.querySelector(".kanban-board-status")!.textContent).toBe("One Points is 8");
    expect(document.querySelector(".kanban-board-field-editor")).toBeNull();
  });

  test("§8.98 a select field edits through a select of its options", () => {
    const onFieldEdit = vi.fn();
    render(<KanbanBoard {...base} onFieldEdit={onFieldEdit} />);
    fireEvent.click(buttons("c2")[0]);
    fireEvent.change(document.querySelector("select.kanban-board-field-editor")!, { target: { value: "b" } });
    expect(onFieldEdit).toHaveBeenCalledTimes(1);
    expect(onFieldEdit).toHaveBeenCalledWith({ cardId: "c2", fieldId: "owner", value: "b", previous: undefined });
  });

  test("§8.99 Escape cancels without reporting; an unchanged value reports nothing", () => {
    const onFieldEdit = vi.fn();
    render(<KanbanBoard {...base} onFieldEdit={onFieldEdit} />);
    fireEvent.click(buttons("c1")[1]);
    fireEvent.change(editor(), { target: { value: "9" } });
    fireEvent.keyDown(editor(), { key: "Escape" });
    expect(onFieldEdit).not.toHaveBeenCalled();
    fireEvent.click(buttons("c1")[1]);
    fireEvent.keyDown(editor(), { key: "Enter" });
    expect(onFieldEdit).not.toHaveBeenCalled();
  });

  test("§8.100 a date field edits through a date input and commits the ISO date", () => {
    const onFieldEdit = vi.fn();
    render(<KanbanBoard {...base} onFieldEdit={onFieldEdit} labels={EXPORT_LABELS} />);
    fireEvent.click(buttons("c1")[2]);
    expect(editor().type).toBe("date");
    fireEvent.change(editor(), { target: { value: "2026-10-17" } });
    fireEvent.keyDown(editor(), { key: "Enter" });
    expect(onFieldEdit).toHaveBeenCalledWith({ cardId: "c1", fieldId: "due", value: "2026-10-17", previous: "2026-10-16" });
  });

  test("§8.101 an invalid number is refused: the editor stays open and the refusal is announced", () => {
    const onFieldEdit = vi.fn();
    render(
      <KanbanBoard {...base} fields={[{ id: "p", header: "P", type: "number", parse: () => Number.NaN }]} cards={[{ id: "c1", columnId: "todo", title: "One", values: { p: 1 } }]} onFieldEdit={onFieldEdit} labels={EXPORT_LABELS} />,
    );
    fireEvent.click(document.querySelector(".kanban-board-field-button")!);
    fireEvent.keyDown(editor(), { key: "Enter" });
    expect(onFieldEdit).not.toHaveBeenCalled();
    expect(document.querySelector(".kanban-board-field-editor")).not.toBeNull();
    expect(document.querySelector(".kanban-board-status")!.textContent).toBe("One: bad P");
  });

  test("§8.102 F2 on a card edits its first editable field; the editor's keys do not reach the grid", () => {
    render(<KanbanBoard {...base} onFieldEdit={vi.fn()} />);
    fireEvent.keyDown(cellOf("c1"), { key: "F2" });
    expect(editor()).not.toBeNull();
    fireEvent.keyDown(editor(), { key: "ArrowDown" });
    expect(document.querySelector(".kanban-board-move-list")).toBeNull();
  });

  test("§8.103 IME: Enter while composing does not commit", () => {
    const onFieldEdit = vi.fn();
    render(<KanbanBoard {...base} fields={[{ id: "n", header: "N" }]} cards={[{ id: "c1", columnId: "todo", title: "One", values: { n: "a" } }]} onFieldEdit={onFieldEdit} />);
    fireEvent.click(document.querySelector(".kanban-board-field-button")!);
    fireEvent.change(editor(), { target: { value: "かな" } });
    fireEvent.keyDown(editor(), { key: "Enter", isComposing: true });
    fireEvent.keyDown(editor(), { key: "Enter", keyCode: 229 });
    expect(onFieldEdit).not.toHaveBeenCalled();
    fireEvent.keyDown(editor(), { key: "Enter" });
    expect(onFieldEdit).toHaveBeenCalledWith({ cardId: "c1", fieldId: "n", value: "かな", previous: "a" });
  });

  test("§8.104 a locked card's fields are not editable", () => {
    render(<KanbanBoard {...base} cards={[{ ...FCARDS[0], locked: true }]} onFieldEdit={vi.fn()} />);
    expect(document.querySelector(".kanban-board-field-button")).toBeNull();
  });

  test("§8.109 Tab commits and moves to the card's next editable field", () => {
    render(<KanbanBoard {...base} onFieldEdit={vi.fn()} />);
    fireEvent.click(buttons("c1")[0]);
    fireEvent.keyDown(editor(), { key: "Tab" });
    expect(document.querySelector<HTMLInputElement>("input.kanban-board-field-editor")!.type).toBe("number");
    fireEvent.keyDown(editor(), { key: "Tab", shiftKey: true });
    expect(document.querySelector("select.kanban-board-field-editor")).not.toBeNull();
  });

  async function exported(props: Record<string, unknown> = {}, format: "csv" | "tsv" | "xlsx" = "csv") {
    const onExport = vi.fn((_file: { format: string; filename: string; cardCount: number; blob: Blob }) => false as const);
    render(<KanbanBoard {...base} labels={EXPORT_LABELS} onExport={onExport} {...props} />);
    fireEvent.click(document.querySelector(`[data-kanban-export-format="${format}"]`)!);
    const file = onExport.mock.calls[0][0];
    const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await file.blob.arrayBuffer());
    cleanup();
    return { file, text };
  }

  test("§8.105 export buttons need a label and exportHeaders; each label gates its button", () => {
    const { unmount } = render(<KanbanBoard {...base} />);
    expect(document.querySelector(".kanban-board-export")).toBeNull();
    unmount();
    const second = render(<KanbanBoard {...base} labels={{ exportCsv: "CSV" }} />);
    expect(document.querySelector(".kanban-board-export")).toBeNull();
    second.unmount();
    render(<KanbanBoard {...base} labels={{ export: "Export", exportExcel: "Excel", exportHeaders: EXPORT_LABELS.exportHeaders }} />);
    expect(screen.getByRole("group", { name: "Export" })).toBeTruthy();
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

  test("§8.107 the view is exported: the search applies; exportScope selected exports only the selection; exportable false drops a field", async () => {
    expect((await exported({ search: "two" })).file.cardCount).toBe(1);
    expect((await exported({ selectable: true, selected: ["c3"], exportScope: "selected" })).file.cardCount).toBe(1);
    const dropped = await exported({ fields: [{ ...FIELDS[0], exportable: false }, FIELDS[1]] });
    expect(dropped.text.split("\r\n")[0]).toBe("﻿Title,Column,Sub,Badges,Flag,Points");
  });

  test("§8.108 lanes add a lane column; saving announces unless onExport returns false; an empty view disables the buttons", async () => {
    const lanes = [{ id: "l1", title: "Lane 1" }];
    const withLane = await exported({ lanes, labels: { ...EXPORT_LABELS, exportHeaders: { ...EXPORT_LABELS.exportHeaders!, lane: "Lane" } } });
    expect(withLane.text.split("\r\n")[0]).toBe("﻿Title,Column,Lane,Sub,Badges,Flag,Owner,Points,Due");
    const created: Blob[] = [];
    const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
    URL.createObjectURL = (b: Blob | MediaSource) => (created.push(b as Blob), "blob:test");
    URL.revokeObjectURL = () => {};
    try {
      const { unmount } = render(<KanbanBoard {...base} labels={EXPORT_LABELS} />);
      fireEvent.click(document.querySelector('[data-kanban-export-format="tsv"]')!);
      expect(created).toHaveLength(1);
      expect(document.querySelector(".kanban-board-status")!.textContent).toBe("3 cards as tsv: kanban-board.tsv");
      unmount();
      render(<KanbanBoard {...base} cards={[]} labels={EXPORT_LABELS} />);
      expect((document.querySelector('[data-kanban-export-format="csv"]') as HTMLButtonElement).disabled).toBe(true);
    } finally {
      URL.createObjectURL = original.create;
      URL.revokeObjectURL = original.revoke;
    }
  });
});


describe("KanbanBoard — search: words, diacritics, fields, highlight, announce, Escape (§8.110–§8.118)", () => {
    const cols: KanbanColumn[] = [
        { id: "todo", title: "To Do" },
        { id: "doing", title: "In Progress" },
    ];
    const cards: KanbanCard[] = [
        { id: "c1", columnId: "todo", title: "Design login page", values: { owner: "Zoë" } },
        { id: "c2", columnId: "todo", title: "Café menu", subtitle: "vip" },
        { id: "c3", columnId: "doing", title: "Write docs" },
    ];
    const L: KanbanLabels = { ...LABELS, search: "Search cards", searchAnnouncement: (m, t) => `${m} of ${t} cards` };
    const base = { label: "Board", columns: cols, cards, labels: L };
    const ids = () => Array.from(document.querySelectorAll("[data-card-id]")).map((e) => e.getAttribute("data-card-id"));
    const input = () => screen.getByRole("searchbox", { name: "Search cards" }) as HTMLInputElement;

    test("§8.110 every word must appear, in any order", async () => {
        render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.input(input(), { target: { value: "page LOGIN" } });
        expect(ids()).toEqual(["c1"]);
    });

    test("§8.111 ignores diacritics both ways", async () => {
        render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.input(input(), { target: { value: "cafe" } });
        expect(ids()).toEqual(["c2"]);
    });

    test("§8.112 the default text includes typed field text", async () => {
        render(<KanbanBoard {...({ ...base, fields: [{ id: "owner", header: "Owner" }] } as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.input(input(), { target: { value: "zoe" } });
        expect(ids()).toEqual(["c1"]);
    });

    test("§8.113 matches in the title are wrapped in <mark class=kanban-board-match>, only while searching", async () => {
        render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
        expect(document.querySelector("mark")).toBeNull();
        await fireEvent.input(input(), { target: { value: "wri" } });
        expect(document.querySelector("mark.kanban-board-match")?.textContent).toBe("Wri");
    });

    test("§8.114 the result count is announced", async () => {
        render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.input(input(), { target: { value: "docs" } });
        await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("1 of 3 cards");
    });

    test("§8.115 Escape in the field clears the search", async () => {
        render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.input(input(), { target: { value: "docs" } });
        await fireEvent.keyDown(input(), { key: "Escape" });
        expect(input().value).toBe("");
        expect(ids().sort()).toEqual(["c1", "c2", "c3"]);
    });

    test("§8.116 searchText replaces what is looked in", async () => {
        render(<KanbanBoard {...({ ...base, searchText: (c: KanbanCard) => c.id } as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.input(input(), { target: { value: "c3" } });
        expect(ids()).toEqual(["c3"]);
    });

    test("§8.117 a linked card's title highlights inside the link", async () => {
        render(<KanbanBoard {...({ ...base, cards: cards.map((c) => (c.id === "c3" ? { ...c, href: "/docs" } : c)) } as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.input(input(), { target: { value: "docs" } });
        expect(document.querySelector("a.kanban-board-card-link mark")?.textContent).toBe("docs");
    });

    test("§8.118 the search prop works without the field", () => {
        render(<KanbanBoard {...({ ...base, labels: LABELS, search: "docs" } as React.ComponentProps<typeof KanbanBoard>)} />);
        expect(ids()).toEqual(["c3"]);
    });
});

describe("KanbanBoard — copy to clipboard (§8.119–§8.121)", () => {
    const cols: KanbanColumn[] = [{ id: "todo", title: "To Do" }, { id: "doing", title: "Doing" }];
    const cards: KanbanCard[] = [
        { id: "c1", columnId: "todo", title: "One" },
        { id: "c2", columnId: "doing", title: "Two" },
    ];
    const L: KanbanLabels = { ...LABELS, export: "Export", copy: "Copy", exportHeaders: { title: "Title", column: "Column" }, copyAnnouncement: (n) => `${n} cards copied`, copyFailed: "Copy failed" };
    const base = { label: "Board", columns: cols, cards, labels: L };
    const wait = () => new Promise((r) => setTimeout(r, 0));

    test("§8.119 copy needs labels.copy and exportHeaders", () => {
        render(<KanbanBoard {...({ ...base, labels: { ...LABELS, copy: "Copy" } } as React.ComponentProps<typeof KanbanBoard>)} />);
        expect(document.querySelector('[data-kanban-export-format="copy"]')).toBeNull();
    });

    test("§8.120 copy puts the view on the clipboard, tab-separated with a header row, and announces", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        const text = (writeText.mock.calls[0] as unknown as [string])[0];
        expect(text.split("\r\n")[0]).toBe("Title\tColumn");
        expect(text).toContain("One\tTo Do");
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("2 cards copied");
        vi.unstubAllGlobals();
    });

    test("§8.121 onCopy can take over, and the search narrows what is copied", async () => {
        const writeText = vi.fn(async () => {});
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        const onCopy = vi.fn(() => false);
        render(<KanbanBoard {...({ ...base, onCopy } as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        expect(writeText).not.toHaveBeenCalled();
        document.body.innerHTML = "";
        render(<KanbanBoard {...({ ...base, search: "two" } as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.click(screen.getByText("Copy"));
        await wait();
        const text = (writeText.mock.calls[0] as unknown as [string])[0];
        expect(text).toContain("Two");
        expect(text).not.toContain("One");
        vi.unstubAllGlobals();
    });
});

describe("KanbanBoard — PageUp / PageDown and type-ahead (§8.122–§8.127)", () => {
    const cols: KanbanColumn[] = [{ id: "todo", title: "To Do" }, { id: "doing", title: "Doing" }];
    const many: KanbanCard[] = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, columnId: "todo", title: i % 2 ? `Beta ${i}` : `Alpha ${i}` }));
    const base = { label: "Board", columns: cols, cards: many, labels: LABELS };
    const cells = () => Array.from(document.querySelectorAll<HTMLElement>("[data-row][data-col]"));
    const active = () => document.querySelector<HTMLElement>('[data-row][data-col][tabindex="0"]')!;
    const rowOf = (el: HTMLElement) => Number(el.dataset.row);

    test("§8.122 PageDown moves ten rows and PageUp moves back; both clamp", async () => {
        render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.keyDown(cells()[0], { key: "PageDown" });
        expect(rowOf(active())).toBe(10);
        await fireEvent.keyDown(active(), { key: "PageUp" });
        expect(rowOf(active())).toBe(0);
        await fireEvent.keyDown(active(), { key: "PageUp" });
        expect(rowOf(active())).toBe(0);
    });

    test("§8.123 typing a letter moves to the next card in the column whose label starts with it", async () => {
        render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.keyDown(cells()[0], { key: "b" });
        expect(rowOf(active())).toBe(1);
    });

    test("§8.124 letters typed in quick succession form one prefix", async () => {
        const cards: KanbanCard[] = [
            { id: "a", columnId: "todo", title: "Design" },
            { id: "b", columnId: "todo", title: "Deploy" },
            { id: "c", columnId: "todo", title: "Docs" },
        ];
        render(<KanbanBoard {...({ ...base, cards } as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.keyDown(cells()[0], { key: "d" });
        await fireEvent.keyDown(active(), { key: "e" });
        await fireEvent.keyDown(active(), { key: "p" });
        expect(rowOf(active())).toBe(1);
    });

    test("§8.125 a lone x is still the select shortcut when cards are selectable", async () => {
        const cards: KanbanCard[] = [
            { id: "a", columnId: "todo", title: "Alpha" },
            { id: "b", columnId: "todo", title: "Xylophone" },
        ];
        render(<KanbanBoard {...({ ...base, cards, selectable: true } as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.keyDown(cells()[0], { key: "x" });
        expect(rowOf(active())).toBe(0);
    });

    test("§8.126 without selectable, x is ordinary type-ahead", async () => {
        const cards: KanbanCard[] = [
            { id: "a", columnId: "todo", title: "Alpha" },
            { id: "b", columnId: "todo", title: "Xylophone" },
        ];
        render(<KanbanBoard {...({ ...base, cards } as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.keyDown(cells()[0], { key: "x" });
        expect(rowOf(active())).toBe(1);
    });

    test("§8.127 a Ctrl or Alt key is never type-ahead, and an unmatched prefix does nothing", async () => {
        render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.keyDown(cells()[0], { key: "b", ctrlKey: true });
        expect(rowOf(active())).toBe(0);
        await fireEvent.keyDown(cells()[0], { key: "z" });
        expect(rowOf(active())).toBe(0);
    });
});

describe("KanbanBoard — in-place edit: validate, undo, redo (§8.128–§8.136)", () => {
    const cols: KanbanColumn[] = [{ id: "todo", title: "To Do" }, { id: "doing", title: "Doing" }];
    const cards: KanbanCard[] = [{ id: "c1", columnId: "todo", title: "One", values: { points: 3 } }];
    const FIELD = { id: "points", header: "Points", type: "number" as const, validate: (v: unknown) => (typeof v === "number" && v < 0 ? "Must not be negative" : undefined) };
    const L: KanbanLabels = {
        ...LABELS,
        editAnnouncement: (t, h, text) => `${t} ${h} is ${text}`,
        editInvalid: (t, h) => `${t}: bad ${h}`,
        editRefused: (t, h, m) => `${t} ${h}: ${m}`,
        fieldUndoAnnouncement: (t, h, text) => `Undid ${t} ${h}: ${text}`,
        fieldRedoAnnouncement: (t, h, text) => `Redid ${t} ${h}: ${text}`,
    };
    const base = { label: "Board", columns: cols, cards, fields: [FIELD], labels: L };
    const status = () => document.querySelector(".kanban-board-status")?.textContent;
    const button = () => document.querySelector<HTMLElement>(".kanban-board-field-button")!;
    const cell = () => document.querySelector<HTMLElement>("[data-row][data-col]")!;

    async function edit(value: string): Promise<HTMLInputElement> {
        await fireEvent.click(button());
        const input = document.querySelector<HTMLInputElement>(".kanban-board-field-editor")!;
        await fireEvent.input(input, { target: { value } });
        await fireEvent.keyDown(input, { key: "Enter" });
        return input;
    }

    test("§8.128 a value validate refuses keeps the editor open, aria-invalid, and announces the reason", async () => {
        const onFieldEdit = vi.fn();
        render(<KanbanBoard {...({ ...base, onFieldEdit } as React.ComponentProps<typeof KanbanBoard>)} />);
        await edit("-4");
        expect(onFieldEdit).not.toHaveBeenCalled();
        expect(document.querySelector(".kanban-board-field-editor")?.getAttribute("aria-invalid")).toBe("true");
        expect(status()).toBe("One Points: Must not be negative");
    });

    test("§8.129 typing again clears aria-invalid, and an acceptable value then commits", async () => {
        const onFieldEdit = vi.fn();
        render(<KanbanBoard {...({ ...base, onFieldEdit } as React.ComponentProps<typeof KanbanBoard>)} />);
        const input = await edit("-4");
        await fireEvent.input(input, { target: { value: "5" } });
        expect(input.getAttribute("aria-invalid")).toBeNull();
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onFieldEdit).toHaveBeenCalledWith({ cardId: "c1", fieldId: "points", value: 5, previous: 3 });
    });

    test("§8.130 Ctrl+Z reports the earlier value through onFieldEdit and announces it", async () => {
        const onFieldEdit = vi.fn();
        render(<KanbanBoard {...({ ...base, onFieldEdit } as React.ComponentProps<typeof KanbanBoard>)} />);
        await edit("8");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "points", value: 3, previous: 8 });
        expect(status()).toBe("Undid One Points: 3");
    });

    test("§8.131 Ctrl+Shift+Z and Ctrl+Y redo", async () => {
        const onFieldEdit = vi.fn();
        render(<KanbanBoard {...({ ...base, onFieldEdit } as React.ComponentProps<typeof KanbanBoard>)} />);
        await edit("8");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true, shiftKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "points", value: 8, previous: 3 });
        expect(status()).toBe("Redid One Points: 8");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        await fireEvent.keyDown(cell(), { key: "y", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "points", value: 8, previous: 3 });
    });

    test("§8.132 undo walks back through several edits, newest first", async () => {
        const onFieldEdit = vi.fn();
        render(<KanbanBoard {...({ ...base, onFieldEdit } as React.ComponentProps<typeof KanbanBoard>)} />);
        await edit("5");
        await edit("9");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "points", value: 3, previous: 9 });
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "points", value: 3, previous: 5 });
    });

    test("§8.133 with nothing to undo Ctrl+Z does nothing, and a new edit ends the redo chain", async () => {
        const onFieldEdit = vi.fn();
        render(<KanbanBoard {...({ ...base, onFieldEdit } as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).not.toHaveBeenCalled();
        await edit("5");
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        await edit("7");
        onFieldEdit.mockClear();
        await fireEvent.keyDown(cell(), { key: "y", ctrlKey: true });
        expect(onFieldEdit).not.toHaveBeenCalled();
    });

    test("§8.134 with undoable on and a move to take back, Ctrl+Z takes the move back first, then the field edit", async () => {
        const onFieldEdit = vi.fn();
        const onMove = vi.fn();
        const { rerender } = render(<KanbanBoard {...({ ...base, onFieldEdit, onMove, undoable: true } as React.ComponentProps<typeof KanbanBoard>)} />);
        await edit("8");
        await fireEvent.keyDown(cell(), { key: "ArrowRight", altKey: true });
        expect(onMove).toHaveBeenCalledTimes(1);
        rerender(<KanbanBoard {...({ ...base, cards: cards.map((c) => ({ ...c, columnId: "doing" })), onFieldEdit, onMove, undoable: true } as React.ComponentProps<typeof KanbanBoard>)} />);
        onFieldEdit.mockClear();
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
        expect(onMove).toHaveBeenCalledTimes(2);
        expect(onFieldEdit).not.toHaveBeenCalled();
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).toHaveBeenLastCalledWith({ cardId: "c1", fieldId: "points", value: 3, previous: 8 });
    });

    test("§8.135 undo and redo do nothing in a readonly board or without onFieldEdit", async () => {
        const onFieldEdit = vi.fn();
        render(<KanbanBoard {...({ ...base, readonly: true, onFieldEdit } as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.keyDown(cell(), { key: "z", ctrlKey: true });
        expect(onFieldEdit).not.toHaveBeenCalled();
    });

    test("§8.136 a wrong-type value without a validate message falls back to editInvalid", async () => {
        render(<KanbanBoard {...({ ...base, fields: [{ ...FIELD, parse: () => Number.NaN }], onFieldEdit: vi.fn() } as React.ComponentProps<typeof KanbanBoard>)} />);
        await edit("x");
        expect(status()).toBe("One: bad Points");
    });
});

describe("KanbanBoard — live drop cue, right-to-left keys, no English left over (§8.137–§8.148)", () => {
    const cols: KanbanColumn[] = [
        { id: "todo", title: "To Do" },
        { id: "doing", title: "Doing" },
        { id: "done", title: "Done" },
    ];
    const cards: KanbanCard[] = [
        { id: "c1", columnId: "todo", title: "One" },
        { id: "c2", columnId: "todo", title: "Two" },
    ];
    const base = { label: "Board", columns: cols, cards };
    const cell = (row: number, col: number) => document.querySelector<HTMLElement>(`.kanban-table-td[data-row="${row}"][data-col="${col}"]`)!;
    const active = () => document.querySelector<HTMLElement>('[data-row][data-col][tabindex="0"]')!;
    const dt = () => ({ setData: vi.fn(), getData: () => "", dropEffect: "" });
    const start = async (el: HTMLElement, transfer = dt()) => fireEvent.dragStart(el.querySelector(".kanban-board-card-title")!, { dataTransfer: transfer });

    test("§8.137 over a column that accepts the card, the cell is a drop target and the drag effect is move", async () => {
        render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
        await start(cell(0, 0));
        const over = dt();
        await fireEvent.dragOver(cell(0, 1), { dataTransfer: over });
        expect(cell(0, 1).hasAttribute("data-drop-target")).toBe(true);
        expect(cell(0, 1).hasAttribute("data-drop-blocked")).toBe(false);
        expect(over.dropEffect).toBe("move");
    });

    test("§8.138 over a column canMove refuses, the cell is data-drop-blocked, not a drop target, and the effect is none", async () => {
        render(<KanbanBoard {...({ ...base, canMove: (_c: KanbanCard, to: KanbanColumn) => to.id !== "done" } as React.ComponentProps<typeof KanbanBoard>)} />);
        await start(cell(0, 0));
        const over = dt();
        await fireEvent.dragOver(cell(0, 2), { dataTransfer: over });
        expect(cell(0, 2).hasAttribute("data-drop-blocked")).toBe(true);
        expect(cell(0, 2).hasAttribute("data-drop-target")).toBe(false);
        expect(over.dropEffect).toBe("none");
    });

    test("§8.139 the dragover of a refused drop is not cancelled, so the browser shows its not-allowed cursor", async () => {
        render(<KanbanBoard {...({ ...base, canMove: () => false } as React.ComponentProps<typeof KanbanBoard>)} />);
        await start(cell(0, 0));
        const event = new Event("dragover", { bubbles: true, cancelable: true });
        Object.defineProperty(event, "dataTransfer", { value: dt() });
        cell(0, 1).dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
    });

    test("§8.139b the dragover of an accepted drop is cancelled, which is what allows the drop", async () => {
        render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
        await start(cell(0, 0));
        const event = new Event("dragover", { bubbles: true, cancelable: true });
        Object.defineProperty(event, "dataTransfer", { value: dt() });
        cell(0, 1).dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
    });

    test("§8.140 the cue follows the pointer: moving to an allowed column clears the blocked cue", async () => {
        render(<KanbanBoard {...({ ...base, canMove: (_c: KanbanCard, to: KanbanColumn) => to.id === "doing" } as React.ComponentProps<typeof KanbanBoard>)} />);
        await start(cell(0, 0));
        await fireEvent.dragOver(cell(0, 2), { dataTransfer: dt() });
        expect(cell(0, 2).hasAttribute("data-drop-blocked")).toBe(true);
        await fireEvent.dragLeave(cell(0, 2));
        await fireEvent.dragOver(cell(0, 1), { dataTransfer: dt() });
        expect(cell(0, 2).hasAttribute("data-drop-blocked")).toBe(false);
        expect(cell(0, 1).hasAttribute("data-drop-target")).toBe(true);
    });

    test("§8.141 a strict WIP limit that is full also blocks, and dropping on a blocked column moves nothing", async () => {
        const onMove = vi.fn();
        const limited: KanbanColumn[] = [cols[0], { id: "doing", title: "Doing", wipLimit: 0, strictLimit: true }, cols[2]];
        render(<KanbanBoard {...({ ...base, columns: limited, onMove } as React.ComponentProps<typeof KanbanBoard>)} />);
        await start(cell(0, 0));
        await fireEvent.dragOver(cell(0, 1), { dataTransfer: dt() });
        expect(cell(0, 1).hasAttribute("data-drop-blocked")).toBe(true);
        await fireEvent.drop(cell(0, 1), { dataTransfer: dt() });
        expect(onMove).not.toHaveBeenCalled();
        expect(cell(0, 1).hasAttribute("data-drop-blocked")).toBe(false);
    });

    test("§8.142 ending the drag clears every cue", async () => {
        render(<KanbanBoard {...({ ...base, canMove: () => false } as React.ComponentProps<typeof KanbanBoard>)} />);
        await start(cell(0, 0));
        await fireEvent.dragOver(cell(0, 1), { dataTransfer: dt() });
        await fireEvent.dragEnd(cell(0, 0).querySelector(".kanban-board-card-title")!);
        expect(document.querySelector("[data-drop-blocked], [data-drop-target]")).toBeNull();
    });

    test("§8.143 left to right: ArrowRight goes to the next column, ArrowLeft back", async () => {
        render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.keyDown(active(), { key: "ArrowRight" });
        expect(Number(active().dataset.col)).toBe(1);
        await fireEvent.keyDown(active(), { key: "ArrowLeft" });
        expect(Number(active().dataset.col)).toBe(0);
    });

    test("§8.144 right to left: ArrowLeft goes to the next column, ArrowRight back", async () => {
        document.body.setAttribute("dir", "rtl");
        try {
            render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
            await fireEvent.keyDown(active(), { key: "ArrowLeft" });
            expect(Number(active().dataset.col)).toBe(1);
            await fireEvent.keyDown(active(), { key: "ArrowRight" });
            expect(Number(active().dataset.col)).toBe(0);
        } finally {
            document.body.removeAttribute("dir");
        }
    });

    test("§8.145 right to left: Alt+ArrowLeft moves the card to the column that is visually on its left, the next one", async () => {
        document.body.setAttribute("dir", "rtl");
        try {
            const onMove = vi.fn();
            render(<KanbanBoard {...({ ...base, onMove } as React.ComponentProps<typeof KanbanBoard>)} />);
            await fireEvent.keyDown(cell(0, 0), { key: "ArrowLeft", altKey: true });
            expect(onMove.mock.calls[0].slice(0, 2)).toEqual(["c1", "doing"]);
        } finally {
            document.body.removeAttribute("dir");
        }
    });

    test("§8.146 vertical keys and Home/End are the same in both directions", async () => {
        for (const dir of ["ltr", "rtl"]) {
            document.body.innerHTML = "";
            document.body.setAttribute("dir", dir);
            render(<KanbanBoard {...(base as React.ComponentProps<typeof KanbanBoard>)} />);
            await fireEvent.keyDown(active(), { key: "ArrowDown" });
            expect(Number(active().dataset.row)).toBe(1);
            await fireEvent.keyDown(active(), { key: "Home" });
            expect(Number(active().dataset.row)).toBe(0);
        }
        document.body.removeAttribute("dir");
    });

    // A complete Simplified Chinese bundle; the data is Chinese too, so any English in the DOM is Lily's.
    const ZH: KanbanLabels = {
        cardCount: (n) => `${n} 张卡片`, overLimit: (n, l) => `超出上限：${n}/${l}`, moveButton: (c) => `移动${c.title}`, moveMenuLabel: "移动到列",
        moveAnnouncement: (t, c) => `${t}已移到${c}`, moveBlocked: (t, c) => `${t}不能移到${c}`, emptyColumn: () => "此列没有卡片",
        search: "搜索卡片", searchAnnouncement: (m, t) => `${t} 张卡片中有 ${m} 张匹配`, export: "导出", exportCsv: "CSV", copy: "复制",
        exportHeaders: { title: "标题", column: "列" }, copyAnnouncement: (n) => `已复制 ${n} 张卡片`, copyFailed: "复制失败",
        collapseColumn: (c, collapsed) => `${collapsed ? "展开" : "折叠"}${c.title}`, addCard: (c) => `向${c.title}添加卡片`,
    };

    function readable(root: Element): string[] {
        const out: string[] = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) out.push(n.textContent ?? "");
        for (const el of root.querySelectorAll("*")) for (const a of ["aria-label", "title", "placeholder", "alt"]) if (el.hasAttribute(a)) out.push(el.getAttribute(a)!);
        return out.map((t) => t.trim()).filter(Boolean);
    }
    const english = (texts: string[]) => texts.filter((t) => !["CSV", "TSV", "Excel"].includes(t) && /[A-Za-z]{3,}/.test(t));

    test("§8.147 with a full Chinese bundle the board reads as Chinese only", () => {
        const zhCols: KanbanColumn[] = [{ id: "todo", title: "待办", wipLimit: 1 }, { id: "doing", title: "进行中" }, { id: "done", title: "已完成" }];
        const zhCards: KanbanCard[] = [{ id: "c1", columnId: "todo", title: "写文档" }, { id: "c2", columnId: "todo", title: "做评审" }];
        const { container } = render(<KanbanBoard {...({ label: "看板", columns: zhCols, cards: zhCards, labels: ZH } as React.ComponentProps<typeof KanbanBoard>)} />);
        expect(english(readable(container))).toEqual([]);
    });

    test("§8.148 the announcements are the bundle's, so none is English", async () => {
        const zhCols: KanbanColumn[] = [{ id: "todo", title: "待办" }, { id: "doing", title: "进行中" }];
        const zhCards: KanbanCard[] = [{ id: "c1", columnId: "todo", title: "写文档" }];
        render(<KanbanBoard {...({ label: "看板", columns: zhCols, cards: zhCards, labels: ZH, onMove: () => {} } as React.ComponentProps<typeof KanbanBoard>)} />);
        await fireEvent.input(screen.getByRole("searchbox", { name: "搜索卡片" }), { target: { value: "写" } });
        await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
        expect(document.querySelector(".kanban-board-status")?.textContent).toBe("1 张卡片中有 1 张匹配");
    });
});

