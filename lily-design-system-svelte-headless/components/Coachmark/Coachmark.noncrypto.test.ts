import { render } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import Subject from "./Coachmark.svelte";

describe("Coachmark ids without crypto.randomUUID", () => {
    afterEach(() => vi.unstubAllGlobals());

    test("still gets an id, so its title can name the dialog", () => {
        vi.stubGlobal("crypto", {});
        const { container } = render(Subject, {
            props: { open: true, title: "New feature", dismissLabel: "Dismiss" },
        });
        const root = container.querySelector("div.coachmark") as HTMLElement;
        expect(root.getAttribute("aria-labelledby")).toMatch(/^coachmark-/);
    });
});
