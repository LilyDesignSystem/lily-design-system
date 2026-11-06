import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CurrencyInput } from "./CurrencyInput";

function create(code = "EUR") {
    const fixture = TestBed.createComponent(CurrencyInput);
    fixture.componentRef.setInput("currencyCode", code);
    return fixture;
}

describe("CurrencyInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = create();
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.currency-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = create();
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.currency-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("exposes the currencyCode via data attribute", () => {
        const fixture = create("JPY");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.currency-input");
        expect(el.getAttribute("data-currency-code")).toBe("JPY");
    });

    test("currencyCode is required and never defaulted (no USD assumed)", () => {
        const fixture = TestBed.createComponent(CurrencyInput);
        // A required signal input throws when read before it is set: no default exists.
        expect(() => fixture.detectChanges()).toThrow();
        expect(fixture.nativeElement.innerHTML).not.toContain("USD");
    });

    test("carries the bounds and a decimal keypad", () => {
        const fixture = TestBed.createComponent(CurrencyInput);
        fixture.componentRef.setInput("currencyCode", "EUR");
        fixture.componentRef.setInput("min", 1);
        fixture.componentRef.setInput("max", 9);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input");
        expect(el.getAttribute("min")).toBe("1");
        expect(el.getAttribute("max")).toBe("9");
        expect(el.getAttribute("inputmode")).toBe("decimal");
    });
});
