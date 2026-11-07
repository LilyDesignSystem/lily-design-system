import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ContainerWithFluidWidth } from "./ContainerWithFluidWidth";

describe("ContainerWithFluidWidth", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(ContainerWithFluidWidth);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.container-with-fluid-width");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ContainerWithFluidWidth);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.container-with-fluid-width");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("never names its root", () => {
        const fixture = TestBed.createComponent(ContainerWithFluidWidth);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".container-with-fluid-width");
        expect(el.hasAttribute("aria-label")).toBe(false);
        expect(el.hasAttribute("role")).toBe(false);
    });

    test("takes a padding", () => {
        const fixture = TestBed.createComponent(ContainerWithFluidWidth);
        fixture.componentRef.setInput("paddingInline", "2rem");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".container-with-fluid-width");
        expect(el.getAttribute("data-padding-inline")).toBe("2rem");
        expect(el.style.width).toBe("100%");
    });
});
