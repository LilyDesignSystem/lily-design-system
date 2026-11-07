import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Select } from "./Select";

describe("Select", () => {
    test("renders the select root with the base class", () => {
        const fixture = TestBed.createComponent(Select);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("select.select");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Select);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("select.select");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("reflects required and disabled", () => {
        const fixture = TestBed.createComponent(Select);
        fixture.componentRef.setInput("required", true);
        fixture.componentRef.setInput("disabled", true);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("select");
        expect(el.required).toBe(true);
        expect(el.disabled).toBe(true);
    });
});
