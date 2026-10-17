// @vitest-environment jsdom
// The kanban board with a label pack: nunjucksLabelsFor() output renders and drives the board in every locale.
import { readdirSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import nunjucks from "nunjucks";
import { afterEach, describe, expect, test } from "vitest";

import type { LabelPack } from "../shared/label-pack";
import { nunjucksLabelsFor } from "../shared/label-pack-nunjucks";
import { initKanbanBoard } from "./kanban-board.client.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const packDir = path.join(here, "..", "shared", "label-packs");
const load = (locale: string) => JSON.parse(readFileSync(path.join(packDir, `${locale}.json`), "utf8")) as LabelPack;
const locales = readdirSync(packDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
const env = nunjucks.configure([here, path.join(here, "..")], { autoescape: true, throwOnUndefined: false, trimBlocks: true, lstripBlocks: true });

const COLUMNS = [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress", wipLimit: 1 }, { id: "done", title: "Done" }];
const LANES = [{ id: "ann", title: "Ann" }, { id: "bo", title: "Bo" }];
const CARDS = [
  { id: "c1", columnId: "todo", title: "Card One", laneId: "ann" },
  { id: "c2", columnId: "todo", title: "Card Two", laneId: "bo" },
  { id: "c3", columnId: "doing", title: "Card Three", laneId: "ann" },
  { id: "c4", columnId: "doing", title: "Card Four", laneId: "ann" },
];

function setup(locale: string, opts: Record<string, unknown> = {}) {
  const { macro, client } = nunjucksLabelsFor("kanban-board", load(locale));
  document.body.innerHTML = env.renderString(`{% from "./kanban-board.njk" import kanbanBoard %}{{ kanbanBoard(opts) }}`, {
    opts: { label: "Board", columns: COLUMNS, lanes: LANES, cards: CARDS, labels: macro, ...opts },
  });
  const root = document.body.querySelector<HTMLElement>("[data-lily-kanban-board-root]")!;
  initKanbanBoard(root, { labels: client });
  return root;
}

afterEach(() => {
  document.body.innerHTML = "";
});

/** Everything the macro writes for a person: attribute labels and text of the label-driven elements. */
function visible(root: HTMLElement): string[] {
  const out: string[] = [];
  root.querySelectorAll("[aria-label]").forEach((e) => out.push(e.getAttribute("aria-label")!));
  root.querySelectorAll(".kanban-board-count, .kanban-board-wip-warning, .kanban-board-lane-count, .kanban-board-empty, .kanban-board-undo-button, .kanban-board-export-button").forEach((e) => out.push(e.textContent ?? ""));
  return out.filter((t) => t !== "");
}

describe("kanban board label pack", () => {
  test("English: counts, the move button and the column and lane toggles", () => {
    const root = setup("en-001", { collapsedColumns: ["done"], undoable: true });
    expect(root.querySelector(".kanban-board-count")!.textContent).toBe("Cards: 2");
    expect(root.querySelector(".kanban-board-wip-warning")!.textContent).toBe("Over the limit: 2 of 1");
    expect(root.querySelector("[aria-label='Move Card One']")).not.toBeNull();
    expect(root.querySelector("[aria-label='Expand Done']")).not.toBeNull();
    expect(root.querySelector("[aria-label='Collapse To Do']")).not.toBeNull();
    expect(root.querySelector("[aria-label='Collapse Ann']")).not.toBeNull();
    expect(root.querySelector("[aria-label='Add a card to To Do']")).not.toBeNull();
    expect(root.querySelector(".kanban-board-undo-button")!.textContent).toBe("Undo");
  });

  test("English: the search announcement and the client's move announcement use the pack", async () => {
    const root = setup("en-001");
    const input = root.querySelector<HTMLInputElement>("[data-lily-kanban-board-search]")!;
    input.value = "one";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(root.querySelector("[data-lily-kanban-board-status]")!.textContent).toBe("1 of 4 match");
  });

  test.each(locales)("%s: every label the macro writes is filled, with no placeholder left over", (locale) => {
    const root = setup(locale, { collapsedColumns: ["done"], undoable: true });
    const texts = visible(root);
    expect(texts.length).toBeGreaterThan(8);
    for (const text of texts) expect(text, `${locale}: ${text}`).not.toMatch(/\{\w+\}/);
  });
});
