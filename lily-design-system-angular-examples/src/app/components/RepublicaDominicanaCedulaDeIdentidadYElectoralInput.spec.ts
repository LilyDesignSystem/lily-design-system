import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RepublicaDominicanaCedulaDeIdentidadYElectoralInput } from "./RepublicaDominicanaCedulaDeIdentidadYElectoralInput";

describe("RepublicaDominicanaCedulaDeIdentidadYElectoralInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(
            RepublicaDominicanaCedulaDeIdentidadYElectoralInput,
        );
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.republica-dominicana-cedula-de-identidad-y-electoral-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(
            RepublicaDominicanaCedulaDeIdentidadYElectoralInput,
        );
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.republica-dominicana-cedula-de-identidad-y-electoral-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
