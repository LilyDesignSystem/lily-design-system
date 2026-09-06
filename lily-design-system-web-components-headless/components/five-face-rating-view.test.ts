import { afterEach, describe, expect, test } from "vitest";

import { FiveFaceRatingView } from "./five-face-rating-view.js";

if (!customElements.get("lily-five-face-rating-view")) {
    customElements.define("lily-five-face-rating-view", FiveFaceRatingView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FiveFaceRatingView", () => {
    test("renders a span with the correct class and role=img", () => {
        const host = render('<lily-five-face-rating-view value="4" label="Good rating"></lily-five-face-rating-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("five-face-rating-view");
        expect(span.getAttribute("role")).toBe("img");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-five-face-rating-view value="4" label="Patient satisfaction: Good"></lily-five-face-rating-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Patient satisfaction: Good");
    });

    test("exposes data-value and derives the default face label", () => {
        const host = render('<lily-five-face-rating-view value="4" label="Good"></lily-five-face-rating-view>');

        const span = host.querySelector("span")!;
        expect(span.getAttribute("data-value")).toBe("4");
        expect(span.textContent).toBe("Good");
    });

    test("supports custom labels via a JSON-encoded labels attribute", () => {
        const host = render(
            '<lily-five-face-rating-view value="5" label="Excellent" labels=\'["Terrible","Poor","Fair","Great","Excellent"]\'></lily-five-face-rating-view>',
        );

        expect(host.querySelector("span")!.textContent).toBe("Excellent");
    });

    test("passes through rest attributes and the class hook", () => {
        const host = render(
            '<lily-five-face-rating-view value="3" label="Okay" class="extra" data-testid="rating"></lily-five-face-rating-view>',
        );

        const span = host.querySelector("span")!;
        expect(span.className).toBe("five-face-rating-view extra");
        expect(span.getAttribute("data-testid")).toBe("rating");
    });

    test("exposes a live value property that re-renders the face label", () => {
        const host = render('<lily-five-face-rating-view value="1" label="Very bad"></lily-five-face-rating-view>') as unknown as FiveFaceRatingView;

        expect(host.value).toBe(1);
        host.value = 3;
        expect(host.value).toBe(3);
        expect(host.querySelector("span")!.textContent).toBe("Okay");
        expect(host.querySelector("span")!.getAttribute("data-value")).toBe("3");
    });
});
