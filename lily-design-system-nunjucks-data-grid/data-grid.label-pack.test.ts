// @vitest-environment jsdom
// The data grid with a label pack: nunjucksLabelsFor() output renders and drives the grid in every locale.
import { readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import nunjucks from "nunjucks";
import { afterEach, describe, expect, test } from "vitest";

import type { LabelPack } from "../shared/label-pack";
import { nunjucksLabelsFor } from "../shared/label-pack-nunjucks";
import { autoInit, FUNCTION_LABELS, resolveLabels } from "./data-grid.client.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const packDir = path.join(here, "..", "shared", "label-packs");
const load = (locale: string) => JSON.parse(readFileSync(path.join(packDir, `${locale}.json`), "utf8")) as LabelPack;
const locales = readdirSync(packDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
const env = nunjucks.configure([here], { autoescape: true, trimBlocks: true, lstripBlocks: true });

const COLUMNS = [{ id: "name", header: "Name", sortable: true }, { id: "email", header: "Email" }];
const ROWS = [{ name: "Bob", email: "bob@example.com" }, { name: "Alice", email: "alice@example.com" }];

function render(labels: Record<string, unknown>): string {
  return env.renderString(`{% from "./data-grid.njk" import dataGrid %}{{ dataGrid(label, columns, rows, labels, "multiple", null) }}`, { label: "Users", columns: COLUMNS, rows: ROWS, labels });
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("data grid label pack", () => {
  test("English: the grid's labels name its controls and announce a sort", () => {
    const { macro } = nunjucksLabelsFor("data-grid", load("en-001"));
    document.body.innerHTML = render(macro);
    autoInit();
    expect(document.querySelector("[aria-label='Select Bob']")).not.toBeNull();
    document.querySelector<HTMLElement>(".data-grid-sort-button")!.click();
    expect(document.querySelector(".data-grid-status")!.textContent).toBe("Sorted by Name, ascending");
    document.querySelector<HTMLElement>(".data-grid-sort-button")!.click();
    expect(document.querySelector(".data-grid-status")!.textContent).toBe("Sorted by Name, descending");
  });

  test.each(locales)("%s: every template resolves with no placeholder left over", (locale) => {
    const { macro } = nunjucksLabelsFor("data-grid", load(locale));
    const labels = resolveLabels(macro) as Record<string, unknown>;
    for (const [key, params] of Object.entries(FUNCTION_LABELS)) {
      const label = labels[key];
      if (typeof label !== "function") continue;
      const args = params.map((name) => (name === "direction" ? "ascending" : name === "format" ? "csv" : `<${name}>`));
      const text = (label as (...a: unknown[]) => string)(...args);
      expect(text.length, `${locale} ${key}`).toBeGreaterThan(0);
      expect(text, `${locale} ${key}`).not.toMatch(/\{\w+\}/);
    }
  });

  test("a locale's sort announcement picks the wording for the direction", () => {
    const labels = resolveLabels(nunjucksLabelsFor("data-grid", load("de-001")).macro);
    expect(labels.sortAnnouncement!("Name", "ascending")).toBe("Nach Name aufsteigend sortiert");
    expect(labels.sortAnnouncement!("Name", "descending")).toBe("Nach Name absteigend sortiert");
  });
});
