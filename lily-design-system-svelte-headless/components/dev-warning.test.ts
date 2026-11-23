import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { resetDevWarnings, warnDeprecated, warnMissingName } from "./dev-warning";

describe("dev-warning", () => {
    let warn: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
        resetDevWarnings();
        warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => {
        warn.mockRestore();
        delete (globalThis as { lilyWarnings?: unknown }).lilyWarnings;
    });

    test("warnDeprecated names the replacement and the removal version, once", () => {
        warnDeprecated("OldThing", "NewThing", "2.0.0");
        warnDeprecated("OldThing", "NewThing", "2.0.0");
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toContain("OldThing is deprecated");
        expect(warn.mock.calls[0][0]).toContain("Use NewThing");
        expect(warn.mock.calls[0][0]).toContain("2.0.0");
    });

    test("a page can silence one component by name and still hear the others", () => {
        (globalThis as { lilyWarnings?: unknown }).lilyWarnings = { Quiet: false };
        warnMissingName("Quiet");
        expect(warn).not.toHaveBeenCalled();
        warnMissingName("Loud");
        expect(warn).toHaveBeenCalledTimes(1);
    });

    test("a page can silence every component", () => {
        (globalThis as { lilyWarnings?: unknown }).lilyWarnings = false;
        warnMissingName("Any");
        expect(warn).not.toHaveBeenCalled();
    });
});
