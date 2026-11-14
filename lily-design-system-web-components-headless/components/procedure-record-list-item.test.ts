import { afterEach, describe, expect, test } from "vitest";

import { ProcedureRecordListItem } from "./procedure-record-list-item.js";

if (!customElements.get("lily-procedure-record-list-item"))
    customElements.define("lily-procedure-record-list-item", ProcedureRecordListItem);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("ProcedureRecordListItem", () => {
    test("replaces itself with an li holding each part, each status as text and data", () => {
        document.body.innerHTML = `<ul><lily-procedure-record-list-item procedure="Appendectomy" status="completed" status-label="Completed" performed="2018-04-22" performed-label="22 Apr 2018"></lily-procedure-record-list-item></ul>`;
        expect(document.querySelector("lily-procedure-record-list-item")).toBeNull();
        const li = document.querySelector("ul > li.procedure-record-list-item") as HTMLElement;
        expect(li.getAttribute("data-status")).toBe("completed");
        expect(li.querySelector(".procedure-record-list-item-procedure")?.textContent).toBe(
            "Appendectomy",
        );
        expect(li.querySelector(".procedure-record-list-item-status")?.textContent).toBe(
            "Completed",
        );
        expect(
            li.querySelector("time.procedure-record-list-item-performed")?.getAttribute("datetime"),
        ).toBe("2018-04-22");
        expect(li.querySelector("time.procedure-record-list-item-performed")?.textContent).toBe(
            "22 Apr 2018",
        );
    });

    test("renders only the parts that are given", () => {
        document.body.innerHTML = `<ul><lily-procedure-record-list-item procedure="Appendectomy"></lily-procedure-record-list-item></ul>`;
        const li = document.querySelector("ul > li.procedure-record-list-item") as HTMLElement;
        expect(li.querySelector(".procedure-record-list-item-status")).toBeNull();
        expect(li.querySelector(".procedure-record-list-item-performed")).toBeNull();
        expect(li.hasAttribute("data-status")).toBe(false);
    });
});
