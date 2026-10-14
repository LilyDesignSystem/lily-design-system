import * as React from "react";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
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
