import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Footnote } from "./Footnote";

describe("Footnote", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(Footnote);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.footnote");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Footnote);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.footnote");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=note, as in Svelte", () => {
        const fixture = TestBed.createComponent(Footnote);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".footnote");
        expect(el.getAttribute("role")).toBe("note");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("takes the id off the host", () => {
        const fixture = TestBed.createComponent(Footnote);
        fixture.componentRef.setInput("id", "note-1");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".footnote");
        expect(el.getAttribute("id")).toBe("note-1");
        expect(el.getAttribute("aria-label")).toBe("note-1");
        expect(fixture.nativeElement.hasAttribute("id")).toBe(false);
    });
});
