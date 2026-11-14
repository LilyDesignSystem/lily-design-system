import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("immunization-record-list", () => {
    it("renders a ul named by its status, holding its items", () => {
        const { document } = render("immunization-record-list", {
            status: "known",
            statusLabel: "Immunizations",
            html: '<li class="immunization-record-list-item">One record</li>',
        });
        const list = document.querySelector("ul.immunization-record-list");
        expect(list.getAttribute("aria-label")).toBe("Immunizations");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".immunization-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    it.each([
        ["none-known", "No immunizations recorded (none-known)"],
        ["not-recorded", "No immunizations recorded (not-recorded)"],
        ["unavailable", "No immunizations recorded (unavailable)"],
        ["omitted", "No immunizations recorded (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        const { document } = render("immunization-record-list", { status, statusLabel: words });
        const items = document.querySelectorAll("ul.immunization-record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("immunization-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
