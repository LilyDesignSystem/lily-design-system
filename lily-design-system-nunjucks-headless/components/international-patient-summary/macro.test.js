import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

const base = {
    label: "Patient summary",
    omittedLabel: "Section missing from document",
    requiredHeadings: {
        medications: "Medication summary",
        allergies: "Allergies and intolerances",
        problems: "Problem list",
    },
};

describe("international-patient-summary", () => {
    it("renders an article named by its label, banner first and details last", () => {
        const { document } = render("international-patient-summary", {
            ...base,
            sections: [
                { key: "medications", heading: "Medication summary" },
                { key: "allergies", heading: "Allergies and intolerances" },
                { key: "problems", heading: "Problem list" },
            ],
            banner: "<p>Banner</p>",
            details: "<p>Details</p>",
            html: '<section class="given">Entries</section>',
        });
        const article = document.querySelector("article.international-patient-summary");
        expect(article.getAttribute("aria-label")).toBe("Patient summary");
        const parts = [...article.children].map((c) => c.getAttribute("class"));
        expect(parts[0]).toBe("international-patient-summary-banner");
        expect(parts[parts.length - 1]).toBe("international-patient-summary-details");
        expect(
            article.querySelector(".international-patient-summary-sections .given"),
        ).toBeTruthy();
        expect(article.querySelectorAll('section[data-status="omitted"]')).toHaveLength(0);
    });

    it("adds each missing required section, in words, after the given sections", () => {
        const { document } = render("international-patient-summary", {
            ...base,
            sections: [{ key: "problems", heading: "Problem list", status: "none-known" }],
        });
        const added = [...document.querySelectorAll('section[data-status="omitted"]')];
        expect(added.map((s) => s.getAttribute("data-section"))).toEqual([
            "medications",
            "allergies",
        ]);
        for (const s of added) {
            expect(s.getAttribute("data-required")).toBe("true");
            expect(s.textContent).toContain("Section missing from document");
        }
        expect(added[1].getAttribute("data-code")).toBe("48765-2");
    });

    it("the contents follow the list, then the missing required sections, and only with contentsLabel", () => {
        expect(
            render("international-patient-summary", base).document.querySelector("nav"),
        ).toBeNull();
        const { document } = render("international-patient-summary", {
            ...base,
            contentsLabel: "Contents",
            sections: [
                { key: "allergies", heading: "Allergies and intolerances" },
                { key: "results", heading: "Results", status: "not-recorded" },
            ],
        });
        const nav = document.querySelector("nav.international-patient-summary-contents");
        expect(nav.getAttribute("aria-label")).toBe("Contents");
        const links = [...nav.querySelectorAll("a")];
        expect(links.map((a) => a.textContent)).toEqual([
            "Allergies and intolerances",
            "Results",
            "Medication summary",
            "Problem list",
        ]);
        expect(links[1].getAttribute("href")).toBe("#international-patient-summary-results");
        expect(links[2].closest("li").getAttribute("data-status")).toBe("omitted");
    });

    it("idPrefix gives the added sections and the contents links their own ids", () => {
        const { document } = render("international-patient-summary", {
            ...base,
            contentsLabel: "Contents",
            idPrefix: "second",
        });
        expect(document.getElementById("second-medications").getAttribute("data-status")).toBe(
            "omitted",
        );
        expect(document.querySelector("nav a").getAttribute("href")).toBe("#second-medications");
    });
});
