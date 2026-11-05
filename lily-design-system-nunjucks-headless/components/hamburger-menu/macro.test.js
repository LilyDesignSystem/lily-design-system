// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { initHamburgerMenu } from "./hamburger-menu.js";

const params = { id: "site", label: "Main menu", html: '<a href="/">Home</a>' };

describe("hamburger-menu", () => {
    it("renders a <div> holding the button and the navigation", () => {
        const { document } = render("hamburger-menu", params);
        expect(
            document.querySelector("div.hamburger-menu > button.hamburger-menu-button"),
        ).toBeTruthy();
        expect(
            document.querySelector("div.hamburger-menu > nav.hamburger-menu-nav a"),
        ).toBeTruthy();
    });

    it("names both and links them", () => {
        const { document } = render("hamburger-menu", params);
        const button = document.querySelector("button");
        const nav = document.querySelector("nav");
        expect(button.getAttribute("aria-label")).toBe("Main menu");
        expect(nav.getAttribute("aria-label")).toBe("Main menu");
        expect(nav.id).toBe("site-nav");
        expect(button.getAttribute("aria-controls")).toBe("site-nav");
    });

    it("has no English of its own", () => {
        const { document } = render("hamburger-menu", {});
        expect(document.querySelector("button").hasAttribute("aria-label")).toBe(false);
    });

    it("takes navId, and starts closed by default", () => {
        const { document } = render("hamburger-menu", { navId: "menu-a" });
        const button = document.querySelector("button");
        expect(button.getAttribute("aria-controls")).toBe("menu-a");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(document.querySelector("#menu-a").hasAttribute("hidden")).toBe(true);
    });

    it("starts open when open", () => {
        const { document } = render("hamburger-menu", { open: true });
        expect(document.querySelector("button").getAttribute("aria-expanded")).toBe("true");
        expect(document.querySelector("nav").hasAttribute("hidden")).toBe(false);
    });

    it("hamburger-menu.js toggles the navigation", () => {
        document.body.innerHTML = render("hamburger-menu", params).html;
        const unwire = initHamburgerMenu(document.querySelector(".hamburger-menu"));
        const button = document.querySelector("button");
        const nav = document.querySelector("nav");
        button.click();
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(nav.hidden).toBe(false);
        button.click();
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(nav.hidden).toBe(true);
        unwire();
        button.click();
        expect(nav.hidden).toBe(true);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("hamburger-menu", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
