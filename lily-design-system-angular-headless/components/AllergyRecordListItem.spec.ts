import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { describe, expect, test } from "vitest";

import { AllergyRecordListItem } from "./AllergyRecordListItem";

@Component({
    standalone: true,
    imports: [AllergyRecordListItem],
    template: `<ul><li lily-allergy-record-list-item substance="Penicillin" reaction="Anaphylaxis" severity="severe" severityLabel="Severe" updated="2026-11-03" updatedLabel="Updated 3 Nov 2026"></li><li lily-allergy-record-list-item substance="Latex"></li></ul>`,
})
class Host {}

describe("AllergyRecordListItem", () => {
    test("the host is the li, with each part", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const [full, bare] = fixture.nativeElement.querySelectorAll(
            "li",
        ) as NodeListOf<HTMLElement>;
        expect(full.classList.contains("allergy-record-list-item")).toBe(true);
        expect(full.getAttribute("data-severity")).toBe("severe");
        expect(full.querySelector(".allergy-record-list-item-substance")?.textContent).toBe("Penicillin");
        expect(full.querySelector(".allergy-record-list-item-reaction")?.textContent).toBe("Anaphylaxis");
        expect(full.querySelector(".allergy-record-list-item-severity")?.textContent).toBe("Severe");
        expect(full.querySelector("time.allergy-record-list-item-updated")?.getAttribute("datetime")).toBe(
            "2026-11-03",
        );
        expect(bare.querySelector(".allergy-record-list-item-reaction")).toBeNull();
        expect(bare.hasAttribute("data-severity")).toBe(false);
    });
});
