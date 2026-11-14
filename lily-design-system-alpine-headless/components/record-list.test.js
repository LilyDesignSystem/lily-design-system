// record-list.test.js
// RecordList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.record-list");

describe("RecordList", () => {
    it("renders the element with its base class", async () => {
        await mount("record-list");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("record-list")).toBe(true);
    });

    it("uses the ul element", async () => {
        await mount("record-list");
        expect(el().tagName.toLowerCase()).toBe("ul");
    });
});
