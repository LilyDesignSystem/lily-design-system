import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Sparkline } from "./Sparkline";

describe("Sparkline", () => {
    test("renders the <span> root with the base class", () => {
        const fixture = TestBed.createComponent(Sparkline);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.sparkline");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Sparkline);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.sparkline");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=img, as in Svelte", () => {
        const fixture = TestBed.createComponent(Sparkline);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".sparkline");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("below minimumPoints it shows the consumer's words as text, not the graphic", () => {
        const fixture = TestBed.createComponent(Sparkline);
        fixture.componentRef.setInput("label", "Weight trend");
        fixture.componentRef.setInput("pointCount", 2);
        fixture.componentRef.setInput("minimumPoints", 3);
        fixture.componentRef.setInput("insufficientLabel", "Not enough readings for a trend");
        fixture.detectChanges();
        const root = (fixture.nativeElement as HTMLElement).querySelector(
            ".sparkline",
        ) as HTMLElement;
        expect(root.hasAttribute("data-insufficient")).toBe(true);
        expect(root.getAttribute("role")).toBeNull();
        expect(root.querySelector(".sparkline-insufficient")?.textContent).toBe(
            "Not enough readings for a trend",
        );
    });
});
