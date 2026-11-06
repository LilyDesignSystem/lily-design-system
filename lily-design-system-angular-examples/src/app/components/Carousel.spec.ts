import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Carousel } from "./Carousel";

describe("Carousel", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Carousel);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.carousel");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Carousel);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.carousel");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=region, as in Svelte", () => {
        const fixture = TestBed.createComponent(Carousel);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".carousel");
        expect(el.getAttribute("role")).toBe("region");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
