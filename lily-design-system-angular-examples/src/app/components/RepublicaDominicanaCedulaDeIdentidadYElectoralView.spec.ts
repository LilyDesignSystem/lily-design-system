import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RepublicaDominicanaCedulaDeIdentidadYElectoralView } from "./RepublicaDominicanaCedulaDeIdentidadYElectoralView";

describe("RepublicaDominicanaCedulaDeIdentidadYElectoralView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(RepublicaDominicanaCedulaDeIdentidadYElectoralView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.republica-dominicana-cedula-de-identidad-y-electoral-view",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(RepublicaDominicanaCedulaDeIdentidadYElectoralView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.republica-dominicana-cedula-de-identidad-y-electoral-view",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
