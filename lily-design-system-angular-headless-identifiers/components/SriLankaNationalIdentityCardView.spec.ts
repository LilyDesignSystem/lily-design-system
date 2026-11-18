import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SriLankaNationalIdentityCardView } from "./SriLankaNationalIdentityCardView";

describe("SriLankaNationalIdentityCardView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(SriLankaNationalIdentityCardView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.sri-lanka-national-identity-card-view",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(SriLankaNationalIdentityCardView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.sri-lanka-national-identity-card-view",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
