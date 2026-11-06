import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Panel } from "./Panel";

describe("Panel", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Panel);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.panel");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Panel);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.panel");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a group when labelled", () => {
        const fixture = TestBed.createComponent(Panel);
        fixture.componentRef.setInput("label", "Notes");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".panel");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Notes");
    });

    test("names nothing unlabelled", () => {
        const fixture = TestBed.createComponent(Panel);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".panel");
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
