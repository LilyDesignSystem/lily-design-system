// @vitest-environment jsdom
// The calendar with a label pack: nunjucksLabelsFor() output renders and drives the calendar in every locale.
import { readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import nunjucks from "nunjucks";
import { afterEach, describe, expect, test } from "vitest";

import type { LabelPack } from "../shared/label-pack";
import { nunjucksLabelsFor } from "../shared/label-pack-nunjucks";
import { initCalendarView } from "./calendar-view.client.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const packDir = path.join(here, "..", "shared", "label-packs");
const load = (locale: string) => JSON.parse(readFileSync(path.join(packDir, `${locale}.json`), "utf8")) as LabelPack;
const locales = readdirSync(packDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
const env = nunjucks.configure([here, path.join(here, "..")], { autoescape: true, throwOnUndefined: false, trimBlocks: true, lstripBlocks: true });

const EVENTS = [
  { id: "e1", date: "2026-01-06", title: "Design review" },
  { id: "e2", date: "2026-01-06", title: "Café standup" },
];

function setup(locale: string, view = "week") {
  const { macro, client } = nunjucksLabelsFor("calendar", load(locale), { view });
  document.body.innerHTML = env.renderString(`{% from "./calendar-view.njk" import calendarView %}{{ calendarView(opts) }}`, {
    opts: { label: "Cal", view, anchorDate: "2026-01-06", labels: macro },
  });
  const root = document.body.querySelector<HTMLElement>("[data-lily-calendar-view-root]")!;
  initCalendarView(root, { events: EVENTS, labels: { ...client, weekday: (d: number) => String(d), weekdayAbbr: (d: number) => String(d), day: (iso: string) => iso } } as never);
  return root;
}

afterEach(() => {
  document.body.innerHTML = "";
});

function visible(root: HTMLElement): string[] {
  const out: string[] = [];
  root.querySelectorAll("[aria-label]").forEach((e) => out.push(e.getAttribute("aria-label")!));
  root.querySelectorAll("button, .calendar-view-export-button").forEach((e) => out.push(e.textContent ?? ""));
  return out.filter((t) => t.trim() !== "");
}

describe("calendar label pack", () => {
  test("English: the view buttons, today and the search announcement", () => {
    const root = setup("en-001");
    const texts = visible(root);
    for (const wanted of ["Week", "Month", "Today"]) expect(texts).toContain(wanted);
    const input = root.querySelector<HTMLInputElement>("[data-lily-calendar-view-search]")!;
    input.value = "design";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(root.querySelector("[data-lily-calendar-view-status]")!.textContent).toBe("1 of 2 match");
  });

  test("the arrows are named for the view the page starts in", () => {
    expect(setup("en-001", "week").querySelector("[aria-label='Previous week']")).not.toBeNull();
    expect(setup("en-001", "month").querySelector("[aria-label='Next month']")).not.toBeNull();
  });

  test.each(locales)("%s: every label the macro writes is filled, with no placeholder left over", (locale) => {
    const root = setup(locale);
    const texts = visible(root);
    expect(texts.length).toBeGreaterThan(4);
    for (const text of texts) expect(text, `${locale}: ${text}`).not.toMatch(/\{\w+\}/);
  });
});
