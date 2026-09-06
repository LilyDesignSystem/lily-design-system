import { afterEach, describe, expect, test } from "vitest";

import { MutuallyExclusive } from "./mutually-exclusive.js";

if (!customElements.get("lily-mutually-exclusive")) {
    customElements.define("lily-mutually-exclusive", MutuallyExclusive);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MutuallyExclusive", () => {
    test("renders a native fieldset with the correct class", () => {
        const host = render("<lily-mutually-exclusive></lily-mutually-exclusive>");

        const fieldset = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(fieldset).not.toBeNull();
        expect(fieldset.className).toBe("mutually-exclusive");
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-mutually-exclusive label="Choose one"></lily-mutually-exclusive>');

        expect(host.querySelector("fieldset")!.getAttribute("aria-label")).toBe("Choose one");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render("<lily-mutually-exclusive></lily-mutually-exclusive>");

        expect(host.querySelector("fieldset")!.hasAttribute("aria-label")).toBe(false);
    });

    test("moves light-DOM children into the fieldset", () => {
        const host = render(
            '<lily-mutually-exclusive label="Choose one"><input type="checkbox" value="a"><input type="checkbox" value="b"></lily-mutually-exclusive>',
        );

        const fieldset = host.querySelector("fieldset") as HTMLFieldSetElement;
        expect(fieldset.querySelectorAll("input[type=checkbox]").length).toBe(2);
    });

    test("passes through rest attributes onto the fieldset", () => {
        const host = render('<lily-mutually-exclusive data-testid="group"></lily-mutually-exclusive>');

        expect(host.querySelector("fieldset")!.getAttribute("data-testid")).toBe("group");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-mutually-exclusive class="extra"></lily-mutually-exclusive>');

        expect(host.querySelector("fieldset")!.className).toBe("mutually-exclusive extra");
    });
});
