// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("checkbox-input keyboard", () => {
    test("Tab reaches it, and Space toggles it", async () => {
        document.body.innerHTML = render("checkbox-input", { label: "Agree" }).html;
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement;
        expect(el.matches("input.checkbox-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Agree");
        expect(el.checked).toBe(false);
        await user.keyboard(" ");
        expect(el.checked).toBe(true);
        await user.keyboard(" ");
        expect(el.checked).toBe(false);
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML = render("checkbox-input", { label: "Agree", disabled: true }).html;
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
