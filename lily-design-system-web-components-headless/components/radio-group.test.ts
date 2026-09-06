import { afterEach, describe, expect, test } from "vitest";

import { RadioGroup } from "./radio-group.js";

if (!customElements.get("lily-radio-group")) {
    customElements.define("lily-radio-group", RadioGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RadioGroup", () => {
    test("renders a fieldset with role=radiogroup", () => {
        const host = render('<lily-radio-group label="Delivery method"></lily-radio-group>');

        const fieldset = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(fieldset.getAttribute("role")).toBe("radiogroup");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-radio-group label="Delivery method"></lily-radio-group>');

        expect(host.querySelector("fieldset")!.getAttribute("aria-label")).toBe("Delivery method");
    });

    test("moves child radio inputs into the fieldset", () => {
        const host = render(
            '<lily-radio-group label="Delivery method"><label><input type="radio" name="d" value="email">Email</label></lily-radio-group>',
        );

        expect(host.querySelector("fieldset input[type=radio]")).toBeTruthy();
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render('<lily-radio-group label="Delivery method" class="my-extra"></lily-radio-group>');

        expect(host.querySelector("fieldset")!.className).toBe("radio-group my-extra");
    });

    test("passes through rest attributes such as id", () => {
        const host = render('<lily-radio-group label="Delivery method" id="delivery-group"></lily-radio-group>');

        expect(host.querySelector("fieldset")!.id).toBe("delivery-group");
    });
});
