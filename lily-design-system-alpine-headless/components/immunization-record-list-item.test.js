// immunization-record-list-item.test.js
// ImmunizationRecordListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.immunization-record-list-item");

describe("ImmunizationRecordListItem", () => {
    it("renders the element with its base class", async () => {
        await mount("immunization-record-list-item");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("immunization-record-list-item")).toBe(true);
    });

    it("uses the li element", async () => {
        await mount("immunization-record-list-item");
        expect(el().tagName.toLowerCase()).toBe("li");
    });
});
