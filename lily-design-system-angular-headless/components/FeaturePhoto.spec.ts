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

    test("carries its image", () => {
        const fixture = TestBed.createComponent(FeaturePhoto);
        fixture.componentRef.setInput("src", "/a.png");
        fixture.componentRef.setInput("alt", "A tulip");
        fixture.componentRef.setInput("width", 20);
        fixture.componentRef.setInput("height", 10);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".feature-photo-image");
        expect(el.getAttribute("src")).toBe("/a.png");
        expect(el.getAttribute("alt")).toBe("A tulip");
        expect(el.getAttribute("loading")).toBe("lazy");
        expect(el.getAttribute("width")).toBe("20");
        expect(el.getAttribute("height")).toBe("10");
    });
});
