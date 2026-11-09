import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Hint } from "./Hint";

describe("Hint", () => {
    test("renders the p root with the base class", () => {
        const fixture = TestBed.createComponent(Hint);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("p.hint");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Hint);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("p.hint");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("never names its root", () => {
        const fixture = TestBed.createComponent(Hint);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector(".hint").hasAttribute("aria-label")).toBe(false);
    });

    test("takes the id off the host", () => {
        const fixture = TestBed.createComponent(Hint);
        fixture.componentRef.setInput("id", "h1");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".hint");
        expect(el.getAttribute("id")).toBe("h1");
        expect(fixture.nativeElement.hasAttribute("id")).toBe(false);
    });
});
