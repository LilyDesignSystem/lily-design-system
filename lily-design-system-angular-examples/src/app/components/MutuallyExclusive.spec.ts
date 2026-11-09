import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MutuallyExclusive } from "./MutuallyExclusive";

describe("MutuallyExclusive", () => {
    test("renders the fieldset root with the base class", () => {
        const fixture = TestBed.createComponent(MutuallyExclusive);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("fieldset.mutually-exclusive");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(MutuallyExclusive);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("fieldset.mutually-exclusive");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a fieldset named by its label, with no explicit role", () => {
        const fixture = TestBed.createComponent(MutuallyExclusive);
        fixture.componentRef.setInput("label", "Or");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".mutually-exclusive");
        expect(el.tagName).toBe("FIELDSET");
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.getAttribute("aria-label")).toBe("Or");
    });
});
