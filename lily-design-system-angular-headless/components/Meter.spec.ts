import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Meter } from "./Meter";

describe("Meter", () => {
    test("renders the meter root with the base class", () => {
        const fixture = TestBed.createComponent(Meter);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("meter.meter");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Meter);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("meter.meter");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("carries the ranges", () => {
        const fixture = TestBed.createComponent(Meter);
        fixture.componentRef.setInput("low", 10);
        fixture.componentRef.setInput("high", 90);
        fixture.componentRef.setInput("optimum", 50);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("meter");
        expect(el.getAttribute("low")).toBe("10");
        expect(el.getAttribute("high")).toBe("90");
        expect(el.getAttribute("optimum")).toBe("50");
    });

    test("repeats the value as fallback text", () => {
        const fixture = TestBed.createComponent(Meter);
        fixture.componentRef.setInput("value", 7);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("meter");
        expect(el.textContent).toBe("7");
    });
});
