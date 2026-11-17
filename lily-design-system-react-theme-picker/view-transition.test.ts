import { afterEach, describe, expect, test, vi } from "vitest";

import { canViewTransition, linkSettled, withViewTransition } from "./view-transition";

type Doc = { startViewTransition?: (update: () => void | Promise<void>) => unknown };

function reducedMotion(reduce: boolean) {
    vi.stubGlobal(
        "matchMedia",
        vi.fn((query: string) => ({ matches: reduce && query.includes("reduce"), media: query })),
    );
}

afterEach(() => {
    delete (document as unknown as Doc).startViewTransition;
    vi.unstubAllGlobals();
});

describe("withViewTransition", () => {
    test("uses a view transition when enabled, supported and motion is allowed", () => {
        reducedMotion(false);
        const start = vi.fn((update: () => void) => update());
        (document as unknown as Doc).startViewTransition = start;
        const apply = vi.fn();
        withViewTransition(true, apply);
        expect(start).toHaveBeenCalledTimes(1);
        expect(apply).toHaveBeenCalledTimes(1);
    });

    test("applies at once, with no transition, under reduced motion", () => {
        reducedMotion(true);
        const start = vi.fn();
        (document as unknown as Doc).startViewTransition = start;
        const apply = vi.fn();
        withViewTransition(true, apply);
        expect(start).not.toHaveBeenCalled();
        expect(apply).toHaveBeenCalledTimes(1);
        expect(canViewTransition()).toBe(false);
    });

    test("applies at once when the browser has no View Transition API", () => {
        reducedMotion(false);
        const apply = vi.fn();
        withViewTransition(true, apply);
        expect(apply).toHaveBeenCalledTimes(1);
        expect(canViewTransition()).toBe(false);
    });

    test("applies at once, with no transition, when not enabled", () => {
        reducedMotion(false);
        const start = vi.fn();
        (document as unknown as Doc).startViewTransition = start;
        const apply = vi.fn();
        withViewTransition(false, apply);
        expect(start).not.toHaveBeenCalled();
        expect(apply).toHaveBeenCalledTimes(1);
    });
});

describe("linkSettled", () => {
    test("resolves on load, on error, or after the limit", async () => {
        const loaded = document.createElement("link");
        const onLoad = linkSettled(loaded);
        loaded.dispatchEvent(new Event("load"));
        await expect(onLoad).resolves.toBeUndefined();
        const failed = document.createElement("link");
        const onError = linkSettled(failed);
        failed.dispatchEvent(new Event("error"));
        await expect(onError).resolves.toBeUndefined();
        await expect(linkSettled(document.createElement("link"), 5)).resolves.toBeUndefined();
    });
});
