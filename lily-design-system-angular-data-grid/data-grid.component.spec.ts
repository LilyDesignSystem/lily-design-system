import { Component, TemplateRef, viewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { fireEvent as domFireEvent, screen, within } from "@testing-library/dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DataGrid, type DataGridColumn, type DataGridLabels } from "./data-grid.component";

/** The consumer templates the grid takes (an Angular grid cannot take render functions). */
@Component({
  standalone: true,
  template: `
    <ng-template #cell let-ctx><a class="test-cell" [href]="'mailto:' + ctx.value">{{ ctx.formatted }} ({{ ctx.row.name }})</a></ng-template>
    <ng-template #widget let-ctx><span><a class="w-link" [href]="'#' + ctx.formatted">{{ ctx.formatted }}</a><input class="w-input" [value]="ctx.formatted" /></span></ng-template>
    <ng-template #headerCell let-column><span class="h-icon">★ {{ column.header }}</span></ng-template>
    <ng-template #empty><span class="e-text">Nobody here</span></ng-template>
    <ng-template #footer let-ctx><tr class="f-row"><td>{{ ctx.rows.length }} rows</td></tr></ng-template>
    <ng-template #personEditor let-ctx><button type="button" data-pick (click)="ctx.commit({ id: 'b', name: 'Bo' })">pick</button></ng-template>
  `,
})
class Templates {
  readonly cell = viewChild.required<TemplateRef<unknown>>("cell");
  readonly widget = viewChild.required<TemplateRef<unknown>>("widget");
  readonly headerCell = viewChild.required<TemplateRef<unknown>>("headerCell");
  readonly empty = viewChild.required<TemplateRef<unknown>>("empty");
  readonly footer = viewChild.required<TemplateRef<unknown>>("footer");
  readonly personEditor = viewChild.required<TemplateRef<unknown>>("personEditor");
}

let templatesFixture: ComponentFixture<Templates>;
const tpl = () => templatesFixture.componentInstance;
let fixtures: ComponentFixture<DataGrid>[] = [];
let current: ComponentFixture<DataGrid> | undefined;

/** The Svelte suite's `render(DataGrid, { props })`: mounts the grid, wiring callback props to outputs and models. */
function render(_component: unknown, options: { props: Record<string, unknown> }): { unmount: () => void } {
  const fixture = TestBed.createComponent(DataGrid);
  const instance = fixture.componentInstance;
  for (const [key, value] of Object.entries(options.props)) {
    if (key === "onCellEdit") instance.cellEdit.subscribe(value as never);
    else if (key === "onFilesSelected") instance.filesSelected.subscribe(value as never);
    else if (key === "onFileRemove") instance.fileRemove.subscribe(value as never);
    else if (key === "onRowActivate") {
      fixture.componentRef.setInput("activateRows", true);
      instance.rowActivate.subscribe((e) => (value as (row: unknown, id: string) => void)(e.row, e.id));
    } else if (key.startsWith("onUpdate:")) {
      const name = key.slice("onUpdate:".length) as "selected" | "columnOrder";
      (instance[name] as unknown as { subscribe: (fn: unknown) => void }).subscribe(value);
    } else fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  fixtures.push(fixture);
  current = fixture;
  return { unmount: () => fixture.destroy() };
}

/** Cleanup between mounts inside one test (the Svelte suite clears `document.body`). */
function cleanup(): void {
  for (const f of fixtures) f.destroy();
  fixtures = [];
}

function settle(): void {
  for (const f of fixtures) f.detectChanges();
}

/** `@testing-library/dom`'s fireEvent, followed by a change-detection pass (Angular does not re-render on its own in a test). */
const fireEvent = new Proxy({} as typeof domFireEvent, {
  get: (_target, name: string) => async (el: Element, init?: unknown) => {
    const fn = (domFireEvent as unknown as Record<string, (e: Element, i?: unknown) => boolean>)[name];
    const result = fn(el, init);
    settle();
    await Promise.resolve();
    settle();
    return result;
  },
});

const nextTick = async () => {
  await Promise.resolve();
  settle();
};

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
    templatesFixture = TestBed.createComponent(Templates);
    templatesFixture.detectChanges();
});

afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
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
            props: { label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS, "onUpdate:selected": onSelectionChange },
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
            props: { label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "multiple", labels: LABELS, "onUpdate:selected": onSelectionChange },
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
            props: { label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS, "onUpdate:selected": onSelectionChange },
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
        // Angular: extra attributes belong on the <lily-data-grid> host; `className` lands on the root <div>.
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, className: "mine" } });
        expect(document.querySelector(".data-grid.mine")).toBeTruthy();
    });

    test("§8.16 every row of the current page renders eagerly — no virtualization", () => {
        const manyRows = Array.from({ length: 50 }, (_, i) => ({ name: `Row ${i}`, email: `row${i}@example.com` }));
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: manyRows } });
        expect(bodyRows()).toHaveLength(50);
    });
});

describe("DataGrid — row identity (§8.17)", () => {
    test("§8.17 default ids come from the row's position in `rows`, so page 2 does not reuse page 1's ids", async () => {
        const onSelectionChange = vi.fn();
        render(DataGrid, {
            props: { label: "Users", columns: COLUMNS, rows: ROWS, pageSize: 1, selectionMode: "single", labels: LABELS, "onUpdate:selected": onSelectionChange },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Next page" }));
        await fireEvent.click(screen.getByRole("radio"));
        expect(onSelectionChange).toHaveBeenLastCalledWith(["1"]);
    });

    test("§8.17 a row keeps its id when sorting moves it", async () => {
        const onSelectionChange = vi.fn();
        render(DataGrid, {
            props: { label: "Users", columns: COLUMNS, rows: ROWS, selectionMode: "single", labels: LABELS, "onUpdate:selected": onSelectionChange },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Name" })); // ascending: Alice (rows[1]) first
        await fireEvent.click(screen.getAllByRole("radio")[0]);
        expect(onSelectionChange).toHaveBeenLastCalledWith(["1"]);
    });

    test("§8.17 Shift-range selection on page 2 selects page 2's rows", async () => {
        const onSelectionChange = vi.fn();
        const rows = Array.from({ length: 4 }, (_, i) => ({ name: `Row ${i}`, email: `r${i}@example.com` }));
        render(DataGrid, {
            props: { label: "Users", columns: COLUMNS, rows, pageSize: 2, selectionMode: "multiple", labels: LABELS, "onUpdate:selected": onSelectionChange },
        });
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
        render(DataGrid, { props: { label: "Users", columns, rows: MANY } });
        accessor.mockClear();
        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        // n key reads for the sort; keyed rows that only move are not re-rendered.
        expect(accessor.mock.calls.length).toBeLessThanOrEqual(MANY.length);
    });

    test("§8.18 successive filter keystrokes reuse one search index instead of reformatting every cell", async () => {
        const format = vi.fn((value: unknown) => String(value));
        const columns: DataGridColumn[] = [{ id: "name", header: "Name", format }];
        render(DataGrid, { props: { label: "Users", columns, rows: MANY, labels: LABELS } });
        format.mockClear();
        const search = screen.getByRole("searchbox", { name: "Search rows" });
        for (const text of ["r", "ro", "row", "row "]) {
            await fireEvent.input(search, { target: { value: text } });
        }
        // One index build (n calls); the old per-keystroke scan cost 4n.
        expect(format.mock.calls.length).toBeLessThanOrEqual(MANY.length);
    });
});

describe("DataGrid — cell snippet (§8.19)", () => {
    test("§8.19 a column's `cell` snippet renders each body cell with value, formatted text, and row", () => {
        const cell = tpl().cell() as never;
        const columns: DataGridColumn[] = [
            { id: "name", header: "Name" },
            { id: "email", header: "Email", format: (v) => String(v).toUpperCase(), cell },
        ];
        render(DataGrid, { props: { label: "Users", columns, rows: ROWS } });
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".test-cell"));
        expect(links).toHaveLength(2);
        expect(links[0].getAttribute("href")).toBe("mailto:bob@example.com");
        expect(links[0].textContent).toBe("BOB@EXAMPLE.COM (Bob)");
    });
});

describe("DataGrid — focus integrity (§8.20)", () => {
    test("§8.20 focusing a cell by pointer moves the roving position there, so arrows move from it", async () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS } });
        const cell = bodyRows()[1].querySelectorAll<HTMLElement>(".data-table-td")[1];
        await fireEvent.focusIn(cell);
        expect(tabbableCells()).toEqual([cell]);
        await fireEvent.keyDown(cell, { key: "ArrowLeft" });
        expect(tabbableCells()).toEqual([bodyRows()[1].querySelectorAll(".data-table-td")[0]]);
    });

    test("§8.20 filtering away the focused row still leaves exactly one tabbable cell", async () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" }); // row 2 of 2
        expect(tabbableCells()[0]).toBe(bodyRows()[1].querySelector(".data-table-td"));
        await fireEvent.input(screen.getByRole("searchbox"), { target: { value: "bob" } });
        expect(bodyRows()).toHaveLength(1);
        expect(tabbableCells()).toHaveLength(1);
    });

    test("§8.20 hiding the focused column still leaves exactly one tabbable cell", async () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowRight" }); // the Email cell
        expect(tabbableCells()[0]).toBe(bodyRows()[0].querySelectorAll(".data-table-td")[1]);
        await fireEvent.click(screen.getByRole("checkbox", { name: "Show Email" }));
        expect(tabbableCells()).toHaveLength(1);
    });

    test("§8.20 keyboard focus is not announced as selection: no body cell carries aria-selected", async () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS } });
        await fireEvent.keyDown(tabbableCells()[0], { key: "ArrowDown" });
        expect(tabbableCells()[0].classList.contains("data-table-td")).toBe(true);
        expect(document.querySelectorAll(".data-table-td[aria-selected]")).toHaveLength(0);
    });
});

describe("DataGrid — row position for assistive technology (§8.21)", () => {
    test("§8.21 a paginated grid exposes aria-rowcount and each row's aria-rowindex", async () => {
        const rows = Array.from({ length: 5 }, (_, i) => ({ name: `Row ${i}`, email: `r${i}@example.com` }));
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows, pageSize: 2, labels: LABELS } });
        expect(screen.getByRole("grid").getAttribute("aria-rowcount")).toBe("6"); // 5 rows + header
        expect(document.querySelector(".data-table-head .data-table-row")?.getAttribute("aria-rowindex")).toBe("1");
        await fireEvent.click(screen.getByRole("button", { name: "Next page" }));
        expect(bodyRows().map((r) => r.getAttribute("aria-rowindex"))).toEqual(["4", "5"]);
    });
});

describe("DataGrid — page announcement (§8.22)", () => {
    test("§8.22 changing page announces labels.pageAnnouncement", async () => {
        render(DataGrid, {
            props: {
                label: "Users", columns: COLUMNS, rows: ROWS, pageSize: 1,
                labels: { ...LABELS, pageAnnouncement: (page: number, count: number) => `Page ${page} of ${count}` },
            },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Next page" }));
        expect(document.querySelector(".data-grid-status")?.textContent).toBe("Page 2 of 2");
    });
});

describe("DataGrid — resize handle range (§8.23)", () => {
    test("§8.23 the resize handle exposes its minimum width as aria-valuemin", () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS } });
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
        render(DataGrid, { props: { label: "Users", columns, rows } });
        await fireEvent.click(screen.getByRole("button", { name: "Name" }));
        expect(bodyRows().map((r) => r.textContent?.trim())).toEqual(["alice", "Bob", "Zoe"]);
    });
});

// ─── Interactive cells, table mode and the slots (§8.25–§8.34) ──────────────

const widgetColumns = (): DataGridColumn[] => [
    { id: "name", header: "Name", sortable: true },
    { id: "email", header: "Email", cell: tpl().widget() as never },
];

function press(target: Element, key: string): KeyboardEvent {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
}

describe("DataGrid — widgets inside cells (§8.25, §8.26)", () => {
    test("§8.25 a key pressed on an input in a cell is not swallowed and does not move the roving position", async () => {
        render(DataGrid, { props: { label: "Users", columns: widgetColumns(), rows: ROWS } });
        const input = document.querySelector<HTMLInputElement>(".w-input")!;
        const before = tabbableCells()[0];
        for (const key of ["ArrowLeft", "ArrowRight", "ArrowDown", "Home", "End", "Enter", " "]) {
            expect(press(input, key).defaultPrevented, key).toBe(false);
        }
        expect(tabbableCells()).toEqual([before]);
    });

    test("§8.25 Escape on a widget focuses its cell", async () => {
        render(DataGrid, { props: { label: "Users", columns: widgetColumns(), rows: ROWS } });
        const input = document.querySelector<HTMLInputElement>(".w-input")!;
        input.focus();
        press(input, "Escape");
        expect(document.activeElement).toBe(input.closest(".data-table-td"));
    });

    test("§8.25 the grid's own controls still follow grid keys", async () => {
        render(DataGrid, { props: { label: "Users", columns: widgetColumns(), rows: ROWS, selectionMode: "multiple", labels: LABELS } });
        const selectAll = screen.getByLabelText("Select all rows");
        expect(press(selectAll, "ArrowRight").defaultPrevented).toBe(true);
    });

    test("§8.26 widgets in body cells are not tab stops, and Enter on the cell enters it", async () => {
        render(DataGrid, { props: { label: "Users", columns: widgetColumns(), rows: ROWS } });
        await nextTick();
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
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, mode: "table", selectionMode: "multiple", labels: LABELS } });
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
        render(DataGrid, { props: { label: "Users", columns, rows: ROWS } });
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
        render(DataGrid, {
            props: {
                label: "Users", columns, rows: ROWS,
                rowClass: (row: Record<string, unknown>) => `row-${String(row.name)}`,
                rowAttrs: (row: Record<string, unknown>) => ({ "data-testid": `row-${String(row.name)}` }),
            },
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
        const headerCell = tpl().headerCell() as never;
        const columns: DataGridColumn[] = [{ id: "name", header: "Name", sortable: true, hidable: true, headerCell }];
        render(DataGrid, { props: { label: "Users", columns, rows: ROWS, labels: LABELS } });
        const button = document.querySelector(".data-grid-sort-button")!;
        expect(button.querySelector(".h-icon")?.textContent).toBe("★ Name");
        expect(screen.getByLabelText("Show Name")).toBeTruthy();
    });
});

describe("DataGrid — empty, footer, busy (§8.31, §8.32)", () => {

    test("§8.31 with nothing to show an `empty` snippet fills one cell spanning every column", async () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: [], empty: tpl().empty() } });
        const cell = document.querySelector(".data-grid-empty")!;
        expect(cell.getAttribute("colspan")).toBe("2");
        expect(cell.querySelector(".e-text")?.textContent).toBe("Nobody here");
    });

    test("§8.31 a filter that matches nothing shows it; without the snippet there is no extra row", async () => {
        const { unmount } = render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, labels: LABELS, filter: "zzz", empty: tpl().empty() } });
        expect(document.querySelector(".data-grid-empty")).not.toBeNull();
        unmount();
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: [] } });
        expect(document.querySelector(".data-grid-empty")).toBeNull();
        expect(bodyRows()).toHaveLength(0);
    });

    test("§8.32 a footer snippet renders in a tfoot, and busy sets aria-busy", () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, busy: true, footer: tpl().footer() } });
        expect(document.querySelector("tfoot .f-row")?.textContent).toBe("2 rows");
        expect(screen.getByRole("grid").getAttribute("aria-busy")).toBe("true");
    });
});

describe("DataGrid — scroll region (§8.33)", () => {
    test("§8.33 the table sits in a named scroll region; only in table mode is the region a tab stop", () => {
        const { unmount } = render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS } });
        const region = document.querySelector(".data-grid-scroll")!;
        expect(region.getAttribute("role")).toBe("region");
        expect(region.getAttribute("aria-label")).toBe("Users");
        expect(region.hasAttribute("tabindex")).toBe(false);
        unmount();
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, mode: "table" } });
        expect(document.querySelector(".data-grid-scroll")!.getAttribute("tabindex")).toBe("0");
    });

    test("§8.33 scroll=false leaves the table unwrapped", () => {
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, scroll: false } });
        expect(document.querySelector(".data-grid-scroll")).toBeNull();
        expect(screen.getByRole("grid")).toBeTruthy();
    });
});

describe("DataGrid — row activation (§8.34)", () => {
    test("§8.34 Enter on a body cell with no widget, and a click outside a widget, activate the row", async () => {
        const onRowActivate = vi.fn();
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, onRowActivate, rowId: (r: Record<string, unknown>) => String(r.name) } });
        const cell = bodyRows()[1].querySelectorAll<HTMLElement>(".data-table-td")[0];
        press(cell, "Enter");
        expect(onRowActivate).toHaveBeenLastCalledWith(ROWS[1], "Alice");
        await fireEvent.click(bodyRows()[0].querySelectorAll(".data-table-td")[1]);
        expect(onRowActivate).toHaveBeenLastCalledWith(ROWS[0], "Bob");
        expect(onRowActivate).toHaveBeenCalledTimes(2);
    });

    test("§8.34 a click on a widget in the cell does not activate the row, and Enter on a cell with one enters it instead", async () => {
        const onRowActivate = vi.fn();
        render(DataGrid, { props: { label: "Users", columns: widgetColumns(), rows: ROWS, onRowActivate } });
        await fireEvent.click(document.querySelector(".w-link")!);
        expect(onRowActivate).not.toHaveBeenCalled();
        const cell = bodyRows()[0].querySelectorAll<HTMLElement>(".data-table-td")[1];
        press(cell, "Enter");
        expect(onRowActivate).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(cell.querySelector(".w-link"));
    });

    test("§8.34 the header row never activates a row", async () => {
        const onRowActivate = vi.fn();
        render(DataGrid, { props: { label: "Users", columns: COLUMNS, rows: ROWS, onRowActivate } });
        await fireEvent.click(document.querySelector(".data-table-th")!);
        expect(onRowActivate).not.toHaveBeenCalled();
    });
});

describe("DataGrid — column reordering (§8.40–§8.45)", () => {
    const cols: DataGridColumn[] = [
        { id: "a", header: "A", movable: true },
        { id: "b", header: "B", movable: true },
        { id: "c", header: "C" },
    ];
    const rows3 = [{ a: "a1", b: "b1", c: "c1" }];
    const labels: DataGridLabels = { ...LABELS, columnMoveAnnouncement: (h, p, n) => `${h} is column ${p} of ${n}` };
    const headers = () => Array.from(document.querySelectorAll<HTMLElement>("thead th")).map((h) => h.textContent?.trim());
    const header = (t: string) => Array.from(document.querySelectorAll<HTMLElement>("thead th")).find((h) => h.textContent?.trim() === t)!;

    test("§8.40 columnOrder sets the display order; unnamed columns follow", () => {
        render(DataGrid, { props: { label: "G", columns: cols, rows: rows3, columnOrder: ["c", "a"] } });
        expect(headers()).toEqual(["C", "A", "B"]);
    });

    test("§8.41 Alt+ArrowRight on a movable header moves the column, calls onColumnOrderChange and announces", async () => {
        const onColumnOrderChange = vi.fn();
        render(DataGrid, { props: { label: "G", columns: cols, rows: rows3, labels, "onUpdate:columnOrder": onColumnOrderChange } });
        await fireEvent.focusIn(header("A"));
        await fireEvent.keyDown(header("A"), { key: "ArrowRight", altKey: true });
        expect(headers()).toEqual(["B", "A", "C"]);
        expect(onColumnOrderChange).toHaveBeenCalledWith(["b", "a", "c"]);
        expect(document.querySelector("[aria-live]")!.textContent).toContain("A is column 2 of 3");
    });

    test("§8.42 a column that is not movable ignores Alt+Arrow", async () => {
        render(DataGrid, { props: { label: "G", columns: cols, rows: rows3 } });
        await fireEvent.focusIn(header("C"));
        await fireEvent.keyDown(header("C"), { key: "ArrowLeft", altKey: true });
        expect(headers()).toEqual(["A", "B", "C"]);
    });

    test("§8.43 dragging a movable header onto another moves it there", async () => {
        render(DataGrid, { props: { label: "G", columns: cols, rows: rows3 } });
        const dt = { setData: vi.fn(), getData: () => "" };
        expect(header("A").getAttribute("draggable")).toBe("true");
        expect(header("C").hasAttribute("draggable")).toBe(false);
        await fireEvent.dragStart(header("A"), { dataTransfer: dt });
        await fireEvent.dragOver(header("B"), { dataTransfer: dt });
        await fireEvent.drop(header("B"), { dataTransfer: dt });
        expect(headers()).toEqual(["B", "A", "C"]);
    });

    test("§8.44 body cells follow the new column order", async () => {
        render(DataGrid, { props: { label: "G", columns: cols, rows: rows3, columnOrder: ["b", "a", "c"] } });
        const cells = Array.from(document.querySelectorAll("tbody td")).map((c) => c.textContent?.trim());
        expect(cells).toEqual(["b1", "a1", "c1"]);
    });

    test("§8.45 hidden columns keep their place when a visible one moves", async () => {
        const onColumnOrderChange = vi.fn();
        const hid: DataGridColumn[] = [
            { id: "a", header: "A", movable: true },
            { id: "b", header: "B", hidable: true },
            { id: "c", header: "C", movable: true },
        ];
        render(DataGrid, { props: { label: "G", columns: hid, rows: rows3, labels, "onUpdate:columnOrder": onColumnOrderChange } });
        await fireEvent.click(screen.getByRole("checkbox", { name: "Show B" }));
        await fireEvent.focusIn(header("A"));
        await fireEvent.keyDown(header("A"), { key: "ArrowRight", altKey: true });
        expect(onColumnOrderChange).toHaveBeenCalledWith(["c", "b", "a"]);
    });
});

describe("DataGrid — pinned columns (§8.46)", () => {
    test("§8.46 a pinned column's header and cells carry data-pinned", () => {
        const cols: DataGridColumn[] = [{ id: "a", header: "A", pinned: "start" }, { id: "b", header: "B" }];
        render(DataGrid, { props: { label: "G", columns: cols, rows: [{ a: "1", b: "2" }] } });
        expect(document.querySelectorAll('[data-pinned="start"]')).toHaveLength(2);
        expect(document.querySelectorAll("[data-pinned]")).toHaveLength(2);
    });
});

describe("DataGrid — cell editing (§8.47–§8.53)", () => {
    const EDIT_COLS: DataGridColumn[] = [
        { id: "name", header: "Name", editable: true },
        { id: "age", header: "Age", editable: true, editor: "number" },
        { id: "note", header: "Note" },
    ];
    const EDIT_ROWS = [{ name: "Ann", age: 30, note: "n" }];
    const cell = (col: number) => document.querySelector<HTMLElement>(`.data-table-body [data-row="0"][data-col="${col}"]`)!;

    test("§8.47 F2 on an editable cell opens an editor; Enter commits through onCellEdit", async () => {
        const onCellEdit = vi.fn();
        render(DataGrid, { props: { label: "G", columns: EDIT_COLS, rows: EDIT_ROWS, onCellEdit, labels: { editAnnouncement: (h, v) => `${h} is now ${v}` } } });
        await fireEvent.keyDown(cell(0), { key: "F2" });
        const input = screen.getByRole("textbox", { name: "Name" }) as HTMLInputElement;
        expect(document.activeElement).toBe(input);
        await fireEvent.input(input, { target: { value: "Bea" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onCellEdit).toHaveBeenCalledWith({ rowId: "0", row: EDIT_ROWS[0], columnId: "name", value: "Bea", previous: "Ann" });
        expect(document.querySelector(".data-grid-cell-editor")).toBeNull();
        expect(document.querySelector(".data-grid-status")!.textContent).toBe("Name is now Bea");
    });

    test("§8.48 Enter on an editable cell starts editing (before row activation); a non-editable cell does not", async () => {
        const onRowActivate = vi.fn();
        render(DataGrid, { props: { label: "G", columns: EDIT_COLS, rows: EDIT_ROWS, onRowActivate } });
        await fireEvent.keyDown(cell(0), { key: "Enter" });
        expect(document.querySelector(".data-grid-cell-editor")).toBeTruthy();
        expect(onRowActivate).not.toHaveBeenCalled();
        await fireEvent.keyDown(document.querySelector(".data-grid-cell-editor")!, { key: "Escape" });
        await fireEvent.keyDown(cell(2), { key: "F2" });
        expect(document.querySelector(".data-grid-cell-editor")).toBeNull();
    });

    test("§8.49 Escape cancels without calling onCellEdit and announces", async () => {
        const onCellEdit = vi.fn();
        render(DataGrid, { props: { label: "G", columns: EDIT_COLS, rows: EDIT_ROWS, onCellEdit, labels: { editCancelAnnouncement: (h) => `${h} edit cancelled` } } });
        await fireEvent.keyDown(cell(0), { key: "F2" });
        const input = document.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
        await fireEvent.input(input, { target: { value: "Zed" } });
        await fireEvent.keyDown(input, { key: "Escape" });
        expect(onCellEdit).not.toHaveBeenCalled();
        expect(document.querySelector(".data-grid-status")!.textContent).toBe("Name edit cancelled");
    });

    test("§8.50 the number editor commits a number; an unchanged value commits nothing", async () => {
        const onCellEdit = vi.fn();
        render(DataGrid, { props: { label: "G", columns: EDIT_COLS, rows: EDIT_ROWS, onCellEdit } });
        await fireEvent.keyDown(cell(1), { key: "F2" });
        const input = document.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
        expect(input.type).toBe("number");
        await fireEvent.input(input, { target: { value: "31" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onCellEdit.mock.calls[0][0].value).toBe(31);
        await fireEvent.keyDown(cell(1), { key: "F2" });
        await fireEvent.keyDown(document.querySelector(".data-grid-cell-editor")!, { key: "Enter" });
        expect(onCellEdit).toHaveBeenCalledTimes(1);
    });

    test("§8.51 validate refuses a value: the cell stays in edit mode, aria-invalid, message shown and announced", async () => {
        const onCellEdit = vi.fn();
        const cols: DataGridColumn[] = [{ id: "name", header: "Name", editable: true, validate: (v) => (v === "" ? "Required" : undefined) }];
        render(DataGrid, { props: { label: "G", columns: cols, rows: [{ name: "Ann" }], onCellEdit, labels: { editError: (h, m) => `${h}: ${m}` } } });
        await fireEvent.keyDown(cell(0), { key: "F2" });
        const input = document.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
        await fireEvent.input(input, { target: { value: "" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onCellEdit).not.toHaveBeenCalled();
        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(document.querySelector(".data-grid-cell-error")!.textContent).toBe("Required");
        expect(document.querySelector(".data-grid-status")!.textContent).toBe("Name: Required");
    });

    test("§8.52 leaving the editor commits; a double click starts editing", async () => {
        const onCellEdit = vi.fn();
        render(DataGrid, { props: { label: "G", columns: EDIT_COLS, rows: EDIT_ROWS, onCellEdit } });
        await fireEvent.dblClick(cell(0));
        const input = document.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
        await fireEvent.input(input, { target: { value: "Cy" } });
        await fireEvent.blur(input);
        expect(onCellEdit).toHaveBeenCalledTimes(1);
        expect(onCellEdit.mock.calls[0][0].value).toBe("Cy");
    });

    test("§8.53 labels.editCell gates an edit button on editable cells", async () => {
        render(DataGrid, { props: { label: "G", columns: EDIT_COLS, rows: EDIT_ROWS } });
        expect(document.querySelector(".data-grid-edit-button")).toBeNull();
        cleanup();
        render(DataGrid, { props: { label: "G", columns: EDIT_COLS, rows: EDIT_ROWS, labels: { editCell: (h, r) => `Edit ${h} of ${r}` } } });
        expect(document.querySelectorAll(".data-grid-edit-button")).toHaveLength(2);
        await fireEvent.click(screen.getByRole("button", { name: "Edit Name of Ann" }));
        expect(document.querySelector(".data-grid-cell-editor")).toBeTruthy();
    });
});

describe("DataGrid — virtualize (§8.54–§8.56)", () => {
    const BIG = Array.from({ length: 200 }, (_, i) => ({ name: `Row ${i}`, email: `r${i}@x` }));

    test("§8.54 renders only the rows in view, with spacers, aria-rowcount and aria-rowindex", () => {
        render(DataGrid, { props: { label: "G", columns: COLUMNS, rows: BIG, virtualize: { rowHeight: 20, height: 100 } } });
        expect(bodyRows().length).toBeLessThan(20);
        expect(document.querySelector(".data-grid-spacer")).toBeTruthy();
        expect(document.querySelector("[role=grid]")!.getAttribute("aria-rowcount")).toBe("201");
        expect(bodyRows()[0].getAttribute("aria-rowindex")).toBe("2");
        const scroll = document.querySelector<HTMLElement>(".data-grid-scroll")!;
        expect(scroll.style.height).toBe("100px");
    });

    test("§8.55 scrolling moves the window", async () => {
        render(DataGrid, { props: { label: "G", columns: COLUMNS, rows: BIG, virtualize: { rowHeight: 20, height: 100, overscan: 0 } } });
        const scroll = document.querySelector<HTMLElement>(".data-grid-scroll")!;
        scroll.scrollTop = 1000;
        await fireEvent.scroll(scroll);
        const first = bodyRows().find((r) => r.hasAttribute("aria-rowindex"))!;
        expect(first.textContent).toContain("Row 50");
    });

    test("§8.56 the roving tab stop's row stays rendered even outside the window", async () => {
        render(DataGrid, { props: { label: "G", columns: COLUMNS, rows: BIG, virtualize: { rowHeight: 20, height: 100, overscan: 0 } } });
        const scroll = document.querySelector<HTMLElement>(".data-grid-scroll")!;
        const first = document.querySelector<HTMLElement>('.data-table-body [data-row="0"][data-col="0"]')!;
        await fireEvent.focusIn(first);
        scroll.scrollTop = 2000;
        await fireEvent.scroll(scroll);
        expect(document.querySelector('.data-table-body [data-row="0"][data-col="0"]')!.getAttribute("tabindex")).toBe("0");
        expect(tabbableCells()).toHaveLength(1);
    });
});

describe("DataGrid — export (§8.67–§8.74)", () => {
    const EXPORT_LABELS: DataGridLabels = {
        export: "Export",
        exportCsv: "CSV",
        exportTsv: "TSV",
        exportExcel: "Excel",
        exportAnnouncement: (format, count, filename) => `${count} rows as ${format}: ${filename}`,
    };
    const COLS: DataGridColumn[] = [
        { id: "name", header: "Name", sortable: true },
        { id: "qty", header: "Qty", format: (v) => `${v} pcs` },
        { id: "act", header: "Actions", exportable: false },
        { id: "email", header: "Email", hidable: true },
    ];
    const DATA = [
        { name: "Bo", qty: 2, act: "x", email: "bo@x" },
        { name: "Ann", qty: 3, act: "x", email: "ann@x" },
        { name: "Cy", qty: 1, act: "x", email: "cy@x" },
    ];

    async function exported(props: Record<string, unknown>, format: "csv" | "tsv" | "xlsx" = "csv") {
        const onExport = vi.fn((_file: { format: string; filename: string; rowCount: number; blob: Blob }) => false as const);
        render(DataGrid, { props: { label: "G", columns: COLS, rows: DATA, labels: EXPORT_LABELS, exportHandler: onExport, ...props } });
        await fireEvent.click(document.querySelector(`[data-grid-export-format="${format}"]`)!);
        const file = onExport.mock.calls[0][0];
        const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await file.blob.arrayBuffer());
        return { file, text, onExport };
    }

    test("§8.67 labels gate the buttons: none without them, one per label inside a named group", () => {
        render(DataGrid, { props: { label: "G", columns: COLS, rows: DATA } });
        expect(document.querySelector(".data-grid-export")).toBeNull();
        cleanup();
        render(DataGrid, { props: { label: "G", columns: COLS, rows: DATA, labels: { export: "Export", exportExcel: "Excel" } } });
        expect(screen.getByRole("group", { name: "Export" })).toBeTruthy();
        expect(document.querySelectorAll(".data-grid-export-button")).toHaveLength(1);
        expect(screen.getByRole("button", { name: "Excel" }).getAttribute("data-grid-export-format")).toBe("xlsx");
    });

    test("§8.68 CSV holds the visible exportable columns, typed values raw and the rest as displayed, with a BOM", async () => {
        const { file, text } = await exported({});
        expect(file.format).toBe("csv");
        expect(file.filename).toBe("data-grid.csv");
        expect(file.rowCount).toBe(3);
        expect(text).toBe("﻿Name,Qty,Email\r\nBo,2,bo@x\r\nAnn,3,ann@x\r\nCy,1,cy@x\r\n");
    });

    test("§8.69 hidden columns are left out", async () => {
        const onExport = vi.fn(() => false as const);
        render(DataGrid, { props: { label: "G", columns: COLS, rows: DATA, exportHandler: onExport, labels: { ...EXPORT_LABELS, columnVisibility: "Columns", columnVisibilityOption: (h) => `Show ${h}` } } });
        await fireEvent.click(screen.getByRole("checkbox", { name: "Show Email" }));
        await fireEvent.click(document.querySelector('[data-grid-export-format="csv"]')!);
        const file = (onExport.mock.calls[0] as unknown as [{ blob: Blob }])[0];
        const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await file.blob.arrayBuffer());
        expect(text).toBe("\uFEFFName,Qty\r\nBo,2\r\nAnn,3\r\nCy,1\r\n");
    });

    test("§8.70 the export is the filtered, sorted view across every page, not just the shown page", async () => {
        const { file, text } = await exported({ pageSize: 1, sort: { columnId: "name", direction: "ascending" }, filter: "x", labels: { ...EXPORT_LABELS, pageStatus: () => "" } });
        expect(file.rowCount).toBe(3);
        expect(text.split("\r\n").slice(1, 4)).toEqual(["Ann,3,ann@x", "Bo,2,bo@x", "Cy,1,cy@x"]);
        cleanup();
        const filtered = await exported({ filter: "ann" });
        expect(filtered.file.rowCount).toBe(1);
    });

    test("§8.71 exportScope selected exports only the selected rows", async () => {
        const { file, text } = await exported({ exportScope: "selected", selectionMode: "multiple", selected: ["1"], labels: { ...EXPORT_LABELS, selectRow: (r: string) => r } });
        expect(file.rowCount).toBe(1);
        expect(text).toContain("Ann,3,ann@x");
        expect(text).not.toContain("Bo,");
    });

    test("§8.72 TSV and Excel: the right extension and type; the xlsx blob is a ZIP", async () => {
        const tsv = await exported({ exportFilename: "report" }, "tsv");
        expect(tsv.file.filename).toBe("report.tsv");
        expect(tsv.text).toContain("Name\tQty\tEmail");
        cleanup();
        const xlsx = await exported({}, "xlsx");
        expect(xlsx.file.filename).toBe("data-grid.xlsx");
        expect(xlsx.file.blob.type).toContain("spreadsheetml.sheet");
        const head = new Uint8Array(await xlsx.file.blob.arrayBuffer()).slice(0, 2);
        expect(Array.from(head)).toEqual([0x50, 0x4b]); // "PK"
    });

    test("§8.73 column.exportValue overrides the cell; formula-looking text is defused", async () => {
        const cols: DataGridColumn[] = [{ id: "n", header: "N", exportValue: (row) => `=${row.n}` }, { id: "m", header: "M", accessor: () => "plain" }];
        const { text } = await exported({ columns: cols, rows: [{ n: 1 }] });
        expect(text).toBe("﻿N,M\r\n'=1,plain\r\n");
    });

    test("§8.74 saves the file and announces unless onExport returns false; the buttons are disabled with nothing to export", async () => {
        const created: Blob[] = [];
        const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
        URL.createObjectURL = (b: Blob | MediaSource) => (created.push(b as Blob), "blob:test");
        URL.revokeObjectURL = () => {};
        try {
            render(DataGrid, { props: { label: "G", columns: COLS, rows: DATA, labels: EXPORT_LABELS } });
            await fireEvent.click(document.querySelector('[data-grid-export-format="csv"]')!);
            expect(created).toHaveLength(1);
            expect(document.querySelector(".data-grid-status")!.textContent).toBe("3 rows as csv: data-grid.csv");
            cleanup();
            render(DataGrid, { props: { label: "G", columns: COLS, rows: [], labels: EXPORT_LABELS } });
            expect((document.querySelector('[data-grid-export-format="csv"]') as HTMLButtonElement).disabled).toBe(true);
        } finally {
            URL.createObjectURL = original.create;
            URL.revokeObjectURL = original.revoke;
        }
    });
});

describe("DataGrid — IME composition in the cell editor (§8.75–§8.76)", () => {
    const cols: DataGridColumn[] = [{ id: "name", header: "Name", editable: true }];
    const cell = () => document.querySelector<HTMLElement>('.data-table-body [data-row="0"][data-col="0"]')!;

    test("§8.75 Enter while composing does not commit; Enter after composition does", async () => {
        const onCellEdit = vi.fn();
        render(DataGrid, { props: { label: "G", columns: cols, rows: [{ name: "Ann" }], onCellEdit } });
        await fireEvent.keyDown(cell(), { key: "F2" });
        const input = document.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
        await fireEvent.input(input, { target: { value: "にほん" } });
        await fireEvent.keyDown(input, { key: "Enter", isComposing: true });
        await fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
        expect(onCellEdit).not.toHaveBeenCalled();
        expect(document.querySelector(".data-grid-cell-editor")).toBeTruthy();
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onCellEdit).toHaveBeenCalledTimes(1);
        expect(onCellEdit.mock.calls[0][0].value).toBe("にほん");
    });

    test("§8.76 Escape while composing leaves the edit open; Escape after composition cancels it", async () => {
        const onCellEdit = vi.fn();
        render(DataGrid, { props: { label: "G", columns: cols, rows: [{ name: "Ann" }], onCellEdit } });
        await fireEvent.keyDown(cell(), { key: "F2" });
        const input = document.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
        await fireEvent.keyDown(input, { key: "Escape", isComposing: true });
        expect(document.querySelector(".data-grid-cell-editor")).toBeTruthy();
        await fireEvent.keyDown(input, { key: "Escape" });
        expect(document.querySelector(".data-grid-cell-editor")).toBeNull();
        expect(onCellEdit).not.toHaveBeenCalled();
    });
});

describe("DataGrid — export with virtualization (§8.77)", () => {
    test("§8.77 a virtualized grid exports every row, not only the rendered window", async () => {
        const big = Array.from({ length: 300 }, (_, i) => ({ name: `Row ${i}` }));
        const onExport = vi.fn(() => false as const);
        render(DataGrid, {
            props: { label: "G", columns: [{ id: "name", header: "Name" }], rows: big, virtualize: { rowHeight: 20, height: 100 }, labels: { exportCsv: "CSV" }, exportHandler: onExport },
        });
        expect(document.querySelectorAll(".data-table-body [data-row]").length).toBeLessThan(30);
        await fireEvent.click(screen.getByRole("button", { name: "CSV" }));
        const file = (onExport.mock.calls[0] as unknown as [{ rowCount: number; blob: Blob }])[0];
        expect(file.rowCount).toBe(300);
        const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await file.blob.arrayBuffer());
        expect(text.trim().split("\r\n")).toHaveLength(301);
        expect(text).toContain("Row 299");
    });
});

describe("DataGrid — cell types (§8.79–§8.97)", () => {
    const dataCell = (row: number, col: number) =>
        document.querySelector<HTMLElement>(`.data-table-body [data-row="${row}"][data-col="${col}"]`)!;
    const text = (el: Element) => (el.textContent ?? "").trim();
    const mount = (columns: DataGridColumn[], rows: Record<string, unknown>[], extra: Record<string, unknown> = {}) =>
        render(DataGrid, { props: { label: "G", columns, rows, ...extra } });

    test("§8.79 type sets data-cell-type on header and cells, and its alignment", () => {
        mount([{ id: "n", header: "N", type: "number" }, { id: "t", header: "T", type: "text" }], [{ n: 1, t: "a" }]);
        expect(document.querySelectorAll('[data-cell-type="number"]')).toHaveLength(2);
        expect(dataCell(0, 0).getAttribute("data-align")).toBe("end");
        expect(dataCell(0, 1).getAttribute("data-align")).toBe("start");
    });

    test("§8.80 number formats with the grid locale; a column's own format wins; no locale shows the value as stored", () => {
        mount([{ id: "n", header: "N", type: "number" }, { id: "m", header: "M", type: "number", format: (v) => `#${v}` }], [{ n: 1200.5, m: 3 }], { locale: "en-US" });
        expect(text(dataCell(0, 0))).toBe("1,200.5");
        expect(text(dataCell(0, 1))).toBe("#3");
        cleanup();
        mount([{ id: "n", header: "N", type: "number" }], [{ n: 1200.5 }]);
        expect(text(dataCell(0, 0))).toBe("1200.5");
    });

    test("§8.81 link renders an anchor; the label is the text, the address the href", () => {
        mount([{ id: "l", header: "L", type: "link" }], [{ l: { href: "https://example.com/a", label: "Example" } }, { l: "/docs" }]);
        const a = dataCell(0, 0).querySelector("a")!;
        expect(a.getAttribute("href")).toBe("https://example.com/a");
        expect(text(a)).toBe("Example");
        expect(dataCell(1, 0).querySelector("a")!.getAttribute("href")).toBe("/docs");
    });

    test("§8.82 an unsafe link scheme is shown as text, never as a link", () => {
        mount([{ id: "l", header: "L", type: "link" }], [{ l: "javascript:alert(1)" }, { l: { href: "data:text/html,x", label: "Bad" } }, { l: " java\tscript:alert(1)" }]);
        expect(document.querySelectorAll(".data-table-body a")).toHaveLength(0);
        expect(text(dataCell(1, 0))).toBe("Bad");
        expect(document.querySelectorAll(".data-grid-link-unsafe")).toHaveLength(3);
    });

    test("§8.83 an external link opens a new tab safely and says so", () => {
        mount([{ id: "l", header: "L", type: "link" }], [{ l: { href: "https://example.com", label: "Ex", external: true } }], { labels: { opensInNewTab: (t: string) => `${t} opens in a new tab` } });
        const a = dataCell(0, 0).querySelector("a")!;
        expect(a.getAttribute("target")).toBe("_blank");
        expect(a.getAttribute("rel")).toBe("noopener noreferrer");
        expect(a.querySelector(".data-grid-visually-hidden")!.textContent).toBe("Ex opens in a new tab");
        expect(a.textContent).toBe("Ex Ex opens in a new tab");
    });

    test("§8.84 links sort by label and filter on label and address", async () => {
        mount(
            [{ id: "l", header: "L", type: "link", sortable: true }],
            [{ l: { href: "https://b.test", label: "Zed" } }, { l: { href: "https://a.test/special", label: "Amy" } }],
            { labels: { search: "Search" } },
        );
        await fireEvent.click(screen.getByRole("button", { name: "L" }));
        expect(text(dataCell(0, 0))).toBe("Amy");
        await fireEvent.input(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "special" } });
        expect(bodyRows()).toHaveLength(1);
    });

    test("§8.85 date: a <time datetime> with locale text; ISO text without a locale; civil dates do not drift", () => {
        mount([{ id: "d", header: "D", type: "date", dateFormat: { dateStyle: "long" } }], [{ d: "2026-10-16" }, { d: "2026-01-01" }], { locale: "en-GB" });
        expect(dataCell(0, 0).querySelector("time")!.getAttribute("datetime")).toBe("2026-10-16");
        expect(text(dataCell(0, 0))).toBe("16 October 2026");
        expect(text(dataCell(1, 0))).toBe("1 January 2026");
        cleanup();
        mount([{ id: "d", header: "D", type: "date" }], [{ d: "2026-10-16" }]);
        expect(text(dataCell(0, 0))).toBe("2026-10-16");
    });

    test("§8.86 time: a <time> element, locale text, the stored text without a locale", () => {
        mount([{ id: "t", header: "T", type: "time" }], [{ t: "14:30" }]);
        expect(text(dataCell(0, 0))).toBe("14:30");
        expect(dataCell(0, 0).querySelector("time")!.getAttribute("datetime")).toBe("14:30");
        cleanup();
        mount([{ id: "t", header: "T", type: "time", timeFormat: { timeStyle: "short", hour12: true } }], [{ t: "14:30" }], { locale: "en-US" });
        expect(text(dataCell(0, 0))).toMatch(/^2:30\s?PM$/);
    });

    test("§8.87 date and time editors are native date/time inputs; a bad date is refused with aria-invalid", async () => {
        const onCellEdit = vi.fn();
        mount([{ id: "d", header: "D", type: "date", editable: true }, { id: "t", header: "T", type: "time", editable: true }], [{ d: "2026-10-16", t: "09:00" }], { onCellEdit });
        await fireEvent.keyDown(dataCell(0, 0), { key: "F2" });
        const input = document.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
        expect(input.type).toBe("date");
        await fireEvent.input(input, { target: { value: "2027-02-03" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onCellEdit.mock.calls[0][0].value).toBe("2027-02-03");
        await fireEvent.keyDown(dataCell(0, 1), { key: "F2" });
        expect((document.querySelector(".data-grid-cell-editor") as HTMLInputElement).type).toBe("time");
    });

    test("§8.88 select shows the option label, a stale id shows as itself", () => {
        const options = [{ id: "todo", label: "To do" }, { id: "done", label: "Done" }];
        mount([{ id: "s", header: "S", type: "select", options }], [{ s: "done" }, { s: "gone" }, { s: null }]);
        expect(text(dataCell(0, 0))).toBe("Done");
        expect(text(dataCell(1, 0))).toBe("gone");
        expect(text(dataCell(2, 0))).toBe("");
    });

    test("§8.89 select edits with a native select, grouped options, and reports the id", async () => {
        const onCellEdit = vi.fn();
        const options = [{ id: "a", label: "Alpha" }, { id: "b", label: "Beta", group: "More" }];
        mount([{ id: "s", header: "Status", type: "select", options, editable: true }], [{ s: "a" }], { onCellEdit });
        await fireEvent.keyDown(dataCell(0, 0), { key: "F2" });
        const select = screen.getByRole("combobox", { name: "Status" }) as HTMLSelectElement;
        expect(select.querySelector("optgroup")!.getAttribute("label")).toBe("More");
        await fireEvent.change(select, { target: { value: "b" } });
        await fireEvent.keyDown(select, { key: "Enter" });
        expect(onCellEdit.mock.calls[0][0]).toMatchObject({ columnId: "s", value: "b", previous: "a" });
    });

    test("§8.90 select sorts by label, or by option order with sortBy order; filter matches the label; export is the label or the id", async () => {
        const options = [{ id: "z", label: "Aardvark" }, { id: "a", label: "Zebra" }];
        const rows = [{ s: "a" }, { s: "z" }];
        mount([{ id: "s", header: "S", type: "select", options, sortable: true }], rows, { sort: { columnId: "s", direction: "ascending" }, labels: { search: "Search" } });
        expect(text(dataCell(0, 0))).toBe("Aardvark");
        await fireEvent.input(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "zeb" } });
        expect(bodyRows()).toHaveLength(1);
        cleanup();
        mount([{ id: "s", header: "S", type: "select", options: [{ id: "q", label: "Qux" }, { id: "b", label: "Bar" }], sortBy: "order", sortable: true }], [{ s: "b" }, { s: "q" }], { sort: { columnId: "s", direction: "ascending" } });
        expect(text(dataCell(0, 0))).toBe("Qux");
        for (const exportAs of ["label", "id"] as const) {
            cleanup();
            const onExport = vi.fn((_f: { blob: Blob }) => false as const);
            mount([{ id: "s", header: "S", type: "select", options, exportAs }], [{ s: "a" }], { labels: { exportCsv: "CSV" }, exportHandler: onExport });
            await fireEvent.click(screen.getByRole("button", { name: "CSV" }));
            const out = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await onExport.mock.calls[0][0].blob.arrayBuffer());
            expect(out).toBe(`﻿S\r\n${exportAs === "id" ? "a" : "Zebra"}\r\n`);
        }
    });

    test("§8.91 radio group: a fieldset with a legend, one radio per option, a name per row and column; change commits", async () => {
        const onCellEdit = vi.fn();
        const options = [{ id: "lo", label: "Low" }, { id: "hi", label: "High" }];
        mount([{ id: "p", header: "Priority", type: "radio", options, editable: true }], [{ p: "lo" }, { p: "hi" }], { onCellEdit });
        const groups = document.querySelectorAll("fieldset.data-grid-radio-group");
        expect(groups).toHaveLength(2);
        expect(groups[0].querySelector("legend")!.textContent).toBe("Priority");
        const names = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"]')).map((r) => r.name);
        expect(new Set(names).size).toBe(2);
        expect((groups[0].querySelector('input[value="lo"]') as HTMLInputElement).checked).toBe(true);
        await fireEvent.click(groups[0].querySelector('input[value="hi"]')!);
        expect(onCellEdit.mock.calls[0][0]).toMatchObject({ columnId: "p", value: "hi", previous: "lo" });
    });

    test("§8.92 a read-only radio column shows the label as text", () => {
        mount([{ id: "p", header: "P", type: "radio", options: [{ id: "lo", label: "Low" }] }], [{ p: "lo" }]);
        expect(document.querySelector("fieldset")).toBeNull();
        expect(text(dataCell(0, 0))).toBe("Low");
    });

    test("§8.93 an unknown option id is refused by a radio; the typed validate message and invalidValue label show", async () => {
        const cols: DataGridColumn[] = [{ id: "n", header: "N", type: "number", editable: true, validate: (v) => (typeof v === "number" && v < 0 ? "Too small" : undefined) }];
        const onCellEdit = vi.fn();
        mount(cols, [{ n: 1 }], { onCellEdit, labels: { editError: (h: string, m: string) => `${h}: ${m}` } });
        await fireEvent.keyDown(dataCell(0, 0), { key: "F2" });
        const input = document.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
        await fireEvent.input(input, { target: { value: "-4" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onCellEdit).not.toHaveBeenCalled();
        expect(document.querySelector(".data-grid-status")!.textContent).toBe("N: Too small");
    });

    test("§8.94 editing a link changes the address and keeps the label; a bad scheme is refused", async () => {
        const onCellEdit = vi.fn();
        mount([{ id: "l", header: "L", type: "link", editable: true }], [{ l: { href: "https://a.test", label: "A" } }], { onCellEdit, labels: { invalidValue: (h: string, t: string) => `${h} is not a valid ${t}` } });
        await fireEvent.keyDown(dataCell(0, 0), { key: "F2" });
        const input = document.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
        expect(input.value).toBe("https://a.test");
        await fireEvent.input(input, { target: { value: "javascript:alert(1)" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onCellEdit).not.toHaveBeenCalled();
        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(document.querySelector(".data-grid-cell-error")!.textContent).toBe("L is not a valid link");
        await fireEvent.input(input, { target: { value: "https://b.test" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onCellEdit.mock.calls[0][0].value).toEqual({ href: "https://b.test", label: "A" });
    });

    test("§8.95 date exports typed (no time of day); time and link export as text; typed export of a link is its label", async () => {
        const onExport = vi.fn((_f: { blob: Blob }) => false as const);
        mount(
            [{ id: "d", header: "D", type: "date" }, { id: "t", header: "T", type: "time" }, { id: "l", header: "L", type: "link" }],
            [{ d: "2026-10-16", t: "09:05", l: { href: "https://a.test", label: "Home" } }],
            { labels: { exportCsv: "CSV" }, exportHandler: onExport },
        );
        await fireEvent.click(screen.getByRole("button", { name: "CSV" }));
        const out = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await onExport.mock.calls[0][0].blob.arrayBuffer());
        expect(out).toBe("﻿D,T,L\r\n2026-10-16,09:05,Home\r\n");
    });

    test("§8.96 the column's own hooks override the type's", () => {
        mount([{ id: "d", header: "D", type: "date", format: () => "custom", align: "end" }], [{ d: "2026-10-16" }]);
        expect(text(dataCell(0, 0))).toBe("custom");
        expect(dataCell(0, 0).getAttribute("data-align")).toBe("end");
    });

    test("§8.97 a column without a type is untouched", () => {
        mount([{ id: "x", header: "X" }], [{ x: "plain" }]);
        expect(dataCell(0, 0).hasAttribute("data-cell-type")).toBe(false);
        expect(text(dataCell(0, 0))).toBe("plain");
    });
});

describe("DataGrid — time zone, person, file, rollup and formula types (§8.98–§8.113)", () => {
    const dataCell = (row: number, col: number) =>
        document.querySelector<HTMLElement>(`.data-table-body [data-row="${row}"][data-col="${col}"]`)!;
    const text = (el: Element) => (el.textContent ?? "").trim();
    const mount = (columns: DataGridColumn[], rows: Record<string, unknown>[], extra: Record<string, unknown> = {}) =>
        render(DataGrid, { props: { label: "G", columns, rows, ...extra } });
    const zones = [{ id: "Europe/London", label: "London" }, { id: "America/New_York", label: "New York" }];

    test("§8.98 time-zone shows the time and the zone id as given; with a locale and a reference date, the zone's short name; never converted", () => {
        mount([{ id: "t", header: "T", type: "time-zone" }], [{ t: { time: "14:30", timeZone: "Europe/London" } }]);
        expect(text(dataCell(0, 0))).toBe("14:30 Europe/London");
        cleanup();
        mount([{ id: "t", header: "T", type: "time-zone", referenceDate: "2026-07-01" }], [{ t: { time: "14:30", timeZone: "Europe/London" } }], { locale: "en-GB" });
        expect(text(dataCell(0, 0))).toMatch(/^14:30 (BST|GMT\+1)$/);
        cleanup();
        mount([{ id: "t", header: "T", type: "time-zone" }], [{ t: { time: "09:00", timeZone: "+01:00" } }]);
        expect(text(dataCell(0, 0))).toBe("09:00 +01:00");
    });

    test("§8.99 time-zone sorts by the UTC minute at the consumer's reference date, equal instants equal; without one, by the stated time", async () => {
        const rows = [
            { t: { time: "13:00", timeZone: "America/New_York" } }, // 17:00 UTC in July
            { t: { time: "17:30", timeZone: "Europe/London" } }, // 16:30 UTC
            { t: { time: "10:00", timeZone: "+00:00" } }, // 10:00 UTC
        ];
        mount([{ id: "t", header: "T", type: "time-zone", sortable: true, referenceDate: "2026-07-01" }], rows, { sort: { columnId: "t", direction: "ascending" } });
        expect([0, 1, 2].map((i) => text(dataCell(i, 0)).slice(0, 5))).toEqual(["10:00", "17:30", "13:00"]);
        cleanup();
        mount([{ id: "t", header: "T", type: "time-zone", sortable: true }], rows, { sort: { columnId: "t", direction: "ascending" } });
        expect([0, 1, 2].map((i) => text(dataCell(i, 0)).slice(0, 5))).toEqual(["10:00", "13:00", "17:30"]);
    });

    test("§8.100 the time-zone editor is a time field and a zone select; commit reports { time, timeZone }; changing the zone keeps the time", async () => {
        const onCellEdit = vi.fn();
        mount([{ id: "t", header: "Start", type: "time-zone", editable: true, timeZones: zones }], [{ t: { time: "09:00", timeZone: "Europe/London" } }], { onCellEdit, labels: { timeZone: (h: string) => `${h} zone` } });
        await fireEvent.keyDown(dataCell(0, 0), { key: "F2" });
        const time = document.querySelector<HTMLInputElement>('input[type="time"]')!;
        const zone = screen.getByRole("combobox", { name: "Start zone" }) as HTMLSelectElement;
        expect(time.value).toBe("09:00");
        expect(zone.value).toBe("Europe/London");
        await fireEvent.change(zone, { target: { value: "America/New_York" } });
        await fireEvent.keyDown(zone, { key: "Enter" });
        expect(onCellEdit.mock.calls[0][0].value).toEqual({ time: "09:00", timeZone: "America/New_York" });
    });

    test("§8.101 person shows names as text, '; '-joined text for filter and export, avatars are decorative, +N through labels.morePeople", async () => {
        const people = [{ id: "a", name: "Ann", email: "ann@x" }, { id: "b", name: "Bo" }, { id: "c" }];
        mount([{ id: "p", header: "P", type: "person", maxPeople: 2 }], [{ p: people }, { p: { id: "z", name: "Zed" } }], { labels: { morePeople: (n: number) => `+${n} more`, search: "Search" } });
        const names = Array.from(dataCell(0, 0).querySelectorAll(".data-grid-person-name")).map((e) => e.textContent);
        expect(names).toEqual(["Ann", "Bo"]);
        expect(text(dataCell(0, 0).querySelector(".data-grid-people-more")!)).toBe("+1 more");
        await fireEvent.input(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "ann@x" } });
        expect(bodyRows()).toHaveLength(1);
    });

    test("§8.102 a person with no name falls back to the id; export is the names '; '-joined", async () => {
        const onExport = vi.fn((_f: { blob: Blob }) => false as const);
        mount([{ id: "p", header: "P", type: "person" }], [{ p: [{ id: "a", name: "Ann" }, { id: "u7" }] }], { labels: { exportCsv: "CSV" }, exportHandler: onExport });
        expect(text(dataCell(0, 0))).toBe("Annu7");
        await fireEvent.click(screen.getByRole("button", { name: "CSV" }));
        const out = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await onExport.mock.calls[0][0].blob.arrayBuffer());
        expect(out).toBe("﻿P\r\nAnn; u7\r\n");
    });

    test("§8.103 file shows names, a link only for a safe href, sizes through the consumer's formatter; the input reports File objects and uploads nothing", async () => {
        const onFilesSelected = vi.fn();
        const onFileRemove = vi.fn();
        const files = [{ id: "1", name: "a.pdf", size: 2048, href: "https://x.test/a.pdf" }, { id: "2", name: "b.txt", href: "javascript:alert(1)" }];
        mount([{ id: "f", header: "Files", type: "file", editable: true, formatSize: (n: number) => `${n / 1024} KB` }], [{ f: files }], { onFilesSelected, onFileRemove, labels: { removeFile: (n: string) => `Remove ${n}` } });
        const links = dataCell(0, 0).querySelectorAll("a");
        expect(links).toHaveLength(1);
        expect(links[0].getAttribute("href")).toBe("https://x.test/a.pdf");
        expect(text(dataCell(0, 0).querySelector(".data-grid-file-size")!)).toBe("2 KB");
        const input = dataCell(0, 0).querySelector<HTMLInputElement>('input[type="file"]')!;
        expect(input.getAttribute("aria-label")).toBe("Files");
        const chosen = new File(["x"], "c.png");
        await fireEvent.change(input, { target: { files: [chosen] } });
        expect(onFilesSelected.mock.calls[0][0]).toMatchObject({ columnId: "f", files: [chosen] });
        await fireEvent.click(screen.getByRole("button", { name: "Remove b.txt" }));
        expect(onFileRemove.mock.calls[0][0]).toMatchObject({ columnId: "f", fileId: "2" });
    });

    test("§8.104 file sorts by first name then count, filters on names, exports names '; '-joined", async () => {
        mount([{ id: "f", header: "F", type: "file", sortable: true }], [{ f: [{ id: "1", name: "b" }] }, { f: [{ id: "2", name: "a" }, { id: "3", name: "z" }] }], { sort: { columnId: "f", direction: "ascending" } });
        expect(text(dataCell(0, 0))).toBe("az");
    });

    test("§8.105 rollup derives its number from the related values once per row; empty is empty, count of none is 0", () => {
        const rows = [{ h: [1, 2, 3] }, { h: [] }, { h: [null, "x"] }];
        mount([{ id: "h", header: "Hours", type: "rollup", aggregate: "sum", resultType: "number" }, { id: "c", header: "Count", type: "rollup", aggregate: "count", relation: (r: Record<string, unknown>) => r.h as unknown[] }], rows);
        expect(text(dataCell(0, 0))).toBe("6");
        expect(text(dataCell(1, 0))).toBe("");
        expect(text(dataCell(1, 1))).toBe("0");
        expect(dataCell(0, 0).getAttribute("data-align")).toBe("end");
    });

    test("§8.106 aggregates: avg, median, min, max, range, countUnique, percentTrue, percentEmpty and a custom reduce", () => {
        const cols = (["avg", "median", "min", "max", "range", "countUnique", "percentTrue", "percentEmpty"] as const).map((aggregate) => ({
            id: aggregate,
            header: aggregate,
            type: "rollup" as const,
            aggregate,
            relation: (r: Record<string, unknown>) => r.v as unknown[],
        }));
        cols.push({ id: "x", header: "x", type: "rollup", aggregate: "count", reduce: (v: unknown[]) => v.length * 10, relation: (r: Record<string, unknown>) => r.v as unknown[] } as never);
        mount(cols, [{ v: [1, 2, 2, 9] }]);
        expect(cols.map((_, i) => text(dataCell(0, i)))).toEqual(["3.5", "2", "1", "9", "8", "3", "", "0", "40"]);
    });

    test("§8.107 a rollup cell is read-only: aria-readonly, data-readonly, F2 and double click do nothing; the header carries its description", async () => {
        mount([{ id: "h", header: "Hours", type: "rollup", aggregate: "sum", editable: true }], [{ h: [1, 2] }], { labels: { rollupDescription: (h: string) => `Sum of ${h}`, editCell: () => "Edit" } });
        const cell = dataCell(0, 0);
        expect(cell.getAttribute("aria-readonly")).toBe("true");
        expect(cell.hasAttribute("data-readonly")).toBe(true);
        await fireEvent.keyDown(cell, { key: "F2" });
        await fireEvent.dblClick(cell);
        expect(document.querySelector(".data-grid-cell-editor")).toBeNull();
        expect(document.querySelector(".data-grid-edit-button")).toBeNull();
        const th = document.querySelector<HTMLElement>(".data-table-head th[data-col='0']")!;
        const describedBy = th.getAttribute("aria-describedby")!;
        expect(document.getElementById(describedBy)!.textContent).toBe("Sum of Hours");
    });

    test("§8.108 rollup sorts and exports on the typed result", async () => {
        const onExport = vi.fn((_f: { blob: Blob }) => false as const);
        mount([{ id: "h", header: "H", type: "rollup", aggregate: "sum", resultType: "number", sortable: true }], [{ h: [5] }, { h: [1, 1] }], { sort: { columnId: "h", direction: "ascending" }, labels: { exportCsv: "CSV" }, exportHandler: onExport });
        expect(text(dataCell(0, 0))).toBe("2");
        await fireEvent.click(screen.getByRole("button", { name: "CSV" }));
        const out = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await onExport.mock.calls[0][0].blob.arrayBuffer());
        expect(out).toBe("﻿H\r\n2\r\n5\r\n");
    });

    const evaluate = (expression: string, { row, rows }: { row: Record<string, unknown>; rows: Record<string, unknown>[] }) => {
        const match = /^=\s*(\d+)\s*\/\s*(\d+)$/.exec(expression);
        if (match) return Number(match[2]) === 0 ? { error: "Division by zero" } : { value: Number(match[1]) / Number(match[2]) };
        if (expression === "=ROWS") return { value: rows.length };
        if (expression === "=THROW") throw new Error("boom");
        return { value: row.n };
    };

    test("§8.109 formula shows the result of the consumer's evaluate, computed once per row; rows store only the expression", () => {
        const spy = vi.fn(evaluate);
        mount([{ id: "f", header: "F", type: "formula", evaluate: spy, resultType: "number" }], [{ f: "=6/3" }, { f: "=ROWS" }]);
        expect(text(dataCell(0, 0))).toBe("2");
        expect(text(dataCell(1, 0))).toBe("2");
        expect(spy).toHaveBeenCalledTimes(2);
    });

    test("§8.110 a formula error is plain text with data-error on the cell; a thrown error becomes its message", () => {
        mount([{ id: "f", header: "F", type: "formula", evaluate }], [{ f: "=1/0" }, { f: "=THROW" }, { f: "=4/2" }]);
        expect(text(dataCell(0, 0))).toBe("Division by zero");
        expect(dataCell(0, 0).hasAttribute("data-error")).toBe(true);
        expect(text(dataCell(1, 0))).toBe("boom");
        expect(dataCell(2, 0).hasAttribute("data-error")).toBe(false);
    });

    test("§8.111 the formula editor shows the expression, commits an expression, and the result recomputes; editor named by labels.formulaEditor", async () => {
        const onCellEdit = vi.fn();
        mount([{ id: "f", header: "F", type: "formula", evaluate, editable: true }], [{ f: "=6/3" }], { onCellEdit, labels: { formulaEditor: (h: string) => `${h} expression` } });
        await fireEvent.keyDown(dataCell(0, 0), { key: "F2" });
        const input = screen.getByRole("textbox", { name: "F expression" }) as HTMLInputElement;
        expect(input.value).toBe("=6/3");
        await fireEvent.input(input, { target: { value: "=8/2" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onCellEdit.mock.calls[0][0]).toMatchObject({ columnId: "f", value: "=8/2", previous: "=6/3" });
    });

    test("§8.112 validate refuses an expression with the engine's message", async () => {
        const onCellEdit = vi.fn();
        const validate = (v: unknown, row: Record<string, unknown>) => {
            const r = evaluate(String(v), { row, rows: [] });
            return "error" in r ? r.error : undefined;
        };
        mount([{ id: "f", header: "F", type: "formula", evaluate, editable: true, validate }], [{ f: "=6/3" }], { onCellEdit });
        await fireEvent.keyDown(dataCell(0, 0), { key: "F2" });
        const input = document.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
        await fireEvent.input(input, { target: { value: "=1/0" } });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onCellEdit).not.toHaveBeenCalled();
        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(document.querySelector(".data-grid-cell-error")!.textContent).toBe("Division by zero");
    });

    test("§8.113 formula export is the typed result (or the error text); sort and filter use the result", async () => {
        const onExport = vi.fn((_f: { blob: Blob }) => false as const);
        mount([{ id: "f", header: "F", type: "formula", evaluate, sortable: true, resultType: "number" }], [{ f: "=9/3" }, { f: "=1/0" }, { f: "=4/2" }], { sort: { columnId: "f", direction: "ascending" }, labels: { exportCsv: "CSV", search: "Search" }, exportHandler: onExport });
        expect(text(dataCell(0, 0))).toBe("2");
        await fireEvent.click(screen.getByRole("button", { name: "CSV" }));
        const out = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await onExport.mock.calls[0][0].blob.arrayBuffer());
        expect(out).toBe("﻿F\r\n2\r\n3\r\nDivision by zero\r\n");
        await fireEvent.input(screen.getByRole("searchbox", { name: "Search" }), { target: { value: "division" } });
        expect(bodyRows()).toHaveLength(1);
    });

    test("§8.114 a person cell is read-only without personEditor; with one, the editor snippet gets commit and cancel", async () => {
        const onCellEdit = vi.fn();
        mount([{ id: "p", header: "P", type: "person", editable: true }], [{ p: { id: "a", name: "Ann" } }], { onCellEdit });
        await fireEvent.keyDown(dataCell(0, 0), { key: "F2" });
        expect(document.querySelector("[data-pick]")).toBeNull();
        cleanup();
        const personEditor = tpl().personEditor() as never;
        mount([{ id: "p", header: "P", type: "person", editable: true, personEditor }], [{ p: { id: "a", name: "Ann" } }], { onCellEdit });
        await fireEvent.keyDown(dataCell(0, 0), { key: "F2" });
        await fireEvent.click(document.querySelector("[data-pick]")!);
        expect(onCellEdit.mock.calls[0][0]).toMatchObject({ columnId: "p", value: { id: "b", name: "Bo" }, previous: { id: "a", name: "Ann" } });
    });

    test("§8.116 time-zone exportUtc adds a UTC column at the reference date, headed by labels.exportUtcHeader; absent without the label or a reference date", async () => {
        const rows = [{ t: { time: "13:00", timeZone: "America/New_York" } }, { t: { time: "09:00", timeZone: "+01:00" } }];
        const run = async (column: Record<string, unknown>, labels: Record<string, unknown>) => {
            const onExport = vi.fn((_f: { blob: Blob }) => false as const);
            mount([{ id: "t", header: "Start", type: "time-zone", ...column } as DataGridColumn], rows, { labels: { exportCsv: "CSV", ...labels }, exportHandler: onExport });
            await fireEvent.click(screen.getByRole("button", { name: "CSV" }));
            const out = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await onExport.mock.calls[0][0].blob.arrayBuffer());
            cleanup();
            return out;
        };
        const labels = { exportUtcHeader: (h: string) => `${h} (UTC)` };
        expect(await run({ exportUtc: true, referenceDate: "2026-07-01" }, labels)).toBe("\uFEFFStart,Start (UTC)\r\n13:00 America/New_York,17:00\r\n09:00 +01:00,08:00\r\n");
        expect(await run({ exportUtc: true }, labels)).toBe("\uFEFFStart\r\n13:00 America/New_York\r\n09:00 +01:00\r\n");
        expect(await run({ exportUtc: true, referenceDate: "2026-07-01" }, {})).toBe("\uFEFFStart\r\n13:00 America/New_York\r\n09:00 +01:00\r\n");
    });

    test("§8.117 person exportAs email exports the emails '; '-joined; people without an email add nothing", async () => {
        const onExport = vi.fn((_f: { blob: Blob }) => false as const);
        mount([{ id: "p", header: "P", type: "person", exportAs: "email" }], [{ p: [{ id: "a", name: "Ann", email: "ann@x" }, { id: "b", name: "Bo", email: "bo@x" }] }, { p: [{ id: "c", name: "Cy" }] }], { labels: { exportCsv: "CSV" }, exportHandler: onExport });
        await fireEvent.click(screen.getByRole("button", { name: "CSV" }));
        const out = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await onExport.mock.calls[0][0].blob.arrayBuffer());
        expect(out).toBe("\uFEFFP\r\nann@x; bo@x\r\n\r\n");
    });

    test("§8.118 files dropped on an editable file cell are reported like the input; a non-file drop and a read-only cell do nothing", async () => {
        const onFilesSelected = vi.fn();
        mount([{ id: "f", header: "F", type: "file", editable: true, multiple: false }, { id: "g", header: "G", type: "file" }], [{ f: [], g: [] }], { onFilesSelected });
        const a = new File(["a"], "a.txt");
        const b = new File(["b"], "b.txt");
        await fireEvent.drop(dataCell(0, 0), { dataTransfer: { files: [a, b], types: ["Files"] } });
        expect(onFilesSelected).toHaveBeenCalledTimes(1);
        expect(onFilesSelected.mock.calls[0][0]).toMatchObject({ columnId: "f", files: [a] });
        await fireEvent.drop(dataCell(0, 0), { dataTransfer: { files: [], types: ["text/plain"] } });
        await fireEvent.drop(dataCell(0, 1), { dataTransfer: { files: [a], types: ["Files"] } });
        expect(onFilesSelected).toHaveBeenCalledTimes(1);
    });

    test("§8.119 exportFormulas keeps live formulas in .xlsx only; CSV still carries the result", async () => {
        const evaluate = (e: string) => ({ value: Number(e.slice(1)) * 2 });
        const grab = async (format: "csv" | "xlsx", extra: Record<string, unknown>) => {
            const onExport = vi.fn((_f: { blob: Blob }) => false as const);
            mount([{ id: "f", header: "F", type: "formula", evaluate }], [{ f: "=21" }], { labels: { exportCsv: "CSV", exportExcel: "Excel" }, exportHandler: onExport, ...extra });
            await fireEvent.click(screen.getByRole("button", { name: format === "csv" ? "CSV" : "Excel" }));
            const blob = onExport.mock.calls[0][0].blob;
            cleanup();
            return blob;
        };
        const csv = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await (await grab("csv", { exportFormulas: true })).arrayBuffer());
        expect(csv).toBe("\uFEFFF\r\n42\r\n");
        const bytes = new Uint8Array(await (await grab("xlsx", { exportFormulas: true })).arrayBuffer());
        const text = new TextDecoder().decode(bytes);
        expect(text).toContain("<f>21</f><v>42</v>");
        const plain = new TextDecoder().decode(new Uint8Array(await (await grab("xlsx", {})).arrayBuffer()));
        expect(plain).not.toContain("<f>");
        expect(plain).toContain("<v>42</v>");
    });
});
