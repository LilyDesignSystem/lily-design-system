import { render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./RecordListItem";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("RecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        const { container } = render(
            <Subject
                status="final"
                statusLabel="Final"
                updated="2026-11-03"
                updatedLabel="Updated 3 Nov 2026"
            >
                <span className="content">Blood pressure 128/82 mmHg</span>
            </Subject>,
        );
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
        const { container } = render(<Subject />);
        const root = container.querySelector(".record-list-item") as HTMLElement;
        expect(root.querySelector(".record-list-item-status")).toBeNull();
        expect(root.querySelector(".record-list-item-updated")).toBeNull();
        expect(root.hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(<Subject status="final" />);
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("RecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});
