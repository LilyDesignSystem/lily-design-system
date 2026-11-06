import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Icon } from "./Icon";

describe("Icon", () => {
    test("renders the <span> root with the base class", () => {
        const fixture = TestBed.createComponent(Icon);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.icon");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Icon);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.icon");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a named image", () => {
        const fixture = TestBed.createComponent(Icon);
        fixture.componentRef.setInput("label", "Warning");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".icon");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Warning");
    });

    test("is hidden when decorative", () => {
        const fixture = TestBed.createComponent(Icon);
        fixture.componentRef.setInput("decorative", true);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".icon");
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.getAttribute("aria-hidden")).toBe("true");
    });
});
