import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./AllergyList.svelte";

const items = createRawSnippet(() => ({
    render: () => '<li class="allergy-list-item">Penicillin</li>',
}));

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("AllergyList", () => {
    test("renders a ul named by its status, with the status as data", () => {
        render(Subject, {
            props: { status: "known", statusLabel: "Known allergies", children: items },
        });
        const list = screen.getByRole("list", { name: "Known allergies" });
        expect(list.tagName).toBe("UL");
        expect(list.getAttribute("class")).toContain("allergy-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".allergy-list-status")).toBeNull();
        expect(list.textContent).toContain("Penicillin");
    });

    test.each([
        ["none-known", "No known allergies"],
        ["not-recorded", "Allergies not recorded"],
        ["unavailable", "Allergies unavailable"],
    ] as const)("status %s is shown as the list's one item, never blank", (status, words) => {
        render(Subject, { props: { status, statusLabel: words } });
        const list = screen.getByRole("list", { name: words });
        const only = list.querySelectorAll("li");
        expect(only).toHaveLength(1);
        expect(only[0].className).toBe("allergy-list-status");
        expect(only[0].textContent).toBe(words);
    });

    test("label overrides the accessible name", () => {
        render(Subject, {
            props: { status: "none-known", statusLabel: "No known allergies", label: "Allergies" },
        });
        expect(screen.getByRole("list", { name: "Allergies" })).toBeTruthy();
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { statusLabel: "Allergies" } as never });
        expect(
            spy.mock.calls.some((call) => String(call[0]).includes("AllergyList has no status")),
        ).toBe(true);
    });
});
