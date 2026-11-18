import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ItyopyaFaydaIdentificationNumberInput } from "./ItyopyaFaydaIdentificationNumberInput";

describe("ItyopyaFaydaIdentificationNumberInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(ItyopyaFaydaIdentificationNumberInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.ityopya-fayda-identification-number-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ItyopyaFaydaIdentificationNumberInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.ityopya-fayda-identification-number-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
