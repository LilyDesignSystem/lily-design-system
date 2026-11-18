import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AlImaratRaqmAlHuwiyahInput } from "./AlImaratRaqmAlHuwiyahInput";

describe("AlImaratRaqmAlHuwiyahInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(AlImaratRaqmAlHuwiyahInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.al-imarat-raqm-al-huwiyah-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(AlImaratRaqmAlHuwiyahInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.al-imarat-raqm-al-huwiyah-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
