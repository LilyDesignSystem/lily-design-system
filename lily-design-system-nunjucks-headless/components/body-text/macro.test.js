import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("body-text", () => {
    it("renders a <div> with the base class", () => {
        const { document } = render("body-text", {}, "content");
        expect(document.querySelector("div.body-text")).toBeTruthy();
    });

    it("never sets aria-label", () => {
        const { document } = render("body-text", { label: "Ignored" }, "x");
        expect(document.querySelector(".body-text").getAttribute("aria-label")).toBeNull();
    });

    it("renders the caller content", () => {
        const { document } = render("body-text", {}, "<span>hello</span>");
        expect(document.querySelector(".body-text span").textContent).toBe("hello");
    });
});
