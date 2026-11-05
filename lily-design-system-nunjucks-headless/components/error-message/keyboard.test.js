// @vitest-environment jsdom
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("error-message keyboard", () => {
    test("is announced as an alert", async () => {
        document.body.innerHTML = render("error-message", { text: "Enter your name" }).html;

        expect(document.querySelector(".error-message")?.getAttribute("role")).toBe("alert");
    });
});
