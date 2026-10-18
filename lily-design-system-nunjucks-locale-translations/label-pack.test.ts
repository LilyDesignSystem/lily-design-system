import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { fillTemplate, labelsFor, SPEC, type LabelHelper, type LabelPack } from "./label-pack";

const dir = join(dirname(fileURLToPath(import.meta.url)), "label-packs");
const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const packs = new Map<string, LabelPack>(files.map((f) => [f.replace(/\.json$/, ""), JSON.parse(readFileSync(join(dir, f), "utf8")) as LabelPack]));
const english = packs.get("en-001")!;
const SECTIONS = ["common", "data-grid", "kanban-board", "calendar", "gantt-chart", "filter"] as const;
const HELPERS: LabelHelper[] = ["data-grid", "kanban-board", "calendar", "gantt-chart", "filter"];

/** Every leaf string of a pack with its path, e.g. `data-grid.sortAnnouncement.ascending`. */
function leaves(pack: LabelPack): Map<string, string> {
    const out = new Map<string, string>();
    for (const section of SECTIONS) {
        for (const [key, value] of Object.entries(pack[section] ?? {})) {
            if (typeof value === "string") out.set(`${section}.${key}`, value);
            else for (const [sub, text] of Object.entries(value)) out.set(`${section}.${key}.${sub}`, text);
        }
    }
    return out;
}

const placeholders = (s: string): string[] => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);

describe("label packs", () => {
    it("English is the base and is marked reviewed", () => {
        expect(english.reviewed).toBe(true);
        expect(leaves(english).size).toBeGreaterThan(150);
    });

    for (const [locale, pack] of packs) {
        describe(locale, () => {
            it("names its own locale and says whether it is reviewed", () => {
                expect(pack.locale).toBe(locale);
                expect(typeof pack.reviewed).toBe("boolean");
            });

            it("has exactly the English keys, every one non-empty", () => {
                const base = leaves(english);
                const mine = leaves(pack);
                expect([...mine.keys()].sort()).toEqual([...base.keys()].sort());
                for (const [path, text] of mine) expect(text.trim(), path).not.toBe("");
            });

            it("keeps every placeholder the English uses, and invents none", () => {
                const base = leaves(english);
                for (const [path, text] of leaves(pack)) {
                    expect(placeholders(text).sort(), `${locale} ${path}`).toEqual(placeholders(base.get(path)!).sort());
                }
            });

            it("builds working labels for every helper, with no placeholder left over", () => {
                for (const helper of HELPERS) {
                    const labels = labelsFor(helper, pack);
                    for (const [key, value] of Object.entries(labels)) {
                        if (typeof value !== "function") continue;
                        const params = SPEC[helper][key];
                        if (!params) continue;
                        const args = params.map((param) => {
                            if (param.startsWith("@")) return pickSelect(pack, helper, key);
                            if (param.includes("=")) return { card: { title: "T" }, column: { title: "T" }, lane: { title: "T" }, task: { label: "T" }, calendarEvent: { title: "T" }, baseline: { start: "S", end: "E" } }[param.split("|")[0].split("=")[1].split(".")[0]];
                            return "x";
                        });
                        const result = (value as (...a: unknown[]) => string)(...args);
                        expect(result, `${locale} ${helper}.${key}`).not.toMatch(/\{\w+\}/);
                        expect(result.trim(), `${locale} ${helper}.${key}`).not.toBe("");
                    }
                }
            });
        });
    }

    it("fills the English templates as written", () => {
        const grid = labelsFor("data-grid", english) as Record<string, (...a: unknown[]) => string>;
        expect(grid.pageStatus(2, 5, 47)).toBe("Page 2 of 5 (47 rows)");
        expect(grid.sortAnnouncement("Name", "descending")).toBe("Sorted by Name, descending");
        expect(grid.exportAnnouncement("xlsx", 3, "a.xlsx")).toBe("Exported 3 as XLSX: a.xlsx");
        const kanban = labelsFor("kanban-board", english) as Record<string, (...a: unknown[]) => string>;
        expect(kanban.moveButton({ title: "Fix bug" })).toBe("Move Fix bug");
        expect(kanban.collapseColumn({ title: "Done" }, true)).toBe("Expand Done");
        expect(kanban.moveFailed("A", "B", new Error("offline"))).toBe("A could not move to B: offline");
        const calendar = labelsFor("calendar", english) as Record<string, (...a: unknown[]) => string>;
        expect(calendar.next("four-week")).toBe("Next four weeks");
        const gantt = labelsFor("gantt-chart", english) as Record<string, (...a: unknown[]) => string>;
        expect(gantt.dependencySummary(["A", "B"])).toBe("Depends on A, B");
        expect(gantt.baselineSummary("T", { start: "2026-01-01", end: "2026-01-05" }, 2)).toBe("T: planned 2026-01-01 to 2026-01-05, variance 2 days");
        const calendarFb = labelsFor("calendar", english) as Record<string, (...a: unknown[]) => string>;
        expect(calendarFb.eventMoveAnnouncement({ id: "e7" }, "2026-01-02")).toBe("e7 moved to 2026-01-02");
        expect(calendarFb.eventMoveAnnouncement({ id: "e7", title: "Dentist" }, "2026-01-02")).toBe("Dentist moved to 2026-01-02");
        const filter = labelsFor("filter", english) as Record<string, (...a: unknown[]) => string>;
        expect(filter.operatorName("not-contains", {})).toBe("does not contain");
        expect(filter.rule(2)).toBe("Condition 2");
    });

    it("the filter takes no export labels; the data grid takes no search announcement", () => {
        expect("export" in labelsFor("filter", english)).toBe(false);
        expect("searchAnnouncement" in labelsFor("data-grid", english)).toBe(false);
    });

    it("an unknown placeholder is left as written", () => {
        expect(fillTemplate("a {x} {y}", { x: "1" })).toBe("a 1 {y}");
    });
});

/** A value that selects a branch of the template for `key`: the first branch the pack defines. */
function pickSelect(pack: LabelPack, helper: LabelHelper, key: string): string {
    const own = (pack[helper] ?? {})[key] ?? (pack.common ?? {})[key];
    return Object.keys(own as Record<string, string>)[0];
}
