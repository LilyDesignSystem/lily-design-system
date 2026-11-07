import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("horizontal-scroller", () => {
    it("renders a <div> with the base class", () => {
        const { document } = render("horizontal-scroller", { label: "Test" }, "content");
        expect(document.querySelector("div.horizontal-scroller")).toBeTruthy();
    });

    it("applies role='region'", () => {
        const { document } = render("horizontal-scroller", { label: "Test" }, "content");
        expect(document.querySelector(".horizontal-scroller").getAttribute("role")).toBe("region");
    });

    it("applies aria-label from label param", () => {
        const { document } = render("horizontal-scroller", { label: "Hello" }, "x");
        expect(document.querySelector(".horizontal-scroller").getAttribute("aria-label")).toBe(
            "Hello",
        );
    });

    it("renders the caller content", () => {
        const { document } = render("horizontal-scroller", { label: "Test" }, "<span>hello</span>");
        expect(document.querySelector(".horizontal-scroller span").textContent).toBe("hello");
    });
});

describe("horizontal-scroller keys", () => {
    it("scrolls on the arrows and goes to the ends", () => {
        const { document } = render(
            "horizontal-scroller",
            { label: "Gallery", attributes: { "data-step": 40 } },
            "x",
        );
        const root = document.querySelector(".horizontal-scroller");
        const calls = [];
        root.scrollBy = ({ left }) => calls.push(["by", left]);
        root.scrollTo = ({ left }) => calls.push(["to", left]);
        autoInit(document);
        on(root).press("ArrowRight");
        on(root).press("ArrowLeft");
        on(root).press("Home");
        expect(calls).toEqual([
            ["by", 40],
            ["by", -40],
            ["to", 0],
        ]);
    });
});
