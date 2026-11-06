import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Badge } from "./Badge";

describe("Badge", () => {
    test("renders the <span> root with the base class", () => {
        const fixture = TestBed.createComponent(Badge);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.badge");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Badge);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.badge");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=status with its label", () => {
        const fixture = TestBed.createComponent(Badge);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".badge");
        expect(el.getAttribute("role")).toBe("status");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
