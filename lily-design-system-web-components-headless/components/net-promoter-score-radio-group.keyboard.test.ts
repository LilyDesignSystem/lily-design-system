import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { NetPromoterScoreRadioGroup } from "./net-promoter-score-radio-group.js";

if (!customElements.get("lily-net-promoter-score-radio-group"))
    customElements.define("lily-net-promoter-score-radio-group", NetPromoterScoreRadioGroup);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("NetPromoterScoreRadioGroup keyboard", () => {
    test("arrows walk the radios inside the named group", async () => {
        document.body.innerHTML =
            '<lily-net-promoter-score-radio-group label="Size"><input type="radio" name="size" aria-label="S" /><input type="radio" name="size" aria-label="M" /></lily-net-promoter-score-radio-group>';
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(first.closest(".net-promoter-score-radio-group")?.getAttribute("aria-label")).toBe(
            "Size",
        );
        expect(first.closest(".net-promoter-score-radio-group")?.getAttribute("role")).toBe(
            "radiogroup",
        );
        await user.keyboard("{ArrowDown}");
        const next = document.activeElement as HTMLInputElement;
        expect(next.getAttribute("aria-label")).toBe("M");
        expect(next.checked).toBe(true);
    });
});
