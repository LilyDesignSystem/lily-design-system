import { afterEach, describe, expect, test } from "vitest";

import { NetPromoterScoreView } from "./net-promoter-score-view.js";

if (!customElements.get("lily-net-promoter-score-view")) {
    customElements.define("lily-net-promoter-score-view", NetPromoterScoreView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NetPromoterScoreView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-net-promoter-score-view label="NPS Score"></lily-net-promoter-score-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("net-promoter-score-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-net-promoter-score-view label="NPS Score"></lily-net-promoter-score-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("NPS Score");
    });

    test("defaults value to an empty string", () => {
        const host = render('<lily-net-promoter-score-view label="NPS Score"></lily-net-promoter-score-view>');

        expect(host.querySelector("span")!.textContent).toBe("");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-net-promoter-score-view label="NPS Score" value="8"></lily-net-promoter-score-view>') as unknown as NetPromoterScoreView;

        expect(host.querySelector("span")!.textContent).toBe("8");
        expect(host.value).toBe("8");

        host.value = "9";
        expect(host.querySelector("span")!.textContent).toBe("9");
        expect(host.value).toBe("9");
    });

    test("passes through rest attributes onto the span", () => {
        const host = render('<lily-net-promoter-score-view label="NPS Score" data-testid="nps"></lily-net-promoter-score-view>');

        expect(host.querySelector("span")!.getAttribute("data-testid")).toBe("nps");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-net-promoter-score-view label="NPS Score" class="extra"></lily-net-promoter-score-view>');

        expect(host.querySelector("span")!.className).toBe("net-promoter-score-view extra");
    });
});
