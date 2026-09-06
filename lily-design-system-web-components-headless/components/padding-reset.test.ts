import { afterEach, describe, expect, test } from "vitest";

import { PaddingReset } from "./padding-reset.js";

if (!customElements.get("lily-padding-reset")) {
    customElements.define("lily-padding-reset", PaddingReset);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PaddingReset", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-padding-reset><figure>Full-bleed chart</figure></lily-padding-reset>");

        expect(host.className).toBe("padding-reset");
    });

    test("keeps children in place", () => {
        const host = render("<lily-padding-reset><figure>Full-bleed chart</figure></lily-padding-reset>");

        expect(host.querySelector("figure")!.textContent).toBe("Full-bleed chart");
    });

    test("adds no ARIA attributes — purely presentational", () => {
        const host = render("<lily-padding-reset></lily-padding-reset>");

        expect(host.attributes.length).toBe(1); // just class
    });

    test("passes through rest attributes onto the host", () => {
        const host = render('<lily-padding-reset data-testid="reset"></lily-padding-reset>');

        expect(host.getAttribute("data-testid")).toBe("reset");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-padding-reset class="extra"></lily-padding-reset>');

        expect(host.className).toBe("padding-reset extra");
    });
});
