import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DateTimeView } from "./DateTimeView";

describe("DateTimeView", () => {
    test("renders the <time> root with the base class", () => {
        const fixture = TestBed.createComponent(DateTimeView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("time.date-time-view");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(DateTimeView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("time.date-time-view");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("writes value to datetime and shows format when given", () => {
        const fixture = TestBed.createComponent(DateTimeView);
        fixture.componentRef.setInput("value", "2026-10-31T09:00");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("time.date-time-view");
        expect(el.getAttribute("datetime")).toBe("2026-10-31T09:00");
        expect(el.textContent).toBe("2026-10-31T09:00");
        fixture.componentRef.setInput("format", "31 October 2026, 09:00");
        fixture.detectChanges();
        expect(el.textContent).toBe("31 October 2026, 09:00");
    });
});
