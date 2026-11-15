import { afterEach, describe, expect, test } from "vitest";

import { NetPromoterScoreRadioGroup } from "./net-promoter-score-radio-group.js";

if (!customElements.get("lily-net-promoter-score-radio-group")) {
    customElements.define("lily-net-promoter-score-radio-group", NetPromoterScoreRadioGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NetPromoterScoreRadioGroup", () => {
    test("renders a fieldset with role=radiogroup", () => {
        const host = render(
            '<lily-net-promoter-score-radio-group label="Delivery method"></lily-net-promoter-score-radio-group>',
        );

        const fieldset = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(fieldset.getAttribute("role")).toBe("radiogroup");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-net-promoter-score-radio-group label="Delivery method"></lily-net-promoter-score-radio-group>',
        );

        expect(host.querySelector("fieldset")!.getAttribute("aria-label")).toBe("Delivery method");
    });

    test("moves child radio inputs into the fieldset", () => {
        const host = render(
            '<lily-net-promoter-score-radio-group label="Delivery method"><label><input type="radio" name="d" value="email">Email</label></lily-net-promoter-score-radio-group>',
        );

        expect(host.querySelector("fieldset input[type=radio]")).toBeTruthy();
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render(
            '<lily-net-promoter-score-radio-group label="Delivery method" class="my-extra"></lily-net-promoter-score-radio-group>',
        );

        expect(host.querySelector("fieldset")!.className).toBe(
            "net-promoter-score-radio-group my-extra",
        );
    });

    test("passes through rest attributes such as id", () => {
        const host = render(
            '<lily-net-promoter-score-radio-group label="Delivery method" id="delivery-group"></lily-net-promoter-score-radio-group>',
        );

        expect(host.querySelector("fieldset")!.id).toBe("delivery-group");
    });
});
