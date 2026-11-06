import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Scroller } from "./Scroller";

describe("Scroller", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Scroller);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.scroller");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Scroller);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.scroller");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a named group when labelled", () => {
        const fixture = TestBed.createComponent(Scroller);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.scroller");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const fixture = TestBed.createComponent(Scroller);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector("div.scroller").hasAttribute("role")).toBe(
            false,
        );
    });

    test("has a live background and a foreground", () => {
        const fixture = TestBed.createComponent(Scroller);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".scroller");
        expect(el.querySelector(".scroller-background").getAttribute("aria-live")).toBe("polite");
        expect(el.querySelector(".scroller-base.scroller-foreground")).toBeTruthy();
    });

    test("reports progress from its foreground", () => {
        const fixture = TestBed.createComponent(Scroller);
        const progress: number[] = [];
        fixture.componentInstance.progressChange.subscribe((value) => progress.push(value));
        fixture.detectChanges();
        TestBed.tick();
        expect(progress.length).toBeGreaterThan(0);
    });
});
