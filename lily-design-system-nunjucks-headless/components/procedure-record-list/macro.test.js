import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("procedure-record-list", () => {
    it("renders a ul named by its status, holding its items", () => {
        const { document } = render("procedure-record-list", {
            status: "known",
            statusLabel: "Procedures",
            html: '<li class="procedure-record-list-item">One record</li>',
        });
        const list = document.querySelector("ul.procedure-record-list");
        expect(list.getAttribute("aria-label")).toBe("Procedures");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".procedure-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    it.each([
        ["none-known", "No known procedures (none-known)"],
        ["not-recorded", "No known procedures (not-recorded)"],
        ["unavailable", "No known procedures (unavailable)"],
        ["omitted", "No known procedures (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        const { document } = render("procedure-record-list", { status, statusLabel: words });
        const items = document.querySelectorAll("ul.procedure-record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("procedure-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
