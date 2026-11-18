import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PakistanComputerizedNationalIdentityCardView } from "./PakistanComputerizedNationalIdentityCardView";

describe("PakistanComputerizedNationalIdentityCardView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(PakistanComputerizedNationalIdentityCardView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.pakistan-computerized-national-identity-card-view",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(PakistanComputerizedNationalIdentityCardView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.pakistan-computerized-national-identity-card-view",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
