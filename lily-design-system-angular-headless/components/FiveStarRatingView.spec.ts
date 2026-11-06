import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FiveStarRatingView } from "./FiveStarRatingView";

describe("FiveStarRatingView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(FiveStarRatingView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.five-star-rating-view");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(FiveStarRatingView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.five-star-rating-view");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a named image of five hidden stars", () => {
        const fixture = TestBed.createComponent(FiveStarRatingView);
        fixture.componentRef.setInput("label", "3 of 5");
        fixture.componentRef.setInput("value", 3);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".five-star-rating-view");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.textContent).toBe("★★★☆☆");
        expect(el.querySelectorAll("[aria-hidden=true]").length).toBe(5);
        expect(el.querySelectorAll("[data-filled=true]").length).toBe(3);
    });
});
