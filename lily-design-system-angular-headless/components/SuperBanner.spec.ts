import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SuperBanner } from "./SuperBanner";

describe("SuperBanner", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(SuperBanner);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.super-banner");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(SuperBanner);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.super-banner");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=alert with a label", () => {
        const fixture = TestBed.createComponent(SuperBanner);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".super-banner");
        expect(el.getAttribute("role")).toBe("alert");
        expect(el.getAttribute("aria-label")).toBe("Story");
        expect(el.getAttribute("aria-live")).toBe("assertive");
    });
});
