import { afterEach, describe, expect, test } from "vitest";

import { MeasurementUnitView } from "./measurement-unit-view.js";

if (!customElements.get("lily-measurement-unit-view")) {
    customElements.define("lily-measurement-unit-view", MeasurementUnitView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MeasurementUnitView", () => {
    test("renders a native span with the correct class", () => {
        const host = render("<lily-measurement-unit-view></lily-measurement-unit-view>");

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("measurement-unit-view");
    });

    test("seeds the initial value as textContent", () => {
        const host = render('<lily-measurement-unit-view value="kg"></lily-measurement-unit-view>');

        expect(host.querySelector("span")!.textContent).toBe("kg");
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-measurement-unit-view value="lb" label="Pounds"></lily-measurement-unit-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Pounds");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render('<lily-measurement-unit-view value="kg"></lily-measurement-unit-view>');

        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("exposes a live value property", () => {
        const host = render('<lily-measurement-unit-view value="kg"></lily-measurement-unit-view>') as unknown as MeasurementUnitView;

        expect(host.value).toBe("kg");
        host.value = "cm";
        expect(host.querySelector("span")!.textContent).toBe("cm");
        expect(host.value).toBe("cm");
    });

    test("passes through rest attributes onto the span", () => {
        const host = render('<lily-measurement-unit-view value="kg" data-testid="unit"></lily-measurement-unit-view>');

        expect(host.querySelector("span")!.getAttribute("data-testid")).toBe("unit");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-measurement-unit-view value="kg" class="extra"></lily-measurement-unit-view>');

        expect(host.querySelector("span")!.className).toBe("measurement-unit-view extra");
    });
});
