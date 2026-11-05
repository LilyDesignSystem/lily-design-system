import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { ErrorMessage } from "./error-message.js";

if (!customElements.get("lily-error-message"))
    customElements.define("lily-error-message", ErrorMessage);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("ErrorMessage keyboard", () => {
    test("is announced as an alert", async () => {
        document.body.innerHTML =
            '<lily-error-message label="Error">Enter your name</lily-error-message>';

        expect(document.querySelector(".error-message")?.getAttribute("role")).toBe("alert");
    });
});
