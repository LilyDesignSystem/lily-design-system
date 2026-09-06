import { afterEach, describe, expect, test } from "vitest";

import { Option } from "./option.js";

if (!customElements.get("lily-option")) {
    customElements.define("lily-option", Option);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Option", () => {
    test("renders a native option", () => {
        const host = render('<lily-option value="ada">Ada Lovelace</lily-option>');

        expect(host.querySelector("option")).toBeTruthy();
    });

    test("sets value from the value attribute", () => {
        const host = render('<lily-option value="ada">Ada Lovelace</lily-option>');

        expect((host.querySelector("option") as HTMLOptionElement).value).toBe("ada");
    });

    test("moves the consumer's content in as the option label", () => {
        const host = render('<lily-option value="ada">Ada Lovelace</lily-option>');

        expect(host.querySelector("option")!.textContent).toBe("Ada Lovelace");
    });

    test("selected and disabled propagate to the inner option", () => {
        const host = render('<lily-option value="ada" selected disabled>Ada Lovelace</lily-option>');

        const option = host.querySelector("option") as HTMLOptionElement;
        expect(option.selected).toBe(true);
        expect(option.disabled).toBe(true);
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render('<lily-option value="ada" class="my-extra">Ada Lovelace</lily-option>');

        expect(host.querySelector("option")!.className).toBe("option my-extra");
    });

    test("passes through rest attributes such as id", () => {
        const host = render('<lily-option value="ada" id="opt-ada">Ada Lovelace</lily-option>');

        expect(host.querySelector("option")!.id).toBe("opt-ada");
    });
});
