import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { DeviceRecordListItem } from "./DeviceRecordListItem";

@Component({
    standalone: true,
    imports: [DeviceRecordListItem],
    template: `<ul><li lily-device-record-list-item device="Cardiac pacemaker" status="active" statusLabel="In use" timing="2021-02-08" timingLabel="Since 8 Feb 2021"></li><li lily-device-record-list-item device="Cardiac pacemaker"></li></ul>`,
})
class Host {}

@Component({
    standalone: true,
    imports: [DeviceRecordListItem],
    template: `<ul><li lily-device-record-list-item device="Cardiac pacemaker" status="active"></li></ul>`,
})
class Unlabelled {}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("DeviceRecordListItem", () => {
    test("the host is the li, with each part and each status as text and data", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const [full, bare] = fixture.nativeElement.querySelectorAll(
            "li",
        ) as NodeListOf<HTMLElement>;
        expect(full.classList.contains("device-record-list-item")).toBe(true);
        expect(full.getAttribute("data-status")).toBe("active");
        expect(full.querySelector(".device-record-list-item-device")?.textContent).toBe(
            "Cardiac pacemaker",
        );
        expect(full.querySelector(".device-record-list-item-status")?.textContent).toBe("In use");
        expect(
            full.querySelector("time.device-record-list-item-timing")?.getAttribute("datetime"),
        ).toBe("2021-02-08");
        expect(full.querySelector("time.device-record-list-item-timing")?.textContent).toBe(
            "Since 8 Feb 2021",
        );
        expect(bare.querySelector(".device-record-list-item-status")).toBeNull();
        expect(bare.querySelector(".device-record-list-item-timing")).toBeNull();
        expect(bare.hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        TestBed.createComponent(Unlabelled).detectChanges();
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("DeviceRecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});
