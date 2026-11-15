import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { ColorRadioInput } from "./color-radio-input.js";

if (!customElements.get("lily-color-radio-input"))
    customElements.define("lily-color-radio-input", ColorRadioInput);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("ColorRadioInput keyboard", () => {
    test("Tab reaches it, and Space selects it", async () => {
        document.body.innerHTML =
            '<lily-color-radio-input label="Yes" name="choice"></lily-color-radio-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.color-radio-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Yes");
        expect(el.checked).toBe(false);
        await user.keyboard(" ");
        expect(el.checked).toBe(true);
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML =
            '<lily-color-radio-input label="Yes" name="choice" disabled></lily-color-radio-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
