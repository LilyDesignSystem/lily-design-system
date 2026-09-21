import { render, screen, fireEvent, within } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import DataGrid from "./DataGrid.svelte";
import type { DataGridColumn, DataGridLabels } from "./DataGrid.svelte";

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
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS } });
        const root = document.querySelector(".data-grid");
        expect(root).toBeTruthy();
        const grid = within(root as HTMLElement).getByRole("grid");
        expect(grid.getAttribute("aria-label")).toBe("Users");
    });
});

describe("DataGrid — sorting (§8.2, §8.3)", () => {
    test("§8.2 a sortable column cycles ascending → descending → none, updating aria-sort", async () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS } });
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
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS } });
        const emailHeader = screen.getByText("Email").closest("th")!;
        expect(emailHeader.hasAttribute("aria-sort")).toBe(false);
    });

    test("§8.3 ascending sort reorders body rows by the active column's value", async () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS } });
        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        const firstRowCells = bodyRows()[0].querySelectorAll(".data-table-td");
        expect(firstRowCells[0].textContent).toBe("Alice");
    });
});

describe("DataGrid — filtering (§8.4)", () => {
    test("§8.4 the search box renders only when labels.search is set", () => {
        const { unmount } = render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS } });
        expect(document.querySelector(".data-grid-search")).toBeNull();
        unmount();

        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS } });
        expect(document.querySelector(".data-grid-search")).toBeTruthy();
    });

    test("§8.4 filters rows by case-insensitive substring across filterable columns", async () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS } });
        const search = screen.getByRole("searchbox", { name: "Search rows" });
        await fireEvent.input(search, { target: { value: "ALI" } });
        expect(bodyRows()).toHaveLength(1);
        expect(bodyRows()[0].textContent).toContain("Alice");
    });
});

describe("DataGrid — selection (§8.5, §8.6, §8.7)", () => {
    test("§8.5 selectionMode='single' keeps at most one id selected", async () => {
        const onSelectionChange = vi.fn();
        render(DataGrid, {
            props: { label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS, onSelectionChange },
        });
        const radios = screen.getAllByRole("radio");
        expect(radios).toHaveLength(2);
        await fireEvent.click(radios[0]);
        expect(onSelectionChange).toHaveBeenLastCalledWith(["0"]);
        await fireEvent.click(radios[1]);
        expect(onSelectionChange).toHaveBeenLastCalledWith(["1"]);
    });

    test("§8.6 selectionMode='multiple' ctrl-click toggles a row without clearing the rest", async () => {
        const onSelectionChange = vi.fn();
        render(DataGrid, {
            props: { label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "multiple", labels: LABELS, onSelectionChange },
        });
        const rowCheckboxes = within(document.querySelector(".data-table-body") as HTMLElement).getAllByRole("checkbox");
        await fireEvent.click(rowCheckboxes[0]);
        await fireEvent.click(rowCheckboxes[1], { ctrlKey: true });
        expect(onSelectionChange).toHaveBeenLastCalledWith(["0", "1"]);
    });

    test("§8.6 the select-all header control reflects all/none selected", async () => {
        render(DataGrid, {
            props: { label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "multiple", labels: LABELS },
        });
        const selectAll = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;
        expect(selectAll.checked).toBe(false);
        await fireEvent.click(selectAll);
        expect(selectAll.checked).toBe(true);
        await fireEvent.click(selectAll);
        expect(selectAll.checked).toBe(false);
    });

    test("§8.7 selected is bindable and onSelectionChange fires on every change", async () => {
        const onSelectionChange = vi.fn();
        render(DataGrid, {
            props: { label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS, onSelectionChange },
        });
        await fireEvent.click(screen.getAllByRole("radio")[0]);
        expect(onSelectionChange).toHaveBeenCalledTimes(1);
    });
});

describe("DataGrid — column resize (§8.8)", () => {
    test("§8.8 ArrowRight/ArrowLeft on a focused resize handle adjusts the column width", async () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS } });
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
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS } });
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
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, pageSize: 1, labels: LABELS } });
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
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS } });
        expect(tabbableCells()).toHaveLength(1);

        const grid = screen.getByRole("grid");
        let active = tabbableCells()[0];
        expect(active.tagName.toLowerCase()).toBe("th");

        await fireEvent.keyDown(active, { key: "ArrowDown" }, { target: grid });
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
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS } });
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
        render(DataGrid, {
            props: { label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS },
        });
        const status = document.querySelector(".data-grid-status")!;
        expect(status.getAttribute("aria-live")).toBe("polite");

        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        expect(status.textContent).toBe("Name sorted ascending");

        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "ali" } });
        expect(status.textContent).toBe("1 of 2 rows match");

        await fireEvent.click(screen.getAllByRole("radio")[0]);
        expect(status.textContent).toBe("1 selected");
    });

    test("§8.13 no announcement fires for a control whose label is absent", async () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS } });
        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        expect(document.querySelector(".data-grid-status")?.textContent).toBe("");
    });
});

describe("DataGrid — persistence (§8.14)", () => {
    test("§8.14 storageKey persists column widths / hidden columns / sort and restores on remount", async () => {
        const { unmount } = render(DataGrid, {
            props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS, storageKey: "lily-data-grid-test" },
        });
        await fireEvent.keyDown(screen.getByRole("separator", { name: "Resize Name" }), { key: "ArrowRight" });
        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        unmount();

        const saved = JSON.parse(localStorage.getItem("lily-data-grid-test")!);
        expect(saved.columnWidths.name).toBe(136);
        expect(saved.sort).toEqual({ columnId: "name", direction: "ascending" });

        render(DataGrid, {
            props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS, storageKey: "lily-data-grid-test" },
        });
        expect(screen.getByRole("button", { name: "Name" }).closest("th")?.getAttribute("style")).toContain("136px");
        expect(bodyRows()[0].querySelectorAll(".data-table-td")[0].textContent).toBe("Alice");
    });

    test("§8.14 never persists row data or the selection", async () => {
        render(DataGrid, {
            props: { label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS, storageKey: "lily-data-grid-test-2" },
        });
        await fireEvent.click(screen.getAllByRole("radio")[0]);
        const saved = JSON.parse(localStorage.getItem("lily-data-grid-test-2")!);
        expect(saved.rows).toBeUndefined();
        expect(saved.selected).toBeUndefined();
    });

    test("§8.14 with no storageKey, localStorage is never touched", () => {
        const getSpy = vi.spyOn(Storage.prototype, "getItem");
        const setSpy = vi.spyOn(Storage.prototype, "setItem");
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS } });
        expect(getSpy).not.toHaveBeenCalled();
        expect(setSpy).not.toHaveBeenCalled();
    });
});

describe("DataGrid — extra attributes and non-goals (§8.15, §8.16)", () => {
    test("§8.15 extra attributes spread onto the root", () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, "data-testid": "grid-root" } });
        expect(document.querySelector('[data-testid="grid-root"]')).toBeTruthy();
    });

    test("§8.16 every row of the current page renders eagerly — no virtualization", () => {
        const manyRows = Array.from({ length: 50 }, (_, i) => ({ name: `Row ${i}`, email: `row${i}@example.com` }));
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: manyRows } });
        expect(bodyRows()).toHaveLength(50);
    });
});
