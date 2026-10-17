// @vitest-environment jsdom
// The Gantt chart with a label pack: nunjucksLabelsFor() output renders and drives the chart in every locale.
import { readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import nunjucks from "nunjucks";
import { afterEach, describe, expect, test } from "vitest";

import type { LabelPack } from "../shared/label-pack";
import { nunjucksLabelsFor } from "../shared/label-pack-nunjucks";
import { initGanttChart } from "./gantt-chart.client.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const packDir = path.join(here, "..", "shared", "label-packs");
const load = (locale: string) => JSON.parse(readFileSync(path.join(packDir, `${locale}.json`), "utf8")) as LabelPack;
const locales = readdirSync(packDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
const env = nunjucks.configure([here, path.join(here, "..")], { autoescape: true, throwOnUndefined: false, trimBlocks: true, lstripBlocks: true });

const RANGE = { start: "2026-10-01", end: "2026-10-10" };
const TASKS = [
  { id: "p", label: "Phase", start: "2026-10-01", end: "2026-10-08" },
  { id: "a", label: "Design", start: "2026-10-01", end: "2026-10-03", parentId: "p", critical: true },
  { id: "b", label: "Build", start: "2026-10-04", end: "2026-10-06", parentId: "p", dependsOn: [{ id: "a", type: "s2s", lag: 2 }] },
  { id: "c", label: "Docs", start: "2026-10-07", end: "2026-10-08", dependsOn: ["b"] },
];

function setup(locale: string) {
  const { macro, client } = nunjucksLabelsFor("gantt-chart", load(locale));
  document.body.innerHTML = env.renderString(`{% from "./gantt-chart.njk" import ganttChart %}{{ ganttChart(opts) }}`, {
    opts: { label: "Plan", range: RANGE, tasks: TASKS, labels: macro },
  });
  const root = document.body.querySelector<HTMLElement>("[data-lily-gantt-chart-root]")!;
  initGanttChart(root, { labels: client });
  return root;
}

afterEach(() => {
  document.body.innerHTML = "";
});

function visible(root: HTMLElement): string[] {
  const out: string[] = [];
  root.querySelectorAll("[aria-label]").forEach((e) => out.push(e.getAttribute("aria-label")!));
  root.querySelectorAll(".gantt-chart-critical-label, .gantt-chart-dependency-summary, .gantt-chart-expand-all-button, .gantt-chart-collapse-all-button, .gantt-chart-export-button").forEach((e) => out.push(e.textContent ?? ""));
  return out.filter((t) => t !== "");
}

describe("gantt chart label pack", () => {
  test("English: the critical label, the per-type dependency wording and the toggles", () => {
    const root = setup("en-001");
    expect(root.querySelector(".gantt-chart-critical-label")!.textContent).toBe("Critical path");
    const summaries = Array.from(root.querySelectorAll(".gantt-chart-dependency-summary")).map((e) => e.textContent);
    expect(summaries).toContain("Depends on Design: start to start, lag 2 days");
    expect(summaries).toContain("Depends on Build");
    expect(root.querySelector("[aria-label='Collapse Phase']")).not.toBeNull();
    expect(root.querySelector(".gantt-chart-expand-all-button")!.textContent).toBe("Expand all");
  });

  test("the critical label leaves the task label itself unchanged", () => {
    const root = setup("en-001");
    const row = root.querySelector("tr[data-lily-gantt-chart-task-id='a']")!;
    expect(row.querySelector("[data-lily-gantt-chart-task-label-text]")!.textContent).toBe("Design");
  });

  test.each(locales)("%s: every label the macro writes is filled, with no placeholder left over", (locale) => {
    const root = setup(locale);
    const texts = visible(root);
    expect(texts.length).toBeGreaterThan(5);
    for (const text of texts) expect(text, `${locale}: ${text}`).not.toMatch(/\{\w+\}/);
    expect(root.querySelectorAll(".gantt-chart-critical-label")).toHaveLength(1);
  });
});
