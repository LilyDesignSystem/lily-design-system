import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { ColorRadioGroup } from "./color-radio-group.js";

if (!customElements.get("lily-color-radio-group"))
    customElements.define("lily-color-radio-group", ColorRadioGroup);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("ColorRadioGroup keyboard", () => {
    test("arrows walk the radios inside the named group", async () => {
        document.body.innerHTML =
            '<lily-color-radio-group label="Size"><input type="radio" name="size" aria-label="S" /><input type="radio" name="size" aria-label="M" /></lily-color-radio-group>';
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(first.closest(".color-radio-group")?.getAttribute("aria-label")).toBe("Size");
        expect(first.closest(".color-radio-group")?.getAttribute("role")).toBe("radiogroup");
        await user.keyboard("{ArrowDown}");
        const next = document.activeElement as HTMLInputElement;
        expect(next.getAttribute("aria-label")).toBe("M");
        expect(next.checked).toBe(true);
    });
});
