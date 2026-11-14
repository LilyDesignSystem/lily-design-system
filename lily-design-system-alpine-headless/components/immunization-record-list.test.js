// immunization-record-list.test.js
// ImmunizationRecordList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.immunization-record-list");

describe("ImmunizationRecordList", () => {
    it("renders the element with its base class", async () => {
        await mount("immunization-record-list");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("immunization-record-list")).toBe(true);
    });

    it("uses the ul element", async () => {
        await mount("immunization-record-list");
        expect(el().tagName.toLowerCase()).toBe("ul");
    });
});
