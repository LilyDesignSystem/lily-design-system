import { render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./MedicationRecordListItem";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("MedicationRecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        const { container } = render(
            <Subject
                status="active"
                statusLabel="Active"
                effective="2025-03-03"
                effectiveLabel="Since 3 Mar 2025"
            >
                <span className="content">ramipril 5 mg capsule, oral, once a day</span>
            </Subject>,
        );
        const root = container.querySelector(".medication-record-list-item") as HTMLElement;
        expect(root.tagName).toBe("LI");
        expect(root.getAttribute("data-status")).toBe("active");
        expect(root.querySelector(".medication-record-list-item-status")?.textContent).toBe(
            "Active",
        );
        expect(
            root
                .querySelector("time.medication-record-list-item-effective")
                ?.getAttribute("datetime"),
        ).toBe("2025-03-03");
        expect(root.querySelector("time.medication-record-list-item-effective")?.textContent).toBe(
            "Since 3 Mar 2025",
        );
        expect(root.querySelector(".content")?.textContent).toBe(
            "ramipril 5 mg capsule, oral, once a day",
        );
    });

    test("renders only the parts that are given", () => {
        const { container } = render(<Subject />);
        const root = container.querySelector(".medication-record-list-item") as HTMLElement;
        expect(root.querySelector(".medication-record-list-item-status")).toBeNull();
        expect(root.querySelector(".medication-record-list-item-effective")).toBeNull();
        expect(root.hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(<Subject status="active" />);
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("MedicationRecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});
