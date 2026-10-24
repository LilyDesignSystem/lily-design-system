import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { LabelHelper, LabelPack } from "./label-pack.js";
import { nunjucksLabelsFor } from "./label-pack-nunjucks.js";

const dir = join(dirname(fileURLToPath(import.meta.url)), "label-packs");
const packs = new Map<string, LabelPack>(
    readdirSync(dir).filter((f) => f.endsWith(".json")).sort().map((f) => [f.replace(/\.json$/, ""), JSON.parse(readFileSync(join(dir, f), "utf8")) as LabelPack]),
);
const english = packs.get("en-001")!;
const HELPERS: LabelHelper[] = ["data-grid", "kanban-board", "calendar", "gantt-chart", "filter"];
const placeholders = (s: string): string[] => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

/** Every `{token}` each Nunjucks helper's macro or client substitutes, by label. A pack's template may use no other. */
const TOKENS: Record<string, Record<string, string[]>> = {
    "kanban-board": {
        cardCount: ["count"], overLimit: ["count", "limit"], moveButton: ["card"], addCard: ["column"], emptyColumn: ["column"],
        collapseColumn: ["column"], expandColumn: ["column"], collapseLane: ["lane"], expandLane: ["lane"], laneCount: ["count", "lane"],
        exportAnnouncement: ["count", "filename", "format"], editAnnouncement: ["card", "field", "value"], editInvalid: ["card", "field"],
        editRefused: ["card", "field", "message"], fieldUndoAnnouncement: ["card", "field", "value"], fieldRedoAnnouncement: ["card", "field", "value"],
        copyAnnouncement: ["count"], searchAnnouncement: ["matched", "total"], titleEditor: ["title"], titleEditAnnouncement: ["previous", "title"],
    },
    "gantt-chart": {
        dependencySummary: ["predecessors"], collapseLabel: ["task"], expandLabel: ["task"], exportAnnouncement: ["count", "filename", "format"],
        editAnnouncement: ["field", "task", "value"], editInvalid: ["field", "task"], editRefused: ["field", "message", "task"],
        fieldUndoAnnouncement: ["field", "task", "value"], fieldRedoAnnouncement: ["field", "task", "value"], copyAnnouncement: ["count"],
        searchAnnouncement: ["matched", "total"],
    },
    filter: {
        rule: ["n"], group: ["depth"], removeRule: ["n"], removeGroup: ["depth"], ruleAdded: ["n"], ruleRemoved: ["n"], groupAdded: ["depth"], groupRemoved: ["depth"],
    },
};

describe("nunjucksLabelsFor", () => {
    for (const [locale, pack] of packs) {
        it(`${locale}: the macro labels are JSON-safe and use only the tokens each helper substitutes`, () => {
            for (const helper of HELPERS) {
                const { macro } = nunjucksLabelsFor(helper, pack);
                expect(JSON.parse(JSON.stringify(macro))).toEqual(macro);
                for (const [key, value] of Object.entries(macro)) {
                    const allowed = TOKENS[helper]?.[key];
                    if (!allowed) continue;
                    const texts = typeof value === "string" ? [value] : Object.values(value as Record<string, string>);
                    for (const text of texts) for (const token of placeholders(text)) expect(allowed, `${locale} ${helper}.${key} uses {${token}}`).toContain(token);
                }
                expect(Object.keys(macro).length).toBeGreaterThan(5);
            }
        });
    }

    it("renames the two-state labels the Nunjucks helpers split", () => {
        const kanban = nunjucksLabelsFor("kanban-board", english).macro;
        expect(kanban.collapseColumn).toBe("Collapse {column}");
        expect(kanban.expandColumn).toBe("Expand {column}");
        expect(kanban.expandLane).toBe("Expand {lane}");
        expect(kanban.searchAnnouncement).toBe("{matched} of {total} match");
        expect(kanban.editAnnouncement).toBe("{card}: {field} changed to {value}");
        const gantt = nunjucksLabelsFor("gantt-chart", english).macro;
        expect(gantt.collapseLabel).toBe("Collapse {task}");
        expect(gantt.expandLabel).toBe("Expand {task}");
        expect(gantt.dependencySummary).toBe("Depends on {predecessors}");
        expect(gantt.fieldUndoAnnouncement).toBe("{task}: {field} restored to {value}");
        expect((gantt.dependencyDetail as Record<string, string>).s2s).toContain("start to start");
    });

    it("renames the data grid's tokens to its own and keeps the select label as an object", () => {
        const grid = nunjucksLabelsFor("data-grid", english).macro;
        expect(grid.filterAnnouncement).toBe("{matchCount} of {totalCount} rows match");
        expect(grid.selectionAnnouncement).toBe("{selectedCount} selected");
        expect(grid.exportAnnouncement).toBe("Exported {rowCount} as {format}: {filename}");
        expect(grid.copyAnnouncement).toBe("Copied {rowCount} rows");
        expect((grid.sortAnnouncement as Record<string, string>).ascending).toBe("Sorted by {header}, ascending");
    });

    it("names the calendar's arrows for one view and gives the filter its operator names", () => {
        expect(nunjucksLabelsFor("calendar", english).macro.previousLabel).toBe("Previous month");
        expect(nunjucksLabelsFor("calendar", english, { view: "week" }).macro.nextLabel).toBe("Next week");
        const filter = nunjucksLabelsFor("filter", english).macro;
        expect((filter.operatorNames as Record<string, string>)["not-contains"]).toBe("does not contain");
        expect("operators" in filter).toBe(false);
    });

    it("hands the client the same pack as functions", () => {
        const { client } = nunjucksLabelsFor("kanban-board", english);
        expect((client.moveFailed as (...a: unknown[]) => string)("A", "B", new Error("offline"))).toBe("A could not move to B: offline");
    });
});
