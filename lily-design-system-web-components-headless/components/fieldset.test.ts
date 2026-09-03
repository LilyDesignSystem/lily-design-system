import { afterEach, describe, expect, test } from "vitest";

import { Fieldset } from "./fieldset.js";

if (!customElements.get("lily-fieldset")) {
    customElements.define("lily-fieldset", Fieldset);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Fieldset", () => {
    test("renders a native fieldset with a legend", () => {
        const host = render('<lily-fieldset legend="Contact details"></lily-fieldset>');

        const fieldset = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(fieldset).toBeTruthy();
        expect(fieldset.querySelector("legend")!.textContent).toBe("Contact details");
    });

    test("moves children after the legend", () => {
        const host = render('<lily-fieldset legend="Contact details"><input type="text"></lily-fieldset>');

        const fieldset = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(fieldset.children[0]!.tagName).toBe("LEGEND");
        expect(fieldset.querySelector("input")).toBeTruthy();
    });

    test("disabled propagates to the native fieldset", () => {
        const host = render('<lily-fieldset legend="Contact details" disabled></lily-fieldset>');

        expect((host.querySelector("fieldset") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-fieldset legend="X" class="extra"></lily-fieldset>');

        expect(host.querySelector("fieldset")!.className).toBe("fieldset extra");
    });
});
