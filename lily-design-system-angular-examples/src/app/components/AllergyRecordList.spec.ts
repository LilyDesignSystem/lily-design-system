import { Component, input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { AllergyRecordList } from "./AllergyRecordList";

@Component({
    standalone: true,
    imports: [AllergyRecordList],
    template: `<lily-allergy-record-list [status]="status()" [statusLabel]="statusLabel()">@if (status() === 'known') {<li class="allergy-record-list-item">One record</li>}</lily-allergy-record-list>`,
})
class Host {
    readonly status = input<string>("known");
    readonly statusLabel = input<string>("Known allergies");
}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

function mount(status: string, statusLabel: string) {
    const fixture = TestBed.createComponent(Host);
    fixture.componentRef.setInput("status", status);
    fixture.componentRef.setInput("statusLabel", statusLabel);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector("ul.allergy-record-list") as HTMLElement;
}

describe("AllergyRecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        const list = mount("known", "Known allergies");
        expect(list.getAttribute("aria-label")).toBe("Known allergies");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".allergy-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known allergies (none-known)"],
        ["not-recorded", "No known allergies (not-recorded)"],
        ["unavailable", "No known allergies (unavailable)"],
        ["omitted", "No known allergies (omitted)"],
    ])("status %s shows its words as an item, never blank", (status, words) => {
        const list = mount(status, words);
        const status_ = list.querySelector(".allergy-record-list-status");
        expect(status_?.textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("HC-C5: warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        mount("", "Known allergies");
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("AllergyRecordList has no status"),
            ),
        ).toBe(true);
    });
});
