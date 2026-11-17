import { afterEach, describe, expect, test } from "vitest";

import { RecordList } from "./record-list.js";

if (!customElements.get("lily-record-list")) customElements.define("lily-record-list", RecordList);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("RecordList", () => {
    test("renders a ul named by its status, holding its items", () => {
        document.body.innerHTML = `<lily-record-list status="known" status-label="Vital signs"><li class="record-list-item">One record</li></lily-record-list>`;
        const list = document.querySelector("ul.record-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Vital signs");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No vital signs recorded (none-known)"],
        ["not-recorded", "No vital signs recorded (not-recorded)"],
        ["unavailable", "No vital signs recorded (unavailable)"],
        ["omitted", "No vital signs recorded (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        document.body.innerHTML = `<lily-record-list status="${status}" status-label="${words}"></lily-record-list>`;
        const items = document.querySelectorAll("ul.record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("record-list-status");
        expect(items[0].textContent).toBe(words);
    });

    test("coverage-label says what the list is a view of, as its first item", () => {
        document.body.innerHTML = `<lily-record-list status="known" status-label="Vital signs" coverage-label="Last 12 months, newest first. The GP record did not answer."></lily-record-list>`;
        const first = document.querySelector(".record-list")!.firstElementChild!;
        expect(first.tagName).toBe("LI");
        expect(first.className).toBe("record-list-coverage");
        expect(first.textContent).toBe(
            "Last 12 months, newest first. The GP record did not answer.",
        );
    });
});
