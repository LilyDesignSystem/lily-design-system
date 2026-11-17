import { render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./MedicationRecordList";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("MedicationRecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        render(() => (
            <Subject
                status="known"
                statusLabel="Current medicines"
            >
                <li class="medication-record-list-item">One record</li>
            </Subject>
        ));
        const list = screen.getByRole("list", { name: "Current medicines" });
        expect(list.className).toContain("medication-record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".medication-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known medicines (none-known)"],
        ["not-recorded", "No known medicines (not-recorded)"],
        ["unavailable", "No known medicines (unavailable)"],
        ["omitted", "No known medicines (omitted)"],
    ] as const)("status %s is the list's one item, never blank", (status, words) => {
        render(() => (
            <Subject
                status={status}
                statusLabel={words}
            />
        ));
        const items = screen.getByRole("list", { name: words }).querySelectorAll("li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("medication-record-list-status");
        expect(items[0].textContent).toBe(words);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const props = { statusLabel: "Current medicines" } as unknown as Parameters<
            typeof Subject
        >[0];
        render(() => <Subject {...props} />);
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("MedicationRecordList has no status"),
            ),
        ).toBe(true);
    });
});
