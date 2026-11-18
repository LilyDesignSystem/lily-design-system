// bangladesh-national-identity-card-view.test.js
// BangladeshNationalIdentityCardView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.bangladesh-national-identity-card-view");

describe("BangladeshNationalIdentityCardView", () => {
    it("renders the element with its base class", async () => {
        await mount("bangladesh-national-identity-card-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("bangladesh-national-identity-card-view")).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("bangladesh-national-identity-card-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
