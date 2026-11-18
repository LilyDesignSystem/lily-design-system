import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CostaRicaCedulaDeIdentidadInput } from "./CostaRicaCedulaDeIdentidadInput";

describe("CostaRicaCedulaDeIdentidadInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(CostaRicaCedulaDeIdentidadInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.costa-rica-cedula-de-identidad-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(CostaRicaCedulaDeIdentidadInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.costa-rica-cedula-de-identidad-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
