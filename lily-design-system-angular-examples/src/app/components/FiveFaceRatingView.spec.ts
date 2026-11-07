import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FiveFaceRatingView } from "./FiveFaceRatingView";

describe("FiveFaceRatingView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(FiveFaceRatingView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.five-face-rating-view");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(FiveFaceRatingView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.five-face-rating-view");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a named image showing the face for its value", () => {
        const fixture = TestBed.createComponent(FiveFaceRatingView);
        fixture.componentRef.setInput("label", "Happy");
        fixture.componentRef.setInput("value", 2);
        fixture.componentRef.setInput("labels", ["a", "b", "c", "d", "e"]);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".five-face-rating-view");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("data-value")).toBe("2");
        expect(el.textContent).toBe("b");
    });

    test("shows nothing out of range", () => {
        const fixture = TestBed.createComponent(FiveFaceRatingView);
        fixture.componentRef.setInput("value", 9);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".five-face-rating-view");
        expect(el.textContent).toBe("");
    });
});
