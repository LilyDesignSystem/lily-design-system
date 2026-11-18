import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NigeriaNationalIdentificationNumberView } from "./NigeriaNationalIdentificationNumberView";

describe("NigeriaNationalIdentificationNumberView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(NigeriaNationalIdentificationNumberView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.nigeria-national-identification-number-view",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(NigeriaNationalIdentificationNumberView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.nigeria-national-identification-number-view",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
