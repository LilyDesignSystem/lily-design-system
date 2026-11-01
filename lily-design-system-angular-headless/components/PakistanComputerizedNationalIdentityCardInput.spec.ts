import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PakistanComputerizedNationalIdentityCardInput } from "./PakistanComputerizedNationalIdentityCardInput";

describe("PakistanComputerizedNationalIdentityCardInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(PakistanComputerizedNationalIdentityCardInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.pakistan-computerized-national-identity-card-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(PakistanComputerizedNationalIdentityCardInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.pakistan-computerized-national-identity-card-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
