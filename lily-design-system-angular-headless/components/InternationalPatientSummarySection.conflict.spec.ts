// An IPS section never prints "none known" above a record list that holds an entry (HC-C17, tasks.md P50-T29).
import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { describe, expect, test } from "vitest";

import { AllergyRecordList } from "./AllergyRecordList";
import { InternationalPatientSummarySection } from "./InternationalPatientSummarySection";

const entry = signal(true);

@Component({
    standalone: true,
    imports: [InternationalPatientSummarySection, AllergyRecordList],
    template: `<lily-international-patient-summary-section section="allergies" heading="Allergies" status="none-known" statusLabel="No known allergies"><lily-allergy-record-list status="none-known" statusLabel="No known allergies" conflictLabel="Check the source">@if (entry()) {<li>Penicillin</li>}</lily-allergy-record-list></lily-international-patient-summary-section>`,
})
class Host {
    readonly entry = entry;
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
const show = async (withEntry: boolean) => {
    entry.set(withEntry);
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();
    await settle();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
};

describe("InternationalPatientSummarySection over a record list in conflict (P50-T29)", () => {
    test("the section's none-known line steps aside, and the entry stays", async () => {
        const root = await show(true);
        expect(root.querySelector(".international-patient-summary-section-status")).toBeNull();
        expect(root.querySelector('[data-status="conflict"]')).not.toBeNull();
        expect(root.textContent).toContain("Penicillin");
    });

    test("with no entry, the section says none known as before", async () => {
        const root = await show(false);
        expect(
            root.querySelector(".international-patient-summary-section-status")?.textContent,
        ).toBe("No known allergies");
    });
});
