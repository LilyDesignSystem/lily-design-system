import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { StatusTag } from "./StatusTag";

describe("StatusTag", () => {
    test("renders the <span> root with the base class", () => {
        const fixture = TestBed.createComponent(StatusTag);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.status-tag");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(StatusTag);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.status-tag");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a static label with a type and hidden text", () => {
        const fixture = TestBed.createComponent(StatusTag);
        fixture.componentRef.setInput("type", "error");
        fixture.componentRef.setInput("label", "Status:");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".status-tag");
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
        expect(el.getAttribute("data-type")).toBe("error");
        expect(el.querySelector(".screen-reader-span").textContent).toBe("Status: ");
    });
});
