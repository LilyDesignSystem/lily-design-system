import { afterEach, describe, expect, test } from "vitest";

import { AllergyRecordList } from "./allergy-record-list.js";

if (!customElements.get("lily-allergy-record-list"))
    customElements.define("lily-allergy-record-list", AllergyRecordList);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("AllergyRecordList", () => {
    test("renders a ul named by its status, holding its items", () => {
        document.body.innerHTML = `<lily-allergy-record-list status="known" status-label="Known allergies"><li class="allergy-record-list-item">One record</li></lily-allergy-record-list>`;
        const list = document.querySelector("ul.allergy-record-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Known allergies");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".allergy-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known allergies (none-known)"],
        ["not-recorded", "No known allergies (not-recorded)"],
        ["unavailable", "No known allergies (unavailable)"],
        ["omitted", "No known allergies (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        document.body.innerHTML = `<lily-allergy-record-list status="${status}" status-label="${words}"></lily-allergy-record-list>`;
        const items = document.querySelectorAll("ul.allergy-record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("allergy-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
