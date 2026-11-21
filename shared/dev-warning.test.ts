import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings, warnDeprecated, warnMissingName, warnMissingProp } from "./dev-warning";

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    delete (globalThis as { lilyWarnings?: unknown }).lilyWarnings;
    resetDevWarnings();
});

describe("development warnings", () => {
    test("a control with no name warns", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        warnMissingName("Thing", undefined, "");
        expect(spy).toHaveBeenCalledOnce();
        expect(spy.mock.calls[0][0]).toContain("Thing has no accessible name");
    });

    test("any one source of a name is enough", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        warnMissingName("Thing", "", "heading-id");
        expect(spy).not.toHaveBeenCalled();
    });

    test("a message prints once", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        warnMissingName("Thing");
        warnMissingName("Thing");
        expect(spy).toHaveBeenCalledOnce();
    });

    test("a deprecated component names its replacement", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        warnDeprecated("Old", "New", "1.0.0");
        expect(spy.mock.calls[0][0]).toContain("Use New");
    });

    test("a missing required prop warns, saying why", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        warnMissingProp(
            "AllergyRecordList",
            "status",
            undefined,
            "An allergy list must say whether allergies are known.",
        );
        expect(spy).toHaveBeenCalledOnce();
        expect(spy.mock.calls[0][0]).toContain(
            "AllergyRecordList has no status. An allergy list must say",
        );
    });

    test("a present prop does not warn", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        warnMissingProp("AllergyRecordList", "status", "none-known", "why");
        expect(spy).not.toHaveBeenCalled();
    });

    test("production is silent", () => {
        vi.stubEnv("NODE_ENV", "production");
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        warnMissingName("Thing");
        expect(spy).not.toHaveBeenCalled();
    });

    test("the off switch is silent", () => {
        (globalThis as { lilyWarnings?: boolean }).lilyWarnings = false;
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        warnMissingName("Thing");
        expect(spy).not.toHaveBeenCalled();
    });

    test("one component can be silenced by name while another still warns", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        (globalThis as { lilyWarnings?: unknown }).lilyWarnings = { Quiet: false };
        warnMissingName("Quiet");
        warnMissingProp("Quiet", "status", undefined, "Why.");
        warnDeprecated("Quiet", "New", "1.0.0");
        expect(spy).not.toHaveBeenCalled();
        warnMissingName("Loud");
        expect(spy).toHaveBeenCalledOnce();
        expect(spy.mock.calls[0][0]).toContain("Loud has no accessible name");
    });

    test("a name left out of the map, or set to anything but false, still warns", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        (globalThis as { lilyWarnings?: unknown }).lilyWarnings = { Other: false, Kept: true };
        warnMissingName("Kept");
        warnMissingName("Absent");
        expect(spy).toHaveBeenCalledTimes(2);
    });

    test("an empty map, or a non-false value, silences nothing; false still silences all", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        (globalThis as { lilyWarnings?: unknown }).lilyWarnings = {};
        warnMissingName("A");
        (globalThis as { lilyWarnings?: unknown }).lilyWarnings = true;
        warnMissingName("B");
        expect(spy).toHaveBeenCalledTimes(2);
        (globalThis as { lilyWarnings?: unknown }).lilyWarnings = false;
        warnMissingName("C");
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
