import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Masonry } from "./Masonry";

describe("Masonry", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Masonry);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.masonry");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Masonry);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.masonry");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("never names its root", () => {
        const fixture = TestBed.createComponent(Masonry);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".masonry");
        expect(el.hasAttribute("aria-label")).toBe(false);
        expect(el.hasAttribute("role")).toBe(false);
    });

    test("lays out its columns", () => {
        const fixture = TestBed.createComponent(Masonry);
        fixture.componentRef.setInput("columns", 2);
        fixture.componentRef.setInput("gap", "2rem");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".masonry");
        expect(el.getAttribute("data-columns")).toBe("2");
        expect(el.style.columnCount).toBe("2");
        expect(el.style.columnGap).toBe("2rem");
    });
});
