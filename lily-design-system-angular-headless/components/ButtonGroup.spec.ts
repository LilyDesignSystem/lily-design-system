import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ButtonGroup } from "./ButtonGroup";

describe("ButtonGroup", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(ButtonGroup);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.button-group");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ButtonGroup);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.button-group");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=group, as in Svelte", () => {
        const fixture = TestBed.createComponent(ButtonGroup);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".button-group");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
