import { afterEach, describe, expect, test } from "vitest";

import { ProblemRecordList } from "./problem-record-list.js";

if (!customElements.get("lily-problem-record-list"))
    customElements.define("lily-problem-record-list", ProblemRecordList);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("ProblemRecordList", () => {
    test("renders a ul named by its status, holding its items", () => {
        document.body.innerHTML = `<lily-problem-record-list status="known" status-label="Problems"><li class="problem-record-list-item">One record</li></lily-problem-record-list>`;
        const list = document.querySelector("ul.problem-record-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Problems");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".problem-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known problems (none-known)"],
        ["not-recorded", "No known problems (not-recorded)"],
        ["unavailable", "No known problems (unavailable)"],
        ["omitted", "No known problems (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        document.body.innerHTML = `<lily-problem-record-list status="${status}" status-label="${words}"></lily-problem-record-list>`;
        const items = document.querySelectorAll("ul.problem-record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("problem-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
