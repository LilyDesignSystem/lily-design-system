import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Toast } from "./Toast";

describe("Toast", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Toast);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.toast");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Toast);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.toast");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a polite status by default", () => {
        const fixture = TestBed.createComponent(Toast);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".toast");
        expect(el.getAttribute("role")).toBe("status");
        expect(el.getAttribute("aria-live")).toBe("polite");
    });

    test("is an assertive alert when urgent", () => {
        const fixture = TestBed.createComponent(Toast);
        fixture.componentRef.setInput("urgent", true);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".toast");
        expect(el.getAttribute("role")).toBe("alert");
        expect(el.getAttribute("aria-live")).toBe("assertive");
    });
});
