import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GuatemalaCodigoUnicoDeIdentificacionInput } from "./GuatemalaCodigoUnicoDeIdentificacionInput";

describe("GuatemalaCodigoUnicoDeIdentificacionInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(GuatemalaCodigoUnicoDeIdentificacionInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.guatemala-codigo-unico-de-identificacion-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(GuatemalaCodigoUnicoDeIdentificacionInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.guatemala-codigo-unico-de-identificacion-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
