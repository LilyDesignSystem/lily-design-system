import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Image } from "./Image";

describe("Image", () => {
    test("renders the img root with the base class", () => {
        const fixture = TestBed.createComponent(Image);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("img.image");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Image);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("img.image");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is an image", () => {
        const fixture = TestBed.createComponent(Image);
        fixture.componentRef.setInput("src", "/a.png");
        fixture.componentRef.setInput("alt", "A tulip");
        fixture.componentRef.setInput("loading", "lazy");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".image");
        expect(el.tagName).toBe("IMG");
        expect(el.getAttribute("src")).toBe("/a.png");
        expect(el.getAttribute("alt")).toBe("A tulip");
        expect(el.getAttribute("loading")).toBe("lazy");
    });

    test("is always a bare img, never a figure", () => {
        const fixture = TestBed.createComponent(Image);
        fixture.componentRef.setInput("src", "/a.png");
        fixture.componentRef.setInput("alt", "A tulip");
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector("figure")).toBeNull();
        expect(fixture.nativeElement.querySelector(".image").tagName).toBe("IMG");
    });
});
