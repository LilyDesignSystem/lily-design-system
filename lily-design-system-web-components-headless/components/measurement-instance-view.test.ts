import { afterEach, describe, expect, test } from "vitest";

import { MeasurementInstanceView } from "./measurement-instance-view.js";

if (!customElements.get("lily-measurement-instance-view")) {
    customElements.define("lily-measurement-instance-view", MeasurementInstanceView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MeasurementInstanceView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-measurement-instance-view value="72 kg"></lily-measurement-instance-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("measurement-instance-view");
    });

    test("seeds the initial value as textContent", () => {
        const host = render('<lily-measurement-instance-view value="98.6 F"></lily-measurement-instance-view>');

        expect(host.querySelector("span")!.textContent).toBe("98.6 F");
    });

    test("uses label as additional accessible context when provided", () => {
        const host = render('<lily-measurement-instance-view value="72 kg" label="Patient weight"></lily-measurement-instance-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Patient weight");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render('<lily-measurement-instance-view value="120/80 mmHg"></lily-measurement-instance-view>');

        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("exposes a live value property", () => {
        const host = render(
            '<lily-measurement-instance-view value="72 kg"></lily-measurement-instance-view>',
        ) as unknown as MeasurementInstanceView;

        expect(host.value).toBe("72 kg");
        host.value = "75 kg";
        expect(host.querySelector("span")!.textContent).toBe("75 kg");
        expect(host.value).toBe("75 kg");
    });

    test("passes through rest attributes and the class hook", () => {
        const host = render('<lily-measurement-instance-view value="72 kg" class="extra" data-testid="weight"></lily-measurement-instance-view>');

        const span = host.querySelector("span")!;
        expect(span.className).toBe("measurement-instance-view extra");
        expect(span.getAttribute("data-testid")).toBe("weight");
    });
});
