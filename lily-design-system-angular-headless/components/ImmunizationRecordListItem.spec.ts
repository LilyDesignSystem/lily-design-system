import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { ImmunizationRecordListItem } from "./ImmunizationRecordListItem";

@Component({
    standalone: true,
    imports: [ImmunizationRecordListItem],
    template: `<ul><li lily-immunization-record-list-item vaccine="MMR vaccine" occurrence="2025-09-12" occurrenceLabel="12 Sep 2025" doseNumberLabel="Dose 2 of 2" status="completed" statusLabel="Given" lotNumber="AB1234"></li><li lily-immunization-record-list-item vaccine="MMR vaccine"></li></ul>`,
})
class Host {}

@Component({
    standalone: true,
    imports: [ImmunizationRecordListItem],
    template: `<ul><li lily-immunization-record-list-item vaccine="MMR vaccine" status="completed"></li></ul>`,
})
class Unlabelled {}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ImmunizationRecordListItem", () => {
    test("the host is the li, with each part and each status as text and data", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const [full, bare] = fixture.nativeElement.querySelectorAll(
            "li",
        ) as NodeListOf<HTMLElement>;
        expect(full.classList.contains("immunization-record-list-item")).toBe(true);
        expect(full.getAttribute("data-status")).toBe("completed");
        expect(full.querySelector(".immunization-record-list-item-vaccine")?.textContent).toBe(
            "MMR vaccine",
        );
        expect(
            full
                .querySelector("time.immunization-record-list-item-occurrence")
                ?.getAttribute("datetime"),
        ).toBe("2025-09-12");
        expect(
            full.querySelector("time.immunization-record-list-item-occurrence")?.textContent,
        ).toBe("12 Sep 2025");
        expect(full.querySelector(".immunization-record-list-item-dose-number")?.textContent).toBe(
            "Dose 2 of 2",
        );
        expect(full.querySelector(".immunization-record-list-item-status")?.textContent).toBe(
            "Given",
        );
        expect(full.querySelector(".immunization-record-list-item-lot-number")?.textContent).toBe(
            "AB1234",
        );
        expect(bare.querySelector(".immunization-record-list-item-occurrence")).toBeNull();
        expect(bare.querySelector(".immunization-record-list-item-dose-number")).toBeNull();
        expect(bare.querySelector(".immunization-record-list-item-status")).toBeNull();
        expect(bare.querySelector(".immunization-record-list-item-lot-number")).toBeNull();
        expect(bare.hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        TestBed.createComponent(Unlabelled).detectChanges();
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ImmunizationRecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});
