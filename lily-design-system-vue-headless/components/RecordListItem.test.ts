import { render } from "@testing-library/vue";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./RecordListItem.vue";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("RecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        const { container } = render(Subject, {
            props: {
                status: "final",
                statusLabel: "Final",
                updated: "2026-11-03",
                updatedLabel: "Updated 3 Nov 2026",
            },
            slots: { default: '<span class="content">Blood pressure 128/82 mmHg</span>' },
        });
        const root = container.querySelector(".record-list-item") as HTMLElement;
        expect(root.tagName).toBe("LI");
        expect(root.getAttribute("data-status")).toBe("final");
        expect(root.querySelector(".record-list-item-status")?.textContent).toBe("Final");
        expect(root.querySelector("time.record-list-item-updated")?.getAttribute("datetime")).toBe(
            "2026-11-03",
        );
        expect(root.querySelector("time.record-list-item-updated")?.textContent).toBe(
            "Updated 3 Nov 2026",
        );
        expect(root.querySelector(".content")?.textContent).toBe("Blood pressure 128/82 mmHg");
    });

    test("renders only the parts that are given", () => {
        const { container } = render(Subject, { props: {} });
        const root = container.querySelector(".record-list-item") as HTMLElement;
        expect(root.querySelector(".record-list-item-status")).toBeNull();
        expect(root.querySelector(".record-list-item-updated")).toBeNull();
        expect(root.hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { status: "final" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("RecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });

    test("withheld shows only the consumer's words; entered-in-error keeps the content struck through", () => {
        const first = render(Subject, {
            props: { entryState: "withheld", entryStateLabel: "Restricted" },
            slots: { default: "Blood pressure" },
        });
        let li = first.container.querySelector("li.record-list-item")!;
        expect(li.getAttribute("data-entry-state")).toBe("withheld");
        expect(li.textContent).not.toContain("Blood pressure");
        expect(li.querySelector(".record-list-item-entry-state")?.textContent).toBe("Restricted");
        first.unmount();
        const second = render(Subject, {
            props: { entryState: "entered-in-error", entryStateLabel: "Entered in error" },
            slots: { default: "Blood pressure" },
        });
        li = second.container.querySelector("li.record-list-item")!;
        expect(li.querySelector("del.record-list-item-entry")?.textContent).toBe("Blood pressure");
        expect(li.querySelector(".record-list-item-entry-state")?.textContent).toBe("Entered in error");
    });
});
