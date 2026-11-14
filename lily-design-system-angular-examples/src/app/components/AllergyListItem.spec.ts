import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { describe, expect, test } from "vitest";

import { AllergyListItem } from "./AllergyListItem";

@Component({
    standalone: true,
    imports: [AllergyListItem],
    template: `<ul><li lily-allergy-list-item substance="Penicillin" reaction="Anaphylaxis" severity="severe" severityLabel="Severe" updated="2026-11-03" updatedLabel="Updated 3 Nov 2026"></li><li lily-allergy-list-item substance="Latex"></li></ul>`,
})
class Host {}

describe("AllergyListItem", () => {
    test("the host is the li, with each part", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const [full, bare] = fixture.nativeElement.querySelectorAll(
            "li",
        ) as NodeListOf<HTMLElement>;
        expect(full.classList.contains("allergy-list-item")).toBe(true);
        expect(full.getAttribute("data-severity")).toBe("severe");
        expect(full.querySelector(".allergy-list-item-substance")?.textContent).toBe("Penicillin");
        expect(full.querySelector(".allergy-list-item-reaction")?.textContent).toBe("Anaphylaxis");
        expect(full.querySelector(".allergy-list-item-severity")?.textContent).toBe("Severe");
        expect(full.querySelector("time.allergy-list-item-updated")?.getAttribute("datetime")).toBe(
            "2026-11-03",
        );
        expect(bare.querySelector(".allergy-list-item-reaction")).toBeNull();
        expect(bare.hasAttribute("data-severity")).toBe(false);
    });
});
