import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { RedAmberGreenRadioInput } from "./red-amber-green-radio-input.js";

if (!customElements.get("lily-red-amber-green-radio-input"))
    customElements.define("lily-red-amber-green-radio-input", RedAmberGreenRadioInput);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("RedAmberGreenRadioInput keyboard", () => {
    test("Tab reaches it, and Space selects it", async () => {
        document.body.innerHTML =
            '<lily-red-amber-green-radio-input label="Yes" name="choice"></lily-red-amber-green-radio-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.red-amber-green-radio-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Yes");
        expect(el.checked).toBe(false);
        await user.keyboard(" ");
        expect(el.checked).toBe(true);
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML =
            '<lily-red-amber-green-radio-input label="Yes" name="choice" disabled></lily-red-amber-green-radio-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
