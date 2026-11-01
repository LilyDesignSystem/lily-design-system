import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { IranKodEMelliInput } from "./IranKodEMelliInput";

describe("IranKodEMelliInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(IranKodEMelliInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.iran-kod-e-melli-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(IranKodEMelliInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.iran-kod-e-melli-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
