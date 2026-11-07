import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("emoji-character-picker", () => {
    it("renders a named <div role=group>, shown, holding the caller's buttons", () => {
        const { document } = render(
            "emoji-character-picker",
            { label: "Choose an emoji" },
            '<button type="button" aria-label="Grinning face">😀</button>',
        );
        const el = document.querySelector("div.emoji-character-picker");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Choose an emoji");
        expect(el.hasAttribute("hidden")).toBe(false);
        expect(el.querySelector('button[aria-label="Grinning face"]')).toBeTruthy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("emoji-character-picker", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
