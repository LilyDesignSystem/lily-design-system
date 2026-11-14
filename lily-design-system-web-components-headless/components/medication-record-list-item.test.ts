import { afterEach, describe, expect, test } from "vitest";

import { MedicationRecordListItem } from "./medication-record-list-item.js";

if (!customElements.get("lily-medication-record-list-item"))
    customElements.define("lily-medication-record-list-item", MedicationRecordListItem);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("MedicationRecordListItem", () => {
    test("replaces itself with an li holding each part, each status as text and data", () => {
        document.body.innerHTML = `<ul><lily-medication-record-list-item status="active" status-label="Active" effective="2025-03-03" effective-label="Since 3 Mar 2025"><span class="content">ramipril 5 mg capsule, oral, once a day</span></lily-medication-record-list-item></ul>`;
        expect(document.querySelector("lily-medication-record-list-item")).toBeNull();
        const li = document.querySelector("ul > li.medication-record-list-item") as HTMLElement;
        expect(li.getAttribute("data-status")).toBe("active");
        expect(li.querySelector(".medication-record-list-item-status")?.textContent).toBe("Active");
        expect(
            li
                .querySelector("time.medication-record-list-item-effective")
                ?.getAttribute("datetime"),
        ).toBe("2025-03-03");
        expect(li.querySelector("time.medication-record-list-item-effective")?.textContent).toBe(
            "Since 3 Mar 2025",
        );
        expect(li.querySelector(".content")?.textContent).toBe(
            "ramipril 5 mg capsule, oral, once a day",
        );
    });

    test("renders only the parts that are given", () => {
        document.body.innerHTML = `<ul><lily-medication-record-list-item></lily-medication-record-list-item></ul>`;
        const li = document.querySelector("ul > li.medication-record-list-item") as HTMLElement;
        expect(li.querySelector(".medication-record-list-item-status")).toBeNull();
        expect(li.querySelector(".medication-record-list-item-effective")).toBeNull();
        expect(li.hasAttribute("data-status")).toBe(false);
    });
});
