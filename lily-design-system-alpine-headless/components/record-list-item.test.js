// record-list-item.test.js
// RecordListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.record-list-item");

describe("RecordListItem", () => {
    it("renders the element with its base class", async () => {
        await mount("record-list-item");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("record-list-item")).toBe(true);
    });

    it("uses the li element", async () => {
        await mount("record-list-item");
        expect(el().tagName.toLowerCase()).toBe("li");
    });
});
