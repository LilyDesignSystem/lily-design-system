import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AspectRatioContainer } from "./AspectRatioContainer";

describe("AspectRatioContainer", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(AspectRatioContainer);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.aspect-ratio-container");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(AspectRatioContainer);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.aspect-ratio-container");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("never names its root", () => {
        const fixture = TestBed.createComponent(AspectRatioContainer);
        fixture.detectChanges();
        expect(
            fixture.nativeElement
                .querySelector(".aspect-ratio-container")
                .hasAttribute("aria-label"),
        ).toBe(false);
    });

    test("carries the ratio", () => {
        const fixture = TestBed.createComponent(AspectRatioContainer);
        fixture.componentRef.setInput("ratio", 1.5);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".aspect-ratio-container");
        expect(el.getAttribute("data-aspect-ratio-container")).toBe("1.5");
        expect(el.style.aspectRatio).toContain("1.5");
    });
});
