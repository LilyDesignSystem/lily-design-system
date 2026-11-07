import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Character } from "./Character";

describe("Character", () => {
    test("renders the <span> root with the base class", () => {
        const fixture = TestBed.createComponent(Character);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.character");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Character);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.character");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a named image", () => {
        const fixture = TestBed.createComponent(Character);
        fixture.componentRef.setInput("label", "Fox");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".character");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Fox");
    });

    test("is hidden when decorative", () => {
        const fixture = TestBed.createComponent(Character);
        fixture.componentRef.setInput("label", "Fox");
        fixture.componentRef.setInput("decorative", true);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".character");
        expect(el.getAttribute("role")).toBe("presentation");
        expect(el.getAttribute("aria-hidden")).toBe("true");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
