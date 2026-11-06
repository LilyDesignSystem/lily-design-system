import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CheckboxInput } from "./CheckboxInput";

describe("CheckboxInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(CheckboxInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.checkbox-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(CheckboxInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.checkbox-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    // Guards the canonical type from components/{slug}/AGENTS.md — every
    // typed input in this library once rendered type="text" (fixed
    // 2026-08-26), and nothing asserted otherwise.
    test('renders the canonical input type "checkbox"', () => {
        const fixture = TestBed.createComponent(CheckboxInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.checkbox-input");
        expect(el.getAttribute("type")).toBe("checkbox");
    });

    test("reflects checked, name, id and value", () => {
        const fixture = TestBed.createComponent(CheckboxInput);
        fixture.componentRef.setInput("checked", true);
        fixture.componentRef.setInput("name", "agree");
        fixture.componentRef.setInput("id", "a");
        fixture.componentRef.setInput("value", "yes");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input");
        expect(el.checked).toBe(true);
        expect(el.getAttribute("name")).toBe("agree");
        expect(el.getAttribute("id")).toBe("a");
        expect(el.getAttribute("value")).toBe("yes");
        expect(fixture.nativeElement.hasAttribute("id")).toBe(false);
    });

    test("toggling writes the checked model", () => {
        const fixture = TestBed.createComponent(CheckboxInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input");
        el.click();
        expect(fixture.componentInstance.checked()).toBe(true);
    });
});
