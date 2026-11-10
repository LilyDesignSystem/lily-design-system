import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("select-with-extras", () => {
    it("renders a <div> holding a named <select>, as Svelte", () => {
        const { document } = render(
            "select-with-extras",
            { id: "c", name: "country", label: "Country" },
            '<option value="fr">France</option>',
        );
        const root = document.querySelector("div.select-with-extras");
        expect(root.dataset.module).toBe("select-with-extras");
        const select = root.querySelector("select");
        expect(select.getAttribute("id")).toBe("c");
        expect(select.getAttribute("name")).toBe("country");
        expect(select.getAttribute("aria-label")).toBe("Country");
        expect(select.querySelector("option").textContent).toBe("France");
    });

    it("renders before and after around the select", () => {
        const { document } = render("select-with-extras", {
            before: '<span class="b">B</span>',
            after: '<span class="a">A</span>',
        });
        const root = document.querySelector(".select-with-extras");
        expect(root.firstElementChild.className).toBe("b");
        expect(root.lastElementChild.className).toBe("a");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("select-with-extras", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
