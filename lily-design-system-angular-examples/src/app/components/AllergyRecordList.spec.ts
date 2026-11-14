import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { AllergyRecordList } from "./AllergyRecordList";
import { AllergyRecordListItem } from "./AllergyRecordListItem";

@Component({
    standalone: true,
    imports: [AllergyRecordList, AllergyRecordListItem],
    template: `<lily-allergy-record-list status="known" statusLabel="Known allergies"><li lily-allergy-record-list-item substance="Penicillin"></li></lily-allergy-record-list>`,
})
class Host {}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("AllergyRecordList", () => {
    test("renders a ul named by its status, with its items as direct li children", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const list = fixture.nativeElement.querySelector("ul.allergy-record-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Known allergies");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".allergy-record-list-status")).toBeNull();
        const item = list.querySelector(":scope > li.allergy-record-list-item");
        expect(item?.textContent).toContain("Penicillin");
    });

    test.each([
        ["none-known", "No known allergies"],
        ["not-recorded", "Allergies not recorded"],
        ["unavailable", "Allergies unavailable"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        const fixture = TestBed.createComponent(AllergyRecordList);
        fixture.componentRef.setInput("status", status);
        fixture.componentRef.setInput("statusLabel", words);
        fixture.detectChanges();
        const items = fixture.nativeElement.querySelectorAll("ul.allergy-record-list li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("allergy-record-list-status");
        expect(items[0].textContent).toBe(words);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const fixture = TestBed.createComponent(AllergyRecordList);
        fixture.componentRef.setInput("statusLabel", "Allergies");
        fixture.detectChanges();
        expect(
            spy.mock.calls.some((call) => String(call[0]).includes("AllergyRecordList has no status")),
        ).toBe(true);
    });
});
