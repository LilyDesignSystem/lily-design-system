import { Component, input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { ImmunizationRecordList } from "./ImmunizationRecordList";

@Component({
    standalone: true,
    imports: [ImmunizationRecordList],
    template: `<lily-immunization-record-list [status]="status()" [statusLabel]="statusLabel()"><li class="immunization-record-list-item">One record</li></lily-immunization-record-list>`,
})
class Host {
    readonly status = input<string>("known");
    readonly statusLabel = input<string>("Immunizations");
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
    return fixture.nativeElement.querySelector("ul.immunization-record-list") as HTMLElement;
}

describe("ImmunizationRecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        const list = mount("known", "Immunizations");
        expect(list.getAttribute("aria-label")).toBe("Immunizations");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".immunization-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No immunizations recorded (none-known)"],
        ["not-recorded", "No immunizations recorded (not-recorded)"],
        ["unavailable", "No immunizations recorded (unavailable)"],
        ["omitted", "No immunizations recorded (omitted)"],
    ])("status %s shows its words as an item, never blank", (status, words) => {
        const list = mount(status, words);
        const status_ = list.querySelector(".immunization-record-list-status");
        expect(status_?.textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        mount("", "Immunizations");
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ImmunizationRecordList has no status"),
            ),
        ).toBe(true);
    });
});
