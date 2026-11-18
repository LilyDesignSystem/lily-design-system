import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PeruDocumentoNacionalDeIdentidadInput } from "./PeruDocumentoNacionalDeIdentidadInput";

describe("PeruDocumentoNacionalDeIdentidadInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(PeruDocumentoNacionalDeIdentidadInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.peru-documento-nacional-de-identidad-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(PeruDocumentoNacionalDeIdentidadInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.peru-documento-nacional-de-identidad-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
