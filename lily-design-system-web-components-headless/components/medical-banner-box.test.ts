import { afterEach, describe, expect, test } from "vitest";

import { MedicalBannerBox } from "./medical-banner-box.js";

if (!customElements.get("lily-medical-banner-box")) {
    customElements.define("lily-medical-banner-box", MedicalBannerBox);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MedicalBannerBox", () => {
    test("the custom element itself is the box (self-is-the-wrapper)", () => {
        const host = render("<lily-medical-banner-box><span>Patient: John Smith</span></lily-medical-banner-box>");

        expect(host.className).toBe("medical-banner-box");
    });

    test("carries data-context=medical", () => {
        const host = render("<lily-medical-banner-box></lily-medical-banner-box>");

        expect(host.getAttribute("data-context")).toBe("medical");
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-medical-banner-box label="Patient summary"></lily-medical-banner-box>');

        expect(host.getAttribute("aria-label")).toBe("Patient summary");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render("<lily-medical-banner-box></lily-medical-banner-box>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("keeps children in place", () => {
        const host = render("<lily-medical-banner-box><span>NHS: 123 456 7890</span></lily-medical-banner-box>");

        expect(host.querySelector("span")!.textContent).toBe("NHS: 123 456 7890");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-medical-banner-box class="extra"></lily-medical-banner-box>');

        expect(host.className).toBe("medical-banner-box extra");
    });
});
