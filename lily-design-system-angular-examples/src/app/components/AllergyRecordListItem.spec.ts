import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { AllergyRecordListItem } from "./AllergyRecordListItem";

@Component({
    standalone: true,
    imports: [AllergyRecordListItem],
    template: `<ul><li lily-allergy-record-list-item substance="Penicillin" reaction="Anaphylaxis" severity="severe" severityLabel="Severe" criticality="high" criticalityLabel="High risk" clinicalStatus="active" clinicalStatusLabel="Active" verificationStatus="confirmed" verificationStatusLabel="Confirmed" typeLabel="Allergy" categoryLabel="Medication" updated="2026-11-03" updatedLabel="Updated 3 Nov 2026"></li><li lily-allergy-record-list-item substance="Penicillin"></li></ul>`,
})
class Host {}

@Component({
    standalone: true,
    imports: [AllergyRecordListItem],
    template: `<ul><li lily-allergy-record-list-item substance="Penicillin" severity="severe"></li></ul>`,
})
class Unlabelled {}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("AllergyRecordListItem", () => {
    test("the host is the li, with each part and each status as text and data", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const [full, bare] = fixture.nativeElement.querySelectorAll(
            "li",
        ) as NodeListOf<HTMLElement>;
        expect(full.classList.contains("allergy-record-list-item")).toBe(true);
        expect(full.getAttribute("data-severity")).toBe("severe");
        expect(full.getAttribute("data-criticality")).toBe("high");
        expect(full.getAttribute("data-clinical-status")).toBe("active");
        expect(full.getAttribute("data-verification-status")).toBe("confirmed");
        expect(full.querySelector(".allergy-record-list-item-substance")?.textContent).toBe(
            "Penicillin",
        );
        expect(full.querySelector(".allergy-record-list-item-reaction")?.textContent).toBe(
            "Anaphylaxis",
        );
        expect(full.querySelector(".allergy-record-list-item-severity")?.textContent).toBe(
            "Severe",
        );
        expect(full.querySelector(".allergy-record-list-item-criticality")?.textContent).toBe(
            "High risk",
        );
        expect(full.querySelector(".allergy-record-list-item-clinical-status")?.textContent).toBe(
            "Active",
        );
        expect(
            full.querySelector(".allergy-record-list-item-verification-status")?.textContent,
        ).toBe("Confirmed");
        expect(full.querySelector(".allergy-record-list-item-type")?.textContent).toBe("Allergy");
        expect(full.querySelector(".allergy-record-list-item-category")?.textContent).toBe(
            "Medication",
        );
        expect(
            full.querySelector("time.allergy-record-list-item-updated")?.getAttribute("datetime"),
        ).toBe("2026-11-03");
        expect(full.querySelector("time.allergy-record-list-item-updated")?.textContent).toBe(
            "Updated 3 Nov 2026",
        );
        expect(bare.querySelector(".allergy-record-list-item-reaction")).toBeNull();
        expect(bare.querySelector(".allergy-record-list-item-severity")).toBeNull();
        expect(bare.querySelector(".allergy-record-list-item-criticality")).toBeNull();
        expect(bare.querySelector(".allergy-record-list-item-clinical-status")).toBeNull();
        expect(bare.querySelector(".allergy-record-list-item-verification-status")).toBeNull();
        expect(bare.querySelector(".allergy-record-list-item-type")).toBeNull();
        expect(bare.querySelector(".allergy-record-list-item-category")).toBeNull();
        expect(bare.querySelector(".allergy-record-list-item-updated")).toBeNull();
        expect(bare.hasAttribute("data-severity")).toBe(false);
        expect(bare.hasAttribute("data-criticality")).toBe(false);
        expect(bare.hasAttribute("data-clinical-status")).toBe(false);
        expect(bare.hasAttribute("data-verification-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        TestBed.createComponent(Unlabelled).detectChanges();
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("AllergyRecordListItem has no severityLabel"),
            ),
        ).toBe(true);
    });
});
