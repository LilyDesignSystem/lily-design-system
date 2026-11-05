import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { CheckboxGroup } from "./checkbox-group.js";

if (!customElements.get("lily-checkbox-group"))
    customElements.define("lily-checkbox-group", CheckboxGroup);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("CheckboxGroup keyboard", () => {
    test("Tab and Space work inside the named group", async () => {
        document.body.innerHTML =
            '<lily-checkbox-group label="Toppings"><input type="checkbox" aria-label="Ham" /><input type="checkbox" aria-label="Egg" /></lily-checkbox-group>';
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(first.closest(".checkbox-group")?.getAttribute("aria-label")).toBe("Toppings");
        expect(first.closest(".checkbox-group")?.getAttribute("role")).toBe("group");
        await user.keyboard(" ");
        expect(first.checked).toBe(true);
        await user.tab();
        expect(document.activeElement?.getAttribute("aria-label")).toBe("Egg");
    });
});
