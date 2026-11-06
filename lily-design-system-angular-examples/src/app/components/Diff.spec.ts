import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Diff } from "./Diff";

describe("Diff", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Diff);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.diff");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Diff);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.diff");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=group with a label", () => {
        const fixture = TestBed.createComponent(Diff);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".diff");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
