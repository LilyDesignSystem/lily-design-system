import { render, screen } from "@testing-library/vue";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./ProcedureRecordList.vue";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ProcedureRecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        render(Subject, {
            props: { status: "known", statusLabel: "Procedures" },
            slots: { default: '<li class="procedure-record-list-item">One record</li>' },
        });
        const list = screen.getByRole("list", { name: "Procedures" });
        expect(list.className).toContain("procedure-record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".procedure-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known procedures (none-known)"],
        ["not-recorded", "No known procedures (not-recorded)"],
        ["unavailable", "No known procedures (unavailable)"],
        ["omitted", "No known procedures (omitted)"],
    ] as const)("status %s is the list's one item, never blank", (status, words) => {
        render(Subject, { props: { status, statusLabel: words } });
        const items = screen.getByRole("list", { name: words }).querySelectorAll("li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("procedure-record-list-status");
        expect(items[0].textContent?.trim()).toBe(words);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { statusLabel: "Procedures" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ProcedureRecordList has no status"),
            ),
        ).toBe(true);
    });
});
