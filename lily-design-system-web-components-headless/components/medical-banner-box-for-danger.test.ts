import { afterEach, describe, expect, test } from "vitest";

import { MedicalBannerBoxForDanger } from "./medical-banner-box-for-danger.js";

if (!customElements.get("lily-medical-banner-box-for-danger")) {
    customElements.define("lily-medical-banner-box-for-danger", MedicalBannerBoxForDanger);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MedicalBannerBoxForDanger", () => {
    test("the custom element itself is the box (self-is-the-wrapper)", () => {
        const host = render('<lily-medical-banner-box-for-danger label="Allergies"></lily-medical-banner-box-for-danger>');

        expect(host.className).toBe("medical-banner-box-for-danger");
    });

    test("has role=region and carries data-type=danger", () => {
        const host = render('<lily-medical-banner-box-for-danger label="Allergies"></lily-medical-banner-box-for-danger>');

        expect(host.getAttribute("role")).toBe("region");
        expect(host.getAttribute("data-type")).toBe("danger");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-medical-banner-box-for-danger label="Allergies"></lily-medical-banner-box-for-danger>');

        expect(host.getAttribute("aria-label")).toBe("Allergies");
    });

    test("keeps children in place", () => {
        const host = render('<lily-medical-banner-box-for-danger label="Allergies"><span>Penicillin: anaphylaxis</span></lily-medical-banner-box-for-danger>');

        expect(host.querySelector("span")!.textContent).toBe("Penicillin: anaphylaxis");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-medical-banner-box-for-danger label="Allergies" class="extra"></lily-medical-banner-box-for-danger>');

        expect(host.className).toBe("medical-banner-box-for-danger extra");
    });
});
