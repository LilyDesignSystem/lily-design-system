import { afterEach, describe, expect, test } from "vitest";

import { MeasurementSystemView } from "./measurement-system-view.js";

if (!customElements.get("lily-measurement-system-view")) {
    customElements.define("lily-measurement-system-view", MeasurementSystemView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MeasurementSystemView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-measurement-system-view value="metric"></lily-measurement-system-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("measurement-system-view");
    });

    test("seeds the initial value as textContent", () => {
        const host = render('<lily-measurement-system-view value="imperial"></lily-measurement-system-view>');

        expect(host.querySelector("span")!.textContent).toBe("imperial");
    });

    test("uses label as additional accessible context when provided", () => {
        const host = render('<lily-measurement-system-view value="SI" label="International System of Units"></lily-measurement-system-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("International System of Units");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render('<lily-measurement-system-view value="metric"></lily-measurement-system-view>');

        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("exposes a live value property", () => {
        const host = render(
            '<lily-measurement-system-view value="metric"></lily-measurement-system-view>',
        ) as unknown as MeasurementSystemView;

        expect(host.value).toBe("metric");
        host.value = "imperial";
        expect(host.querySelector("span")!.textContent).toBe("imperial");
        expect(host.value).toBe("imperial");
    });

    test("passes through rest attributes and the class hook", () => {
        const host = render('<lily-measurement-system-view value="SI" class="extra" data-testid="system"></lily-measurement-system-view>');

        const span = host.querySelector("span")!;
        expect(span.className).toBe("measurement-system-view extra");
        expect(span.getAttribute("data-testid")).toBe("system");
    });
});
