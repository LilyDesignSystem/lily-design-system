// australia-tax-file-number-view.test.js
// AustraliaTaxFileNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.australia-tax-file-number-view");

describe("AustraliaTaxFileNumberView", () => {
    it("renders the element with its base class", async () => {
        await mount("australia-tax-file-number-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("australia-tax-file-number-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("australia-tax-file-number-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
