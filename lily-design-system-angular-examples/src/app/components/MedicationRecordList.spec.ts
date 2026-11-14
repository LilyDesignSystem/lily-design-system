import { Component, input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { MedicationRecordList } from "./MedicationRecordList";

@Component({
    standalone: true,
    imports: [MedicationRecordList],
    template: `<lily-medication-record-list [status]="status()" [statusLabel]="statusLabel()"><li class="medication-record-list-item">One record</li></lily-medication-record-list>`,
})
class Host {
    readonly status = input<string>("known");
    readonly statusLabel = input<string>("Current medicines");
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
    return fixture.nativeElement.querySelector("ul.medication-record-list") as HTMLElement;
}

describe("MedicationRecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        const list = mount("known", "Current medicines");
        expect(list.getAttribute("aria-label")).toBe("Current medicines");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".medication-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known medicines (none-known)"],
        ["not-recorded", "No known medicines (not-recorded)"],
        ["unavailable", "No known medicines (unavailable)"],
        ["omitted", "No known medicines (omitted)"],
    ])("status %s shows its words as an item, never blank", (status, words) => {
        const list = mount(status, words);
        const status_ = list.querySelector(".medication-record-list-status");
        expect(status_?.textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        mount("", "Current medicines");
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("MedicationRecordList has no status"),
            ),
        ).toBe(true);
    });
});
