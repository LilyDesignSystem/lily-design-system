import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { TextInput } from "./text-input.js";

if (!customElements.get("lily-text-input")) customElements.define("lily-text-input", TextInput);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("TextInput keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        document.body.innerHTML = '<lily-text-input label="Name"></lily-text-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.text-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("Ada");
        expect(el.value).toBe("Ada");
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML = '<lily-text-input label="Name" disabled></lily-text-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
