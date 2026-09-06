import { afterEach, describe, expect, test } from "vitest";

import { PasswordInput } from "./password-input.js";

if (!customElements.get("lily-password-input")) {
    customElements.define("lily-password-input", PasswordInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PasswordInput", () => {
    test("renders a native input type=password", () => {
        const host = render('<lily-password-input label="Password"></lily-password-input>');

        expect((host.querySelector("input") as HTMLInputElement).type).toBe("password");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-password-input label="Password"></lily-password-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Password");
    });

    test("defaults autocomplete to current-password", () => {
        const host = render('<lily-password-input label="Password"></lily-password-input>');

        expect((host.querySelector("input") as HTMLInputElement).autocomplete).toBe("current-password");
    });

    test("autocomplete can be overridden", () => {
        const host = render('<lily-password-input label="Password" autocomplete="new-password"></lily-password-input>');

        expect((host.querySelector("input") as HTMLInputElement).autocomplete).toBe("new-password");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render('<lily-password-input label="Password"></lily-password-input>') as unknown as PasswordInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "hunter2";

        expect(input.value).toBe("hunter2");
        expect(host.value).toBe("hunter2");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-password-input label="Password" required disabled></lily-password-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });
});
