// device-record-list.test.js
// DeviceRecordList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.device-record-list");

describe("DeviceRecordList", () => {
    it("renders the element with its base class", async () => {
        await mount("device-record-list");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("device-record-list")).toBe(true);
    });

    it("uses the ul element", async () => {
        await mount("device-record-list");
        expect(el().tagName.toLowerCase()).toBe("ul");
    });
});
