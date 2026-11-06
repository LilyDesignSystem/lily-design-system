import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Flair } from "./Flair";

describe("Flair", () => {
    test("renders the <span> root with the base class", () => {
        const fixture = TestBed.createComponent(Flair);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.flair");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Flair);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.flair");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=img with a label", () => {
        const fixture = TestBed.createComponent(Flair);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".flair");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
