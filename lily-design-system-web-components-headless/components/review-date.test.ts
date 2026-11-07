import { afterEach, describe, expect, test } from "vitest";

import { ReviewDate } from "./review-date.js";

if (!customElements.get("lily-review-date")) {
    customElements.define("lily-review-date", ReviewDate);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ReviewDate", () => {
    test("renders a native time element with the correct class", () => {
        const host = render(
            '<lily-review-date label="Next review" datetime="2025-06-15">June 15, 2025</lily-review-date>',
        );

        const time = host.querySelector("time") as HTMLTimeElement;
        expect(time).not.toBeNull();
        expect(time.className).toBe("review-date");
    });

    test("renders label as hidden text, not aria-label", () => {
        const host = render(
            '<lily-review-date label="Next review" datetime="2025-06-15">June 15, 2025</lily-review-date>',
        );

        const time = host.querySelector("time")!;
        expect(time.hasAttribute("aria-label")).toBe(false);
        expect(time.querySelector(".screen-reader-span")!.textContent).toBe("Next review ");
    });

    test("sets the datetime attribute for machine readability", () => {
        const host = render(
            '<lily-review-date label="Next review" datetime="2025-06-15">June 15, 2025</lily-review-date>',
        );

        expect(host.querySelector("time")!.getAttribute("datetime")).toBe("2025-06-15");
    });

    test("moves the human-readable display text into the time element", () => {
        const host = render(
            '<lily-review-date label="Next review" datetime="2025-06-15">June 15, 2025</lily-review-date>',
        );

        expect(host.querySelector("time")!.textContent).toBe("Next review June 15, 2025");
    });

    test("passes through rest attributes onto the time element", () => {
        const host = render(
            '<lily-review-date label="Due date" datetime="2025-12-31" data-urgency="high">Dec 31, 2025</lily-review-date>',
        );

        expect(host.querySelector("time")!.getAttribute("data-urgency")).toBe("high");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-review-date label="Next review" datetime="2025-06-15" class="my-date">June 15, 2025</lily-review-date>',
        );

        expect(host.querySelector("time")!.className).toBe("review-date my-date");
    });
});
