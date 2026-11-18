import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MauritiusNationalIdentityCardNumberView } from "./MauritiusNationalIdentityCardNumberView";

describe("MauritiusNationalIdentityCardNumberView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(MauritiusNationalIdentityCardNumberView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.mauritius-national-identity-card-number-view",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(MauritiusNationalIdentityCardNumberView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.mauritius-national-identity-card-number-view",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
