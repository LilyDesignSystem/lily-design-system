import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { RedOrangeYellowGreenBlueRadioGroup } from "./red-orange-yellow-green-blue-radio-group.js";

if (!customElements.get("lily-red-orange-yellow-green-blue-radio-group"))
    customElements.define(
        "lily-red-orange-yellow-green-blue-radio-group",
        RedOrangeYellowGreenBlueRadioGroup,
    );

afterEach(() => {
    document.body.innerHTML = "";
});

describe("RedOrangeYellowGreenBlueRadioGroup keyboard", () => {
    test("arrows walk the radios inside the named group", async () => {
        document.body.innerHTML =
            '<lily-red-orange-yellow-green-blue-radio-group label="Size"><input type="radio" name="size" aria-label="S" /><input type="radio" name="size" aria-label="M" /></lily-red-orange-yellow-green-blue-radio-group>';
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(
            first.closest(".red-orange-yellow-green-blue-radio-group")?.getAttribute("aria-label"),
        ).toBe("Size");
        expect(
            first.closest(".red-orange-yellow-green-blue-radio-group")?.getAttribute("role"),
        ).toBe("radiogroup");
        await user.keyboard("{ArrowDown}");
        const next = document.activeElement as HTMLInputElement;
        expect(next.getAttribute("aria-label")).toBe("M");
        expect(next.checked).toBe(true);
    });
});
