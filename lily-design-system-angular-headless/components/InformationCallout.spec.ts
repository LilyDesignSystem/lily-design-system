import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { InformationCallout } from "./InformationCallout";

describe("InformationCallout", () => {
    test("renders the aside root with the base class", () => {
        const fixture = TestBed.createComponent(InformationCallout);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("aside.information-callout");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(InformationCallout);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("aside.information-callout");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=note, as in Svelte", () => {
        const fixture = TestBed.createComponent(InformationCallout);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".information-callout");
        expect(el.getAttribute("role")).toBe("note");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
