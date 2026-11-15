import { afterEach, describe, expect, test } from "vitest";

import { RedAmberGreenRadioGroup } from "./red-amber-green-radio-group.js";

if (!customElements.get("lily-red-amber-green-radio-group")) {
    customElements.define("lily-red-amber-green-radio-group", RedAmberGreenRadioGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RedAmberGreenRadioGroup", () => {
    test("renders a fieldset with role=radiogroup", () => {
        const host = render(
            '<lily-red-amber-green-radio-group label="Delivery method"></lily-red-amber-green-radio-group>',
        );

        const fieldset = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(fieldset.getAttribute("role")).toBe("radiogroup");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-red-amber-green-radio-group label="Delivery method"></lily-red-amber-green-radio-group>',
        );

        expect(host.querySelector("fieldset")!.getAttribute("aria-label")).toBe("Delivery method");
    });

    test("moves child radio inputs into the fieldset", () => {
        const host = render(
            '<lily-red-amber-green-radio-group label="Delivery method"><label><input type="radio" name="d" value="email">Email</label></lily-red-amber-green-radio-group>',
        );

        expect(host.querySelector("fieldset input[type=radio]")).toBeTruthy();
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render(
            '<lily-red-amber-green-radio-group label="Delivery method" class="my-extra"></lily-red-amber-green-radio-group>',
        );

        expect(host.querySelector("fieldset")!.className).toBe(
            "red-amber-green-radio-group my-extra",
        );
    });

    test("passes through rest attributes such as id", () => {
        const host = render(
            '<lily-red-amber-green-radio-group label="Delivery method" id="delivery-group"></lily-red-amber-green-radio-group>',
        );

        expect(host.querySelector("fieldset")!.id).toBe("delivery-group");
    });
});
