import { Component, input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { DeviceRecordList } from "./DeviceRecordList";

@Component({
    standalone: true,
    imports: [DeviceRecordList],
    template: `<lily-device-record-list [status]="status()" [statusLabel]="statusLabel()">@if (status() === 'known') {<li class="device-record-list-item">One record</li>}</lily-device-record-list>`,
})
class Host {
    readonly status = input<string>("known");
    readonly statusLabel = input<string>("Medical devices");
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
    return fixture.nativeElement.querySelector("ul.device-record-list") as HTMLElement;
}

describe("DeviceRecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        const list = mount("known", "Medical devices");
        expect(list.getAttribute("aria-label")).toBe("Medical devices");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".device-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known medical devices (none-known)"],
        ["not-recorded", "No known medical devices (not-recorded)"],
        ["unavailable", "No known medical devices (unavailable)"],
        ["omitted", "No known medical devices (omitted)"],
    ])("status %s shows its words as an item, never blank", (status, words) => {
        const list = mount(status, words);
        const status_ = list.querySelector(".device-record-list-status");
        expect(status_?.textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        mount("", "Medical devices");
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("DeviceRecordList has no status"),
            ),
        ).toBe(true);
    });
});
