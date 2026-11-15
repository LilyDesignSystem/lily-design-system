import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ColorRadioInput } from "./ColorRadioInput";

describe("ColorRadioInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(ColorRadioInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.color-radio-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ColorRadioInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.color-radio-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    // Guards the canonical type from components/{slug}/AGENTS.md — every
    // typed input in this library once rendered type="text" (fixed
    // 2026-08-26), and nothing asserted otherwise.
    test('renders the canonical input type "radio"', () => {
        const fixture = TestBed.createComponent(ColorRadioInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.color-radio-input");
        expect(el.getAttribute("type")).toBe("radio");
    });

    test("reflects name and checked", () => {
        const fixture = TestBed.createComponent(ColorRadioInput);
        fixture.componentRef.setInput("name", "size");
        fixture.componentRef.setInput("checked", true);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input");
        expect(el.getAttribute("name")).toBe("size");
        expect(el.checked).toBe(true);
    });

    test("exposes its colour in data-color and a custom property, and submits it by default", () => {
        const fixture = TestBed.createComponent(ColorRadioInput);
        fixture.componentRef.setInput("color", "#005eb8");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.color-radio-input",
        ) as HTMLInputElement;
        expect(el.getAttribute("data-color")).toBe("#005eb8");
        expect(el.style.getPropertyValue("--color-radio-input-color")).toBe("#005eb8");
        expect(el.value).toBe("#005eb8");
    });
});
