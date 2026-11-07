// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("navigation-menu", () => {
    it("renders a <nav> with no English aria-label", () => {
        const { document } = render("navigation-menu", {});
        const el = document.querySelector("nav.navigation-menu");
        expect(el).toBeTruthy();
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("navigation-menu", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("overflow unset renders as before: no list, no More, no data-overflow", () => {
        const { document } = render("navigation-menu", { html: "<a href='/'>Home</a>" });
        expect(document.querySelector(".navigation-menu-list")).toBeNull();
        expect(document.querySelector(".navigation-menu-more")).toBeNull();
        expect(document.querySelector("nav").hasAttribute("data-overflow")).toBe(false);
    });

    it("overflow renders the list, a hidden More item and the consumer's moreLabel", () => {
        const { document } = render("navigation-menu", {
            overflow: true,
            moreLabel: "Mwy",
            html: "<li><a href='/'>Home</a></li><li><a href='/b' aria-current='page'>B</a></li>",
        });
        const nav = document.querySelector("nav.navigation-menu");
        expect(nav.getAttribute("data-overflow")).toBe("true");
        const list = nav.querySelector("ul.navigation-menu-list");
        expect(list.children.length).toBe(3);
        const more = list.querySelector("li.navigation-menu-more");
        expect(more.hasAttribute("hidden")).toBe(true);
        const button = more.querySelector("button.navigation-menu-more-button");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(button.textContent).toBe("Mwy");
        expect(more.querySelector("ul.navigation-menu-more-list").hasAttribute("hidden")).toBe(
            true,
        );
        expect(list.querySelector("[aria-current=page]")).toBeTruthy();
    });

    it("overflow renders no English: without moreLabel the button text is empty", () => {
        const { document } = render("navigation-menu", { overflow: true, html: "<li>x</li>" });
        expect(document.querySelector(".navigation-menu-more-button").textContent).toBe("");
    });
});

describe("navigation-menu keys", () => {
    it("overflow: Escape closes the More list and returns to its button", () => {
        const { document } = render(
            "navigation-menu",
            { label: "Main", overflow: true, moreLabel: "More" },
            '<li><a href="/a">A</a></li>',
        );
        autoInit(document);
        document.querySelector(".navigation-menu-more").hidden = false;
        const button = document.querySelector(".navigation-menu-more-button");
        const list = document.querySelector(".navigation-menu-more-list");
        button.click();
        expect(list.hidden).toBe(false);
        on(button).press("Escape");
        expect(list.hidden).toBe(true);
        expect(document.activeElement).toBe(button);
    });
});
