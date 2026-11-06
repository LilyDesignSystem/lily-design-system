import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CharacterCounter } from "./CharacterCounter";

describe("CharacterCounter", () => {
    test("renders the <span> root with the base class", () => {
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.character-counter");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.character-counter");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=status, as in Svelte", () => {
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".character-counter");
        expect(el.getAttribute("role")).toBe("status");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("shows the count alone", () => {
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.componentRef.setInput("count", 3);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".character-counter");
        expect(el.textContent).toBe("3");
        expect(el.hasAttribute("data-remaining")).toBe(false);
    });

    test("counts against the limit", () => {
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.componentRef.setInput("count", 12);
        fixture.componentRef.setInput("max", 10);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".character-counter");
        expect(el.textContent).toBe("12 / 10");
        expect(el.getAttribute("data-remaining")).toBe("-2");
        expect(el.getAttribute("data-over-limit")).toBe("true");
    });
});
