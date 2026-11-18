import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SriLankaNationalIdentityCardInput } from "./SriLankaNationalIdentityCardInput";

describe("SriLankaNationalIdentityCardInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(SriLankaNationalIdentityCardInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.sri-lanka-national-identity-card-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(SriLankaNationalIdentityCardInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.sri-lanka-national-identity-card-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
