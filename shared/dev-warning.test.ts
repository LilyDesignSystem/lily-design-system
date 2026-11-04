import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings, warnDeprecated, warnMissingName } from "./dev-warning";

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    delete (globalThis as { lilyWarnings?: boolean }).lilyWarnings;
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
});
