import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("problem-record-list", () => {
    it("renders a ul named by its status, holding its items", () => {
        const { document } = render("problem-record-list", {
            status: "known",
            statusLabel: "Problems",
            html: '<li class="problem-record-list-item">One record</li>',
        });
        const list = document.querySelector("ul.problem-record-list");
        expect(list.getAttribute("aria-label")).toBe("Problems");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".problem-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    it.each([
        ["none-known", "No known problems (none-known)"],
        ["not-recorded", "No known problems (not-recorded)"],
        ["unavailable", "No known problems (unavailable)"],
        ["omitted", "No known problems (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        const { document } = render("problem-record-list", { status, statusLabel: words });
        const items = document.querySelectorAll("ul.problem-record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("problem-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
