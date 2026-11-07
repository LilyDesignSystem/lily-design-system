import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MutuallyExclusive } from "./MutuallyExclusive";

describe("MutuallyExclusive", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(MutuallyExclusive);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.mutually-exclusive");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(MutuallyExclusive);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.mutually-exclusive");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a group when labelled", () => {
        const fixture = TestBed.createComponent(MutuallyExclusive);
        fixture.componentRef.setInput("label", "Or");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".mutually-exclusive");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Or");
    });
});
