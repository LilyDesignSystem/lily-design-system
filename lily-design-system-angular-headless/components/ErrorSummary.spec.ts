import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ErrorSummary } from "./ErrorSummary";

describe("ErrorSummary", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(ErrorSummary);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.error-summary");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ErrorSummary);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.error-summary");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is an alert named by its title, and can take focus", () => {
        const fixture = TestBed.createComponent(ErrorSummary);
        fixture.componentRef.setInput("title", "There is a problem");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".error-summary");
        expect(el.getAttribute("role")).toBe("alert");
        expect(el.getAttribute("tabindex")).toBe("-1");
        expect(el.getAttribute("aria-labelledby")).toBe(el.querySelector("h2").id);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    test("with no title, label names it", () => {
        const fixture = TestBed.createComponent(ErrorSummary);
        fixture.componentRef.setInput("label", "Errors");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".error-summary");
        expect(el.getAttribute("aria-label")).toBe("Errors");
        expect(el.hasAttribute("aria-labelledby")).toBe(false);
    });
});
