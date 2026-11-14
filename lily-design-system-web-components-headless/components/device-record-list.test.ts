import { afterEach, describe, expect, test } from "vitest";

import { DeviceRecordList } from "./device-record-list.js";

if (!customElements.get("lily-device-record-list"))
    customElements.define("lily-device-record-list", DeviceRecordList);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("DeviceRecordList", () => {
    test("renders a ul named by its status, holding its items", () => {
        document.body.innerHTML = `<lily-device-record-list status="known" status-label="Medical devices"><li class="device-record-list-item">One record</li></lily-device-record-list>`;
        const list = document.querySelector("ul.device-record-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Medical devices");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".device-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known medical devices (none-known)"],
        ["not-recorded", "No known medical devices (not-recorded)"],
        ["unavailable", "No known medical devices (unavailable)"],
        ["omitted", "No known medical devices (omitted)"],
    ])("status %s is the list's one item, never blank", (status, words) => {
        document.body.innerHTML = `<lily-device-record-list status="${status}" status-label="${words}"></lily-device-record-list>`;
        const items = document.querySelectorAll("ul.device-record-list > li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("device-record-list-status");
        expect(items[0].textContent).toBe(words);
    });
});
