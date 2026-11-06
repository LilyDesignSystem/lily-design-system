import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SuccessPanel } from "./SuccessPanel";

describe("SuccessPanel", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(SuccessPanel);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.success-panel");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(SuccessPanel);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.success-panel");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=status with its label", () => {
        const fixture = TestBed.createComponent(SuccessPanel);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".success-panel");
        expect(el.getAttribute("role")).toBe("status");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
