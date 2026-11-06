import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Emoji } from "./Emoji";

describe("Emoji", () => {
    test("renders the <span> root with the base class", () => {
        const fixture = TestBed.createComponent(Emoji);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.emoji");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Emoji);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.emoji");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=img, as in Svelte", () => {
        const fixture = TestBed.createComponent(Emoji);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".emoji");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
