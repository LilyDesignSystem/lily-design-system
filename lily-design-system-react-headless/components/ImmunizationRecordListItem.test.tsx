import { render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./ImmunizationRecordListItem";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ImmunizationRecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        const { container } = render(
            <Subject
                vaccine="MMR vaccine"
                occurrence="2025-09-12"
                occurrenceLabel="12 Sep 2025"
                doseNumberLabel="Dose 2 of 2"
                status="completed"
                statusLabel="Given"
                lotNumber="AB1234"
            />,
        );
        const root = container.querySelector(".immunization-record-list-item") as HTMLElement;
        expect(root.tagName).toBe("LI");
        expect(root.getAttribute("data-status")).toBe("completed");
        expect(root.querySelector(".immunization-record-list-item-vaccine")?.textContent).toBe(
            "MMR vaccine",
        );
        expect(
            root
                .querySelector("time.immunization-record-list-item-occurrence")
                ?.getAttribute("datetime"),
        ).toBe("2025-09-12");
        expect(
            root.querySelector("time.immunization-record-list-item-occurrence")?.textContent,
        ).toBe("12 Sep 2025");
        expect(root.querySelector(".immunization-record-list-item-dose-number")?.textContent).toBe(
            "Dose 2 of 2",
        );
        expect(root.querySelector(".immunization-record-list-item-status")?.textContent).toBe(
            "Given",
        );
        expect(root.querySelector(".immunization-record-list-item-lot-number")?.textContent).toBe(
            "AB1234",
        );
    });

    test("renders only the parts that are given", () => {
        const { container } = render(<Subject vaccine="MMR vaccine" />);
        const root = container.querySelector(".immunization-record-list-item") as HTMLElement;
        expect(root.querySelector(".immunization-record-list-item-occurrence")).toBeNull();
        expect(root.querySelector(".immunization-record-list-item-dose-number")).toBeNull();
        expect(root.querySelector(".immunization-record-list-item-status")).toBeNull();
        expect(root.querySelector(".immunization-record-list-item-lot-number")).toBeNull();
        expect(root.hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(
            <Subject
                vaccine="MMR vaccine"
                status="completed"
            />,
        );
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ImmunizationRecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});
