import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { NetPromoterScoreRadioInput } from "./net-promoter-score-radio-input.js";

if (!customElements.get("lily-net-promoter-score-radio-input"))
    customElements.define("lily-net-promoter-score-radio-input", NetPromoterScoreRadioInput);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("NetPromoterScoreRadioInput keyboard", () => {
    test("Tab reaches it, and Space selects it", async () => {
        document.body.innerHTML =
            '<lily-net-promoter-score-radio-input label="Yes" name="choice"></lily-net-promoter-score-radio-input>';
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLInputElement;
        expect(el.matches("input.net-promoter-score-radio-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Yes");
        expect(el.checked).toBe(false);
        await user.keyboard(" ");
        expect(el.checked).toBe(true);
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML =
            '<lily-net-promoter-score-radio-input label="Yes" name="choice" disabled></lily-net-promoter-score-radio-input>';
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
