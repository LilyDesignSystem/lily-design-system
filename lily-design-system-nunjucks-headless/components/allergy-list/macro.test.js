import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("allergy-list", () => {
    it("renders a ul named by its status, with its items", () => {
        const { document } = render(
            "allergy-list",
            { status: "known", statusLabel: "Known allergies" },
            '<li class="allergy-list-item">Penicillin</li>',
        );
        const list = document.querySelector("ul.allergy-list");
        expect(list.getAttribute("aria-label")).toBe("Known allergies");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".allergy-list-status")).toBeNull();
        expect(list.textContent).toContain("Penicillin");
    });

    it.each([
        ["none-known", "No known allergies"],
        ["not-recorded", "Allergies not recorded"],
        ["unavailable", "Allergies unavailable"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        const { document } = render("allergy-list", { status, statusLabel: words });
        const items = document.querySelectorAll("ul.allergy-list li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("allergy-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
