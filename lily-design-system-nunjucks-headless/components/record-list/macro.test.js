import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("record-list", () => {
    it("renders a ul named by its status, holding its items", () => {
        const { document } = render("record-list", {
            status: "known",
            statusLabel: "Vital signs",
            html: '<li class="record-list-item">One record</li>',
        });
        const list = document.querySelector("ul.record-list");
        expect(list.getAttribute("aria-label")).toBe("Vital signs");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    it.each([
        ["none-known", "No vital signs recorded (none-known)"],
        ["not-recorded", "No vital signs recorded (not-recorded)"],
        ["unavailable", "No vital signs recorded (unavailable)"],
        ["omitted", "No vital signs recorded (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        const { document } = render("record-list", { status, statusLabel: words });
        const items = document.querySelectorAll("ul.record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("record-list-status");
        expect(items[0].textContent).toBe(words);
    });

    it("not-applicable is its own status, shown in words", () => {
        const { document } = render("record-list", {
            status: "not-applicable",
            statusLabel: "Pregnancy: not applicable",
        });
        const list = document.querySelector("ul.record-list");
        expect(list.getAttribute("data-status")).toBe("not-applicable");
        expect(list.querySelector(".record-list-status").textContent).toBe(
            "Pregnancy: not applicable",
        );
    });

    it("coverageLabel says what the list is a view of, as its first item", () => {
        const { document } = render("record-list", {
            status: "known",
            statusLabel: "Vital signs",
            coverageLabel: "Last 12 months, newest first. The GP record did not answer.",
        });
        const first = document.querySelector(".record-list").firstElementChild;
        expect(first.tagName).toBe("LI");
        expect(first.className).toBe("record-list-coverage");
        expect(first.textContent).toBe(
            "Last 12 months, newest first. The GP record did not answer.",
        );
    });
});
