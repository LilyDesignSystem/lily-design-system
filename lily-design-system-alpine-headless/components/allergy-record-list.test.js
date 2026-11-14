// allergy-record-list.test.js
// AllergyRecordList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.allergy-record-list");

describe("AllergyRecordList", () => {
    it("renders the element with its base class", async () => {
        await mount("allergy-record-list");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("allergy-record-list")).toBe(true);
    });

    it("uses the ul element", async () => {
        await mount("allergy-record-list");
        expect(el().tagName.toLowerCase()).toBe("ul");
    });
});
