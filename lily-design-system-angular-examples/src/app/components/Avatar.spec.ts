import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Avatar } from "./Avatar";

describe("Avatar", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(Avatar);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.avatar");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Avatar);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.avatar");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=img, as in Svelte", () => {
        const fixture = TestBed.createComponent(Avatar);
        fixture.componentRef.setInput("alt", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".avatar");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("names itself from alt", () => {
        const fixture = TestBed.createComponent(Avatar);
        fixture.componentRef.setInput("alt", "Ada");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".avatar");
        expect(el.getAttribute("aria-label")).toBe("Ada");
    });
});
