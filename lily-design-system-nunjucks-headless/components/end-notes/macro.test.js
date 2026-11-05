import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("end-notes", () => {
    it("renders a <section> with the base class", () => {
        const { document } = render("end-notes", {}, "content");
        expect(document.querySelector("section.end-notes")).toBeTruthy();
    });

    it("has no English aria-label of its own", () => {
        const { document } = render("end-notes", {}, "x");
        expect(document.querySelector(".end-notes").hasAttribute("aria-label")).toBe(false);
    });

    it("aria-label can be overridden", () => {
        const { document } = render("end-notes", { label: "Other" }, "x");
        expect(document.querySelector(".end-notes").getAttribute("aria-label")).toBe("Other");
    });

    it("renders the caller content", () => {
        const { document } = render("end-notes", {}, "<span>hello</span>");
        expect(document.querySelector(".end-notes span").textContent).toBe("hello");
    });
});
