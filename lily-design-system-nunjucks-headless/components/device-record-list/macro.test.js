import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("device-record-list", () => {
    it("renders a ul named by its status, holding its items", () => {
        const { document } = render("device-record-list", {
            status: "known",
            statusLabel: "Medical devices",
            html: '<li class="device-record-list-item">One record</li>',
        });
        const list = document.querySelector("ul.device-record-list");
        expect(list.getAttribute("aria-label")).toBe("Medical devices");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".device-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    it.each([
        ["none-known", "No known medical devices (none-known)"],
        ["not-recorded", "No known medical devices (not-recorded)"],
        ["unavailable", "No known medical devices (unavailable)"],
        ["omitted", "No known medical devices (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        const { document } = render("device-record-list", { status, statusLabel: words });
        const items = document.querySelectorAll("ul.device-record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("device-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
