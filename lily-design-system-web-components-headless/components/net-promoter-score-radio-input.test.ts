import { afterEach, describe, expect, test } from "vitest";

import { NetPromoterScoreRadioInput } from "./net-promoter-score-radio-input.js";

if (!customElements.get("lily-net-promoter-score-radio-input")) {
    customElements.define("lily-net-promoter-score-radio-input", NetPromoterScoreRadioInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NetPromoterScoreRadioInput", () => {
    test("renders a native input type=radio", () => {
        const host = render(
            '<lily-net-promoter-score-radio-input label="Email"></lily-net-promoter-score-radio-input>',
        );

        expect((host.querySelector("input") as HTMLInputElement).type).toBe("radio");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-net-promoter-score-radio-input label="Email"></lily-net-promoter-score-radio-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Email");
    });

    test("sets name and value for grouping", () => {
        const host = render(
            '<lily-net-promoter-score-radio-input label="Email" name="delivery" value="email"></lily-net-promoter-score-radio-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.name).toBe("delivery");
        expect(input.value).toBe("email");
    });

    test("checked and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-net-promoter-score-radio-input label="Email" checked disabled></lily-net-promoter-score-radio-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.checked).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("defaults to unchecked", () => {
        const host = render(
            '<lily-net-promoter-score-radio-input label="Email"></lily-net-promoter-score-radio-input>',
        );

        expect((host.querySelector("input") as HTMLInputElement).checked).toBe(false);
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render(
            '<lily-net-promoter-score-radio-input label="Email" class="my-extra"></lily-net-promoter-score-radio-input>',
        );

        expect(host.querySelector("input")!.className).toBe(
            "net-promoter-score-radio-input my-extra",
        );
    });

    test("passes through rest attributes such as id", () => {
        const host = render(
            '<lily-net-promoter-score-radio-input label="Email" id="delivery-email"></lily-net-promoter-score-radio-input>',
        );

        expect(host.querySelector("input")!.id).toBe("delivery-email");
    });

    test("exposes its value in data-value for consumer CSS", () => {
        const host = render(
            '<lily-net-promoter-score-radio-input label="A" value="9"></lily-net-promoter-score-radio-input>',
        );

        expect(host.querySelector("input")!.getAttribute("data-value")).toBe("9");
    });
});
