// device-record-list-item.test.js
// DeviceRecordListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.device-record-list-item");

describe("DeviceRecordListItem", () => {
    it("renders the element with its base class", async () => {
        await mount("device-record-list-item");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("device-record-list-item")).toBe(true);
    });

    it("uses the li element", async () => {
        await mount("device-record-list-item");
        expect(el().tagName.toLowerCase()).toBe("li");
    });
});
