// international-patient-summary.test.js
// InternationalPatientSummary component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("article.international-patient-summary");

describe("InternationalPatientSummary", () => {
    it("renders the element with its base class", async () => {
        await mount("international-patient-summary");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("international-patient-summary")).toBe(true);
    });

    it("uses the article element", async () => {
        await mount("international-patient-summary");
        expect(el().tagName.toLowerCase()).toBe("article");
    });
});
