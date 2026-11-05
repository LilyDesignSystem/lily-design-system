// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("email-input keyboard", () => {
    test("Tab reaches it, and typing fills it", async () => {
        document.body.innerHTML = render("email-input", { label: "Name" }).html;
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement;
        expect(el.matches("input.email-input")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("Name");
        await user.keyboard("a@b.org");
        expect(el.value).toBe("a@b.org");
    });

    test("Tab skips it when disabled", async () => {
        document.body.innerHTML = render("email-input", { label: "Name", disabled: true }).html;
        const user = userEvent.setup();
        await user.tab();
        expect(document.activeElement).toBe(document.body);
    });
});
