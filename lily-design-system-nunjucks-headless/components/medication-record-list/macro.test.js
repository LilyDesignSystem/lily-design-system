import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("medication-record-list", () => {
    it("renders a ul named by its status, holding its items", () => {
        const { document } = render("medication-record-list", {
            status: "known",
            statusLabel: "Current medicines",
            html: '<li class="medication-record-list-item">One record</li>',
        });
        const list = document.querySelector("ul.medication-record-list");
        expect(list.getAttribute("aria-label")).toBe("Current medicines");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".medication-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    it.each([
        ["none-known", "No known medicines (none-known)"],
        ["not-recorded", "No known medicines (not-recorded)"],
        ["unavailable", "No known medicines (unavailable)"],
        ["omitted", "No known medicines (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        const { document } = render("medication-record-list", { status, statusLabel: words });
        const items = document.querySelectorAll("ul.medication-record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("medication-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
