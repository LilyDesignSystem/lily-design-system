import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GuatemalaCodigoUnicoDeIdentificacionView } from "./GuatemalaCodigoUnicoDeIdentificacionView";

describe("GuatemalaCodigoUnicoDeIdentificacionView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(GuatemalaCodigoUnicoDeIdentificacionView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.guatemala-codigo-unico-de-identificacion-view",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(GuatemalaCodigoUnicoDeIdentificacionView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.guatemala-codigo-unico-de-identificacion-view",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
