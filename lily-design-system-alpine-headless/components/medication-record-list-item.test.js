// medication-record-list-item.test.js
// MedicationRecordListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.medication-record-list-item");

describe("MedicationRecordListItem", () => {
    it("renders the element with its base class", async () => {
        await mount("medication-record-list-item");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("medication-record-list-item")).toBe(true);
    });

    it("uses the li element", async () => {
        await mount("medication-record-list-item");
        expect(el().tagName.toLowerCase()).toBe("li");
    });
});
