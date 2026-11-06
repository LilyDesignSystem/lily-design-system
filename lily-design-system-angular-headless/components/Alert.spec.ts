import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Alert } from "./Alert";

describe("Alert", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Alert);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.alert");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Alert);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.alert");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is an assertive alert by default", () => {
        const fixture = TestBed.createComponent(Alert);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".alert");
        expect(el.getAttribute("role")).toBe("alert");
        expect(el.getAttribute("aria-live")).toBe("assertive");
        expect(el.getAttribute("aria-atomic")).toBe("true");
        expect(el.getAttribute("data-type")).toBe("info");
    });

    test("role=status is polite, and live overrides it", () => {
        const fixture = TestBed.createComponent(Alert);
        fixture.componentRef.setInput("role", "status");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".alert");
        expect(el.getAttribute("aria-live")).toBe("polite");
        fixture.componentRef.setInput("live", "off");
        fixture.detectChanges();
        expect(el.getAttribute("aria-live")).toBe("off");
    });

    test("renders its heading", () => {
        const fixture = TestBed.createComponent(Alert);
        fixture.componentRef.setInput("heading", "Saved");
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector(".alert strong").textContent).toBe("Saved");
    });
});
