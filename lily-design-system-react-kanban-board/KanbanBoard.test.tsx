import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
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
