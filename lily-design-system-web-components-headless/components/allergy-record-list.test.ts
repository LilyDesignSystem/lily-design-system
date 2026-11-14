import { afterEach, describe, expect, test, vi } from "vitest";

import { AllergyRecordList } from "./allergy-record-list.js";
import { AllergyRecordListItem } from "./allergy-record-list-item.js";
if (!customElements.get("lily-allergy-record-list-item"))
    customElements.define("lily-allergy-record-list-item", AllergyRecordListItem);
if (!customElements.get("lily-allergy-record-list"))
    customElements.define("lily-allergy-record-list", AllergyRecordList);

afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body;
}

describe("AllergyRecordList", () => {
    test("renders a ul named by its status, with real li items", () => {
        const body = render(
            `<lily-allergy-record-list status="known" status-label="Known allergies"><lily-allergy-record-list-item substance="Penicillin"></lily-allergy-record-list-item></lily-allergy-record-list>`,
        );
        const list = body.querySelector("ul.allergy-record-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Known allergies");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".allergy-record-list-status")).toBeNull();
        expect(list.querySelector(":scope > li.allergy-record-list-item")?.textContent).toContain(
            "Penicillin",
        );
    });

    test.each([
        ["none-known", "No known allergies"],
        ["not-recorded", "Allergies not recorded"],
        ["unavailable", "Allergies unavailable"],
    ])("status %s is the list\x27s one item, never blank", (status, words) => {
        const body = render(
            `<lily-allergy-record-list status="${status}" status-label="${words}"></lily-allergy-record-list>`,
        );
        const items = body.querySelectorAll("ul.allergy-record-list li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("allergy-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
