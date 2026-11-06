import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Loading } from "./Loading";

describe("Loading", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Loading);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.loading");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Loading);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.loading");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=status with a label", () => {
        const fixture = TestBed.createComponent(Loading);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".loading");
        expect(el.getAttribute("role")).toBe("status");
        expect(el.getAttribute("aria-label")).toBe("Story");
        expect(el.getAttribute("aria-live")).toBe("polite");
    });
});
