import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ImageFileInput } from "./ImageFileInput";

describe("ImageFileInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(ImageFileInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.image-file-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ImageFileInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.image-file-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    // Guards the canonical type from components/{slug}/AGENTS.md — every
    // typed input in this library once rendered type="text" (fixed
    // 2026-08-26), and nothing asserted otherwise.
    test('renders the canonical input type "file"', () => {
        const fixture = TestBed.createComponent(ImageFileInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.image-file-input");
        expect(el.getAttribute("type")).toBe("file");
    });

    test("accepts images by default", () => {
        const fixture = TestBed.createComponent(ImageFileInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input");
        expect(el.getAttribute("accept")).toBe("image/*");
    });

    test("takes another accept", () => {
        const fixture = TestBed.createComponent(ImageFileInput);
        fixture.componentRef.setInput("accept", "image/png");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input");
        expect(el.getAttribute("accept")).toBe("image/png");
    });

    test("never writes a value to the file input: the browser throws on one", () => {
        const fixture = TestBed.createComponent(ImageFileInput);
        fixture.componentRef.setInput("value", "a.png");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input");
        expect(el.value).toBe("");
    });
});
