import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { PasswordInput } from "./password-input.js";

if (!customElements.get("lily-password-input"))
    customElements.define("lily-password-input", PasswordInput);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("PasswordInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        document.body.innerHTML = '<lily-password-input label="Name"></lily-password-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.password-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("secret");
        expect(el.value).toBe("secret");
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML =
            '<lily-password-input label="Name" disabled></lily-password-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
