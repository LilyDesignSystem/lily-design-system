import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EcuadorCedulaDeIdentidadView } from "./EcuadorCedulaDeIdentidadView";

describe("EcuadorCedulaDeIdentidadView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(EcuadorCedulaDeIdentidadView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.ecuador-cedula-de-identidad-view");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(EcuadorCedulaDeIdentidadView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.ecuador-cedula-de-identidad-view");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
