import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Affix } from "./Affix";

describe("Affix", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Affix);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.affix");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Affix);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.affix");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("never names its root", () => {
        const fixture = TestBed.createComponent(Affix);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".affix");
        expect(el.hasAttribute("aria-label")).toBe(false);
        expect(el.hasAttribute("role")).toBe(false);
    });

    test("sticks to the top by default", () => {
        const fixture = TestBed.createComponent(Affix);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".affix");
        expect(el.style.position).toBe("sticky");
        expect(el.style.top).toBe("0px");
    });

    test("offsetBottom wins", () => {
        const fixture = TestBed.createComponent(Affix);
        fixture.componentRef.setInput("offsetTop", 4);
        fixture.componentRef.setInput("offsetBottom", 8);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".affix");
        expect(el.style.bottom).toBe("8px");
        expect(el.style.top).toBe("");
        expect(el.getAttribute("data-offset-bottom")).toBe("8");
    });
});
