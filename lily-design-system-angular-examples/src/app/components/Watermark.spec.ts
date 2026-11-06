import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Watermark } from "./Watermark";

describe("Watermark", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Watermark);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.watermark");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Watermark);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.watermark");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("never names its root", () => {
        const fixture = TestBed.createComponent(Watermark);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector(".watermark").hasAttribute("aria-label")).toBe(
            false,
        );
    });

    test("hides its overlay from assistive technology", () => {
        const fixture = TestBed.createComponent(Watermark);
        fixture.componentRef.setInput("text", "Draft");
        fixture.componentRef.setInput("rotate", 10);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".watermark");
        expect(el.getAttribute("data-rotate")).toBe("10");
        const overlay = el.querySelector(".watermark-overlay");
        expect(overlay.getAttribute("aria-hidden")).toBe("true");
        expect(overlay.getAttribute("data-text")).toBe("Draft");
    });
});
