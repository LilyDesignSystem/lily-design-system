import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Tile } from "./Tile";

describe("Tile", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Tile);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.tile");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Tile);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.tile");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=group with a label", () => {
        const fixture = TestBed.createComponent(Tile);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".tile");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
