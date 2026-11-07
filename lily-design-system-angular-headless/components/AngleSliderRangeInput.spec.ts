import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AngleSliderRangeInput } from "./AngleSliderRangeInput";

describe("AngleSliderRangeInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(AngleSliderRangeInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.angle-slider-range-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(AngleSliderRangeInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.angle-slider-range-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    // Guards the canonical type from components/{slug}/AGENTS.md — every
    // typed input in this library once rendered type="text" (fixed
    // 2026-08-26), and nothing asserted otherwise.
    test('renders the canonical input type "range"', () => {
        const fixture = TestBed.createComponent(AngleSliderRangeInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.angle-slider-range-input");
        expect(el.getAttribute("type")).toBe("range");
    });

    test("carries the range and the value text", () => {
        const fixture = TestBed.createComponent(AngleSliderRangeInput);
        fixture.componentRef.setInput("max", 180);
        fixture.componentRef.setInput("step", 5);
        fixture.componentRef.setInput("value", "90");
        fixture.componentRef.setInput("valueTextSuffix", " degrees");
        fixture.componentRef.setInput("name", "hue");
        fixture.componentRef.setInput("id", "h");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input");
        expect(el.getAttribute("max")).toBe("180");
        expect(el.getAttribute("step")).toBe("5");
        expect(el.getAttribute("name")).toBe("hue");
        expect(el.getAttribute("id")).toBe("h");
        expect(el.getAttribute("aria-valuemax")).toBe("180");
        expect(el.getAttribute("aria-valuenow")).toBe("90");
        expect(el.getAttribute("aria-valuetext")).toBe("90 degrees");
    });
});
