import { afterEach, describe, expect, test } from "vitest";

import { CanadaSocialInsuranceNumberView } from "./canada-social-insurance-number-view.js";

if (!customElements.get("lily-canada-social-insurance-number-view")) {
    customElements.define("lily-canada-social-insurance-number-view", CanadaSocialInsuranceNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CanadaSocialInsuranceNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-canada-social-insurance-number-view label="Social Insurance Number (SIN)" value="123 456 782"></lily-canada-social-insurance-number-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("canada-social-insurance-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-canada-social-insurance-number-view label="Social Insurance Number (SIN)" value="123 456 782"></lily-canada-social-insurance-number-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Social Insurance Number (SIN)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-canada-social-insurance-number-view label="Social Insurance Number (SIN)" value="123 456 782"></lily-canada-social-insurance-number-view>') as unknown as CanadaSocialInsuranceNumberView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("123 456 782");
        expect(host.value).toBe("123 456 782");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-canada-social-insurance-number-view label="Social Insurance Number (SIN)" value="123 456 782"></lily-canada-social-insurance-number-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
