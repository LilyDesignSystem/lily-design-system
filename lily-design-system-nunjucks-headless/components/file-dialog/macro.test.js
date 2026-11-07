import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("file-dialog", () => {
    it("renders a closed <dialog> by default", () => {
        const { document } = render("file-dialog", { label: "X" });
        const el = document.querySelector("dialog.file-dialog");
        expect(el).toBeTruthy();
        expect(el.hasAttribute("open")).toBe(false);
    });

    it("is open when open", () => {
        const { document } = render("file-dialog", { label: "X", open: true });
        expect(document.querySelector("dialog").hasAttribute("open")).toBe(true);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("file-dialog", { label: "X" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
