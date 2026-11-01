import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FeaturePhoto } from "./FeaturePhoto";

describe("FeaturePhoto", () => {
    test("renders the <figure> root with the base class", () => {
        const fixture = TestBed.createComponent(FeaturePhoto);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("figure.feature-photo");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(FeaturePhoto);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("figure.feature-photo");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
