import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MockupPhonePortrait } from "./MockupPhonePortrait";

describe("MockupPhonePortrait", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(MockupPhonePortrait);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.mockup-phone-portrait");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(MockupPhonePortrait);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.mockup-phone-portrait");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=img with a label", () => {
        const fixture = TestBed.createComponent(MockupPhonePortrait);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".mockup-phone-portrait");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
