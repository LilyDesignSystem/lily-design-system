// iran-kod-e-melli-view.test.js
// IranKodEMelliView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.iran-kod-e-melli-view");

describe("IranKodEMelliView", () => {
    it("renders the element with its base class", async () => {
        await mount("iran-kod-e-melli-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("iran-kod-e-melli-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("iran-kod-e-melli-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
