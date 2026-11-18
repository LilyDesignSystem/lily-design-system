// bangladesh-national-identity-card-input.test.js
// BangladeshNationalIdentityCardInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.bangladesh-national-identity-card-input");

describe("BangladeshNationalIdentityCardInput", () => {
    it("renders the element with its base class", async () => {
        await mount("bangladesh-national-identity-card-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("bangladesh-national-identity-card-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("bangladesh-national-identity-card-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});
