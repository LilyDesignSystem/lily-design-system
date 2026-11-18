// pakistan-computerized-national-identity-card-view.test.js
// PakistanComputerizedNationalIdentityCardView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.pakistan-computerized-national-identity-card-view");

describe("PakistanComputerizedNationalIdentityCardView", () => {
    it("renders the element with its base class", async () => {
        await mount("pakistan-computerized-national-identity-card-view");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("pakistan-computerized-national-identity-card-view")).toBe(
            true,
        );
    });

    it("uses the span element", async () => {
        await mount("pakistan-computerized-national-identity-card-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});
