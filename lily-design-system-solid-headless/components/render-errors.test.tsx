import { render, screen } from "@solidjs/testing-library";
import { Errored } from "solid-js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import Button from "./Button";

// Render errors (tasks.md P50-T24): Lily catches nothing. An error thrown by a child of a Lily component reaches the
// consumer's Errored boundary (Solid 2's ErrorBoundary) unchanged, and the component renders no fallback of its own.
function Boom(): never {
    throw new Error("child failed");
}

describe("render errors", () => {
    beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}));
    afterEach(() => vi.restoreAllMocks());

    test("a child's error reaches the consumer's Errored, unchanged", () => {
        const seen: unknown[] = [];
        render(() => (
            <Errored
                fallback={(error: () => unknown) => {
                    seen.push(error());
                    return <p role="alert">Caught: {(error() as Error).message}</p>;
                }}
            >
                <Button>
                    <Boom />
                </Button>
            </Errored>
        ));
        expect(seen.length).toBeGreaterThan(0);
        expect((seen[0] as Error).message).toBe("child failed");
        expect(screen.getByRole("alert").textContent).toBe("Caught: child failed");
    });
});
