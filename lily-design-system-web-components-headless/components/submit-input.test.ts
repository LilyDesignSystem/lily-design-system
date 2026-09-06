import { afterEach, describe, expect, test } from "vitest";

import { SubmitInput } from "./submit-input.js";

if (!customElements.get("lily-submit-input")) {
    customElements.define("lily-submit-input", SubmitInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SubmitInput", () => {
    test("renders a native input type=submit", () => {
        const host = render("<lily-submit-input></lily-submit-input>");

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("submit");
    });

    test("defaults the visible value to Submit", () => {
        const host = render("<lily-submit-input></lily-submit-input>");

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("Submit");
    });

    test("seeds the value from the value attribute", () => {
        const host = render('<lily-submit-input value="Save changes"></lily-submit-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("Save changes");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render("<lily-submit-input></lily-submit-input>") as unknown as SubmitInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "Go";

        expect(input.value).toBe("Go");
        expect(host.value).toBe("Go");
    });

    test("disabled propagates to the inner input", () => {
        const host = render("<lily-submit-input disabled></lily-submit-input>");

        expect((host.querySelector("input") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through rest attributes such as form", () => {
        const host = render('<lily-submit-input form="my-form"></lily-submit-input>');

        expect(host.querySelector("input")!.getAttribute("form")).toBe("my-form");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-submit-input class="extra"></lily-submit-input>');

        expect(host.querySelector("input")!.className).toBe("submit-input extra");
    });
});
