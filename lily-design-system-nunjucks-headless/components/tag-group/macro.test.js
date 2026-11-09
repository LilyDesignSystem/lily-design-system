import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tag-group", () => {
    it("renders a <div role=group> named by label, as Svelte", () => {
        const { document } = render(
            "tag-group",
            { label: "Statuses" },
            '<strong class="tag">Verified</strong>',
        );
        const el = document.querySelector("div.tag-group");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Statuses");
        expect(el.querySelector(".tag").textContent).toBe("Verified");
    });

    it("prefers labelledBy over label", () => {
        const el = render("tag-group", { label: "A", labelledBy: "h" }).document.querySelector(
            ".tag-group",
        );
        expect(el.getAttribute("aria-labelledby")).toBe("h");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("tag-group", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
