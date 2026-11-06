import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(PasswordInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.password-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(PasswordInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.password-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    // Guards the canonical type from components/{slug}/AGENTS.md — every
    // typed input in this library once rendered type="text" (fixed
    // 2026-08-26), and nothing asserted otherwise.
    test('renders the canonical input type "password"', () => {
        const fixture = TestBed.createComponent(PasswordInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.password-input");
        expect(el.getAttribute("type")).toBe("password");
    });

    test("lets a password manager fill it by default", () => {
        const fixture = TestBed.createComponent(PasswordInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input");
        expect(el.getAttribute("autocomplete")).toBe("current-password");
    });

    test("takes new-password", () => {
        const fixture = TestBed.createComponent(PasswordInput);
        fixture.componentRef.setInput("autocomplete", "new-password");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input");
        expect(el.getAttribute("autocomplete")).toBe("new-password");
    });
});
