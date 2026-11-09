import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("call-to-action", () => {
    it("renders a link when href is given", () => {
        const { document } = render("call-to-action", { href: "/signup", text: "Sign up now" });
        const el = document.querySelector(".call-to-action");
        expect(el.tagName).toBe("A");
        expect(el.getAttribute("href")).toBe("/signup");
        expect(el.textContent.trim()).toBe("Sign up now");
        expect(el.hasAttribute("role")).toBe(false);
    });

    it("renders a type=button button otherwise, which can be disabled", () => {
        const { document } = render("call-to-action", { text: "Start", disabled: true });
        const el = document.querySelector(".call-to-action");
        expect(el.tagName).toBe("BUTTON");
        expect(el.getAttribute("type")).toBe("button");
        expect(el.hasAttribute("disabled")).toBe(true);
    });

    it("sets aria-label only when a label is given", () => {
        const plain = render("call-to-action", { href: "/a", text: "Go" }).document;
        expect(plain.querySelector(".call-to-action").hasAttribute("aria-label")).toBe(false);
        const named = render("call-to-action", {
            href: "/a",
            text: "Go",
            label: "Go to the shop",
        }).document;
        expect(named.querySelector(".call-to-action").getAttribute("aria-label")).toBe(
            "Go to the shop",
        );
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("call-to-action", { text: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
