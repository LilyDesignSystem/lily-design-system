import { afterEach, describe, expect, test } from "vitest";

import { FiveStarRatingView } from "./five-star-rating-view.js";

if (!customElements.get("lily-five-star-rating-view")) {
    customElements.define("lily-five-star-rating-view", FiveStarRatingView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FiveStarRatingView", () => {
    test("renders an outer span with the correct class and role=img", () => {
        const host = render('<lily-five-star-rating-view value="4" label="4 out of 5 stars"></lily-five-star-rating-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("five-star-rating-view");
        expect(span.getAttribute("role")).toBe("img");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-five-star-rating-view value="4" label="4 out of 5 stars"></lily-five-star-rating-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("4 out of 5 stars");
    });

    test("renders 5 inner star spans, all aria-hidden", () => {
        const host = render('<lily-five-star-rating-view value="4" label="4 out of 5 stars"></lily-five-star-rating-view>');

        const stars = host.querySelectorAll("span > span");
        expect(stars.length).toBe(5);
        stars.forEach((star) => expect(star.getAttribute("aria-hidden")).toBe("true"));
    });

    test("marks filled vs. empty stars with data-filled", () => {
        const host = render('<lily-five-star-rating-view value="3" label="3 out of 5 stars"></lily-five-star-rating-view>');

        const stars = Array.from(host.querySelectorAll("span > span"));
        expect(stars.map((s) => s.getAttribute("data-filled"))).toEqual(["true", "true", "true", "false", "false"]);
        expect(stars.map((s) => s.textContent)).toEqual(["★", "★", "★", "☆", "☆"]);
    });

    test("exposes data-value on the outer span", () => {
        const host = render('<lily-five-star-rating-view value="2" label="2 out of 5 stars"></lily-five-star-rating-view>');

        expect(host.querySelector("span")!.getAttribute("data-value")).toBe("2");
    });

    test("handles a zero rating with no filled stars", () => {
        const host = render('<lily-five-star-rating-view value="0" label="No rating"></lily-five-star-rating-view>');

        const stars = Array.from(host.querySelectorAll("span > span"));
        expect(stars.every((s) => s.getAttribute("data-filled") === "false")).toBe(true);
    });

    test("exposes a live value property that re-renders the stars", () => {
        const host = render('<lily-five-star-rating-view value="1" label="1 star"></lily-five-star-rating-view>') as unknown as FiveStarRatingView;

        expect(host.value).toBe(1);
        host.value = 5;
        expect(host.value).toBe(5);
        const stars = Array.from(host.querySelectorAll("span > span"));
        expect(stars.every((s) => s.getAttribute("data-filled") === "true")).toBe(true);
    });
});
