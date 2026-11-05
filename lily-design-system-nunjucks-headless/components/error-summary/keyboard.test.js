// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("error-summary keyboard", () => {
    test("Tab reaches its links, and it can take focus itself", async () => {
        document.body.innerHTML = render("error-summary", {
            title: "There is a problem",
            errors: [{ text: "Enter your name", href: "#name" }],
        }).html;
        const user = userEvent.setup();
        await user.tab();
        const link = document.activeElement;
        expect(link.textContent).toBe("Enter your name");
        const root = link.closest(".error-summary");
        expect(root.getAttribute("role")).toBe("alert");
        expect(root.getAttribute("aria-labelledby")).toBe(root.querySelector("h2")?.id);
        expect(root.getAttribute("tabindex")).toBe("-1");
        root.focus();
        expect(document.activeElement).toBe(root);
    });
});
