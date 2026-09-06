import { afterEach, describe, expect, test } from "vitest";

import { NetPromoterScorePicker } from "./net-promoter-score-picker.js";

if (!customElements.get("lily-net-promoter-score-picker")) {
    customElements.define("lily-net-promoter-score-picker", NetPromoterScorePicker);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NetPromoterScorePicker", () => {
    test("carries the base class", () => {
        const host = render(
            '<lily-net-promoter-score-picker label="How likely are you to recommend us?"></lily-net-promoter-score-picker>',
        );

        expect(host.classList.contains("net-promoter-score-picker")).toBe(true);
    });

    test("has role=radiogroup", () => {
        const host = render(
            '<lily-net-promoter-score-picker label="How likely are you to recommend us?"></lily-net-promoter-score-picker>',
        );

        expect(host.getAttribute("role")).toBe("radiogroup");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-net-promoter-score-picker label="How likely are you to recommend us?"></lily-net-promoter-score-picker>',
        );

        expect(host.getAttribute("aria-label")).toBe("How likely are you to recommend us?");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render(
            '<lily-net-promoter-score-picker label="NPS" class="my-picker"></lily-net-promoter-score-picker>',
        );

        expect(host.getAttribute("class")).toBe("net-promoter-score-picker my-picker");
    });

    test("keeps consumer-supplied picker-button children in place", () => {
        const host = render(
            '<lily-net-promoter-score-picker label="NPS"><button aria-pressed="false" aria-label="9"></button></lily-net-promoter-score-picker>',
        );

        expect(host.querySelector("button")).toBeTruthy();
    });

    test("is idempotent across repeated connectedCallback invocations", () => {
        const host = render('<lily-net-promoter-score-picker label="NPS"></lily-net-promoter-score-picker>');

        (host as unknown as NetPromoterScorePicker).connectedCallback();

        expect(host.getAttribute("role")).toBe("radiogroup");
        expect(host.getAttribute("aria-label")).toBe("NPS");
    });
});
