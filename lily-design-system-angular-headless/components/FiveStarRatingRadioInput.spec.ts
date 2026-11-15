import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FiveStarRatingRadioInput } from "./FiveStarRatingRadioInput";

describe("FiveStarRatingRadioInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(FiveStarRatingRadioInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.five-star-rating-radio-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(FiveStarRatingRadioInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.five-star-rating-radio-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    // Guards the canonical type from components/{slug}/AGENTS.md — every
    // typed input in this library once rendered type="text" (fixed
    // 2026-08-26), and nothing asserted otherwise.
    test('renders the canonical input type "radio"', () => {
        const fixture = TestBed.createComponent(FiveStarRatingRadioInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.five-star-rating-radio-input");
        expect(el.getAttribute("type")).toBe("radio");
    });

    test("reflects name and checked", () => {
        const fixture = TestBed.createComponent(FiveStarRatingRadioInput);
        fixture.componentRef.setInput("name", "size");
        fixture.componentRef.setInput("checked", true);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input");
        expect(el.getAttribute("name")).toBe("size");
        expect(el.checked).toBe(true);
    });

    test("exposes its value in data-value for consumer CSS", () => {
        const fixture = TestBed.createComponent(FiveStarRatingRadioInput);
        fixture.componentRef.setInput("value", "4");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.five-star-rating-radio-input");
        expect(el.getAttribute("data-value")).toBe("4");
    });
});
