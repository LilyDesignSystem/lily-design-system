// sri-lanka-national-identity-card-input.test.js
// SriLankaNationalIdentityCardInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.sri-lanka-national-identity-card-input");

describe("SriLankaNationalIdentityCardInput", () => {
    it("renders the element with its base class", async () => {
        await mount("sri-lanka-national-identity-card-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("sri-lanka-national-identity-card-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("sri-lanka-national-identity-card-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
