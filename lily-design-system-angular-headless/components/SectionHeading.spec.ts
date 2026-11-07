import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SectionHeading } from "./SectionHeading";

describe("SectionHeading", () => {
    test("renders the <header> root with the base class", () => {
        const fixture = TestBed.createComponent(SectionHeading);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("header.section-heading");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(SectionHeading);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("header.section-heading");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("renders at level 2 by default", () => {
        const fixture = TestBed.createComponent(SectionHeading);
        fixture.componentRef.setInput("heading", "Plants");
        fixture.componentRef.setInput("eyebrow", "Garden");
        fixture.componentRef.setInput("subtitle", "All of them");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".section-heading");
        expect(el.querySelector("h2.section-heading-heading").textContent).toBe("Plants");
        expect(el.querySelector(".section-heading-eyebrow").textContent).toBe("Garden");
        expect(el.querySelector(".section-heading-subtitle").textContent).toBe("All of them");
    });

    test("takes a level", () => {
        const fixture = TestBed.createComponent(SectionHeading);
        fixture.componentRef.setInput("heading", "Plants");
        fixture.componentRef.setInput("level", 6);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".section-heading");
        expect(el.querySelector("h6").textContent).toBe("Plants");
    });
});
