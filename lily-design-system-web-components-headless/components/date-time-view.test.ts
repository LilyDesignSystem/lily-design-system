import { afterEach, describe, expect, test } from "vitest";

import { DateTimeView } from "./date-time-view.js";

if (!customElements.get("lily-date-time-view")) {
    customElements.define("lily-date-time-view", DateTimeView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DateTimeView", () => {
    test("renders a native time element with the datetime attribute", () => {
        const host = render('<lily-date-time-view value="2026-04-27T09:00:00Z"></lily-date-time-view>');

        const time = host.querySelector("time") as HTMLTimeElement;
        expect(time.className).toBe("date-time-view");
        expect(time.getAttribute("datetime")).toBe("2026-04-27T09:00:00Z");
    });

    test("falls back to the raw value when no format or children are given", () => {
        const host = render('<lily-date-time-view value="2026-04-27T09:00:00Z"></lily-date-time-view>');

        expect(host.querySelector("time")!.textContent).toBe("2026-04-27T09:00:00Z");
    });

    test("prefers format over the raw value", () => {
        const host = render(
            '<lily-date-time-view value="2026-04-27T09:00:00Z" format="27 April 2026, 09:00"></lily-date-time-view>',
        );

        expect(host.querySelector("time")!.textContent).toBe("27 April 2026, 09:00");
    });

    test("prefers children over format", () => {
        const host = render(
            '<lily-date-time-view value="2026-04-27T09:00:00Z" format="ignored"><strong>27 Apr</strong></lily-date-time-view>',
        );

        expect(host.querySelector("strong")!.textContent).toBe("27 Apr");
    });

    test("aria-label is rendered only when provided", () => {
        const withLabel = render(
            '<lily-date-time-view value="2026-04-27T09:00:00Z" label="Published"></lily-date-time-view>',
        );
        expect(withLabel.querySelector("time")!.getAttribute("aria-label")).toBe("Published");

        const withoutLabel = render('<lily-date-time-view value="2026-04-27T09:00:00Z"></lily-date-time-view>');
        expect(withoutLabel.querySelector("time")!.hasAttribute("aria-label")).toBe(false);
    });
});
