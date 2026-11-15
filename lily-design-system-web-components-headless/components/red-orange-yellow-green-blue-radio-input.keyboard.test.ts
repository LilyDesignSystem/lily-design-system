import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { RedOrangeYellowGreenBlueRadioInput } from "./red-orange-yellow-green-blue-radio-input.js";

if (!customElements.get("lily-red-orange-yellow-green-blue-radio-input"))
    customElements.define(
        "lily-red-orange-yellow-green-blue-radio-input",
        RedOrangeYellowGreenBlueRadioInput,
    );

afterEach(() => {
    document.body.innerHTML = "";
});

describe("RedOrangeYellowGreenBlueRadioInput keyboard", () => {
    test("Tab reaches it, and Space selects it", async () => {
        document.body.innerHTML =
            '<lily-red-orange-yellow-green-blue-radio-input label="Yes" name="choice"></lily-red-orange-yellow-green-blue-radio-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.red-orange-yellow-green-blue-radio-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Yes");
        expect(el.checked).toBe(false);
        await user.keyboard(" ");
        expect(el.checked).toBe(true);
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML =
            '<lily-red-orange-yellow-green-blue-radio-input label="Yes" name="choice" disabled></lily-red-orange-yellow-green-blue-radio-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
