import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { AllergyList } from "./AllergyList";
import { AllergyListItem } from "./AllergyListItem";

@Component({
    standalone: true,
    imports: [AllergyList, AllergyListItem],
    template: `<lily-allergy-list status="known" statusLabel="Known allergies"><li lily-allergy-list-item substance="Penicillin"></li></lily-allergy-list>`,
})
class Host {}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("AllergyList", () => {
    test("renders a ul named by its status, with its items as direct li children", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const list = fixture.nativeElement.querySelector("ul.allergy-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Known allergies");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".allergy-list-status")).toBeNull();
        const item = list.querySelector(":scope > li.allergy-list-item");
        expect(item?.textContent).toContain("Penicillin");
    });

    test.each([
        ["none-known", "No known allergies"],
        ["not-recorded", "Allergies not recorded"],
        ["unavailable", "Allergies unavailable"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        const fixture = TestBed.createComponent(AllergyList);
        fixture.componentRef.setInput("status", status);
        fixture.componentRef.setInput("statusLabel", words);
        fixture.detectChanges();
        const items = fixture.nativeElement.querySelectorAll("ul.allergy-list li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("allergy-list-status");
        expect(items[0].textContent).toBe(words);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const fixture = TestBed.createComponent(AllergyList);
        fixture.componentRef.setInput("statusLabel", "Allergies");
        fixture.detectChanges();
        expect(
            spy.mock.calls.some((call) => String(call[0]).includes("AllergyList has no status")),
        ).toBe(true);
    });
});
