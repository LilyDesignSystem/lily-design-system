import { readFileSync } from "node:fs";
import Alpine from "alpinejs";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import lilyDataGrid, { createDataGrid } from "./index.js";
import type { DataGridOptions } from "./index.js";

const SNIPPET = readFileSync("snippet.html", "utf8");
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

const ROWS = [
    { id: "a", name: "Alice", age: 31, team: "Red" },
    { id: "b", name: "bob", age: 25, team: "Blue" },
    { id: "c", name: "Carol", age: 31, team: "Red" },
    { id: "d", name: "Dave", age: null, team: "Blue" },
    { id: "e", name: "Éve", age: 40, team: "Green" },
];

const LABELS = {
    grid: "People",
    search: "Search people",
    pagination: "Pages",
    selectAll: "Select all",
    selectRow: (name: string) => "Select " + name,
    sortButton: (header: string) => "Sort by " + header,
    previousPage: "Previous",
    nextPage: "Next",
    pageStatus: (page: number, count: number) => page + " of " + count,
    empty: "No people",
    exportCsv: "CSV",
    exportTsv: "TSV",
    copy: "Copy",
    copyAnnouncement: (n: number) => "Copied " + n,
    copyFailed: "Copy failed",
    sortAnnouncement: (header: string, dir: string) => header + " " + dir,
    filterAnnouncement: (n: number) => n + " rows",
    columns: "Columns",
    toggleColumn: (header: string) => "Show " + header,
};

const options = (extra: Partial<DataGridOptions> = {}): DataGridOptions => ({
    columns: [
        { id: "name", header: "Name", sortable: true },
        { id: "age", header: "Age", sortable: true, hidable: true },
        { id: "team", header: "Team", hidable: true },
    ],
    rows: ROWS,
    rowId: "id",
    selectionMode: "multiple",
    labels: LABELS,
    ...extra,
});

beforeAll(() => {
    (window as unknown as { Alpine: typeof Alpine }).Alpine = Alpine;
    Alpine.plugin(lilyDataGrid);
    Alpine.start();
});

afterEach(async () => {
    document.body.innerHTML = "";
    await tick();
});

async function mount(extra: Partial<DataGridOptions> = {}) {
    (window as unknown as { gridOptions: DataGridOptions }).gridOptions = options(extra);
    document.body.innerHTML = SNIPPET;
    await tick();
    await tick();
    return document.querySelector(".data-grid") as HTMLElement;
}

const state = () => Alpine.$data(document.querySelector(".data-grid") as HTMLElement) as ReturnType<typeof createDataGrid>;
const headers = () => [...document.querySelectorAll("th[scope=col]")] as HTMLElement[];
const names = () => [...document.querySelectorAll("tbody tr")].map((tr) => (tr.querySelectorAll("td")[1] as HTMLElement).textContent);
const press = async (target: Element, key: string, init: KeyboardEventInit = {}) => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
    await tick();
};
const cell = (row: number, col: number) => document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;

describe("rendering", () => {
    test("is a role=grid table with column headers and one row per record", async () => {
        await mount();
        const table = document.querySelector("table") as HTMLElement;
        expect(table.getAttribute("role")).toBe("grid");
        expect(table.getAttribute("aria-label")).toBe("People");
        expect(table.getAttribute("aria-multiselectable")).toBe("true");
        expect(table.getAttribute("aria-rowcount")).toBe("6");
        expect(table.getAttribute("aria-colcount")).toBe("4");
        expect(headers().map((h) => h.textContent?.trim())).toEqual(["Name", "Age", "Team"]);
        expect(document.querySelectorAll("tbody tr")).toHaveLength(5);
        expect(names()).toEqual(["Alice", "bob", "Carol", "Dave", "Éve"]);
    });

    test("headless: a label's absence removes the control it names", async () => {
        await mount({ labels: { grid: "People" }, selectionMode: "none" });
        expect(document.querySelector(".data-grid-search")).toBeNull();
        expect(document.querySelector(".data-grid-export")).toBeNull();
        expect(document.querySelector(".data-grid-pager")).toBeNull();
        expect(document.querySelector("caption")).toBeNull();
        expect(document.querySelector(".data-grid-select-all, .data-grid-select")).toBeNull();
    });
});

describe("filter", () => {
    test("matches every term over the visible columns, ignoring case and diacritics", async () => {
        await mount();
        const search = document.querySelector(".data-grid-search") as HTMLInputElement;
        search.value = "eve green";
        search.dispatchEvent(new Event("input", { bubbles: true }));
        await tick();
        expect(names()).toEqual(["Éve"]);
        expect(document.querySelector(".data-grid-status")?.textContent).toBe("1 rows");
    });

    test("a hidden column no longer takes part in the filter", async () => {
        await mount();
        state().toggleColumn("team");
        state().setFilter("green");
        await tick();
        expect(names()).toEqual([]);
        expect(document.querySelector(".data-grid-empty")?.textContent).toBe("No people");
    });
});

describe("sort", () => {
    test("click cycles ascending, descending, off, with aria-sort and an announcement", async () => {
        await mount();
        const button = headers()[1].querySelector("button") as HTMLElement;
        expect(headers()[1].getAttribute("aria-sort")).toBe("none");
        expect(headers()[2].hasAttribute("aria-sort")).toBe(false);
        button.click(); await tick();
        expect(headers()[1].getAttribute("aria-sort")).toBe("ascending");
        expect(document.querySelector(".data-grid-status")?.textContent).toBe("Age asc");
        // 25, 31, 31, 40 and the missing value last; ties keep their input order.
        expect(names()).toEqual(["bob", "Alice", "Carol", "Éve", "Dave"]);
        button.click(); await tick();
        expect(headers()[1].getAttribute("aria-sort")).toBe("descending");
        expect(names()).toEqual(["Éve", "Alice", "Carol", "bob", "Dave"]);
        button.click(); await tick();
        expect(headers()[1].getAttribute("aria-sort")).toBe("none");
        expect(names()).toEqual(["Alice", "bob", "Carol", "Dave", "Éve"]);
    });

    test("Shift adds a key; data-sort-order shows only while there is more than one", async () => {
        await mount();
        (headers()[1].querySelector("button") as HTMLElement).click(); await tick();
        expect(headers()[1].hasAttribute("data-sort-order")).toBe(false);
        headers()[0].querySelector("button")?.dispatchEvent(new MouseEvent("click", { bubbles: true, shiftKey: true })); await tick();
        expect(headers()[1].getAttribute("data-sort-order")).toBe("1");
        expect(headers()[0].getAttribute("data-sort-order")).toBe("2");
        // Age first, then Name inside equal ages: Alice before Carol.
        expect(names()).toEqual(["bob", "Alice", "Carol", "Éve", "Dave"]);
    });

    test("a plain click on another header replaces the keys", async () => {
        await mount();
        (headers()[1].querySelector("button") as HTMLElement).click(); await tick();
        (headers()[0].querySelector("button") as HTMLElement).click(); await tick();
        expect(headers()[1].getAttribute("aria-sort")).toBe("none");
        expect(state().sort).toEqual([{ id: "name", dir: "asc" }]);
    });

    test("a column that is not sortable does nothing", async () => {
        await mount();
        state().toggleSort(state().columns[2]);
        expect(state().sort).toEqual([]);
    });
});

describe("selection", () => {
    test("multiple: rows toggle and aria-selected follows", async () => {
        await mount();
        const boxes = () => [...document.querySelectorAll("tbody input[type=checkbox]")] as HTMLInputElement[];
        expect(boxes()[0].getAttribute("aria-label")).toBe("Select Alice");
        boxes()[0].click(); boxes()[2].click(); await tick();
        expect(state().selected).toEqual(["a", "c"]);
        expect(document.querySelectorAll("tbody tr")[0].getAttribute("aria-selected")).toBe("true");
        expect(document.querySelectorAll("tbody tr")[1].getAttribute("aria-selected")).toBe("false");
        boxes()[0].click(); await tick();
        expect(state().selected).toEqual(["c"]);
    });

    test("select all covers the current page and shows the mixed state", async () => {
        await mount();
        const all = document.querySelector(".data-grid-select-all input") as HTMLInputElement;
        (document.querySelectorAll("tbody input[type=checkbox]")[0] as HTMLInputElement).click(); await tick();
        expect(all.indeterminate).toBe(true);
        all.click(); await tick();
        expect(state().selected).toHaveLength(5);
        expect(all.checked).toBe(true);
        all.click(); await tick();
        expect(state().selected).toEqual([]);
    });

    test("single mode replaces the selection and has no select-all box", async () => {
        await mount({ selectionMode: "single" });
        expect(document.querySelector(".data-grid-select-all input")).toBeNull();
        (document.querySelectorAll("tbody input[type=checkbox]")[0] as HTMLInputElement).click(); await tick();
        (document.querySelectorAll("tbody input[type=checkbox]")[1] as HTMLInputElement).click(); await tick();
        expect(state().selected).toEqual(["b"]);
    });

    test("announces the selection with lily:select", async () => {
        const grid = await mount();
        const seen = vi.fn();
        grid.addEventListener("lily:select", (e) => seen((e as CustomEvent).detail));
        (document.querySelectorAll("tbody input[type=checkbox]")[1] as HTMLInputElement).click(); await tick();
        expect(seen).toHaveBeenCalledWith({ selected: ["b"] });
    });
});

describe("pagination", () => {
    test("shows pageSize rows, a status and prev/next that disable at the ends", async () => {
        await mount({ pageSize: 2 });
        const [prev, next] = [...document.querySelectorAll(".data-grid-pager-button")] as HTMLButtonElement[];
        expect(names()).toEqual(["Alice", "bob"]);
        expect(document.querySelector(".data-grid-pager-status")?.textContent).toBe("1 of 3");
        expect(prev.disabled).toBe(true);
        next.click(); await tick();
        expect(names()).toEqual(["Carol", "Dave"]);
        next.click(); await tick();
        expect(names()).toEqual(["Éve"]);
        expect(next.disabled).toBe(true);
        prev.click(); await tick();
        expect(document.querySelector(".data-grid-pager-status")?.textContent).toBe("2 of 3");
    });

    test("sorting and filtering return to the first page", async () => {
        await mount({ pageSize: 2 });
        state().goto(2);
        state().setFilter("red");
        await tick();
        expect(state().page).toBe(0);
        expect(names()).toEqual(["Alice", "Carol"]);
        state().setFilter("");
        state().goto(2);
        state().toggleSort(state().columns[0]);
        expect(state().page).toBe(0);
    });
});

describe("columns", () => {
    test("a hidable column can be hidden and shown; others cannot", async () => {
        await mount();
        const toggle = document.querySelectorAll(".data-grid-column-toggle input")[0] as HTMLInputElement;
        expect(toggle.getAttribute("aria-label")).toBe("Show Age");
        toggle.click(); await tick();
        expect(headers().map((h) => h.textContent?.trim())).toEqual(["Name", "Team"]);
        expect(document.querySelector("table")?.getAttribute("aria-colcount")).toBe("3");
        state().toggleColumn("name");
        expect(headers()).toHaveLength(2);
        toggle.click(); await tick();
        expect(headers()).toHaveLength(3);
    });
});

describe("keyboard", () => {
    test("only the active cell is in the tab order and arrows move it", async () => {
        await mount();
        expect([...document.querySelectorAll("[tabindex='0']")]).toEqual([cell(-1, 0)]);
        cell(-1, 0).focus();
        await press(cell(-1, 0), "ArrowRight");
        expect(document.activeElement).toBe(cell(-1, 1));
        expect(cell(-1, 1).getAttribute("tabindex")).toBe("0");
        expect(cell(-1, 0).getAttribute("tabindex")).toBe("-1");
        await press(cell(-1, 1), "ArrowDown");
        expect(document.activeElement).toBe(cell(0, 1));
        await press(cell(0, 1), "ArrowDown");
        await press(cell(1, 1), "ArrowLeft");
        expect(document.activeElement).toBe(cell(1, 0));
    });

    test("Home and End go along the row; Ctrl moves to the corners; PageDown jumps", async () => {
        await mount();
        cell(0, 1).focus();
        await press(cell(0, 1), "End");
        expect(document.activeElement).toBe(cell(0, 3));
        await press(cell(0, 3), "Home");
        expect(document.activeElement).toBe(cell(0, 0));
        await press(cell(0, 0), "End", { ctrlKey: true });
        expect(document.activeElement).toBe(cell(4, 3));
        await press(cell(4, 3), "Home", { ctrlKey: true });
        expect(document.activeElement).toBe(cell(-1, 0));
        await press(cell(-1, 0), "PageDown");
        expect(document.activeElement).toBe(cell(4, 0));
    });

    test("stops at the edges", async () => {
        await mount();
        cell(-1, 0).focus();
        await press(cell(-1, 0), "ArrowLeft");
        await press(cell(-1, 0), "ArrowUp");
        expect(document.activeElement).toBe(cell(-1, 0));
    });

    test("Enter or Space on a sortable header sorts; Shift adds a key", async () => {
        await mount();
        cell(-1, 2).focus();
        await press(cell(-1, 2), "Enter");
        expect(headers()[1].getAttribute("aria-sort")).toBe("ascending");
        cell(-1, 1).focus();
        await press(cell(-1, 1), " ", { shiftKey: true });
        expect(state().sort.map((k) => k.id)).toEqual(["age", "name"]);
    });

    test("Space in the selection column toggles the row; Enter on a data cell announces activation", async () => {
        const grid = await mount();
        const seen = vi.fn();
        grid.addEventListener("lily:activate", (e) => seen((e as CustomEvent).detail.id));
        cell(1, 0).focus();
        await press(cell(1, 0), " ");
        expect(state().selected).toEqual(["b"]);
        cell(1, 1).focus();
        await press(cell(1, 1), "Enter");
        expect(seen).toHaveBeenCalledWith("b");
        cell(-1, 0).focus();
        await press(cell(-1, 0), " ");
        expect(state().selected).toHaveLength(5);
    });

    test("right-to-left swaps the horizontal arrows", async () => {
        document.documentElement.setAttribute("dir", "rtl");
        try {
            await mount();
            cell(-1, 1).focus();
            await press(cell(-1, 1), "ArrowLeft");
            expect(document.activeElement).toBe(cell(-1, 2));
        } finally {
            document.documentElement.removeAttribute("dir");
        }
    });
});

describe("export", () => {
    test("the table is the visible columns' text in the chosen scope and order", async () => {
        await mount({ exportScope: "filtered" });
        state().toggleSort(state().columns[1]);
        state().toggleColumn("team");
        expect(state().exportTable()).toEqual({
            headers: ["Name", "Age"],
            rows: [["bob", "25"], ["Alice", "31"], ["Carol", "31"], ["Éve", "40"], ["Dave", ""]],
        });
        state().setFilter("31");
        expect(state().exportTable().rows).toHaveLength(2);
        expect(state().exportTable("all").rows).toHaveLength(5);
        state().toggleRow("c");
        expect(state().exportTable("selected").rows).toEqual([["Carol", "31"]]);
    });

    test("a column's format is used for display, filter and export", async () => {
        await mount({ columns: [{ id: "age", header: "Age", format: (v) => (v == null ? "n/a" : v + " yrs") }] });
        expect(state().exportTable().rows[3]).toEqual(["n/a"]);
        state().setFilter("40 yrs");
        expect(state().filteredRows).toHaveLength(1);
    });

    test("copy puts tab-separated text with a header row on the clipboard and announces it", async () => {
        await mount();
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
        (document.querySelector("[data-export-format=copy]") as HTMLElement).click();
        await tick(); await tick();
        expect(writeText.mock.calls[0][0].split("\r\n")[0]).toBe("Name\tAge\tTeam");
        expect(document.querySelector(".data-grid-status")?.textContent).toBe("Copied 5");
    });

    test("download builds a file from the same table", async () => {
        await mount();
        const create = vi.fn(() => "blob:x");
        Object.assign(URL, { createObjectURL: create, revokeObjectURL: vi.fn() });
        const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
        (document.querySelector("[data-export-format=csv]") as HTMLElement).click(); await tick();
        expect(create).toHaveBeenCalled();
        expect(click).toHaveBeenCalled();
        click.mockRestore();
    });
});
