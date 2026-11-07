import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Resizable } from "./Resizable";

describe("Resizable", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Resizable);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.resizable");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Resizable);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.resizable");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a focusable region", () => {
        const fixture = TestBed.createComponent(Resizable);
        fixture.componentRef.setInput("label", "Notes");
        fixture.componentRef.setInput("direction", "vertical");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".resizable");
        expect(el.getAttribute("role")).toBe("region");
        expect(el.getAttribute("tabindex")).toBe("0");
        expect(el.getAttribute("aria-label")).toBe("Notes");
        expect(el.getAttribute("data-resize")).toBe("vertical");
    });
});
