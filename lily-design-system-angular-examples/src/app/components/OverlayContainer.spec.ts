import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { OverlayContainer } from "./OverlayContainer";

describe("OverlayContainer", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(OverlayContainer);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.overlay-container");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(OverlayContainer);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.overlay-container");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is hidden until open", () => {
        const fixture = TestBed.createComponent(OverlayContainer);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".overlay-container");
        expect(el.hidden).toBe(true);
        expect(el.getAttribute("aria-hidden")).toBe("true");
        expect(el.getAttribute("data-open")).toBe("false");
    });

    test("shows when open", () => {
        const fixture = TestBed.createComponent(OverlayContainer);
        fixture.componentRef.setInput("open", true);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".overlay-container");
        expect(el.hidden).toBe(false);
        expect(el.getAttribute("aria-hidden")).toBe("false");
    });
});
