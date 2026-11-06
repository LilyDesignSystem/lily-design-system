import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ContainerWithFixedWidth } from "./ContainerWithFixedWidth";

describe("ContainerWithFixedWidth", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(ContainerWithFixedWidth);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.container-with-fixed-width");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ContainerWithFixedWidth);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.container-with-fixed-width");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("never names its root", () => {
        const fixture = TestBed.createComponent(ContainerWithFixedWidth);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".container-with-fixed-width");
        expect(el.hasAttribute("aria-label")).toBe(false);
        expect(el.hasAttribute("role")).toBe(false);
    });
});
