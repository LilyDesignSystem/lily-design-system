import { afterEach, describe, expect, test } from "vitest";

import { FiveStarRatingRadioGroup } from "./five-star-rating-radio-group.js";

if (!customElements.get("lily-five-star-rating-radio-group")) {
    customElements.define("lily-five-star-rating-radio-group", FiveStarRatingRadioGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FiveStarRatingRadioGroup", () => {
    test("renders a fieldset with role=radiogroup", () => {
        const host = render(
            '<lily-five-star-rating-radio-group label="Delivery method"></lily-five-star-rating-radio-group>',
        );

        const fieldset = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(fieldset.getAttribute("role")).toBe("radiogroup");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-five-star-rating-radio-group label="Delivery method"></lily-five-star-rating-radio-group>',
        );

        expect(host.querySelector("fieldset")!.getAttribute("aria-label")).toBe("Delivery method");
    });

    test("moves child radio inputs into the fieldset", () => {
        const host = render(
            '<lily-five-star-rating-radio-group label="Delivery method"><label><input type="radio" name="d" value="email">Email</label></lily-five-star-rating-radio-group>',
        );

        expect(host.querySelector("fieldset input[type=radio]")).toBeTruthy();
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render(
            '<lily-five-star-rating-radio-group label="Delivery method" class="my-extra"></lily-five-star-rating-radio-group>',
        );

        expect(host.querySelector("fieldset")!.className).toBe(
            "five-star-rating-radio-group my-extra",
        );
    });

    test("passes through rest attributes such as id", () => {
        const host = render(
            '<lily-five-star-rating-radio-group label="Delivery method" id="delivery-group"></lily-five-star-rating-radio-group>',
        );

        expect(host.querySelector("fieldset")!.id).toBe("delivery-group");
    });
});
