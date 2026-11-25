import { Component, input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { RecordList } from "./RecordList";

@Component({
    standalone: true,
    imports: [RecordList],
    template: `<lily-record-list [status]="status()" [statusLabel]="statusLabel()">@if (status() === 'known') {<li class="record-list-item">One record</li>}</lily-record-list>`,
})
class Host {
    readonly status = input<string>("known");
    readonly statusLabel = input<string>("Vital signs");
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
    return fixture.nativeElement.querySelector("ul.record-list") as HTMLElement;
}

describe("RecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        const list = mount("known", "Vital signs");
        expect(list.getAttribute("aria-label")).toBe("Vital signs");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No vital signs recorded (none-known)"],
        ["not-recorded", "No vital signs recorded (not-recorded)"],
        ["unavailable", "No vital signs recorded (unavailable)"],
        ["omitted", "No vital signs recorded (omitted)"],
    ])("status %s shows its words as an item, never blank", (status, words) => {
        const list = mount(status, words);
        const status_ = list.querySelector(".record-list-status");
        expect(status_?.textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("HC-C3: warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        mount("", "Vital signs");
        expect(
            spy.mock.calls.some((call) => String(call[0]).includes("RecordList has no status")),
        ).toBe(true);
    });

    test("not-applicable is its own status, shown in words", () => {
        const list = mount("not-applicable", "Pregnancy: not applicable");
        expect(list.getAttribute("data-status")).toBe("not-applicable");
        expect(list.querySelector(".record-list-status")?.textContent).toBe(
            "Pregnancy: not applicable",
        );
    });

    test("coverageLabel says what the list is a view of, as its first item", () => {
        const fixture = TestBed.createComponent(RecordList);
        fixture.componentRef.setInput("status", "known");
        fixture.componentRef.setInput("statusLabel", "Vital signs");
        fixture.componentRef.setInput(
            "coverageLabel",
            "Last 12 months, newest first. The GP record did not answer.",
        );
        fixture.detectChanges();
        const first = (fixture.nativeElement as HTMLElement).querySelector(
            ".record-list",
        )!.firstElementChild!;
        expect(first.tagName).toBe("LI");
        expect(first.className).toBe("record-list-coverage");
        expect(first.textContent).toBe(
            "Last 12 months, newest first. The GP record did not answer.",
        );
    });
});
