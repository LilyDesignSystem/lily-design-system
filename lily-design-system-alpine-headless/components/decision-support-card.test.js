// decision-support-card.test.js
// DecisionSupportCard component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.decision-support-card");

describe("DecisionSupportCard", () => {
    it("renders the element with its base class", async () => {
        await mount("decision-support-card");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("decision-support-card")).toBe(true);
    });

    it("uses the div element", async () => {
        await mount("decision-support-card");
        expect(el().tagName.toLowerCase()).toBe("div");
    });
});
