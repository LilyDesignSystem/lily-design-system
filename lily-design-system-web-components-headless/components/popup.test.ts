import { afterEach, describe, expect, test } from "vitest";

import { Popup } from "./popup.js";

if (!customElements.get("lily-popup")) {
    customElements.define("lily-popup", Popup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Popup", () => {
    test("carries the base class", () => {
        const host = render('<lily-popup label="Confirmation"></lily-popup>');

        expect(host.classList.contains("popup")).toBe(true);
    });

    test("has role=dialog", () => {
        const host = render('<lily-popup label="Confirmation"></lily-popup>');

        expect(host.getAttribute("role")).toBe("dialog");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-popup label="Confirmation"></lily-popup>');

        expect(host.getAttribute("aria-label")).toBe("Confirmation");
    });

    test("is hidden when open is absent", () => {
        const host = render('<lily-popup label="Confirmation"></lily-popup>');

        expect(host.hidden).toBe(true);
    });

    test("is visible when open is present", () => {
        const host = render('<lily-popup label="Confirmation" open></lily-popup>');

        expect(host.hidden).toBe(false);
    });

    test("toggling the open attribute externally updates visibility", () => {
        const host = render('<lily-popup label="Confirmation"></lily-popup>');

        host.toggleAttribute("open", true);
        expect(host.hidden).toBe(false);

        host.toggleAttribute("open", false);
        expect(host.hidden).toBe(true);
    });

    test("keeps consumer content in place", () => {
        const host = render('<lily-popup label="Confirmation" open><p>Are you sure?</p></lily-popup>');

        expect(host.querySelector("p")?.textContent).toBe("Are you sure?");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render('<lily-popup label="Confirmation" class="my-popup"></lily-popup>');

        expect(host.getAttribute("class")).toBe("popup my-popup");
    });
});
