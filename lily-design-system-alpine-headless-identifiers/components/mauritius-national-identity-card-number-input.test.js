// mauritius-national-identity-card-number-input.test.js
// MauritiusNationalIdentityCardNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.mauritius-national-identity-card-number-input");

describe("MauritiusNationalIdentityCardNumberInput", () => {
    it("renders the element with its base class", async () => {
        await mount("mauritius-national-identity-card-number-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("mauritius-national-identity-card-number-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("mauritius-national-identity-card-number-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
