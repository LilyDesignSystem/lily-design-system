import { afterEach, describe, expect, test } from "vitest";

import { ErrorMessage } from "./error-message.js";

if (!customElements.get("lily-error-message")) {
    customElements.define("lily-error-message", ErrorMessage);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ErrorMessage", () => {
    test("renders a p with role=alert, as Svelte", () => {
        const host = render("<lily-error-message>Password is required</lily-error-message>");

        const span = host.querySelector("p") as HTMLParagraphElement;
        expect(span.className).toBe("error-message");
        expect(span.tagName).toBe("P");
        expect(span.getAttribute("role")).toBe("alert");
    });

    test("moves the error text into the p", () => {
        const host = render("<lily-error-message>Password is required</lily-error-message>");

        expect(host.querySelector("p")!.textContent).toBe("Password is required");
    });

    test("passes through rest attributes onto the p", () => {
        const host = render(
            '<lily-error-message id="password-error">Password is required</lily-error-message>',
        );

        expect(host.querySelector("p")!.id).toBe("password-error");
    });
});
