import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Question } from "./Question";

describe("Question", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Question);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.question");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Question);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.question");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a named group when labelled", () => {
        const fixture = TestBed.createComponent(Question);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".question");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const fixture = TestBed.createComponent(Question);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector(".question").hasAttribute("role")).toBe(false);
    });
});
