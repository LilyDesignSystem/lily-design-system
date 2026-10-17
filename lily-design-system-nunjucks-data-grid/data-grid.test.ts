// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { autoInit, initDataGrid, resolveLabels } from "./data-grid.client.js";

const env = nunjucks.configure([path.dirname(fileURLToPath(import.meta.url))], { autoescape: true, trimBlocks: true, lstripBlocks: true });

const COLUMNS = [
  { id: "name", header: "Name", sortable: true },
  { id: "email", header: "Email" },
];
const ROWS = [
  { name: "Bob", email: "bob@example.com" },
  { name: "Alice", email: "alice@example.com" },
];

function render(opts: Record<string, unknown> = {}): string {
  return env.renderString(`{% from "./data-grid.njk" import dataGrid %}{{ dataGrid(label, columns, rows, labels, selectionMode, pageSize) }}`, {
    label: "Users",
    columns: COLUMNS,
    rows: ROWS,
    labels: { selectAll: "Select all", selectRow: "Select {rowLabel}", sortAnnouncement: "{header} sorted {direction}" },
    selectionMode: "multiple",
    pageSize: null,
    ...opts,
  });
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("data-grid.njk (SSR skeleton)", () => {
  test("renders a labelled readable table without JavaScript", () => {
    document.body.innerHTML = render();
    const root = document.querySelector(".data-grid")!;
    expect(root.hasAttribute("data-data-grid")).toBe(true);
    expect(root.querySelector("table")!.getAttribute("aria-label")).toBe("Users");
    expect(root.querySelectorAll("th")).toHaveLength(2);
    expect(root.querySelectorAll("tbody tr")).toHaveLength(2);
    expect(root.querySelector("tbody td")!.textContent).toBe("Bob");
  });
  test("config JSON is embedded and cannot break out of the script", () => {
    const html = render({ rows: [{ name: "</script><b>x", email: "" }] });
    expect(html).not.toContain("</script><b>");
    document.body.innerHTML = html;
    const config = JSON.parse(document.querySelector("script[data-data-grid-config]")!.textContent!);
    expect(config.rows[0].name).toBe("</script><b>x");
  });
});

describe("client runtime", () => {
  test("resolveLabels turns templates into functions", () => {
    const labels = resolveLabels({ selectRow: "Select {rowLabel}", selectAll: "All", pageStatus: "{page}/{pageCount}" });
    expect(labels.selectRow!("Bob")).toBe("Select Bob");
    expect(labels.selectAll).toBe("All");
    expect(labels.pageStatus!(2, 5, 40)).toBe("2/5");
  });
  test("autoInit replaces the skeleton with the interactive grid", () => {
    document.body.innerHTML = render();
    const grids = autoInit();
    expect(grids).toHaveLength(1);
    const root = document.querySelector("[data-data-grid]")!;
    expect(root.hasAttribute("data-data-grid-ready")).toBe(true);
    expect(root.querySelector("table")!.getAttribute("role")).toBe("grid");
    expect(autoInit()).toHaveLength(0);
  });
  test("sort works and uses the template label", () => {
    document.body.innerHTML = render();
    autoInit();
    document.querySelector<HTMLElement>(".data-grid-sort-button")!.click();
    expect(document.querySelectorAll("tbody td")[1].textContent).toBe("Alice");
    expect(document.querySelector(".data-grid-status")!.textContent).toBe("Name sorted ascending");
  });
  test("selection label template and event", () => {
    document.body.innerHTML = render();
    const [grid] = autoInit();
    const fn = vi.fn();
    grid.addEventListener("selectionchange", (e) => fn((e as CustomEvent).detail));
    expect(document.querySelectorAll("tbody input")[1].getAttribute("aria-label")).toBe("Select Alice");
    document.querySelector<HTMLElement>("thead input")!.click();
    expect(fn).toHaveBeenLastCalledWith(["0", "1"]);
  });
  test("pagination and no config", () => {
    document.body.innerHTML = render({ pageSize: 1, labels: { pageStatus: "Page {page} of {pageCount}", nextPage: "Next" } });
    autoInit();
    expect(document.querySelector(".data-grid-page-status")!.textContent).toBe("Page 1 of 2");
    expect(initDataGrid(document.createElement("div"))).toBeNull();
  });
});

describe("0.10.0 macro parameters reach the interactive grid", () => {
  function renderWith(call: string, extra: Record<string, unknown> = {}): string {
    return env.renderString(`{% from "./data-grid.njk" import dataGrid %}{{ ${call} }}`, { label: "Users", columns: COLUMNS, rows: ROWS, labels: {}, ...extra });
  }
  test("emptyValue, nulls, movableColumns, warnMissingLabels and filterField are in the embedded config", () => {
    document.body.innerHTML = renderWith('dataGrid(label, columns, rows, labels, emptyValue="—", nulls="first", movableColumns=true, warnMissingLabels=false, filterField="name")');
    const config = JSON.parse(document.querySelector("script[data-data-grid-config]")!.textContent!);
    expect(config).toMatchObject({ emptyValue: "—", nulls: "first", movableColumns: true, warnMissingLabels: false, filterField: "name" });
  });
  test("initDataGrid applies them: data-empty cells show the emptyValue, columns become movable, the warning is off", () => {
    document.body.innerHTML = renderWith('dataGrid(label, columns, rows, labels, emptyValue="—", movableColumns=true, warnMissingLabels=false)', { rows: [{ name: null, email: "a@b" }] });
    const grid = initDataGrid(document.querySelector("[data-data-grid]")!)!;
    expect(grid.getAttribute("empty-value")).toBe("—");
    expect(grid.hasAttribute("movable-columns")).toBe(true);
    expect(grid.hasAttribute("no-warn-missing-labels")).toBe(true);
    const first = grid.querySelector(".data-table-body .data-table-td")!;
    expect(first.hasAttribute("data-empty")).toBe(true);
    expect(first.textContent).toBe("—");
  });
  test("the new label functions are template strings with placeholders", () => {
    const labels = resolveLabels({ copyAnnouncement: "{rowCount} rows copied", undoAnnouncement: "Undid {header}: {text}" });
    expect((labels.copyAnnouncement as (n: number) => string)(2)).toBe("2 rows copied");
    expect((labels.undoAnnouncement as (h: string, t: string) => string)("Name", "Ann")).toBe("Undid Name: Ann");
  });
});
