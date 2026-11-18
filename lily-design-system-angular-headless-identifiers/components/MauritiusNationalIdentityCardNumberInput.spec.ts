import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MauritiusNationalIdentityCardNumberInput } from "./MauritiusNationalIdentityCardNumberInput";

describe("MauritiusNationalIdentityCardNumberInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(MauritiusNationalIdentityCardNumberInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.mauritius-national-identity-card-number-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(MauritiusNationalIdentityCardNumberInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.mauritius-national-identity-card-number-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
