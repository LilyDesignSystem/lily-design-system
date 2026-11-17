// repeatable-fieldset.test.js
// RepeatableFieldset component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.repeatable-fieldset");

describe("RepeatableFieldset", () => {
    it("renders the element with its base class", async () => {
        await mount("repeatable-fieldset");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("repeatable-fieldset")).toBe(true);
    });

    it("uses the fieldset element", async () => {
        await mount("repeatable-fieldset");
        expect(el().tagName.toLowerCase()).toBe("fieldset");
    });
});
