import { afterEach, describe, expect, test } from "vitest";

import { ProcedureRecordList } from "./procedure-record-list.js";

if (!customElements.get("lily-procedure-record-list"))
    customElements.define("lily-procedure-record-list", ProcedureRecordList);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("ProcedureRecordList", () => {
    test("renders a ul named by its status, holding its items", () => {
        document.body.innerHTML = `<lily-procedure-record-list status="known" status-label="Procedures"><li class="procedure-record-list-item">One record</li></lily-procedure-record-list>`;
        const list = document.querySelector("ul.procedure-record-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Procedures");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".procedure-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known procedures (none-known)"],
        ["not-recorded", "No known procedures (not-recorded)"],
        ["unavailable", "No known procedures (unavailable)"],
        ["omitted", "No known procedures (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        document.body.innerHTML = `<lily-procedure-record-list status="${status}" status-label="${words}"></lily-procedure-record-list>`;
        const items = document.querySelectorAll("ul.procedure-record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("procedure-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
