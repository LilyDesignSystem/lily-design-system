import * as React from "react";
import { act, render, screen, fireEvent, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import DataGrid from "./DataGrid";
import type { DataGridColumn, DataGridLabels, Props } from "./DataGrid";

function renderGrid(props: Props & Record<string, unknown>) {
    return render(<DataGrid {...props} />);
}

const COLUMNS: DataGridColumn[] = [
    { id: "name", header: "Name", sortable: true, resizable: true, filterable: true },
    { id: "email", header: "Email", filterable: true, hidable: true },
];

const ROWS = [
    { name: "Bob", email: "bob@example.com" },
    { name: "Alice", email: "alice@example.com" },
];

const LABELS: DataGridLabels = {
    search: "Search rows",
    columnVisibility: "Columns",
    columnVisibilityOption: (header) => `Show ${header}`,
    resizeHandle: (header) => `Resize ${header}`,
    selectAll: "Select all rows",
    selectionColumn: "Select",
    selectRow: (rowLabel) => `Select ${rowLabel}`,
    previousPage: "Previous page",
    nextPage: "Next page",
    pageStatus: (page, pageCount, rowCount) => `Page ${page} of ${pageCount} (${rowCount})`,
    sortAnnouncement: (header, direction) => `${header} sorted ${direction}`,
    filterAnnouncement: (matches, total) => `${matches} of ${total} rows match`,
    selectionAnnouncement: (count) => `${count} selected`,
};

function bodyRows(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".data-table-body .data-table-row"));
}

function tabbableCells(): Element[] {
    return Array.from(document.querySelectorAll('.data-table-th[tabindex="0"], .data-table-td[tabindex="0"]'));
}

beforeEach(() => {
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("DataGrid — markup (§8.1)", () => {
    test("§8.1 renders a data-grid root wrapping a role=grid labelled by `label`", () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS });
        const root = document.querySelector(".data-grid");
        expect(root).toBeTruthy();
        const grid = within(root as HTMLElement).getByRole("grid");
        expect(grid.getAttribute("aria-label")).toBe("Users");
    });
});

describe("DataGrid — sorting (§8.2, §8.3)", () => {
    test("§8.2 a sortable column cycles ascending → descending → none, updating aria-sort", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS });
        const button = screen.getByRole("button", { name: "Name" });
        const th = button.closest("th")!;
        expect(th.getAttribute("aria-sort")).toBe("none");

        await fireEvent.click(button);
        expect(th.getAttribute("aria-sort")).toBe("ascending");

        await fireEvent.click(button);
        expect(th.getAttribute("aria-sort")).toBe("descending");

        await fireEvent.click(button);
        expect(th.getAttribute("aria-sort")).toBe("none");
    });

    test("§8.2 a non-sortable column never carries aria-sort", () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS });
        const emailHeader = screen.getByText("Email").closest("th")!;
        expect(emailHeader.hasAttribute("aria-sort")).toBe(false);
    });

    test("§8.3 ascending sort reorders body rows by the active column's value", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS });
        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        const firstRowCells = bodyRows()[0].querySelectorAll(".data-table-td");
        expect(firstRowCells[0].textContent).toBe("Alice");
    });
});

describe("DataGrid — filtering (§8.4)", () => {
    test("§8.4 the search box renders only when labels.search is set", () => {
        const { unmount } = renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS });
        expect(document.querySelector(".data-grid-search")).toBeNull();
        unmount();

        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS });
        expect(document.querySelector(".data-grid-search")).toBeTruthy();
    });

    test("§8.4 filters rows by case-insensitive substring across filterable columns", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS });
        const search = screen.getByRole("searchbox", { name: "Search rows" });
        await fireEvent.change(search, { target: { value: "ALI" } });
        expect(bodyRows()).toHaveLength(1);
        expect(bodyRows()[0].textContent).toContain("Alice");
    });
});

describe("DataGrid — selection (§8.5, §8.6, §8.7)", () => {
    test("§8.5 selectionMode='single' keeps at most one id selected", async () => {
        const onSelectionChange = vi.fn();
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS, onSelectionChange });
        const radios = screen.getAllByRole("radio");
        expect(radios).toHaveLength(2);
        await fireEvent.click(radios[0]);
        expect(onSelectionChange).toHaveBeenLastCalledWith(["0"]);
        await fireEvent.click(radios[1]);
        expect(onSelectionChange).toHaveBeenLastCalledWith(["1"]);
    });

    test("§8.6 selectionMode='multiple' ctrl-click toggles a row without clearing the rest", async () => {
        const onSelectionChange = vi.fn();
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "multiple", labels: LABELS, onSelectionChange });
        const rowCheckboxes = within(document.querySelector(".data-table-body") as HTMLElement).getAllByRole("checkbox");
        await fireEvent.click(rowCheckboxes[0]);
        await fireEvent.click(rowCheckboxes[1], { ctrlKey: true });
        expect(onSelectionChange).toHaveBeenLastCalledWith(["0", "1"]);
    });

    test("§8.6 the select-all header control reflects all/none selected", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "multiple", labels: LABELS });
        const selectAll = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;
        expect(selectAll.checked).toBe(false);
        await fireEvent.click(selectAll);
        expect(selectAll.checked).toBe(true);
        await fireEvent.click(selectAll);
        expect(selectAll.checked).toBe(false);
    });

    test("§8.7 onSelectionChange fires on every change", async () => {
        const onSelectionChange = vi.fn();
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS, onSelectionChange });
        await fireEvent.click(screen.getAllByRole("radio")[0]);
        expect(onSelectionChange).toHaveBeenCalledTimes(1);
    });
});

describe("DataGrid — column resize (§8.8)", () => {
    test("§8.8 ArrowRight/ArrowLeft on a focused resize handle adjusts the column width", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS });
        const handle = screen.getByRole("separator", { name: "Resize Name" });
        expect(handle.getAttribute("aria-valuenow")).toBe("120");
        await fireEvent.keyDown(handle, { key: "ArrowRight" });
        expect(handle.getAttribute("aria-valuenow")).toBe("136");
        expect(handle.closest("th")?.getAttribute("style")).toContain("136px");
        await fireEvent.keyDown(handle, { key: "ArrowLeft" });
        expect(handle.getAttribute("aria-valuenow")).toBe("120");
    });
});

describe("DataGrid — column visibility (§8.9)", () => {
    test("§8.9 hiding a column removes its th and every row's td outright", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS });
        expect(screen.getByText("Email")).toBeTruthy();
        const toggle = screen.getByRole("checkbox", { name: "Show Email" });
        await fireEvent.click(toggle);
        expect(screen.queryByText("Email")).toBeNull();
        for (const row of bodyRows()) {
            expect(row.querySelectorAll(".data-table-td")).toHaveLength(1);
        }
    });
});

describe("DataGrid — pagination (§8.10)", () => {
    test("§8.10 pageSize renders a pagination footer and slices body rows", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, pageSize: 1, labels: LABELS });
        expect(bodyRows()).toHaveLength(1);
        expect(document.querySelector(".data-grid-page-status")?.textContent).toBe("Page 1 of 2 (2)");

        const next = screen.getByRole("button", { name: "Next page" });
        await fireEvent.click(next);
        expect(document.querySelector(".data-grid-page-status")?.textContent).toBe("Page 2 of 2 (2)");
        expect((next as HTMLButtonElement).disabled).toBe(true);
    });
});

describe("DataGrid — roving-tabindex keyboard navigation (§8.11, §8.12)", () => {
    test("§8.11 exactly one grid cell carries tabindex=0, and arrows move it and clamp", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS });
        expect(tabbableCells()).toHaveLength(1);

        let active = tabbableCells()[0];
        expect(active.tagName.toLowerCase()).toBe("th");

        await fireEvent.keyDown(active, { key: "ArrowDown" });
        active = tabbableCells()[0];
        expect(tabbableCells()).toHaveLength(1);
        expect(active.tagName.toLowerCase()).toBe("td");

        // Clamp: ArrowUp past the header row stays on the header row.
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowUp" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowUp" });
        expect(tabbableCells()).toHaveLength(1);
        expect(tabbableCells()[0].tagName.toLowerCase()).toBe("th");
    });

    test("§8.12 Home/End move within the row; Ctrl+Home/Ctrl+End move to the grid's ends", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "End" });
        expect(tabbableCells()[0].getAttribute("data-col")).toBe("1");

        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "Home", ctrlKey: true });
        const cell = tabbableCells()[0];
        expect(cell.getAttribute("data-row")).toBe("-1");
        expect(cell.getAttribute("data-col")).toBe("0");
    });
});

describe("DataGrid — announcements (§8.13)", () => {
    test("§8.13 sort/filter/selection changes announce via the live region using `labels.*`", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS });
        const status = document.querySelector(".data-grid-status")!;
        expect(status.getAttribute("aria-live")).toBe("polite");

        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        expect(status.textContent).toBe("Name sorted ascending");

        await fireEvent.change(screen.getByRole("searchbox"), { target: { value: "ali" } });
        expect(status.textContent).toBe("1 of 2 rows match");

        await fireEvent.click(screen.getAllByRole("radio")[0]);
        expect(status.textContent).toBe("1 selected");
    });

    test("§8.13 no announcement fires for a control whose label is absent", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS });
        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        expect(document.querySelector(".data-grid-status")?.textContent).toBe("");
    });
});

describe("DataGrid — persistence (§8.14)", () => {
    test("§8.14 storageKey persists column widths / hidden columns / sort and restores on remount", async () => {
        const { unmount } = renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS, storageKey: "lily-data-grid-test" });
        await fireEvent.keyDown(screen.getByRole("separator", { name: "Resize Name" }), { key: "ArrowRight" });
        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        unmount();

        const saved = JSON.parse(localStorage.getItem("lily-data-grid-test")!);
        expect(saved.columnWidths.name).toBe(136);
        expect(saved.sort).toEqual({ columnId: "name", direction: "ascending" });

        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS, storageKey: "lily-data-grid-test" });
        expect(screen.getByRole("button", { name: "Name" }).closest("th")?.getAttribute("style")).toContain("136px");
        expect(bodyRows()[0].querySelectorAll(".data-table-td")[0].textContent).toBe("Alice");
    });

    test("§8.14 never persists row data or the selection", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS, storageKey: "lily-data-grid-test-2" });
        await fireEvent.click(screen.getAllByRole("radio")[0]);
        const saved = JSON.parse(localStorage.getItem("lily-data-grid-test-2")!);
        expect(saved.rows).toBeUndefined();
        expect(saved.selected).toBeUndefined();
    });

    test("§8.14 with no storageKey, localStorage is never touched", () => {
        const getSpy = vi.spyOn(Storage.prototype, "getItem");
        const setSpy = vi.spyOn(Storage.prototype, "setItem");
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS });
        expect(getSpy).not.toHaveBeenCalled();
        expect(setSpy).not.toHaveBeenCalled();
    });
});

describe("DataGrid — extra attributes and non-goals (§8.15, §8.16)", () => {
    test("§8.15 extra attributes spread onto the root", () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, "data-testid": "grid-root" });
        expect(document.querySelector('[data-testid="grid-root"]')).toBeTruthy();
    });

    test("§8.16 every row of the current page renders eagerly — no virtualization", () => {
        const manyRows = Array.from({ length: 50 }, (_, i) => ({ name: `Row ${i}`, email: `row${i}@example.com` }));
        renderGrid({ label: "Users", columns: COLUMNS, rows: manyRows });
        expect(bodyRows()).toHaveLength(50);
    });
});

describe("DataGrid — row identity (§8.17)", () => {
    test("§8.17 default ids come from the row's position in `rows`, so page 2 does not reuse page 1's ids", async () => {
        const onSelectionChange = vi.fn();
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, pageSize: 1, selectionMode: "single", labels: LABELS, onSelectionChange });
        await fireEvent.click(screen.getByRole("button", { name: "Next page" }));
        await fireEvent.click(screen.getByRole("radio"));
        expect(onSelectionChange).toHaveBeenLastCalledWith(["1"]);
    });

    test("§8.17 a row keeps its id when sorting moves it", async () => {
        const onSelectionChange = vi.fn();
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS, onSelectionChange });
        await fireEvent.click(screen.getByRole("button", { name: "Name" })); // ascending: Alice (rows[1]) first
        await fireEvent.click(screen.getAllByRole("radio")[0]);
        expect(onSelectionChange).toHaveBeenLastCalledWith(["1"]);
    });

    test("§8.17 Shift-range selection on page 2 selects page 2's rows", async () => {
        const onSelectionChange = vi.fn();
        const rows = Array.from({ length: 4 }, (_, i) => ({ name: `Row ${i}`, email: `r${i}@example.com` }));
        renderGrid({ label: "Users", columns: COLUMNS, rows, pageSize: 2, selectionMode: "multiple", labels: LABELS, onSelectionChange });
        await fireEvent.click(screen.getByRole("button", { name: "Next page" }));
        const boxes = within(document.querySelector(".data-table-body") as HTMLElement).getAllByRole("checkbox");
        await fireEvent.click(boxes[0]);
        await fireEvent.click(boxes[1], { shiftKey: true });
        expect(onSelectionChange).toHaveBeenLastCalledWith(["2", "3"]);
    });
});

describe("DataGrid — hot-path cost (§8.18)", () => {
    const MANY = Array.from({ length: 64 }, (_, i) => ({ name: `Row ${(i * 37) % 64}`, email: `r${i}@example.com` }));

    test("§8.18 sorting reads each row's sort key once, not once per comparison", async () => {
        const accessor = vi.fn((row: Record<string, unknown>) => row.name);
        const columns: DataGridColumn[] = [{ id: "name", header: "Name", sortable: true, filterable: false, accessor }];
        renderGrid({ label: "Users", columns, rows: MANY });
        accessor.mockClear();
        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        // n key reads for the sort; keyed rows that only move are not re-rendered.
        expect(accessor.mock.calls.length).toBeLessThanOrEqual(MANY.length);
    });

    test("§8.18 successive filter keystrokes reuse one search index instead of reformatting every cell", async () => {
        const format = vi.fn((value: unknown) => String(value));
        const columns: DataGridColumn[] = [{ id: "name", header: "Name", format }];
        renderGrid({ label: "Users", columns, rows: MANY, labels: LABELS });
        format.mockClear();
        const search = screen.getByRole("searchbox", { name: "Search rows" });
        for (const text of ["r", "ro", "row", "row "]) {
            await fireEvent.change(search, { target: { value: text } });
        }
        // One index build (n calls); the old per-keystroke scan cost 4n.
        expect(format.mock.calls.length).toBeLessThanOrEqual(MANY.length);
    });
});

describe("DataGrid — cell render prop (§8.19)", () => {
    test("§8.19 a column's `cell` render prop renders each body cell with value, formatted text, and row", () => {
        const cell = (ctx: { value: unknown; formatted: string; row: Record<string, unknown> }) => (
            <a className="test-cell" href={`mailto:${String(ctx.value)}`}>{`${ctx.formatted} (${String(ctx.row.name)})`}</a>
        );
        const columns: DataGridColumn[] = [
            { id: "name", header: "Name" },
            { id: "email", header: "Email", format: (v) => String(v).toUpperCase(), cell },
        ];
        renderGrid({ label: "Users", columns, rows: ROWS });
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".test-cell"));
        expect(links).toHaveLength(2);
        expect(links[0].getAttribute("href")).toBe("mailto:bob@example.com");
        expect(links[0].textContent).toBe("BOB@EXAMPLE.COM (Bob)");
    });
});

describe("DataGrid — focus integrity (§8.20)", () => {
    test("§8.20 focusing a cell by pointer moves the roving position there, so arrows move from it", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS });
        const cell = bodyRows()[1].querySelectorAll<HTMLElement>(".data-table-td")[1];
        await fireEvent.focusIn(cell);
        expect(tabbableCells()).toEqual([cell]);
        await fireEvent.keyDown(cell, { key: "ArrowLeft" });
        expect(tabbableCells()).toEqual([bodyRows()[1].querySelectorAll(".data-table-td")[0]]);
    });

    test("§8.20 filtering away the focused row still leaves exactly one tabbable cell", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" }); // row 2 of 2
        expect(tabbableCells()[0]).toBe(bodyRows()[1].querySelector(".data-table-td"));
        await fireEvent.change(screen.getByRole("searchbox"), { target: { value: "bob" } });
        expect(bodyRows()).toHaveLength(1);
        expect(tabbableCells()).toHaveLength(1);
    });

    test("§8.20 hiding the focused column still leaves exactly one tabbable cell", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" }); // the Email cell
        expect(tabbableCells()[0]).toBe(bodyRows()[0].querySelectorAll(".data-table-td")[1]);
        await fireEvent.click(screen.getByRole("checkbox", { name: "Show Email" }));
        expect(tabbableCells()).toHaveLength(1);
    });

    test("§8.20 keyboard focus is not announced as selection: no body cell carries aria-selected", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
        expect(tabbableCells()[0].classList.contains("data-table-td")).toBe(true);
        expect(document.querySelectorAll(".data-table-td[aria-selected]")).toHaveLength(0);
    });
});

describe("DataGrid — row position for assistive technology (§8.21)", () => {
    test("§8.21 a paginated grid exposes aria-rowcount and each row's aria-rowindex", async () => {
        const rows = Array.from({ length: 5 }, (_, i) => ({ name: `Row ${i}`, email: `r${i}@example.com` }));
        renderGrid({ label: "Users", columns: COLUMNS, rows, pageSize: 2, labels: LABELS });
        expect(screen.getByRole("grid").getAttribute("aria-rowcount")).toBe("6"); // 5 rows + header
        expect(document.querySelector(".data-table-head .data-table-row")?.getAttribute("aria-rowindex")).toBe("1");
        await fireEvent.click(screen.getByRole("button", { name: "Next page" }));
        expect(bodyRows().map((r) => r.getAttribute("aria-rowindex"))).toEqual(["4", "5"]);
    });
});

describe("DataGrid — page announcement (§8.22)", () => {
    test("§8.22 changing page announces labels.pageAnnouncement", async () => {
        renderGrid({
                label: "Users", columns: COLUMNS, rows: ROWS, pageSize: 1,
                labels: { ...LABELS, pageAnnouncement: (page: number, count: number) => `Page ${page} of ${count}` },
            });
        await fireEvent.click(screen.getByRole("button", { name: "Next page" }));
        expect(document.querySelector(".data-grid-status")?.textContent).toBe("Page 2 of 2");
    });
});

describe("DataGrid — resize handle range (§8.23)", () => {
    test("§8.23 the resize handle exposes its minimum width as aria-valuemin", () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS });
        expect(screen.getByRole("separator").getAttribute("aria-valuemin")).toBe("40");
    });
});

describe("DataGrid — custom comparison (§8.24)", () => {
    test("§8.24 a column's `compare` orders its sort, e.g. a consumer-supplied locale collator", async () => {
        const collator = new Intl.Collator("en", { sensitivity: "base" });
        const rows = [{ name: "Zoe" }, { name: "alice" }, { name: "Bob" }];
        const columns: DataGridColumn[] = [
            { id: "name", header: "Name", sortable: true, compare: (a, b) => collator.compare(String(a), String(b)) },
        ];
        renderGrid({ label: "Users", columns, rows });
        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        expect(bodyRows().map((r) => r.textContent?.trim())).toEqual(["alice", "Bob", "Zoe"]);
    });
});

// ─── Interactive cells, table mode and the slots (§8.25–§8.34) ──────────────

const widgetCell = (ctx: { formatted: string }) => (
    <span>
        <a className="w-link" href={`#${ctx.formatted}`}>{ctx.formatted}</a>
        <input className="w-input" defaultValue={ctx.formatted} />
    </span>
);
const WIDGET_COLUMNS: DataGridColumn[] = [
    { id: "name", header: "Name", sortable: true },
    { id: "email", header: "Email", cell: widgetCell },
];

function press(target: Element, key: string): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    act(() => {
        target.dispatchEvent(event);
    });
    return event;
}

describe("DataGrid — widgets inside cells (§8.25, §8.26)", () => {
    test("§8.25 a key pressed on an input in a cell is not swallowed and does not move the roving position", async () => {
        renderGrid({ label: "Users", columns: WIDGET_COLUMNS, rows: ROWS });
        const input = document.querySelector<HTMLInputElement>(".w-input")!;
        const before = tabbableCells()[0];
        for (const key of ["ArrowLeft", "ArrowRight", "ArrowDown", "Home", "End", "Enter", " "]) {
            expect(press(input, key).defaultPrevented, key).toBe(false);
        }
        expect(tabbableCells()).toEqual([before]);
    });

    test("§8.25 Escape on a widget focuses its cell", async () => {
        renderGrid({ label: "Users", columns: WIDGET_COLUMNS, rows: ROWS });
        const input = document.querySelector<HTMLInputElement>(".w-input")!;
        input.focus();
        press(input, "Escape");
        expect(document.activeElement).toBe(input.closest(".data-table-td"));
    });

    test("§8.25 the grid's own controls still follow grid keys", async () => {
        renderGrid({ label: "Users", columns: WIDGET_COLUMNS, rows: ROWS, selectionMode: "multiple", labels: LABELS });
        const selectAll = screen.getByLabelText("Select all rows");
        expect(press(selectAll, "ArrowRight").defaultPrevented).toBe(true);
    });

    test("§8.26 widgets in body cells are not tab stops, and Enter on the cell enters it", async () => {
        renderGrid({ label: "Users", columns: WIDGET_COLUMNS, rows: ROWS });
        await Promise.resolve();
        const widgets = Array.from(document.querySelectorAll<HTMLElement>(".w-link, .w-input"));
        expect(widgets).toHaveLength(4);
        for (const w of widgets) expect(w.getAttribute("tabindex")).toBe("-1");
        const cell = bodyRows()[0].querySelectorAll<HTMLElement>(".data-table-td")[1];
        const event = press(cell, "Enter");
        expect(event.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(cell.querySelector(".w-link"));
        // While focus is inside the cell its widgets are tab stops, so Tab can move between them.
        for (const w of cell.querySelectorAll<HTMLElement>(".w-link, .w-input")) expect(w.getAttribute("tabindex")).toBe("0");
        // Leaving the cell puts them back.
        await fireEvent.focusOut(cell.querySelector(".w-input")!, { relatedTarget: document.body });
        for (const w of cell.querySelectorAll<HTMLElement>(".w-link, .w-input")) expect(w.getAttribute("tabindex")).toBe("-1");
    });
});

describe("DataGrid — table mode (§8.27)", () => {
    test("§8.27 a plain table: role table, role cell, no roving tab stop, no grid keys", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, mode: "table", selectionMode: "multiple", labels: LABELS });
        const table = screen.getByRole("table", { name: "Users" });
        expect(table.getAttribute("role")).toBe("table");
        expect(screen.queryByRole("grid")).toBeNull();
        const cells = Array.from(document.querySelectorAll(".data-table-td"));
        expect(cells.length).toBeGreaterThan(0);
        for (const c of cells) {
            expect(c.getAttribute("role")).toBe("cell");
            expect(c.hasAttribute("tabindex")).toBe(false);
        }
        expect(tabbableCells()).toEqual([]);
        expect(press(cells[0], "ArrowDown").defaultPrevented).toBe(false);
        // Sort buttons and selection inputs are ordinary tab stops.
        expect(screen.getByRole("button", { name: "Name" }).hasAttribute("tabindex")).toBe(false);
        expect(screen.getByLabelText("Select all rows").hasAttribute("tabindex")).toBe(false);
        // The rest still works: sorting.
        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        expect(bodyRows()[0].textContent).toContain("Alice");
    });
});

describe("DataGrid — row headers and attribute hooks (§8.28, §8.29)", () => {
    test("§8.28 a rowHeader column renders th scope=row in the body", () => {
        const columns: DataGridColumn[] = [{ id: "name", header: "Name", rowHeader: true }, { id: "email", header: "Email" }];
        renderGrid({ label: "Users", columns, rows: ROWS });
        const th = bodyRows()[0].querySelector("th")!;
        expect(th.getAttribute("scope")).toBe("row");
        expect(th.getAttribute("role")).toBe("rowheader");
        expect(th.textContent?.trim()).toBe("Bob");
    });

    test("§8.29 rowClass, rowAttrs, cellClass, cellAttrs and align reach the DOM", () => {
        const columns: DataGridColumn[] = [
            { id: "name", header: "Name", align: "end", cellClass: (ctx) => `n-${String(ctx.value).toLowerCase()}`, cellAttrs: (ctx) => ({ "data-testid": `name-${String(ctx.value)}` }) },
            { id: "email", header: "Email", cellClass: "plain" },
        ];
        renderGrid({
                label: "Users", columns, rows: ROWS,
                rowClass: (row: Record<string, unknown>) => `row-${String(row.name)}`,
                rowAttrs: (row: Record<string, unknown>) => ({ "data-testid": `row-${String(row.name)}` }),
            });
        const row = screen.getByTestId("row-Bob");
        expect(row.classList.contains("row-Bob")).toBe(true);
        const nameCell = screen.getByTestId("name-Bob");
        expect(nameCell.classList.contains("n-bob")).toBe(true);
        expect(nameCell.getAttribute("data-align")).toBe("end");
        expect((nameCell as HTMLElement).style.textAlign).toBe("end");
        expect(row.querySelectorAll(".plain")).toHaveLength(1);
    });
});

describe("DataGrid — header content (§8.30)", () => {
    test("§8.30 headerCell replaces the header text inside the sort button; `header` stays the visibility label", () => {
        const headerCell = (ctx: { column: DataGridColumn }) => <span className="h-icon">{`★ ${ctx.column.header}`}</span>;
        const columns: DataGridColumn[] = [{ id: "name", header: "Name", sortable: true, hidable: true, headerCell }];
        renderGrid({ label: "Users", columns, rows: ROWS, labels: LABELS });
        const button = document.querySelector(".data-grid-sort-button")!;
        expect(button.querySelector(".h-icon")?.textContent).toBe("★ Name");
        expect(screen.getByLabelText("Show Name")).toBeTruthy();
    });
});

describe("DataGrid — empty, footer, busy (§8.31, §8.32)", () => {
    const empty = <span className="e-text">Nobody here</span>;
    const footer = (ctx: { rows: unknown[] }) => (
        <tr className="f-row"><td>{`${ctx.rows.length} rows`}</td></tr>
    );

    test("§8.31 with nothing to show an `empty` node fills one cell spanning every column", async () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: [], empty });
        const cell = document.querySelector(".data-grid-empty")!;
        expect(cell.getAttribute("colspan")).toBe("2");
        expect(cell.querySelector(".e-text")?.textContent).toBe("Nobody here");
    });

    test("§8.31 a filter that matches nothing shows it; without the node there is no extra row", async () => {
        const { unmount } = renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, empty, labels: LABELS, filter: "zzz" });
        expect(document.querySelector(".data-grid-empty")).not.toBeNull();
        unmount();
        renderGrid({ label: "Users", columns: COLUMNS, rows: [] });
        expect(document.querySelector(".data-grid-empty")).toBeNull();
        expect(bodyRows()).toHaveLength(0);
    });

    test("§8.32 a `footer` render prop renders in a tfoot, and busy sets aria-busy", () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, footer, busy: true });
        expect(document.querySelector("tfoot .f-row")?.textContent).toBe("2 rows");
        expect(screen.getByRole("grid").getAttribute("aria-busy")).toBe("true");
    });
});

describe("DataGrid — scroll region (§8.33)", () => {
    test("§8.33 the table sits in a named scroll region; only in table mode is the region a tab stop", () => {
        const { unmount } = renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS });
        const region = document.querySelector(".data-grid-scroll")!;
        expect(region.getAttribute("role")).toBe("region");
        expect(region.getAttribute("aria-label")).toBe("Users");
        expect(region.hasAttribute("tabindex")).toBe(false);
        unmount();
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, mode: "table" });
        expect(document.querySelector(".data-grid-scroll")!.getAttribute("tabindex")).toBe("0");
    });

    test("§8.33 scroll=false leaves the table unwrapped", () => {
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, scroll: false });
        expect(document.querySelector(".data-grid-scroll")).toBeNull();
        expect(screen.getByRole("grid")).toBeTruthy();
    });
});

describe("DataGrid — row activation (§8.34)", () => {
    test("§8.34 Enter on a body cell with no widget, and a click outside a widget, activate the row", async () => {
        const onRowActivate = vi.fn();
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, onRowActivate, rowId: (r: Record<string, unknown>) => String(r.name) });
        const cell = bodyRows()[1].querySelectorAll<HTMLElement>(".data-table-td")[0];
        press(cell, "Enter");
        expect(onRowActivate).toHaveBeenLastCalledWith(ROWS[1], "Alice");
        await fireEvent.click(bodyRows()[0].querySelectorAll(".data-table-td")[1]);
        expect(onRowActivate).toHaveBeenLastCalledWith(ROWS[0], "Bob");
        expect(onRowActivate).toHaveBeenCalledTimes(2);
    });

    test("§8.34 a click on a widget in the cell does not activate the row, and Enter on a cell with one enters it instead", async () => {
        const onRowActivate = vi.fn();
        renderGrid({ label: "Users", columns: WIDGET_COLUMNS, rows: ROWS, onRowActivate });
        await fireEvent.click(document.querySelector(".w-link")!);
        expect(onRowActivate).not.toHaveBeenCalled();
        const cell = bodyRows()[0].querySelectorAll<HTMLElement>(".data-table-td")[1];
        press(cell, "Enter");
        expect(onRowActivate).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(cell.querySelector(".w-link"));
    });

    test("§8.34 the header row never activates a row", async () => {
        const onRowActivate = vi.fn();
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, onRowActivate });
        await fireEvent.click(document.querySelector(".data-table-th")!);
        expect(onRowActivate).not.toHaveBeenCalled();
    });
});


describe("DataGrid — controlled and uncontrolled state (React)", () => {
    test("`selected` controls the selection; `defaultSelected` only seeds it", async () => {
        const { unmount } = renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS, selected: ["1"] });
        const radios = screen.getAllByRole("radio") as HTMLInputElement[];
        expect(radios.map((r) => r.checked)).toEqual([false, true]);
        await fireEvent.click(radios[0]);
        // Controlled: the consumer did not update `selected`, so nothing moves.
        expect((screen.getAllByRole("radio") as HTMLInputElement[]).map((r) => r.checked)).toEqual([false, true]);
        unmount();

        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS, defaultSelected: ["1"] });
        const seeded = screen.getAllByRole("radio") as HTMLInputElement[];
        expect(seeded.map((r) => r.checked)).toEqual([false, true]);
        await fireEvent.click(seeded[0]);
        expect((screen.getAllByRole("radio") as HTMLInputElement[]).map((r) => r.checked)).toEqual([true, false]);
    });

    test("`filter` and `defaultFilter` filter the rows; onFilterChange and onPageChange fire on input", async () => {
        const onFilterChange = vi.fn();
        const onPageChange = vi.fn();
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS, defaultFilter: "bob", onFilterChange, onPageChange });
        expect(bodyRows()).toHaveLength(1);
        await fireEvent.change(screen.getByRole("searchbox", { name: "Search rows" }), { target: { value: "ali" } });
        expect(onFilterChange).toHaveBeenLastCalledWith("ali");
        expect(onPageChange).toHaveBeenLastCalledWith(1);
        expect(bodyRows()[0].textContent).toContain("Alice");
    });

    test("`sort` controls the order and onSortChange reports each change", async () => {
        const onSortChange = vi.fn();
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, sort: { columnId: "name", direction: "ascending" }, onSortChange });
        expect(bodyRows()[0].textContent).toContain("Alice");
        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        expect(onSortChange).toHaveBeenLastCalledWith({ columnId: "name", direction: "descending" });
        // Controlled: still ascending until the consumer says otherwise.
        expect(bodyRows()[0].textContent).toContain("Alice");
    });

    test("`page` controls the page and onPageChange reports each change", async () => {
        const onPageChange = vi.fn();
        renderGrid({ label: "Users", columns: COLUMNS, rows: ROWS, pageSize: 1, labels: LABELS, page: 2, onPageChange });
        expect(bodyRows()[0].textContent).toContain("Alice");
        await fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
        expect(onPageChange).toHaveBeenLastCalledWith(1);
    });
});
