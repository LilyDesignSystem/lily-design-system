import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { NetPromoterScorePicker } from "./net-promoter-score-picker.js";

if (!customElements.get("lily-net-promoter-score-picker"))
    customElements.define("lily-net-promoter-score-picker", NetPromoterScorePicker);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("NetPromoterScorePicker keyboard", () => {
    test("arrows walk the scores inside the named radio group", async () => {
        document.body.innerHTML =
            '<lily-net-promoter-score-picker label="Score" name="nps"><input type="radio" name="nps" aria-label="0" /><input type="radio" name="nps" aria-label="1" /></lily-net-promoter-score-picker>';
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(first.closest('[role="radiogroup"]')?.getAttribute("aria-label")).toBe("Score");
        expect(first.getAttribute("aria-label")).toBe("0");
        await user.keyboard("{ArrowRight}");
        const next = document.activeElement as HTMLInputElement;
        expect(next.getAttribute("aria-label")).toBe("1");
        expect(next.checked).toBe(true);
    });
});
