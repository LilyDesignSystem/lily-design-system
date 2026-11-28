import { render } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import Button from "./Button/Button.svelte";

// Render errors (tasks.md P50-T24): Lily catches nothing. An error thrown by a child snippet of a Lily component reaches
// the consumer unchanged: a <svelte:boundary> around the component, or, as here with none, the caller of mount.
describe("render errors", () => {
    beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}));
    afterEach(() => vi.restoreAllMocks());

    test("a child's error reaches the caller, unchanged", () => {
        const children = (() => {
            throw new Error("child failed");
        }) as any;
        expect(() => render(Button, { props: { children } })).toThrow("child failed");
    });
});
