import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Notification } from "./Notification";

describe("Notification", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Notification);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.notification");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Notification);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.notification");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a polite status by default", () => {
        const fixture = TestBed.createComponent(Notification);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".notification");
        expect(el.getAttribute("role")).toBe("status");
        expect(el.getAttribute("aria-live")).toBe("polite");
    });

    test("is an assertive alert when urgent", () => {
        const fixture = TestBed.createComponent(Notification);
        fixture.componentRef.setInput("urgent", true);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".notification");
        expect(el.getAttribute("role")).toBe("alert");
        expect(el.getAttribute("aria-live")).toBe("assertive");
    });
});
