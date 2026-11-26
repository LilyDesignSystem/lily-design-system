// Edge cases of the label-pack builders, typed fields and Intl labels: what a missing, empty or odd value does.
// Each rule here is in the module's own doc comments; the main test files cover the ordinary paths.
import { describe, expect, it } from "vitest";

import { intlLabels } from "./intl-labels";
import { labelsFor, type LabelPack } from "./label-pack";
import { draftOf, exportFieldCell, fieldText, resolveFields } from "./typed-fields";

const base: LabelPack = { locale: "xx-001", reviewed: false };
type Fn = (...args: unknown[]) => string;

describe("labelsFor", () => {
    it("a select with no matching key and no `other` is empty, never a half-filled template", () => {
        const l = labelsFor("data-grid", {
            ...base,
            "data-grid": { sortAnnouncement: { ascending: "{header} up" } },
        });
        expect((l.sortAnnouncement as Fn)("Name", "ascending")).toBe("Name up");
        expect((l.sortAnnouncement as Fn)("Name", "descending")).toBe("");
    });

    it("a missing argument fills its placeholder with nothing", () => {
        const l = labelsFor("data-grid", {
            ...base,
            "data-grid": { sortAnnouncement: { other: "[{header}]" } },
        });
        expect((l.sortAnnouncement as Fn)(undefined, "none")).toBe("[]");
    });

    it("an unknown filter operator has no name", () => {
        const l = labelsFor("filter", { ...base, filter: { operators: { eq: "is" } } });
        expect((l.operatorName as Fn)("eq")).toBe("is");
        expect((l.operatorName as Fn)("between")).toBe("");
    });
});

describe("typed fields with no values", () => {
    const [name, link] = resolveFields([
        { id: "name", header: "Name", accessor: (row) => row.first },
        { id: "url", header: "Link", type: "link" },
    ]);

    it("read nothing, show nothing and export null", () => {
        expect(fieldText(name, undefined)).toBe("");
        expect(exportFieldCell(name, undefined)).toBeNull();
        expect(fieldText(name, { first: "Ada" })).toBe("Ada");
    });

    it("a link's draft is its href, and an object without one starts empty", () => {
        expect(draftOf(link, { url: { href: "https://example.org" } })).toBe("https://example.org");
        expect(draftOf(link, { url: { label: "No address" } })).toBe("");
        expect(draftOf(link, { url: "https://example.org/x" })).toBe("https://example.org/x");
    });
});

describe("intlLabels", () => {
    it("gantt-chart with no pack, or a pack without words, leaves confirm and cancel to the caller", () => {
        const none = intlLabels("gantt-chart", "en-GB") as {
            dateTimePickerLabels: Record<string, string>;
        };
        expect(none.dateTimePickerLabels.confirm).toBeUndefined();
        expect(none.dateTimePickerLabels.previousMonth).toBe("Last month");
        const empty = intlLabels("gantt-chart", "en-GB", base) as {
            dateTimePickerLabels: Record<string, string>;
        };
        expect(empty.dateTimePickerLabels.cancel).toBeUndefined();
    });

    it("a helper with no Intl labels gets none", () => {
        expect(intlLabels("filter", "en-GB")).toEqual({});
    });
});
