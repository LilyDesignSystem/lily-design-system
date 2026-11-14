import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./AllergyRecordList";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("AllergyRecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        render(
            <Subject
                status="known"
                statusLabel="Known allergies"
            >
                <li className="allergy-record-list-item">One record</li>
            </Subject>,
        );
        const list = screen.getByRole("list", { name: "Known allergies" });
        expect(list.className).toContain("allergy-record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".allergy-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known allergies (none-known)"],
        ["not-recorded", "No known allergies (not-recorded)"],
        ["unavailable", "No known allergies (unavailable)"],
        ["omitted", "No known allergies (omitted)"],
    ] as const)("status %s is the list's one item, never blank", (status, words) => {
        render(
            <Subject
                status={status}
                statusLabel={words}
            />,
        );
        const items = screen.getByRole("list", { name: words }).querySelectorAll("li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("allergy-record-list-status");
        expect(items[0].textContent).toBe(words);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const props = { statusLabel: "Known allergies" } as unknown as Parameters<
            typeof Subject
        >[0];
        render(<Subject {...props} />);
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("AllergyRecordList has no status"),
            ),
        ).toBe(true);
    });
});
