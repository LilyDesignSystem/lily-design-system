import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput } from "./OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput";

describe("OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(
            OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput,
        );
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(
            OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput,
        );
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
