import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("allergy-record-list", () => {
    it("renders a ul named by its status, holding its items", () => {
        const { document } = render("allergy-record-list", {
            status: "known",
            statusLabel: "Known allergies",
            html: '<li class="allergy-record-list-item">One record</li>',
        });
        const list = document.querySelector("ul.allergy-record-list");
        expect(list.getAttribute("aria-label")).toBe("Known allergies");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".allergy-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    it.each([
        ["none-known", "No known allergies (none-known)"],
        ["not-recorded", "No known allergies (not-recorded)"],
        ["unavailable", "No known allergies (unavailable)"],
        ["omitted", "No known allergies (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        const { document } = render("allergy-record-list", { status, statusLabel: words });
        const items = document.querySelectorAll("ul.allergy-record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("allergy-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
