// international-patient-summary-section.test.js
// InternationalPatientSummarySection component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("section.international-patient-summary-section");

describe("InternationalPatientSummarySection", () => {
    it("renders the element with its base class", async () => {
        await mount("international-patient-summary-section");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("international-patient-summary-section")).toBe(true);
    });

    it("uses the section element", async () => {
        await mount("international-patient-summary-section");
        expect(el().tagName.toLowerCase()).toBe("section");
    });
});
