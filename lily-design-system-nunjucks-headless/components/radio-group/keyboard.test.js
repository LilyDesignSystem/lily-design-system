// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("radio-group keyboard", () => {
    test("arrows walk the radios inside the named group", async () => {
        document.body.innerHTML = render("radio-group", {
            label: "Size",
            html: '<input type="radio" name="size" aria-label="S" /><input type="radio" name="size" aria-label="M" />',
        }).html;
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement;
        expect(first.closest(".radio-group")?.getAttribute("aria-label")).toBe("Size");
        expect(first.closest(".radio-group")?.getAttribute("role")).toBe("radiogroup");
        await user.keyboard("{ArrowDown}");
        const next = document.activeElement;
        expect(next.getAttribute("aria-label")).toBe("M");
        expect(next.checked).toBe(true);
    });
});
