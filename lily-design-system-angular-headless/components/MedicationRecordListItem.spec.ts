import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { MedicationRecordListItem } from "./MedicationRecordListItem";

@Component({
    standalone: true,
    imports: [MedicationRecordListItem],
    template: `<ul><li lily-medication-record-list-item status="active" statusLabel="Active" effective="2025-03-03" effectiveLabel="Since 3 Mar 2025"><span class="content">ramipril 5 mg capsule, oral, once a day</span></li><li lily-medication-record-list-item></li></ul>`,
})
class Host {}

@Component({
    standalone: true,
    imports: [MedicationRecordListItem],
    template: `<ul><li lily-medication-record-list-item status="active"></li></ul>`,
})
class Unlabelled {}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("MedicationRecordListItem", () => {
    test("the host is the li, with each part and each status as text and data", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const [full, bare] = fixture.nativeElement.querySelectorAll(
            "li",
        ) as NodeListOf<HTMLElement>;
        expect(full.classList.contains("medication-record-list-item")).toBe(true);
        expect(full.getAttribute("data-status")).toBe("active");
        expect(full.querySelector(".medication-record-list-item-status")?.textContent).toBe(
            "Active",
        );
        expect(
            full
                .querySelector("time.medication-record-list-item-effective")
                ?.getAttribute("datetime"),
        ).toBe("2025-03-03");
        expect(full.querySelector("time.medication-record-list-item-effective")?.textContent).toBe(
            "Since 3 Mar 2025",
        );
        expect(full.querySelector(".content")?.textContent).toBe(
            "ramipril 5 mg capsule, oral, once a day",
        );
        expect(bare.querySelector(".medication-record-list-item-status")).toBeNull();
        expect(bare.querySelector(".medication-record-list-item-effective")).toBeNull();
        expect(bare.hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        TestBed.createComponent(Unlabelled).detectChanges();
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("MedicationRecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});
