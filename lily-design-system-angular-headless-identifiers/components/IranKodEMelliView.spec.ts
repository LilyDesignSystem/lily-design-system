import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { IranKodEMelliView } from "./IranKodEMelliView";

describe("IranKodEMelliView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(IranKodEMelliView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.iran-kod-e-melli-view");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(IranKodEMelliView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.iran-kod-e-melli-view");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
