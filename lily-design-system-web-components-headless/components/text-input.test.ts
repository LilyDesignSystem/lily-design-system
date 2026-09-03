import { afterEach, describe, expect, test } from "vitest";

import { TextInput } from "./text-input.js";

if (!customElements.get("lily-text-input")) {
    customElements.define("lily-text-input", TextInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TextInput", () => {
    test("renders a native input type=text", () => {
        const host = render('<lily-text-input label="Name"></lily-text-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-text-input label="Name"></lily-text-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Name");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-text-input label="Name" value="Ada"></lily-text-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("Ada");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render('<lily-text-input label="Name"></lily-text-input>') as unknown as TextInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "Grace";

        expect(input.value).toBe("Grace");
        expect(host.value).toBe("Grace");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-text-input label="Name" required disabled></lily-text-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through rest attributes such as placeholder", () => {
        const host = render('<lily-text-input label="Name" placeholder="e.g. Ada"></lily-text-input>');

        expect(host.querySelector("input")!.getAttribute("placeholder")).toBe("e.g. Ada");
    });
});
