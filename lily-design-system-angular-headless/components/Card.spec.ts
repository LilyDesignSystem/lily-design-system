import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Card } from "./Card";

describe("Card", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Card);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.card");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Card);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.card");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("renders a heading at its level, linked when given href", () => {
        const fixture = TestBed.createComponent(Card);
        fixture.componentRef.setInput("heading", "Tulips");
        fixture.componentRef.setInput("headingLevel", 4);
        fixture.componentRef.setInput("href", "/tulips");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".card");
        expect(el.querySelector("h4 a").getAttribute("href")).toBe("/tulips");
        expect(el.querySelector("h4").textContent).toBe("Tulips");
    });

    test("defaults to an unlinked h3", () => {
        const fixture = TestBed.createComponent(Card);
        fixture.componentRef.setInput("heading", "Tulips");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".card");
        expect(el.querySelector("h3").textContent).toBe("Tulips");
        expect(el.querySelector("a")).toBeNull();
    });

    test("is a group when labelled", () => {
        const fixture = TestBed.createComponent(Card);
        fixture.componentRef.setInput("label", "Plant");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".card");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Plant");
    });

    test("names nothing unlabelled", () => {
        const fixture = TestBed.createComponent(Card);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".card");
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
