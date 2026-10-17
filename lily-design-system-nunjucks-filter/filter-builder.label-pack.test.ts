// @vitest-environment jsdom
// The filter builder with a label pack: nunjucksLabelsFor() output renders and names every control in every locale.
import { readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import nunjucks from "nunjucks";
import { afterEach, describe, expect, test } from "vitest";

import type { LabelPack } from "../shared/label-pack";
import { nunjucksLabelsFor } from "../shared/label-pack-nunjucks";
import { initFilterBuilder } from "./filter-builder.client.js";
import { createRule, type FilterField, type FilterGroup } from "./filter-model";

const here = path.dirname(fileURLToPath(import.meta.url));
const packDir = path.join(here, "..", "shared", "label-packs");
const load = (locale: string) => JSON.parse(readFileSync(path.join(packDir, `${locale}.json`), "utf8")) as LabelPack;
const locales = readdirSync(packDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
const env = nunjucks.configure([here], { autoescape: true, throwOnUndefined: false, trimBlocks: true, lstripBlocks: true });

const FIELDS: FilterField[] = [{ id: "name", label: "Name" }, { id: "age", label: "Age", type: "number" }];

function setup(locale: string, pass: "macro" | "client" = "macro") {
  const { macro, client } = nunjucksLabelsFor("filter", load(locale));
  const age = { ...createRule(FIELDS, "age"), operator: "between" as const };
  const value: FilterGroup = { type: "group", id: "g1", combinator: "and", not: false, children: [createRule(FIELDS, "name"), age] } as FilterGroup;
  document.body.innerHTML = env.renderString(`{% from "./filter-builder.njk" import filterBuilder %}{{ filterBuilder(opts) }}`, {
    opts: { label: "Filter people", fields: FIELDS, value, labels: pass === "macro" ? macro : {} },
  });
  const root = document.body.querySelector<HTMLElement>("[data-lily-filter-builder-root]")!;
  initFilterBuilder(root, pass === "client" ? { labels: client } : {});
  return root;
}

afterEach(() => {
  document.body.innerHTML = "";
});

function visible(root: HTMLElement): string[] {
  const out: string[] = [];
  root.querySelectorAll("[aria-label]").forEach((e) => out.push(e.getAttribute("aria-label")!));
  root.querySelectorAll("button, option, label, legend").forEach((e) => out.push(e.textContent ?? ""));
  return out.filter((t) => t.trim() !== "");
}

describe("filter builder label pack", () => {
  test("English: the rule names, the operator names and the buttons", () => {
    const root = setup("en-001");
    const texts = visible(root);
    for (const wanted of ["Condition 1", "Condition 2", "Group, level 1", "Add condition", "Add group", "contains", "is between"]) expect(texts.join("|")).toContain(wanted);
  });

  test.each(locales)("%s: macro labels fill every control, with no placeholder left over", (locale) => {
    const texts = visible(setup(locale));
    expect(texts.length).toBeGreaterThan(8);
    for (const text of texts) expect(text, `${locale}: ${text}`).not.toMatch(/\{\w+\}/);
  });

  test.each(locales)("%s: the function labels from the client option give the same names", (locale) => {
    const viaMacro = visible(setup(locale, "macro")).join("|");
    const viaClient = visible(setup(locale, "client")).join("|");
    expect(viaClient).toBe(viaMacro);
  });
});
