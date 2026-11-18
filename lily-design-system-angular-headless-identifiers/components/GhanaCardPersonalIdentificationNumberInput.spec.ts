import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GhanaCardPersonalIdentificationNumberInput } from "./GhanaCardPersonalIdentificationNumberInput";

describe("GhanaCardPersonalIdentificationNumberInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(GhanaCardPersonalIdentificationNumberInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.ghana-card-personal-identification-number-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(GhanaCardPersonalIdentificationNumberInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.ghana-card-personal-identification-number-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
