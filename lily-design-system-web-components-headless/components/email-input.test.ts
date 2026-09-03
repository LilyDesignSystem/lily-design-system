import { afterEach, describe, expect, test } from "vitest";

import { EmailInput } from "./email-input.js";

if (!customElements.get("lily-email-input")) {
    customElements.define("lily-email-input", EmailInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EmailInput", () => {
    test("renders a native input type=email", () => {
        const host = render('<lily-email-input label="Email"></lily-email-input>');

        expect((host.querySelector("input") as HTMLInputElement).type).toBe("email");
    });

    test("does not set autocomplete", () => {
        const host = render('<lily-email-input label="Email"></lily-email-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBeNull();
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-email-input label="Email" value="a@example.com"></lily-email-input>') as unknown as EmailInput;

        expect(host.value).toBe("a@example.com");

        host.value = "b@example.com";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("b@example.com");
    });

    test("required and disabled propagate", () => {
        const host = render('<lily-email-input label="Email" required disabled></lily-email-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-email-input label="Email address"></lily-email-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Email address");
    });
});
