// allergy-record-list-item.test.js
// AllergyRecordListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.allergy-record-list-item");

describe("AllergyRecordListItem", () => {
    it("renders the element with its base class", async () => {
        await mount("allergy-record-list-item");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("allergy-record-list-item")).toBe(true);
    });

    it("uses the li element", async () => {
        await mount("allergy-record-list-item");
        expect(el().tagName.toLowerCase()).toBe("li");
    });
});
