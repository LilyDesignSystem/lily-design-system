// medication-record-list.test.js
// MedicationRecordList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.medication-record-list");

describe("MedicationRecordList", () => {
    it("renders the element with its base class", async () => {
        await mount("medication-record-list");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("medication-record-list")).toBe(true);
    });

    it("uses the ul element", async () => {
        await mount("medication-record-list");
        expect(el().tagName.toLowerCase()).toBe("ul");
    });
});
