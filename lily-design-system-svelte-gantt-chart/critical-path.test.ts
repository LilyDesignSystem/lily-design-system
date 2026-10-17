import { describe, expect, it } from "vitest";
import { applyCriticalPath, criticalPath, type CriticalPathTask } from "./critical-path";

const t = (id: string, start: string, end: string, extra: Partial<CriticalPathTask> = {}): CriticalPathTask => ({ id, start, end, ...extra });
const get = (tasks: CriticalPathTask[], id: string) => criticalPath(tasks).tasks.get(id)!;

describe("critical-path", () => {
    it("a chain of finish-to-start tasks is all critical; a shorter parallel branch has slack", () => {
        const tasks = [
            t("a", "2026-01-01", "2026-01-03"),
            t("b", "2026-01-04", "2026-01-08", { dependsOn: ["a"] }),
            t("c", "2026-01-04", "2026-01-05", { dependsOn: ["a"] }),
            t("d", "2026-01-09", "2026-01-10", { dependsOn: ["b", "c"] }),
        ];
        const r = criticalPath(tasks);
        expect(["a", "b", "d"].every((id) => r.tasks.get(id)!.critical)).toBe(true);
        expect(r.tasks.get("c")).toEqual({ critical: false, slack: 3 });
        expect(r.finish).toBe("2026-01-10");
    });

    it("a dependency pushes a task later than its planned start", () => {
        const tasks = [t("a", "2026-01-01", "2026-01-05"), t("b", "2026-01-02", "2026-01-03", { dependsOn: ["a"] })];
        expect(criticalPath(tasks).finish).toBe("2026-01-07");
        expect(get(tasks, "b")).toEqual({ critical: true, slack: 0 });
    });

    it("finish-to-start lag and lead", () => {
        const base = [t("a", "2026-01-01", "2026-01-02")];
        expect(criticalPath([...base, t("b", "2026-01-03", "2026-01-03", { dependsOn: [{ id: "a", lag: 2 }] })]).finish).toBe("2026-01-05");
        expect(criticalPath([...base, t("b", "2026-01-01", "2026-01-04", { dependsOn: [{ id: "a", lag: -2 }] })]).finish).toBe("2026-01-04");
    });

    it("start-to-start: the successor starts lag days after the predecessor starts", () => {
        const tasks = [t("a", "2026-01-01", "2026-01-10"), t("b", "2026-01-01", "2026-01-02", { dependsOn: [{ id: "a", type: "s2s", lag: 3 }] })];
        const r = criticalPath(tasks);
        expect(r.tasks.get("a")).toEqual({ critical: true, slack: 0 });
        expect(r.tasks.get("b")).toEqual({ critical: false, slack: 5 });
    });

    it("end-to-end: the successor ends lag days after the predecessor ends", () => {
        const tasks = [t("a", "2026-01-01", "2026-01-10"), t("b", "2026-01-01", "2026-01-03", { dependsOn: [{ id: "a", type: "e2e", lag: 2 }] })];
        const r = criticalPath(tasks);
        expect(r.finish).toBe("2026-01-12");
        expect(r.tasks.get("a")!.critical).toBe(true);
        expect(r.tasks.get("b")!.critical).toBe(true);
    });

    it("start-to-end: the successor ends lag days after the predecessor starts", () => {
        const tasks = [t("a", "2026-01-05", "2026-01-06"), t("b", "2026-01-01", "2026-01-03", { dependsOn: [{ id: "a", type: "s2e", lag: 4 }] })];
        const r = criticalPath(tasks);
        // b must end on 2026-01-09, so it starts 2026-01-07.
        expect(r.finish).toBe("2026-01-09");
        expect(r.tasks.get("b")).toEqual({ critical: true, slack: 0 });
    });

    it("mixed kinds with lags: slack is measured against the project finish", () => {
        const tasks = [
            t("a", "2026-01-01", "2026-01-04"),
            t("b", "2026-01-01", "2026-01-02", { dependsOn: [{ id: "a", type: "s2s", lag: 1 }] }),
            t("c", "2026-01-01", "2026-01-03", { dependsOn: [{ id: "a", type: "e2s", lag: 1 }, { id: "b", type: "e2e", lag: 5 }] }),
        ];
        const r = criticalPath(tasks);
        // c: e2s -> starts >= 01-06; e2e with b (ends 01-03) -> ends >= 01-08 -> starts >= 01-06. Finish 01-08.
        expect(r.finish).toBe("2026-01-08");
        expect(r.tasks.get("c")!.critical).toBe(true);
        expect(r.tasks.get("a")!.critical).toBe(true);
        // b can slide until c's e2e bound: slack against c's end (b.EF <= 08-5 = 01-03) is 0, so b is critical too.
        expect(r.tasks.get("b")!.slack).toBe(0);
    });

    it("summary rows are ignored; their children are scheduled", () => {
        const tasks = [t("p", "2026-01-01", "2026-01-10"), t("a", "2026-01-01", "2026-01-02", { parentId: "p" }), t("b", "2026-01-03", "2026-01-04", { parentId: "p", dependsOn: ["a"] })];
        const r = criticalPath(tasks);
        expect(r.tasks.has("p")).toBe(false);
        expect(r.finish).toBe("2026-01-04");
    });

    it("ignores unscheduled tasks and unknown dependencies", () => {
        const tasks = [t("a", "2026-01-01", "2026-01-02", { dependsOn: ["ghost", "u"] }), { id: "u" }];
        const r = criticalPath(tasks);
        expect([...r.tasks.keys()]).toEqual(["a"]);
        expect(r.tasks.get("a")!.critical).toBe(true);
    });

    it("reports a cycle and leaves it out", () => {
        const tasks = [t("a", "2026-01-01", "2026-01-02", { dependsOn: ["b"] }), t("b", "2026-01-03", "2026-01-04", { dependsOn: ["a"] }), t("c", "2026-01-01", "2026-01-01")];
        const r = criticalPath(tasks);
        expect(r.cycle.sort()).toEqual(["a", "b"]);
        expect([...r.tasks.keys()]).toEqual(["c"]);
    });

    it("nothing scheduled: no result", () => {
        expect(criticalPath([])).toEqual({ tasks: new Map(), cycle: [], finish: null });
    });

    it("applyCriticalPath fills critical and slack and leaves other fields alone", () => {
        const out = applyCriticalPath([{ ...t("a", "2026-01-01", "2026-01-02"), label: "A" }, { id: "u", label: "U" }]);
        expect(out[0]).toMatchObject({ label: "A", critical: true, slack: 0 });
        expect(out[1]).toEqual({ id: "u", label: "U" });
    });
});
