import { afterEach, describe, expect, test } from "vitest";

import { MedicalBannerBoxForAdvice } from "./medical-banner-box-for-advice.js";

if (!customElements.get("lily-medical-banner-box-for-advice")) {
    customElements.define("lily-medical-banner-box-for-advice", MedicalBannerBoxForAdvice);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MedicalBannerBoxForAdvice", () => {
    test("the custom element itself is the box (self-is-the-wrapper)", () => {
        const host = render('<lily-medical-banner-box-for-advice label="Care contacts"></lily-medical-banner-box-for-advice>');

        expect(host.className).toBe("medical-banner-box-for-advice");
    });

    test("has role=region and carries data-type=advice", () => {
        const host = render('<lily-medical-banner-box-for-advice label="Care contacts"></lily-medical-banner-box-for-advice>');

        expect(host.getAttribute("role")).toBe("region");
        expect(host.getAttribute("data-type")).toBe("advice");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-medical-banner-box-for-advice label="Care contacts"></lily-medical-banner-box-for-advice>');

        expect(host.getAttribute("aria-label")).toBe("Care contacts");
    });

    test("keeps children in place", () => {
        const host = render('<lily-medical-banner-box-for-advice label="Care contacts"><span>GP: Dr Patel</span></lily-medical-banner-box-for-advice>');

        expect(host.querySelector("span")!.textContent).toBe("GP: Dr Patel");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-medical-banner-box-for-advice label="Care contacts" class="extra"></lily-medical-banner-box-for-advice>');

        expect(host.className).toBe("medical-banner-box-for-advice extra");
    });
});
