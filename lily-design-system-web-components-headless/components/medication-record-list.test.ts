import { afterEach, describe, expect, test } from "vitest";

import { MedicationRecordList } from "./medication-record-list.js";

if (!customElements.get("lily-medication-record-list"))
    customElements.define("lily-medication-record-list", MedicationRecordList);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("MedicationRecordList", () => {
    test("renders a ul named by its status, holding its items", () => {
        document.body.innerHTML = `<lily-medication-record-list status="known" status-label="Current medicines"><li class="medication-record-list-item">One record</li></lily-medication-record-list>`;
        const list = document.querySelector("ul.medication-record-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Current medicines");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".medication-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known medicines (none-known)"],
        ["not-recorded", "No known medicines (not-recorded)"],
        ["unavailable", "No known medicines (unavailable)"],
        ["omitted", "No known medicines (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        document.body.innerHTML = `<lily-medication-record-list status="${status}" status-label="${words}"></lily-medication-record-list>`;
        const items = document.querySelectorAll("ul.medication-record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("medication-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
