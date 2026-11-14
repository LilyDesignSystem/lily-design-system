import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./AllergyList";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("AllergyList", () => {
    test("renders a ul named by its status, with its items", () => {
        render(
            <Subject
                status="known"
                statusLabel="Known allergies"
            >
                <li className="allergy-list-item">Penicillin</li>
            </Subject>,
        );
        const list = screen.getByRole("list", { name: "Known allergies" });
        expect(list.tagName).toBe("UL");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".allergy-list-status")).toBeNull();
        expect(list.textContent).toContain("Penicillin");
    });

    test.each([
        ["none-known", "No known allergies"],
        ["not-recorded", "Allergies not recorded"],
        ["unavailable", "Allergies unavailable"],
    ] as const)("status %s is the list's one item, never blank", (status, words) => {
        render(
            <Subject
                status={status}
                statusLabel={words}
            />,
        );
        const items = screen.getByRole("list", { name: words }).querySelectorAll("li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("allergy-list-status");
        expect(items[0].textContent).toBe(words);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const props = { statusLabel: "Allergies" } as unknown as React.ComponentProps<
            typeof Subject
        >;
        render(<Subject {...props} />);
        expect(
            spy.mock.calls.some((call) => String(call[0]).includes("AllergyList has no status")),
        ).toBe(true);
    });
});
