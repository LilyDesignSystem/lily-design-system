import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./CheckboxGroup";

describe("CheckboxGroup keyboard", () => {
    test("Tab and Space work inside the named group", async () => {
        render(
            <Subject label="Toppings">
                <input
                    type="checkbox"
                    aria-label="Ham"
                />
                <input
                    type="checkbox"
                    aria-label="Egg"
                />
            </Subject>,
        );
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
