import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DataGrid } from "./data-grid.js";
import type { DataGridColumn, DataGridLabels } from "./data-grid.js";

if (!customElements.get("lily-data-grid")) customElements.define("lily-data-grid", DataGrid);

const COLUMNS: DataGridColumn[] = [
  { id: "name", header: "Name", sortable: true, resizable: true },
  { id: "email", header: "Email", hidable: true },
];
const ROWS = [
  { name: "Bob", email: "bob@example.com" },
  { name: "Alice", email: "alice@example.com" },
  { name: "Carol", email: "carol@example.com" },
];
const LABELS: DataGridLabels = {
  search: "Search rows",
  columnVisibility: "Columns",
  resizeHandle: (h) => `Resize ${h}`,
  selectAll: "Select all rows",
  selectionColumn: "Select",
  selectRow: (r) => `Select ${r}`,
  previousPage: "Previous",
  nextPage: "Next",
  pageStatus: (p, c, n) => `Page ${p} of ${c} (${n})`,
  sortAnnouncement: (h, d) => `${h} sorted ${d}`,
  filterAnnouncement: (m, t) => `${m} of ${t} match`,
  selectionAnnouncement: (n) => `${n} selected`,
  editCell: (h, r) => `Edit ${h} of ${r}`,
  exportCsv: "CSV",
};

let grid: DataGrid;
function mount(props: Partial<DataGrid> & Record<string, unknown> = {}, attrs: Record<string, string> = {}): DataGrid {
  grid = document.createElement("lily-data-grid") as DataGrid;
  grid.setAttribute("label", "Users");
  for (const [k, v] of Object.entries(attrs)) grid.setAttribute(k, v);
  grid.columns = (props.columns as DataGridColumn[]) ?? COLUMNS;
  grid.rows = (props.rows as never) ?? ROWS;
  grid.labels = (props.labels as DataGridLabels) ?? LABELS;
  for (const [k, v] of Object.entries(props)) if (!["columns", "rows", "labels"].includes(k)) (grid as never as Record<string, unknown>)[k] = v;
  document.body.append(grid);
  return grid;
}
const bodyRows = () => Array.from(grid.querySelectorAll<HTMLElement>(".data-table-body .data-table-row"));
const cell = (r: number, c: number) => grid.querySelector<HTMLElement>(`.data-table-body [data-row="${r}"][data-col="${c}"]`)!;
const names = () => bodyRows().map((r) => r.querySelector(".data-table-td")!.textContent);
const key = (el: Element, k: string, init: KeyboardEventInit = {}) => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init }));
const click = (el: Element) => (el as HTMLElement).click();

beforeEach(() => localStorage.clear());
afterEach(() => {
  document.body.innerHTML = "";
});

describe("markup", () => {
  test("§8.1 root, labelled grid, headers and rows", () => {
    mount();
    expect(grid.querySelector(".data-grid")).toBeTruthy();
    const table = grid.querySelector("table")!;
    expect(table.getAttribute("role")).toBe("grid");
    expect(table.getAttribute("aria-label")).toBe("Users");
    expect(grid.querySelectorAll("th[scope=col]")).toHaveLength(2);
    expect(bodyRows()).toHaveLength(3);
  });
  test("table mode has no roving tabindex", () => {
    mount({}, { mode: "table" });
    expect(grid.querySelector("table")!.getAttribute("role")).toBe("table");
    expect(grid.querySelectorAll("[tabindex='0'][data-row]")).toHaveLength(0);
  });
  test("busy sets aria-busy; class passes to the root", () => {
    mount({}, { busy: "", class: "mine" });
    expect(grid.querySelector("table")!.getAttribute("aria-busy")).toBe("true");
    expect(grid.querySelector(".data-grid.mine")).toBeTruthy();
  });
  test("empty and footer render", () => {
    mount({ rows: [], empty: () => "Nobody here", footer: () => { const tr = document.createElement("tr"); tr.className = "f-row"; return tr; } });
    expect(grid.querySelector(".data-grid-empty")!.textContent).toBe("Nobody here");
    expect(grid.querySelector("tfoot .f-row")).toBeTruthy();
  });
});

describe("sort, filter, select, paginate", () => {
  test("sort cycles ascending, descending, none and announces", () => {
    mount();
    const btn = () => grid.querySelector<HTMLElement>(".data-grid-sort-button")!;
    click(btn());
    expect(names()).toEqual(["Alice", "Bob", "Carol"]);
    expect(grid.querySelector("th")!.getAttribute("aria-sort")).toBe("ascending");
    expect(grid.querySelector(".data-grid-status")!.textContent).toBe("Name sorted ascending");
    click(btn());
    expect(names()).toEqual(["Carol", "Bob", "Alice"]);
    click(btn());
    expect(names()).toEqual(["Bob", "Alice", "Carol"]);
  });
  test("filter narrows rows, keeps focus and announces", () => {
    mount();
    const search = grid.querySelector<HTMLInputElement>(".data-grid-search")!;
    search.value = "ali";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    expect(names()).toEqual(["Alice"]);
    expect(grid.querySelector(".data-grid-status")!.textContent).toBe("1 of 3 match");
    expect(document.activeElement).toBe(grid.querySelector(".data-grid-search"));
  });
  test("multiple selection, select all, event", () => {
    mount({}, { "selection-mode": "multiple" });
    const onChange = vi.fn();
    grid.addEventListener("selectionchange", (e) => onChange((e as CustomEvent).detail));
    click(grid.querySelector("thead input[type=checkbox]")!);
    expect(onChange).toHaveBeenLastCalledWith(["0", "1", "2"]);
    expect(grid.querySelectorAll("tbody tr[aria-selected=true]")).toHaveLength(3);
    click(grid.querySelector("thead input[type=checkbox]")!);
    expect(grid.selected).toEqual([]);
  });
  test("single selection uses radios", () => {
    mount({}, { "selection-mode": "single" });
    click(grid.querySelectorAll<HTMLElement>("tbody input[type=radio]")[1]);
    expect(grid.selected).toEqual(["1"]);
  });
  test("pagination", () => {
    mount({}, { "page-size": "2" });
    expect(bodyRows()).toHaveLength(2);
    expect(grid.querySelector(".data-grid-page-status")!.textContent).toBe("Page 1 of 2 (3)");
    expect(grid.querySelector("table")!.getAttribute("aria-rowcount")).toBe("4");
    click(grid.querySelector(".data-grid-page-next")!);
    expect(bodyRows()).toHaveLength(1);
    expect(grid.page).toBe(2);
  });
  test("hidable column toggles", () => {
    mount();
    click(grid.querySelector(".data-grid-column-visibility input")!);
    expect(grid.querySelectorAll("th[scope=col]")).toHaveLength(1);
  });
});

describe("keyboard", () => {
  test("exactly one roving tab stop; arrows move it", () => {
    mount();
    expect(grid.querySelectorAll("[tabindex='0'][data-row]")).toHaveLength(1);
    cell(0, 0).focus();
    key(cell(0, 0), "ArrowDown");
    expect(document.activeElement).toBe(cell(1, 0));
    key(document.activeElement!, "ArrowRight");
    expect(document.activeElement).toBe(cell(1, 1));
    key(document.activeElement!, "End", { ctrlKey: true });
    expect(document.activeElement).toBe(cell(2, 1));
    key(document.activeElement!, "Home", { ctrlKey: true });
    expect(grid.querySelector("th[data-col='0'][tabindex='0']")).toBeTruthy();
  });
  test("Enter on a header sorts", () => {
    mount();
    const th = grid.querySelector<HTMLElement>("th[data-col='0']")!;
    th.focus();
    key(th, "Enter");
    expect(names()[0]).toBe("Alice");
  });
  test("Enter activates a row when onRowActivate is set", () => {
    const fn = vi.fn();
    mount({ onRowActivate: fn });
    cell(1, 0).focus();
    key(cell(1, 0), "Enter");
    expect(fn).toHaveBeenCalledWith(ROWS[1], "1");
  });
  test("Alt+Arrow reorders a movable column", () => {
    mount({ columns: [{ id: "a", header: "A", movable: true }, { id: "b", header: "B", movable: true }], rows: [{ a: 1, b: 2 }] });
    const onOrder = vi.fn();
    grid.addEventListener("columnorderchange", (e) => onOrder((e as CustomEvent).detail));
    const th = grid.querySelector<HTMLElement>("th[data-col='0']")!;
    th.focus();
    key(th, "ArrowRight", { altKey: true });
    expect(onOrder).toHaveBeenCalledWith(["b", "a"]);
    expect(grid.querySelectorAll("th")[0].textContent).toBe("B");
  });
  test("resize handle keyboard", () => {
    mount();
    const handle = grid.querySelector<HTMLElement>(".data-grid-resize-handle")!;
    expect(handle.getAttribute("role")).toBe("separator");
    key(handle, "ArrowRight");
    expect(grid.querySelector<HTMLElement>(".data-grid-resize-handle")!.getAttribute("aria-valuenow")).toBe("136");
  });
  test("widgets in cells are not tab stops until the cell is entered", () => {
    mount({ columns: [{ id: "name", header: "N" }, { id: "e", header: "E", cell: (c) => { const a = document.createElement("a"); a.href = "#x"; a.textContent = c.formatted; return a; } }], rows: [{ name: "A", e: "x" }] });
    const a = grid.querySelector<HTMLElement>("tbody a")!;
    expect(a.getAttribute("tabindex")).toBe("-1");
    cell(0, 1).focus();
    key(cell(0, 1), "Enter");
    expect(document.activeElement).toBe(grid.querySelector("tbody a"));
  });
});

describe("editing", () => {
  const edit = (): DataGridColumn[] => [{ id: "name", header: "Name", editable: true, validate: (v) => (v === "bad" ? "no" : undefined) }];
  test("F2 edits, Enter commits, celledit fires", () => {
    const fn = vi.fn();
    mount({ columns: edit(), rows: [{ name: "Ann" }], onCellEdit: fn });
    cell(0, 0).focus();
    key(cell(0, 0), "F2");
    const input = grid.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
    expect(document.activeElement).toBe(input);
    input.value = "Bea";
    input.dispatchEvent(new Event("input"));
    key(input, "Enter");
    expect(fn).toHaveBeenCalledWith({ rowId: "0", row: { name: "Ann" }, columnId: "name", value: "Bea", previous: "Ann" });
    expect(grid.querySelector(".data-grid-cell-editor")).toBeNull();
  });
  test("Escape cancels", () => {
    const fn = vi.fn();
    mount({ columns: edit(), rows: [{ name: "Ann" }], onCellEdit: fn });
    cell(0, 0).focus();
    key(cell(0, 0), "F2");
    const input = grid.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
    input.value = "Zed";
    input.dispatchEvent(new Event("input"));
    key(input, "Escape");
    expect(fn).not.toHaveBeenCalled();
    expect(grid.querySelector(".data-grid-cell-editor")).toBeNull();
  });
  test("validation keeps the editor open with aria-invalid", () => {
    mount({ columns: edit(), rows: [{ name: "Ann" }] });
    cell(0, 0).focus();
    key(cell(0, 0), "F2");
    const input = grid.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
    input.value = "bad";
    input.dispatchEvent(new Event("input"));
    key(input, "Enter");
    const again = grid.querySelector(".data-grid-cell-editor")!;
    expect(again.getAttribute("aria-invalid")).toBe("true");
    expect(grid.querySelector(".data-grid-cell-error")!.textContent).toBe("no");
  });
  test("IME composition Enter does not commit", () => {
    const fn = vi.fn();
    mount({ columns: edit(), rows: [{ name: "Ann" }], onCellEdit: fn });
    cell(0, 0).focus();
    key(cell(0, 0), "F2");
    const input = grid.querySelector<HTMLInputElement>(".data-grid-cell-editor")!;
    input.value = "x";
    input.dispatchEvent(new Event("input"));
    key(input, "Enter", { isComposing: true });
    expect(grid.querySelector(".data-grid-cell-editor")).toBeTruthy();
  });
  test("edit button gated by labels.editCell", () => {
    mount({ columns: edit(), rows: [{ name: "Ann" }] });
    expect(grid.querySelectorAll(".data-grid-edit-button")).toHaveLength(1);
    mount({ columns: edit(), rows: [{ name: "Ann" }], labels: {} });
    expect(grid.querySelectorAll(".data-grid-edit-button")).toHaveLength(0);
  });
});

describe("virtualization, persistence, export, types", () => {
  test("virtualize renders a window with spacers", () => {
    const rows = Array.from({ length: 200 }, (_, i) => ({ name: `r${i}`, email: "" }));
    mount({ rows, virtualize: { rowHeight: 20, height: 100, overscan: 1 } });
    expect(bodyRows().length).toBeLessThan(15);
    expect(grid.querySelector(".data-grid-spacer")).toBeTruthy();
    expect(grid.querySelector("table")!.getAttribute("aria-rowcount")).toBe("201");
  });
  test("storageKey persists sort and widths", () => {
    mount({}, { "storage-key": "k" });
    click(grid.querySelector(".data-grid-sort-button")!);
    const saved = JSON.parse(localStorage.getItem("k")!);
    expect(saved.sort).toEqual({ columnId: "name", direction: "ascending" });
    document.body.innerHTML = "";
    mount({}, { "storage-key": "k" });
    expect(names()[0]).toBe("Alice");
  });
  test("CSV export reports through onExport and exportfile", async () => {
    const onExport = vi.fn(() => false);
    mount({ onExport });
    click(grid.querySelector("[data-grid-export-format=csv]")!);
    const file = onExport.mock.calls[0][0] as { filename: string; rowCount: number; blob: Blob };
    expect(file.filename).toBe("data-grid.csv");
    expect(file.rowCount).toBe(3);
    const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(await file.blob.arrayBuffer());
    expect(text).toContain("Name,Email");
  });
  test("number, link, date, select types", () => {
    mount({
      locale: undefined,
      columns: [
        { id: "n", header: "N", type: "number" },
        { id: "l", header: "L", type: "link" },
        { id: "d", header: "D", type: "date" },
        { id: "s", header: "S", type: "select", options: [{ id: "a", label: "Alpha" }] },
      ],
      rows: [{ n: 5, l: { href: "https://x.test/", label: "X" }, d: "2026-01-02", s: "a" }, { n: 1, l: { href: "javascript:alert(1)" }, d: null, s: "a" }],
    });
    expect(cell(0, 1).querySelector("a")!.getAttribute("href")).toBe("https://x.test/");
    expect(cell(1, 1).querySelector("a")).toBeNull();
    expect(cell(0, 2).querySelector("time")!.getAttribute("datetime")).toBe("2026-01-02");
    expect(cell(0, 3).textContent).toBe("Alpha");
  });
  test("file drop reports files; rollup is read-only", () => {
    const fn = vi.fn();
    mount({ columns: [{ id: "f", header: "F", type: "file", editable: true }, { id: "r", header: "R", type: "rollup", aggregate: "count", relation: () => [1, 2] }], rows: [{ f: [] }], onFilesSelected: fn });
    const f = new File(["x"], "a.txt");
    const drop = new Event("drop", { bubbles: true, cancelable: true }) as Event & { dataTransfer?: unknown };
    drop.dataTransfer = { files: [f], types: ["Files"] };
    cell(0, 0).dispatchEvent(drop);
    expect(fn.mock.calls[0][0].files).toEqual([f]);
    expect(cell(0, 1).textContent).toBe("2");
    expect(cell(0, 1).getAttribute("aria-readonly")).toBe("true");
  });
});

describe("footer totals, pinned offset, remembered order (ported from Svelte)", () => {
  const AMOUNTS: DataGridColumn[] = [
    { id: "name", header: "Name", filterable: true },
    { id: "amount", header: "Amount", type: "number" },
  ];
  const MONEY = [
    { name: "a", amount: 10 },
    { name: "ab", amount: 20 },
    { name: "abc", amount: null },
    { name: "abcd", amount: "" },
    { name: "z", amount: 1000 },
  ];
  const totalFooter = (ctx: { rows: unknown[]; allRows: unknown[]; aggregate: (id: string, kind: "sum" | "count") => unknown }) => {
    const tr = document.createElement("tr");
    tr.className = "f-row";
    for (const [cls, text] of [["f-page", ctx.rows.length], ["f-all", ctx.allRows.length], ["f-sum", ctx.aggregate("amount", "sum")]] as const) {
      const td = document.createElement("td");
      td.className = cls;
      td.textContent = String(text);
      tr.appendChild(td);
    }
    return tr;
  };

  test("the footer's aggregate covers every filtered row, not only the current page", () => {
    mount({ columns: AMOUNTS, rows: MONEY, pageSize: 2, footer: totalFooter, filter: "a", labels: { ...LABELS, pagination: "Pages" } });
    expect(grid.querySelector(".f-page")!.textContent).toBe("2");
    expect(grid.querySelector(".f-all")!.textContent).toBe("4");
    expect(grid.querySelector(".f-sum")!.textContent).toBe("30");
  });

  test("a pinned column gets --data-grid-pinned-offset from the widths of the pinned columns before it", () => {
    mount({
      columns: [
        { id: "a", header: "A", pinned: "start", width: 100 },
        { id: "b", header: "B", pinned: "start", width: 50 },
        { id: "c", header: "C" },
      ],
      rows: [{ a: 1, b: 2, c: 3 }],
    });
    const ths = grid.querySelectorAll<HTMLElement>("thead th");
    expect(ths[0].style.getPropertyValue("--data-grid-pinned-offset")).toBe("0px");
    expect(ths[1].style.getPropertyValue("--data-grid-pinned-offset")).toBe("100px");
    expect(ths[2].style.getPropertyValue("--data-grid-pinned-offset")).toBe("");
  });

  test("storageKey remembers the column order", () => {
    mount({ columnOrder: ["email", "name"] }, { "storage-key": "order-k" });
    expect(JSON.parse(localStorage.getItem("order-k")!).columnOrder).toEqual(["email", "name"]);
    document.body.innerHTML = "";
    mount({}, { "storage-key": "order-k" });
    expect(bodyRows()[0].querySelectorAll(".data-table-td")[0].textContent).toBe("bob@example.com");
  });
});
