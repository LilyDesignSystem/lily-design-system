import { afterEach, describe, expect, test } from "vitest";

import { ImmunizationRecordListItem } from "./immunization-record-list-item.js";

if (!customElements.get("lily-immunization-record-list-item"))
    customElements.define("lily-immunization-record-list-item", ImmunizationRecordListItem);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("ImmunizationRecordListItem", () => {
    test("replaces itself with an li holding each part, each status as text and data", () => {
        document.body.innerHTML = `<ul><lily-immunization-record-list-item vaccine="MMR vaccine" occurrence="2025-09-12" occurrence-label="12 Sep 2025" dose-number-label="Dose 2 of 2" status="completed" status-label="Given" lot-number="AB1234"></lily-immunization-record-list-item></ul>`;
        expect(document.querySelector("lily-immunization-record-list-item")).toBeNull();
        const li = document.querySelector("ul > li.immunization-record-list-item") as HTMLElement;
        expect(li.getAttribute("data-status")).toBe("completed");
        expect(li.querySelector(".immunization-record-list-item-vaccine")?.textContent).toBe(
            "MMR vaccine",
        );
        expect(
            li
                .querySelector("time.immunization-record-list-item-occurrence")
                ?.getAttribute("datetime"),
        ).toBe("2025-09-12");
        expect(li.querySelector("time.immunization-record-list-item-occurrence")?.textContent).toBe(
            "12 Sep 2025",
        );
        expect(li.querySelector(".immunization-record-list-item-dose-number")?.textContent).toBe(
            "Dose 2 of 2",
        );
        expect(li.querySelector(".immunization-record-list-item-status")?.textContent).toBe(
            "Given",
        );
        expect(li.querySelector(".immunization-record-list-item-lot-number")?.textContent).toBe(
            "AB1234",
        );
    });

    test("renders only the parts that are given", () => {
        document.body.innerHTML = `<ul><lily-immunization-record-list-item vaccine="MMR vaccine"></lily-immunization-record-list-item></ul>`;
        const li = document.querySelector("ul > li.immunization-record-list-item") as HTMLElement;
        expect(li.querySelector(".immunization-record-list-item-occurrence")).toBeNull();
        expect(li.querySelector(".immunization-record-list-item-dose-number")).toBeNull();
        expect(li.querySelector(".immunization-record-list-item-status")).toBeNull();
        expect(li.querySelector(".immunization-record-list-item-lot-number")).toBeNull();
        expect(li.hasAttribute("data-status")).toBe(false);
    });
});
