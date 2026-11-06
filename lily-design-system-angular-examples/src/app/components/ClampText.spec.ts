import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ClampText } from "./ClampText";

describe("ClampText", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(ClampText);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.clamp-text");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ClampText);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.clamp-text");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a named group when labelled", () => {
        const fixture = TestBed.createComponent(ClampText);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".clamp-text");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const fixture = TestBed.createComponent(ClampText);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector(".clamp-text").hasAttribute("role")).toBe(false);
    });

    test("exposes the line count", () => {
        const fixture = TestBed.createComponent(ClampText);
        fixture.componentRef.setInput("lines", 3);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".clamp-text");
        expect(el.getAttribute("data-lines")).toBe("3");
        expect(el.style.getPropertyValue("--clamp-text-lines")).toBe("3");
    });
});
