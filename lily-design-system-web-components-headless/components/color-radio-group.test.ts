import { afterEach, describe, expect, test } from "vitest";

import { ColorRadioGroup } from "./color-radio-group.js";

if (!customElements.get("lily-color-radio-group")) {
    customElements.define("lily-color-radio-group", ColorRadioGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ColorRadioGroup", () => {
    test("renders a fieldset with role=radiogroup", () => {
        const host = render(
            '<lily-color-radio-group label="Delivery method"></lily-color-radio-group>',
        );

        const fieldset = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(fieldset.getAttribute("role")).toBe("radiogroup");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-color-radio-group label="Delivery method"></lily-color-radio-group>',
        );

        expect(host.querySelector("fieldset")!.getAttribute("aria-label")).toBe("Delivery method");
    });

    test("moves child radio inputs into the fieldset", () => {
        const host = render(
            '<lily-color-radio-group label="Delivery method"><label><input type="radio" name="d" value="email">Email</label></lily-color-radio-group>',
        );

        expect(host.querySelector("fieldset input[type=radio]")).toBeTruthy();
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render(
            '<lily-color-radio-group label="Delivery method" class="my-extra"></lily-color-radio-group>',
        );

        expect(host.querySelector("fieldset")!.className).toBe("color-radio-group my-extra");
    });

    test("passes through rest attributes such as id", () => {
        const host = render(
            '<lily-color-radio-group label="Delivery method" id="delivery-group"></lily-color-radio-group>',
        );

        expect(host.querySelector("fieldset")!.id).toBe("delivery-group");
    });
});
