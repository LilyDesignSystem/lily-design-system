import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
    test("renders the a root with the base class", () => {
        const fixture = TestBed.createComponent(SkipLink);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("a.skip-link");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(SkipLink);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("a.skip-link");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the label is the link's text, and it skips to #content by default", () => {
        const fixture = TestBed.createComponent(SkipLink);
        fixture.componentRef.setInput("label", "Skip to content");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("a.skip-link");
        expect(el.textContent.trim()).toBe("Skip to content");
        expect(el.getAttribute("href")).toBe("#content");
    });

    test("has no English of its own", () => {
        const fixture = TestBed.createComponent(SkipLink);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector("a.skip-link").textContent.trim()).toBe("");
    });
});
