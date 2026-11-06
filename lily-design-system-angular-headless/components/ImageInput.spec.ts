import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ImageInput } from "./ImageInput";

describe("ImageInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(ImageInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.image-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ImageInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.image-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    // Guards the canonical type from components/{slug}/AGENTS.md — every
    // typed input in this library once rendered type="text" (fixed
    // 2026-08-26), and nothing asserted otherwise.
    test('renders the canonical input type "image"', () => {
        const fixture = TestBed.createComponent(ImageInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.image-input");
        expect(el.getAttribute("type")).toBe("image");
    });

    test("carries the image", () => {
        const fixture = TestBed.createComponent(ImageInput);
        fixture.componentRef.setInput("src", "/a.png");
        fixture.componentRef.setInput("alt", "Search");
        fixture.componentRef.setInput("width", 20);
        fixture.componentRef.setInput("height", 10);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input");
        expect(el.getAttribute("src")).toBe("/a.png");
        expect(el.getAttribute("alt")).toBe("Search");
        expect(el.getAttribute("width")).toBe("20");
        expect(el.getAttribute("height")).toBe("10");
    });
});
