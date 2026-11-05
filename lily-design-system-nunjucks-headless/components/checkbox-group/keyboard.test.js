// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("checkbox-group keyboard", () => {
    test("Tab and Space work inside the named group", async () => {
        document.body.innerHTML = render("checkbox-group", {
            label: "Toppings",
            html: '<input type="checkbox" aria-label="Ham" /><input type="checkbox" aria-label="Egg" />',
        }).html;
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement;
        expect(first.closest(".checkbox-group")?.getAttribute("aria-label")).toBe("Toppings");
        expect(first.closest(".checkbox-group")?.getAttribute("role")).toBe("group");
        await user.keyboard(" ");
        expect(first.checked).toBe(true);
        await user.tab();
        expect(document.activeElement?.getAttribute("aria-label")).toBe("Egg");
    });
});
