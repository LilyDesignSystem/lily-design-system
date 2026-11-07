import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CalendarTableTD } from "./CalendarTableTD";

// CalendarTableTD is an attribute-selector component (`td[lily-calendar-table-td]`): its host is the
// native <td> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(CalendarTableTD)` directly (the
// latter has no <td> to attach to and falls back to a bare <div>).
@Component({
    standalone: true,
    imports: [CalendarTableTD],
    template: `<td lily-calendar-table-td [className]="className"></td>`,
})
class TestHost {
    className = "";
}

describe("CalendarTableTD", () => {
    test("the host is the td itself — no wrapper element — with the base class", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("td");
        expect(el.tagName).toBe("TD");
        expect(el.classList.contains("calendar-table-td")).toBe(true);
    });

    test("appends the className input to the host class list", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.className = "extra";
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("td");
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a gridcell out of the tab order", () => {
        const fixture = TestBed.createComponent(CalendarTableTD);
        fixture.detectChanges();
        const el = fixture.nativeElement;
        expect(el.getAttribute("role")).toBe("gridcell");
        expect(el.getAttribute("tabindex")).toBe("-1");
    });

    test("reflects selected and today", () => {
        const fixture = TestBed.createComponent(CalendarTableTD);
        fixture.componentRef.setInput("selected", true);
        fixture.componentRef.setInput("today", true);
        fixture.detectChanges();
        const el = fixture.nativeElement;
        expect(el.getAttribute("aria-selected")).toBe("true");
        expect(el.getAttribute("aria-current")).toBe("date");
        expect(el.getAttribute("tabindex")).toBe("0");
    });
});

@Component({
    standalone: true,
    imports: [CalendarTableTD],
    template: `<table><tr><td lily-calendar-table-td [attr.aria-selected]="'true'">x</td></tr></table>`,
})
class ConsumerHost {}

test("a consumer's own aria-selected survives the cell", () => {
    const fixture = TestBed.createComponent(ConsumerHost);
    fixture.detectChanges();
    const cell = fixture.nativeElement.querySelector("td");
    expect(cell.getAttribute("aria-selected")).toBe("true");
});
