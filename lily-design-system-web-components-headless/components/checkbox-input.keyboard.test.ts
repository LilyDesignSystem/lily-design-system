import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { CheckboxInput } from "./checkbox-input.js";

if (!customElements.get("lily-checkbox-input"))
    customElements.define("lily-checkbox-input", CheckboxInput);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("CheckboxInput keyboard", () => {
    test("Tab reaches it, and Space toggles it", async () => {
        document.body.innerHTML = '<lily-checkbox-input label="Agree"></lily-checkbox-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.checkbox-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Agree");
        expect(el.checked).toBe(false);
        await user.keyboard(" ");
        expect(el.checked).toBe(true);
        await user.keyboard(" ");
        expect(el.checked).toBe(false);
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML =
            '<lily-checkbox-input label="Agree" disabled></lily-checkbox-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
