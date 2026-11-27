import { afterEach, describe, expect, test, vi } from "vitest";

import { MedicalBanner } from "./medical-banner.js";

if (!customElements.get("lily-medical-banner")) {
    customElements.define("lily-medical-banner", MedicalBanner);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MedicalBanner", () => {
    test("the custom element itself is the live region (self-is-the-wrapper)", () => {
        const host = render(
            '<lily-medical-banner label="Patient alerts">Allergy on file.</lily-medical-banner>',
        );

        expect(host.className).toBe("medical-banner");
        expect(host.getAttribute("role")).toBe("region");
        expect(host.getAttribute("aria-live")).toBe("polite");
    });

    test("always carries data-context=medical", () => {
        const host = render(
            '<lily-medical-banner label="Patient alerts">Allergy on file.</lily-medical-banner>',
        );

        expect(host.getAttribute("data-context")).toBe("medical");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-medical-banner label="Patient alerts">Allergy on file.</lily-medical-banner>',
        );

        expect(host.getAttribute("aria-label")).toBe("Patient alerts");
    });

    test("defaults data-type to info", () => {
        const host = render(
            '<lily-medical-banner label="Patient alerts">Allergy on file.</lily-medical-banner>',
        );

        expect(host.getAttribute("data-type")).toBe("info");
    });

    test("honours an explicit type", () => {
        const host = render(
            '<lily-medical-banner label="Patient alerts" type="warning">Allergy.</lily-medical-banner>',
        );

        expect(host.getAttribute("data-type")).toBe("warning");
    });

    test("dismissible renders a dismiss button with close-label as its accessible name", () => {
        const host = render(
            '<lily-medical-banner label="Patient alerts" dismissible close-label="Dismiss">Allergy.</lily-medical-banner>',
        );

        expect(host.querySelector(".medical-banner-dismiss")!.getAttribute("aria-label")).toBe(
            "Dismiss",
        );
    });

    test("dismissing fires lily-close and hides the banner", () => {
        const host = render(
            '<lily-medical-banner label="Patient alerts" dismissible close-label="Dismiss">Allergy.</lily-medical-banner>',
        );
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);

        (host.querySelector(".medical-banner-dismiss") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalled();
        expect(host.hidden).toBe(true);
    });

    test("shows a change to its attributes after it is mounted (P50-T28)", async () => {
        document.body.innerHTML = `<lily-medical-banner type="info" label="Allergy">Penicillin</lily-medical-banner>`;
        const el = document.querySelector("lily-medical-banner")!;
        el.setAttribute("type", "danger");
        el.setAttribute("dismissible", "");
        el.setAttribute("close-label", "Close");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(el.getAttribute("data-type")).toBe("danger");
        expect(el.querySelectorAll("button.medical-banner-dismiss").length).toBe(1);
        expect(el.querySelector("button")!.getAttribute("aria-label")).toBe("Close");
        el.removeAttribute("dismissible");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(el.querySelector("button")).toBeNull();
        expect(el.textContent).toBe("Penicillin");
    });
});
