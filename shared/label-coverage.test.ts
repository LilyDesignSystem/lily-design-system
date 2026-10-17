import { describe, expect, test } from "vitest";
import { ANNOUNCEMENT_LABELS, CONTROL_LABELS, missingLabels, requiredLabels } from "./label-coverage";

describe("label coverage", () => {
    test("a bare grid needs nothing", () => {
        expect(requiredLabels({})).toEqual([]);
        expect(missingLabels({}, undefined)).toEqual([]);
    });

    test("each feature calls for its own control labels", () => {
        expect(requiredLabels({ selection: true }).filter((r) => r.kind === "control").map((r) => r.key)).toEqual(CONTROL_LABELS.selection);
        expect(requiredLabels({ pagination: true }).map((r) => r.key)).toContain("pageStatus");
        expect(requiredLabels({ hidableColumns: true }).map((r) => r.key)).toEqual(["columnVisibility", "columnVisibilityOption"]);
        expect(requiredLabels({ resizableColumns: true }).map((r) => r.key)).toEqual(["resizeHandle"]);
    });

    test("and its announcements, kept apart from controls", () => {
        const sorting = requiredLabels({ sorting: true });
        expect(sorting).toEqual([{ key: "sortAnnouncement", kind: "announcement" }]);
        expect(ANNOUNCEMENT_LABELS.pagination).toContain("pageAnnouncement");
    });

    test("a key shared by two features is listed once", () => {
        const keys = requiredLabels({ search: true, exporting: true, sorting: true }).map((r) => r.key);
        expect(new Set(keys).size).toBe(keys.length);
    });

    test("missing means absent, null or empty — not falsy values like 0", () => {
        const labels = { selectAll: "Select all", selectionColumn: "", selectRow: undefined, selectionAnnouncement: null };
        expect(missingLabels({ selection: true }, labels).map((m) => m.key)).toEqual(["selectionColumn", "selectRow", "selectionAnnouncement"]);
    });

    test("a complete bundle has none missing", () => {
        const labels = Object.fromEntries(requiredLabels({ selection: true, pagination: true, sorting: true }).map((r) => [r.key, "x"]));
        expect(missingLabels({ selection: true, pagination: true, sorting: true }, labels)).toEqual([]);
    });
});
