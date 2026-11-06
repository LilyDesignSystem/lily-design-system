import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MockupPhoneLandscape } from "./MockupPhoneLandscape";

describe("MockupPhoneLandscape", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(MockupPhoneLandscape);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.mockup-phone-landscape");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(MockupPhoneLandscape);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.mockup-phone-landscape");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=img, as in Svelte", () => {
        const fixture = TestBed.createComponent(MockupPhoneLandscape);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".mockup-phone-landscape");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
