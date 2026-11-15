import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { RedAmberGreenRadioGroup } from "./red-amber-green-radio-group.js";

if (!customElements.get("lily-red-amber-green-radio-group"))
    customElements.define("lily-red-amber-green-radio-group", RedAmberGreenRadioGroup);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("RedAmberGreenRadioGroup keyboard", () => {
    test("arrows walk the radios inside the named group", async () => {
        document.body.innerHTML =
            '<lily-red-amber-green-radio-group label="Size"><input type="radio" name="size" aria-label="S" /><input type="radio" name="size" aria-label="M" /></lily-red-amber-green-radio-group>';
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(first.closest(".red-amber-green-radio-group")?.getAttribute("aria-label")).toBe(
            "Size",
        );
        expect(first.closest(".red-amber-green-radio-group")?.getAttribute("role")).toBe(
            "radiogroup",
        );
        await user.keyboard("{ArrowDown}");
        const next = document.activeElement as HTMLInputElement;
        expect(next.getAttribute("aria-label")).toBe("M");
        expect(next.checked).toBe(true);
    });
});
