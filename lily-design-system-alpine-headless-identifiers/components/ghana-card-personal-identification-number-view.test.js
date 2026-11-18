// ghana-card-personal-identification-number-view.test.js
// GhanaCardPersonalIdentificationNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.ghana-card-personal-identification-number-view");

describe("GhanaCardPersonalIdentificationNumberView", () => {
    it("renders the element with its base class", async () => {
        await mount("ghana-card-personal-identification-number-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("ghana-card-personal-identification-number-view")).toBe(
            true,
        );
    });

    it("uses the span element", async () => {
        await mount("ghana-card-personal-identification-number-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
