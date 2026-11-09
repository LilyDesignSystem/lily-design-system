import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";

describe("expander", () => {
    it("renders a <div> with a button controlling a hidden region, as Svelte", () => {
        const { document } = render("expander", {
            id: "x",
            label: "More about fees",
            text: "Body",
        });
        const root = document.querySelector("div.expander");
        const button = root.querySelector("button.expander-button");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(button.textContent).toBe("More about fees");
        const region = document.getElementById(button.getAttribute("aria-controls"));
        expect(region.getAttribute("role")).toBe("region");
        expect(region.getAttribute("aria-label")).toBe("More about fees");
        expect(region.hidden).toBe(true);
        expect(region.textContent).toBe("Body");
    });

    it("has no English default text", () => {
        const { document } = render("expander", { id: "x" });
        expect(document.querySelector(".expander-button").textContent).toBe("");
    });

    it("starts open when expanded", () => {
        const { document } = render("expander", { id: "x", label: "L", expanded: true });
        expect(document.querySelector(".expander-button").getAttribute("aria-expanded")).toBe(
            "true",
        );
        expect(document.querySelector(".expander-content").hidden).toBe(false);
    });

    it("the button toggles the region", () => {
        const { document } = render("expander", { id: "x", label: "L" });
        autoInit(document);
        const button = document.querySelector(".expander-button");
        button.click();
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(document.querySelector(".expander-content").hidden).toBe(false);
        button.click();
        expect(document.querySelector(".expander-content").hidden).toBe(true);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("expander", { id: "x", label: "L" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
