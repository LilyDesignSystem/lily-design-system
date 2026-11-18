// mauritius-national-identity-card-number-view.test.js
// MauritiusNationalIdentityCardNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.mauritius-national-identity-card-number-view");

describe("MauritiusNationalIdentityCardNumberView", () => {
    it("renders the element with its base class", async () => {
        await mount("mauritius-national-identity-card-number-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("mauritius-national-identity-card-number-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("mauritius-national-identity-card-number-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
