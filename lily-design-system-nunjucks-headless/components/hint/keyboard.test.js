// @vitest-environment jsdom
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("hint keyboard", () => {
    test("aria-describedby can point a control at it", async () => {
        document.body.innerHTML = render("hint", {
            id: "name-hint",
            text: "Use your full name",
        }).html;

        document.body.insertAdjacentHTML("beforeend", '<input aria-describedby="name-hint" />');
        const input = document.querySelector("[aria-describedby]");
        const target = document.getElementById(input?.getAttribute("aria-describedby") ?? "");
        expect(target?.textContent).toContain("Use your full name");
    });
});
