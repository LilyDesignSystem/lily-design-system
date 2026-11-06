import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Comment } from "./Comment";

describe("Comment", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Comment);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.comment");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Comment);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.comment");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a named group when labelled", () => {
        const fixture = TestBed.createComponent(Comment);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".comment");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const fixture = TestBed.createComponent(Comment);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector(".comment").hasAttribute("role")).toBe(false);
    });
});
