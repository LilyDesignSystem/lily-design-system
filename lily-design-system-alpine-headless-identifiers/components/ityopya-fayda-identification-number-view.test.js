// ityopya-fayda-identification-number-view.test.js
// ItyopyaFaydaIdentificationNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.ityopya-fayda-identification-number-view");

describe("ItyopyaFaydaIdentificationNumberView", () => {
    it("renders the element with its base class", async () => {
        await mount("ityopya-fayda-identification-number-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("ityopya-fayda-identification-number-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("ityopya-fayda-identification-number-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
