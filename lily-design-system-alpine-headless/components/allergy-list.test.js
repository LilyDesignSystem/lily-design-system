// allergy-list.test.js
// AllergyList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.allergy-list");

describe("AllergyList", () => {
    it("renders the element with its base class", async () => {
        await mount("allergy-list");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("allergy-list")).toBe(true);
    });

    it("uses the ul element", async () => {
        await mount("allergy-list");
        expect(el().tagName.toLowerCase()).toBe("ul");
    });
});
