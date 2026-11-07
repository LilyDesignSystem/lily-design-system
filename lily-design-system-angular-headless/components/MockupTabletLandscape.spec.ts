import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MockupTabletLandscape } from "./MockupTabletLandscape";

describe("MockupTabletLandscape", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(MockupTabletLandscape);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.mockup-tablet-landscape");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(MockupTabletLandscape);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.mockup-tablet-landscape");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=img with a label", () => {
        const fixture = TestBed.createComponent(MockupTabletLandscape);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".mockup-tablet-landscape");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
