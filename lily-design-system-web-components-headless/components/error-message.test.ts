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
    test("renders a span with role=alert (per the AGENTS.md metadata field)", () => {
        const host = render("<lily-error-message>Password is required</lily-error-message>");

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span.className).toBe("error-message");
        expect(span.tagName).toBe("SPAN");
        expect(span.getAttribute("role")).toBe("alert");
    });

    test("moves the error text into the span", () => {
        const host = render("<lily-error-message>Password is required</lily-error-message>");

        expect(host.querySelector("span")!.textContent).toBe("Password is required");
    });

    test("passes through rest attributes onto the span", () => {
        const host = render('<lily-error-message id="password-error">Password is required</lily-error-message>');

        expect(host.querySelector("span")!.id).toBe("password-error");
    });
});
