import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Headline } from "./Headline";

describe("Headline", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Headline);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.headline");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Headline);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.headline");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("never names its root", () => {
        const fixture = TestBed.createComponent(Headline);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector(".headline").hasAttribute("aria-label")).toBe(
            false,
        );
    });

    test("is an h1 by default", () => {
        const fixture = TestBed.createComponent(Headline);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".headline");
        expect(el.querySelector("h1.headline-heading")).toBeTruthy();
    });

    test("takes a level", () => {
        const fixture = TestBed.createComponent(Headline);
        fixture.componentRef.setInput("level", 3);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".headline");
        expect(el.querySelector("h3.headline-heading")).toBeTruthy();
        expect(el.querySelector("h1")).toBeNull();
    });
});
