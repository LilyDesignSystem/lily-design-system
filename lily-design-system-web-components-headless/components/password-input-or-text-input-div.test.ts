import { afterEach, describe, expect, test } from "vitest";

import { PasswordInputOrTextInputDiv } from "./password-input-or-text-input-div.js";

if (!customElements.get("lily-password-input-or-text-input-div")) {
    customElements.define("lily-password-input-or-text-input-div", PasswordInputOrTextInputDiv);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PasswordInputOrTextInputDiv", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render('<lily-password-input-or-text-input-div label="Password"></lily-password-input-or-text-input-div>');

        expect(host.className).toBe("password-input-or-text-input-div");
    });

    test("renders a password input with autocomplete=current-password and aria-label", () => {
        const host = render('<lily-password-input-or-text-input-div label="Password"></lily-password-input-or-text-input-div>');
        const input = host.querySelector("input") as HTMLInputElement;

        expect(input.type).toBe("password");
        expect(input.autocomplete).toBe("current-password");
        expect(input.getAttribute("aria-label")).toBe("Password");
    });

    test("renders a toggle button by default with aria-pressed=false", () => {
        const host = render('<lily-password-input-or-text-input-div label="Password"></lily-password-input-or-text-input-div>');
        const toggle = host.querySelector("button") as HTMLButtonElement;

        expect(toggle).not.toBeNull();
        expect(toggle.type).toBe("button");
        expect(toggle.getAttribute("aria-pressed")).toBe("false");
    });

    test("toggleLabel defaults to Show password and is the toggle's accessible name and text", () => {
        const host = render('<lily-password-input-or-text-input-div label="Password"></lily-password-input-or-text-input-div>');
        const toggle = host.querySelector("button") as HTMLButtonElement;

        expect(toggle.getAttribute("aria-label")).toBe("Show password");
        expect(toggle.textContent).toBe("Show password");
    });

    test("show-toggle=false omits the toggle button", () => {
        const host = render('<lily-password-input-or-text-input-div label="Password" show-toggle="false"></lily-password-input-or-text-input-div>');

        expect(host.querySelector("button")).toBeNull();
    });

    test("clicking the toggle switches the input type to text and sets aria-pressed=true", () => {
        const host = render('<lily-password-input-or-text-input-div label="Password"></lily-password-input-or-text-input-div>');
        const input = host.querySelector("input") as HTMLInputElement;
        const toggle = host.querySelector("button") as HTMLButtonElement;

        toggle.click();

        expect(input.type).toBe("text");
        expect(toggle.getAttribute("aria-pressed")).toBe("true");

        toggle.click();

        expect(input.type).toBe("password");
        expect(toggle.getAttribute("aria-pressed")).toBe("false");
    });

    test("required and disabled propagate to the input", () => {
        const host = render('<lily-password-input-or-text-input-div label="Password" required disabled></lily-password-input-or-text-input-div>');
        const input = host.querySelector("input") as HTMLInputElement;

        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render(
            '<lily-password-input-or-text-input-div label="Password" value="s3cr3t"></lily-password-input-or-text-input-div>',
        ) as unknown as PasswordInputOrTextInputDiv;

        expect(host.value).toBe("s3cr3t");
        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-password-input-or-text-input-div label="Password" class="extra"></lily-password-input-or-text-input-div>');

        expect(host.className).toBe("password-input-or-text-input-div extra");
    });
});
