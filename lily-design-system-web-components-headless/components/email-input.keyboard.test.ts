import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { EmailInput } from "./email-input.js";

if (!customElements.get("lily-email-input")) customElements.define("lily-email-input", EmailInput);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("EmailInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        document.body.innerHTML = '<lily-email-input label="Name"></lily-email-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.email-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("a@b.org");
        expect(el.value).toBe("a@b.org");
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML = '<lily-email-input label="Name" disabled></lily-email-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
