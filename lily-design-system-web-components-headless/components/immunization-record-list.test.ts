import { afterEach, describe, expect, test } from "vitest";

import { ImmunizationRecordList } from "./immunization-record-list.js";

if (!customElements.get("lily-immunization-record-list"))
    customElements.define("lily-immunization-record-list", ImmunizationRecordList);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("ImmunizationRecordList", () => {
    test("renders a ul named by its status, holding its items", () => {
        document.body.innerHTML = `<lily-immunization-record-list status="known" status-label="Immunizations"><li class="immunization-record-list-item">One record</li></lily-immunization-record-list>`;
        const list = document.querySelector("ul.immunization-record-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Immunizations");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".immunization-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No immunizations recorded (none-known)"],
        ["not-recorded", "No immunizations recorded (not-recorded)"],
        ["unavailable", "No immunizations recorded (unavailable)"],
        ["omitted", "No immunizations recorded (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        document.body.innerHTML = `<lily-immunization-record-list status="${status}" status-label="${words}"></lily-immunization-record-list>`;
        const items = document.querySelectorAll("ul.immunization-record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("immunization-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
