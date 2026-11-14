import { afterEach, describe, expect, test } from "vitest";

import { DeviceRecordListItem } from "./device-record-list-item.js";

if (!customElements.get("lily-device-record-list-item"))
    customElements.define("lily-device-record-list-item", DeviceRecordListItem);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("DeviceRecordListItem", () => {
    test("replaces itself with an li holding each part, each status as text and data", () => {
        document.body.innerHTML = `<ul><lily-device-record-list-item device="Cardiac pacemaker" status="active" status-label="In use" timing="2021-02-08" timing-label="Since 8 Feb 2021"></lily-device-record-list-item></ul>`;
        expect(document.querySelector("lily-device-record-list-item")).toBeNull();
        const li = document.querySelector("ul > li.device-record-list-item") as HTMLElement;
        expect(li.getAttribute("data-status")).toBe("active");
        expect(li.querySelector(".device-record-list-item-device")?.textContent).toBe(
            "Cardiac pacemaker",
        );
        expect(li.querySelector(".device-record-list-item-status")?.textContent).toBe("In use");
        expect(
            li.querySelector("time.device-record-list-item-timing")?.getAttribute("datetime"),
        ).toBe("2021-02-08");
        expect(li.querySelector("time.device-record-list-item-timing")?.textContent).toBe(
            "Since 8 Feb 2021",
        );
    });

    test("renders only the parts that are given", () => {
        document.body.innerHTML = `<ul><lily-device-record-list-item device="Cardiac pacemaker"></lily-device-record-list-item></ul>`;
        const li = document.querySelector("ul > li.device-record-list-item") as HTMLElement;
        expect(li.querySelector(".device-record-list-item-status")).toBeNull();
        expect(li.querySelector(".device-record-list-item-timing")).toBeNull();
        expect(li.hasAttribute("data-status")).toBe(false);
    });
});
