import { render, screen } from "@testing-library/vue";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./MedicationRecordList.vue";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("MedicationRecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        render(Subject, {
            props: { status: "known", statusLabel: "Current medicines" },
            slots: { default: '<li class="medication-record-list-item">One record</li>' },
        });
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
        render(Subject, { props: { status, statusLabel: words } });
        const items = screen.getByRole("list", { name: words }).querySelectorAll("li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("medication-record-list-status");
        expect(items[0].textContent?.trim()).toBe(words);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { statusLabel: "Current medicines" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("MedicationRecordList has no status"),
            ),
        ).toBe(true);
    });
});
