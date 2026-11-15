import { describe, expect, test } from "vitest";
import {
    IPS_REQUIRED_SECTIONS,
    IPS_SECTIONS,
    ipsContents,
    ipsMissingRequired,
    ipsSectionCode,
    ipsSectionId,
    ipsSectionIsRequired,
} from "./ips-sections";

describe("ips-sections", () => {
    test("has the sixteen IPS 2.0.1 sections, three required, with unique keys and LOINC codes", () => {
        expect(IPS_SECTIONS).toHaveLength(16);
        expect(new Set(IPS_SECTIONS.map((s) => s.key)).size).toBe(16);
        expect(new Set(IPS_SECTIONS.map((s) => s.code)).size).toBe(16);
        expect(IPS_REQUIRED_SECTIONS).toEqual(["medications", "allergies", "problems"]);
        expect(IPS_SECTIONS.filter((s) => s.level === "recommended")).toHaveLength(4);
    });

    test("knows each section's LOINC code and whether it is required", () => {
        expect(ipsSectionCode("allergies")).toBe("48765-2");
        expect(ipsSectionCode("alerts")).toBe("104605-1");
        expect(ipsSectionCode("not-a-section")).toBeUndefined();
        expect(ipsSectionIsRequired("problems")).toBe(true);
        expect(ipsSectionIsRequired("results")).toBe(false);
    });

    test("a section's id defaults from its key, so contents links and sections agree", () => {
        expect(ipsSectionId("allergies")).toBe("international-patient-summary-allergies");
        expect(ipsSectionId("allergies", "mine")).toBe("mine");
    });

    test("finds the required sections the list lacks, in registry order", () => {
        expect(ipsMissingRequired([{ key: "problems" }, { key: "results" }])).toEqual([
            "medications",
            "allergies",
        ]);
        expect(
            ipsMissingRequired([{ key: "allergies" }, { key: "medications" }, { key: "problems" }]),
        ).toEqual([]);
    });

    test("contents keep the consumer's order, then add an omitted entry per missing required section", () => {
        const contents = ipsContents(
            [
                { key: "allergies", heading: "Allergies", status: "known" },
                { key: "results", heading: "Results" },
            ],
            { medications: "Medication summary", allergies: "Allergies", problems: "Problem list" },
        );
        expect(contents.map((c) => [c.key, c.status, c.added])).toEqual([
            ["allergies", "known", false],
            ["results", "known", false],
            ["medications", "omitted", true],
            ["problems", "omitted", true],
        ]);
        expect(contents[2]).toMatchObject({
            heading: "Medication summary",
            id: "international-patient-summary-medications",
            code: "10160-0",
            required: true,
        });
    });
});
