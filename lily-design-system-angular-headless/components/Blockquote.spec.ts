import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Blockquote } from "./Blockquote";

describe("Blockquote", () => {
    test("renders the <blockquote> root with the base class", () => {
        const fixture = TestBed.createComponent(Blockquote);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("blockquote.blockquote");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Blockquote);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("blockquote.blockquote");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("carries its source", () => {
        const fixture = TestBed.createComponent(Blockquote);
        fixture.componentRef.setInput("cite", "https://example.org");
        fixture.componentRef.setInput("citationText", "A book");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".blockquote");
        expect(el.getAttribute("cite")).toBe("https://example.org");
        expect(el.querySelector(".blockquote-citation").textContent).toBe("A book");
    });
});
