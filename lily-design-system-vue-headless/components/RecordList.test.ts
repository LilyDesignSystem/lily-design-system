import { render, screen } from "@testing-library/vue";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./RecordList.vue";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("RecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        render(Subject, {
            props: { status: "known", statusLabel: "Vital signs" },
            slots: { default: '<li class="record-list-item">One record</li>' },
        });
        const list = screen.getByRole("list", { name: "Vital signs" });
        expect(list.className).toContain("record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No vital signs recorded (none-known)"],
        ["not-recorded", "No vital signs recorded (not-recorded)"],
        ["unavailable", "No vital signs recorded (unavailable)"],
        ["omitted", "No vital signs recorded (omitted)"],
    ] as const)("status %s is the list's one item, never blank", (status, words) => {
        render(Subject, { props: { status, statusLabel: words } });
        const items = screen.getByRole("list", { name: words }).querySelectorAll("li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("record-list-status");
        expect(items[0].textContent?.trim()).toBe(words);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { statusLabel: "Vital signs" } as never });
        expect(
            spy.mock.calls.some((call) => String(call[0]).includes("RecordList has no status")),
        ).toBe(true);
    });

    test("not-applicable is its own status, shown in words", () => {
        const { container } = render(Subject, {
            props: { status: "not-applicable", statusLabel: "Pregnancy: not applicable" },
        });
        const list = container.querySelector("ul.record-list") as HTMLElement;
        expect(list.getAttribute("data-status")).toBe("not-applicable");
        expect(list.querySelector(".record-list-status")?.textContent).toBe(
            "Pregnancy: not applicable",
        );
    });

    test("coverageLabel says what the list is a view of, as its first item", () => {
        const { container } = render(Subject, {
            props: {
                status: "known",
                statusLabel: "Vital signs",
                coverageLabel: "Last 12 months, newest first. The GP record did not answer.",
            },
        });
        const first = container.querySelector(".record-list")!.firstElementChild!;
        expect(first.tagName).toBe("LI");
        expect(first.className).toBe("record-list-coverage");
        expect(first.textContent?.trim()).toBe(
            "Last 12 months, newest first. The GP record did not answer.",
        );
    });
});
