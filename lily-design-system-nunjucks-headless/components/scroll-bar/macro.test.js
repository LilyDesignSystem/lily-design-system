import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("scroll-bar", () => {
    it("renders a <div role=scrollbar>", () => {
        const { document } = render("scroll-bar", { value: 25 });
        const el = document.querySelector("div.scroll-bar");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("scrollbar");
        expect(el.getAttribute("aria-valuenow")).toBe("25");
        expect(el.getAttribute("aria-orientation")).toBe("vertical");
    });

    it("takes its accessible name and range from params", () => {
        const { document } = render("scroll-bar", {
            label: "Chat scroll",
            min: -20,
            max: 150,
            controls: "messages",
        });
        const el = document.querySelector("div.scroll-bar");
        expect(el.getAttribute("aria-label")).toBe("Chat scroll");
        expect(el.getAttribute("aria-valuemin")).toBe("-20");
        expect(el.getAttribute("aria-valuemax")).toBe("150");
        expect(el.getAttribute("aria-controls")).toBe("messages");
        expect(el.getAttribute("tabindex")).toBe("0");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("scroll-bar", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("scroll-bar keys", () => {
    it("moves aria-valuenow, and stays in range", () => {
        const { document } = render("scroll-bar", {
            label: "Scroll",
            value: 50,
            step: 5,
            pageStep: 20,
        });
        autoInit(document);
        const bar = document.querySelector(".scroll-bar");
        const seen = [];
        bar.addEventListener("change", (event) => seen.push(event.detail.value));
        on(bar).press("ArrowDown");
        on(bar).press("PageUp");
        on(bar).press("Home");
        on(bar).press("ArrowUp");
        on(bar).press("End");
        expect(seen).toEqual([55, 35, 0, 0, 100]);
    });
});
