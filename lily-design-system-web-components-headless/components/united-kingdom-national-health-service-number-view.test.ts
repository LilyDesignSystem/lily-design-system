import { afterEach, describe, expect, test } from "vitest";

import { UnitedKingdomNationalHealthServiceNumberView } from "./united-kingdom-national-health-service-number-view.js";

if (!customElements.get("lily-united-kingdom-national-health-service-number-view")) {
    customElements.define("lily-united-kingdom-national-health-service-number-view", UnitedKingdomNationalHealthServiceNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("UnitedKingdomNationalHealthServiceNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-united-kingdom-national-health-service-number-view label="NHS number"></lily-united-kingdom-national-health-service-number-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("united-kingdom-national-health-service-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-united-kingdom-national-health-service-number-view label="NHS number"></lily-united-kingdom-national-health-service-number-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("NHS number");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render('<lily-united-kingdom-national-health-service-number-view label="NHS number" value="943 476 5919"></lily-united-kingdom-national-health-service-number-view>') as unknown as UnitedKingdomNationalHealthServiceNumberView;

        expect(host.value).toBe("943 476 5919");
        expect(host.querySelector("span")!.textContent).toBe("943 476 5919");

        host.value = "485 777 3456";
        expect(host.querySelector("span")!.textContent).toBe("485 777 3456");
        expect(host.value).toBe("485 777 3456");
    });
});
