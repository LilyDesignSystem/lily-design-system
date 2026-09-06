import { afterEach, describe, expect, test } from "vitest";

import { CheckboxInput } from "./checkbox-input.js";

if (!customElements.get("lily-checkbox-input")) {
    customElements.define("lily-checkbox-input", CheckboxInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CheckboxInput", () => {
    test("renders a native input type=checkbox with the base class", () => {
        const host = render('<lily-checkbox-input label="Subscribe"></lily-checkbox-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("checkbox");
        expect(input.classList.contains("checkbox-input")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-checkbox-input label="Subscribe"></lily-checkbox-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Subscribe");
    });

    test("checked attribute seeds the initial checked state", () => {
        const host = render('<lily-checkbox-input label="Subscribe" checked></lily-checkbox-input>');

        expect((host.querySelector("input") as HTMLInputElement).checked).toBe(true);
    });

    test("exposes a live checked property proxying the inner input", () => {
        const host = render('<lily-checkbox-input label="Subscribe"></lily-checkbox-input>') as unknown as CheckboxInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.checked = true;

        expect(input.checked).toBe(true);
        expect(host.checked).toBe(true);
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-checkbox-input label="Subscribe" required disabled></lily-checkbox-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through rest attributes such as name and value", () => {
        const host = render('<lily-checkbox-input label="Subscribe" name="ch" value="email"></lily-checkbox-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.getAttribute("name")).toBe("ch");
        expect(input.getAttribute("value")).toBe("email");
    });
});
