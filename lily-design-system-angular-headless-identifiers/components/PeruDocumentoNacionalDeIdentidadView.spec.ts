import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PeruDocumentoNacionalDeIdentidadView } from "./PeruDocumentoNacionalDeIdentidadView";

describe("PeruDocumentoNacionalDeIdentidadView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(PeruDocumentoNacionalDeIdentidadView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.peru-documento-nacional-de-identidad-view",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(PeruDocumentoNacionalDeIdentidadView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.peru-documento-nacional-de-identidad-view",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
