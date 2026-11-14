// body-map.test.js
// BodyMap component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.body-map");

describe("BodyMap", () => {
    it("renders the element with its base class", async () => {
        await mount("body-map");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("body-map")).toBe(true);
    });

    it("uses the fieldset element", async () => {
        await mount("body-map");
        expect(el().tagName.toLowerCase()).toBe("fieldset");
    });
});
