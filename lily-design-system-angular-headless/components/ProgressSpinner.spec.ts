import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ProgressSpinner } from "./ProgressSpinner";

describe("ProgressSpinner", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(ProgressSpinner);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.progress-spinner");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ProgressSpinner);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.progress-spinner");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=status, as in Svelte", () => {
        const fixture = TestBed.createComponent(ProgressSpinner);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".progress-spinner");
        expect(el.getAttribute("role")).toBe("status");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
