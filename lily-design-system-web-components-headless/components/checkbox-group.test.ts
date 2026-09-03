import { afterEach, describe, expect, test } from "vitest";

import { CheckboxGroup } from "./checkbox-group.js";

if (!customElements.get("lily-checkbox-group")) {
    customElements.define("lily-checkbox-group", CheckboxGroup);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CheckboxGroup", () => {
    test("renders a fieldset with role=group", () => {
        const host = render('<lily-checkbox-group label="Notify me by"></lily-checkbox-group>');

        const fieldset = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(fieldset.getAttribute("role")).toBe("group");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-checkbox-group label="Notify me by"></lily-checkbox-group>');

        expect(host.querySelector("fieldset")!.getAttribute("aria-label")).toBe("Notify me by");
    });

    test("moves child checkboxes into the fieldset", () => {
        const host = render(
            '<lily-checkbox-group label="Notify me by"><label><input type="checkbox" value="email">Email</label></lily-checkbox-group>',
        );

        expect(host.querySelector("fieldset input[type=checkbox]")).toBeTruthy();
    });

    test("disabled sets the native fieldset's disabled property", () => {
        // The component's contract is to set `fieldset.disabled = true`;
        // the browser then natively disables every descendant listed
        // form control for free (HTML fieldset-disabling algorithm).
        // jsdom does not implement that propagation, so this asserts
        // only what the component itself is responsible for.
        const host = render('<lily-checkbox-group label="Notify me by" disabled></lily-checkbox-group>');

        expect((host.querySelector("fieldset") as HTMLFieldSetElement).disabled).toBe(true);
    });
});
