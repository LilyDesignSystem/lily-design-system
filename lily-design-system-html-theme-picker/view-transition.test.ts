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
    vi.unstubAllGlobals();
    delete (document as unknown as Doc).startViewTransition;
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

    test("without matchMedia, a supported browser still transitions", () => {
        vi.stubGlobal("matchMedia", undefined);
        const start = vi.fn((update: () => void) => update());
        (document as unknown as Doc).startViewTransition = start;
        expect(canViewTransition()).toBe(true);
        withViewTransition(true, vi.fn());
        expect(start).toHaveBeenCalledTimes(1);
    });

    test("asks the reduced-motion query", () => {
        const queries: string[] = [];
        vi.stubGlobal(
            "matchMedia",
            vi.fn((query: string) => {
                queries.push(query);
                return { matches: false, media: query };
            }),
        );
        (document as unknown as Doc).startViewTransition = vi.fn();
        expect(canViewTransition()).toBe(true);
        expect(queries).toEqual(["(prefers-reduced-motion: reduce)"]);
    });

    // Some test environments (Angular's) make the global document fixed; there it cannot be removed.
    test.runIf(Object.getOwnPropertyDescriptor(globalThis, "document")?.configurable !== false)(
        "is false with no document, as while prerendering",
        () => {
            vi.stubGlobal("document", undefined);
            expect(canViewTransition()).toBe(false);
        },
    );

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

    // Found by bin/mutation-test (tasks.md P35-T3): with a long limit, only the load or error event can settle it in time.
    test("load and error settle it before the limit", async () => {
        for (const type of ["load", "error"]) {
            const link = document.createElement("link");
            const settled = linkSettled(link, 60_000);
            link.dispatchEvent(new Event(type));
            const first = await Promise.race([
                settled.then(() => "settled"),
                new Promise((r) => setTimeout(() => r("waiting"), 50)),
            ]);
            expect(first, type).toBe("settled");
        }
    });
});
