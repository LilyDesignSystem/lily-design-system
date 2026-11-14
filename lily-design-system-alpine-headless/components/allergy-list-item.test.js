// allergy-list-item.test.js
// AllergyListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.allergy-list-item");

describe("AllergyListItem", () => {
    it("renders the element with its base class", async () => {
        await mount("allergy-list-item");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("allergy-list-item")).toBe(true);
    });

    it("uses the li element", async () => {
        await mount("allergy-list-item");
        expect(el().tagName.toLowerCase()).toBe("li");
    });
});
