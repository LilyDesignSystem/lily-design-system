// call-to-action.test.js
// CallToAction component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.call-to-action");

describe("CallToAction", () => {
    it("renders the element with its base class", async () => {
        await mount("call-to-action");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("call-to-action")).toBe(true);
    });

    it("uses the a element", async () => {
        await mount("call-to-action");
        expect(el().tagName.toLowerCase()).toBe("a");
    });
});
