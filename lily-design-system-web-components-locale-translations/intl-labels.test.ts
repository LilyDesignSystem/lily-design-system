import { describe, expect, it } from "vitest";
import { intlDateTimePickerLabels, intlLabels, intlLabelsFor } from "./intl-labels.js";
import type { LabelPack } from "./label-pack.js";

const pack: LabelPack = {
    locale: "en-001",
    reviewed: false,
    common: {},
    "gantt-chart": { saveLabel: "Save", cancelLabel: "Cancel", startLabel: "Start" },
    calendar: { today: "Today" },
};

describe("calendar labels", () => {
    const l = intlLabels("calendar", "en-GB") as Record<string, (...a: never[]) => string>;
    it("names the weekdays from Sunday = 0", () => {
        expect(l.weekday(0 as never)).toBe("Sunday");
        expect(l.weekday(6 as never)).toBe("Saturday");
        expect(l.weekdayAbbr(1 as never)).toBe("Mon");
    });
    it("names a day in full and announces a period", () => {
        // The punctuation between the parts differs between ICU versions, so only the parts are pinned.
        expect(l.day("2026-10-24" as never)).toMatch(/^Saturday.*24 October 2026$/);
        const period = l.periodAnnouncement("month" as never, "2026-10-01" as never, "2026-10-31" as never);
        expect(period).toMatch(/Thursday.*1 October 2026 – Saturday.*31 October 2026/);
    });
    it("follows the locale", () => {
        const de = intlLabels("calendar", "de-DE") as Record<string, (...a: never[]) => string>;
        expect(de.weekday(1 as never)).toBe("Montag");
        const ar = intlLabels("calendar", "ar-001") as Record<string, (...a: never[]) => string>;
        expect(ar.weekday(0 as never)).toBe("الأحد");
    });
});

describe("gantt labels", () => {
    it("labels a column by day and month", () => {
        const l = intlLabels("gantt-chart", "en-GB", pack) as { columnLabel: (s: string) => string };
        expect(l.columnLabel("2026-10-24")).toBe("24 Oct");
    });
    it("builds the date-time picker names, with confirm and cancel from the pack's save and cancel", () => {
        const l = intlLabels("gantt-chart", "en-GB", pack) as { dateTimePickerLabels: Record<string, string> };
        expect(l.dateTimePickerLabels.confirm).toBe("Save");
        expect(l.dateTimePickerLabels.cancel).toBe("Cancel");
        expect(l.dateTimePickerLabels.previousMonth).toBe("Last month");
        expect(l.dateTimePickerLabels.nextYear).toBe("Next year");
        expect(l.dateTimePickerLabels.nextDay).toBe("Tomorrow");
    });
    it("capitalises the first letter by the locale's own rules", () => {
        const fr = intlDateTimePickerLabels("fr-FR");
        expect(fr.nextMonth?.[0]).toBe(fr.nextMonth?.[0].toLocaleUpperCase("fr-FR"));
        expect(fr.nextMonth).toMatch(/^[A-ZÀ-Ý]/);
    });
});

describe("what it will not do", () => {
    it("builds nothing for a locale the browser does not know, rather than falling back to another language", () => {
        expect(intlLabels("calendar", "xx-invalid-tag-!!")).toEqual({});
        expect(intlDateTimePickerLabels("not a locale")).toEqual({});
    });
    it("builds nothing for helpers that have no date-dependent labels", () => {
        expect(intlLabels("data-grid", "en-GB")).toEqual({});
        expect(intlLabels("kanban-board", "en-GB")).toEqual({});
    });
    it("passes confirm and cancel through even when Intl has nothing", () => {
        expect(intlDateTimePickerLabels("not a locale", { confirm: "OK" })).toEqual({ confirm: "OK" });
    });
});

describe("intlLabelsFor", () => {
    it("is the pack's labels plus the Intl-built ones", () => {
        const l = intlLabelsFor("calendar", pack, "en-GB");
        expect(l.today).toBe("Today");
        expect(typeof l.weekday).toBe("function");
    });
});
