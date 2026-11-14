import { afterEach, describe, expect, test, vi } from "vitest";

import { AllergyList } from "./allergy-list.js";
import { AllergyListItem } from "./allergy-list-item.js";
if (!customElements.get("lily-allergy-list-item"))
    customElements.define("lily-allergy-list-item", AllergyListItem);
if (!customElements.get("lily-allergy-list"))
    customElements.define("lily-allergy-list", AllergyList);

afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body;
}

describe("AllergyList", () => {
    test("renders a ul named by its status, with real li items", () => {
        const body = render(
            `<lily-allergy-list status="known" status-label="Known allergies"><lily-allergy-list-item substance="Penicillin"></lily-allergy-list-item></lily-allergy-list>`,
        );
        const list = body.querySelector("ul.allergy-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Known allergies");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".allergy-list-status")).toBeNull();
        expect(list.querySelector(":scope > li.allergy-list-item")?.textContent).toContain(
            "Penicillin",
        );
    });

    test.each([
        ["none-known", "No known allergies"],
        ["not-recorded", "Allergies not recorded"],
        ["unavailable", "Allergies unavailable"],
    ])("status %s is the list\x27s one item, never blank", (status, words) => {
        const body = render(
            `<lily-allergy-list status="${status}" status-label="${words}"></lily-allergy-list>`,
        );
        const items = body.querySelectorAll("ul.allergy-list li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("allergy-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
