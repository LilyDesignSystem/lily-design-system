// @vitest-environment jsdom
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("accordion-nav keyboard", () => {
    test("is a named navigation landmark", async () => {
        document.body.innerHTML = render("accordion-nav", {
            label: "Sections",
            html: "Content",
        }).html;

        const el = document.querySelector("nav.accordion-nav");
        expect(el?.hasAttribute("role")).toBe(false);
        expect(el?.getAttribute("aria-label")).toBe("Sections");
    });
});
