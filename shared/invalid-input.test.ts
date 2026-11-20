// Input the modules are documented to refuse: each returns its "nothing" (null, false, undefined) rather than a wrong
// value or a throw. The modules' own tests cover what they accept.
import { afterEach, describe, expect, test, vi } from "vitest";

import { isCivilTime, resolveColumn, zonedUtcTime } from "./cell-types";
import { hexToRgb, nameOfColor, parseColor } from "./colors";
import { criticalPath } from "./critical-path";
import { systemZone } from "./zones";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("cell types", () => {
    test("isCivilTime refuses a value that is not a string", () => {
        expect(isCivilTime(930)).toBe(false);
        expect(isCivilTime(null)).toBe(false);
    });

    test("zonedUtcTime of something that is not a zoned time is null, even with a reference date", () => {
        expect(zonedUtcTime("09:30", "2026-01-15")).toBeNull();
        expect(zonedUtcTime({ time: "09:30" }, "2026-01-15")).toBeNull();
    });

    test("a select column filters by the option's label, not its id", () => {
        const column = resolveColumn({
            id: "team",
            type: "select",
            options: [{ id: "r", label: "Red" }],
        });
        expect(column.filterText?.("r")).toBe("Red");
    });
});

describe("colours", () => {
    test("hexToRgb and nameOfColor refuse text that is not a hex colour", () => {
        expect(hexToRgb("zz")).toBeNull();
        expect(nameOfColor("#12")).toBeNull();
    });

    test("parseColor refuses a component that is not a number", () => {
        expect(parseColor("rgb(1.2.3, 0, 0)")).toBeNull();
        expect(parseColor("hsl(1..0, 50%, 50%)")).toBeNull();
    });
});

describe("critical path", () => {
    test("a task without a valid date is left out, and so is an unavailable range without one", () => {
        const result = criticalPath(
            [
                { id: "a", start: "2026-01-05", end: "2026-01-06" },
                { id: "bad", start: "5 January", end: "2026-01-06" },
            ],
            { unavailable: [{ start: "someday" }, { start: "2026-01-05", end: "not yet" }] },
        );
        expect(result.tasks.has("bad")).toBe(false);
        expect(result.tasks.get("a")).toEqual({ critical: true, slack: 0 });
        expect(result.finish).toBe("2026-01-06");
    });
});

describe("zones", () => {
    test("systemZone is undefined when the platform cannot tell", () => {
        vi.spyOn(Intl, "DateTimeFormat").mockImplementation(() => {
            throw new RangeError("no ICU");
        });
        expect(systemZone()).toBeUndefined();
    });

    test("systemZone is undefined when the platform reports an empty zone", () => {
        vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
            timeZone: "",
        } as Intl.ResolvedDateTimeFormatOptions);
        expect(systemZone()).toBeUndefined();
    });
});
