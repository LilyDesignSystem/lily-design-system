import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NigeriaNationalIdentificationNumberInput } from "./NigeriaNationalIdentificationNumberInput";

describe("NigeriaNationalIdentificationNumberInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(NigeriaNationalIdentificationNumberInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.nigeria-national-identification-number-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(NigeriaNationalIdentificationNumberInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.nigeria-national-identification-number-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
