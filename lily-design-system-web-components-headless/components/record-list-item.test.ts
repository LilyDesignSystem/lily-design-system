import { afterEach, describe, expect, test } from "vitest";

import { RecordListItem } from "./record-list-item.js";

if (!customElements.get("lily-record-list-item"))
    customElements.define("lily-record-list-item", RecordListItem);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("RecordListItem", () => {
    test("replaces itself with an li holding each part, each status as text and data", () => {
        document.body.innerHTML = `<ul><lily-record-list-item status="final" status-label="Final" updated="2026-11-03" updated-label="Updated 3 Nov 2026"><span class="content">Blood pressure 128/82 mmHg</span></lily-record-list-item></ul>`;
        expect(document.querySelector("lily-record-list-item")).toBeNull();
        const li = document.querySelector("ul > li.record-list-item") as HTMLElement;
        expect(li.getAttribute("data-status")).toBe("final");
        expect(li.querySelector(".record-list-item-status")?.textContent).toBe("Final");
        expect(li.querySelector("time.record-list-item-updated")?.getAttribute("datetime")).toBe(
            "2026-11-03",
        );
        expect(li.querySelector("time.record-list-item-updated")?.textContent).toBe(
            "Updated 3 Nov 2026",
        );
        expect(li.querySelector(".content")?.textContent).toBe("Blood pressure 128/82 mmHg");
    });

    test("renders only the parts that are given", () => {
        document.body.innerHTML = `<ul><lily-record-list-item></lily-record-list-item></ul>`;
        const li = document.querySelector("ul > li.record-list-item") as HTMLElement;
        expect(li.querySelector(".record-list-item-status")).toBeNull();
        expect(li.querySelector(".record-list-item-updated")).toBeNull();
        expect(li.hasAttribute("data-status")).toBe(false);
    });

    test("withheld shows only the consumer's words; entered-in-error keeps the content struck through", () => {
        document.body.innerHTML = `<ul><lily-record-list-item entry-state="withheld" entry-state-label="Restricted">Blood pressure</lily-record-list-item><lily-record-list-item entry-state="entered-in-error" entry-state-label="Entered in error">Blood pressure</lily-record-list-item></ul>`;
        const [withheld, inError] = Array.from(document.querySelectorAll("ul > li.record-list-item"));
        expect(withheld.getAttribute("data-entry-state")).toBe("withheld");
        expect(withheld.textContent).not.toContain("Blood pressure");
        expect(withheld.querySelector(".record-list-item-entry-state")?.textContent).toBe("Restricted");
        expect(inError.querySelector("del.record-list-item-entry")?.textContent).toBe("Blood pressure");
        expect(inError.querySelector(".record-list-item-entry-state")?.textContent).toBe("Entered in error");
    });
});
