import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("international-patient-summary-section", () => {
    it("renders a section named by its heading, with its key, LOINC code, status and required flag", () => {
        const { document } = render("international-patient-summary-section", {
            section: "allergies",
            heading: "Allergies and intolerances",
            html: "<p>Peanut</p>",
        });
        const section = document.querySelector("section.international-patient-summary-section");
        const heading = section.querySelector("h2");
        expect(section.getAttribute("aria-labelledby")).toBe(heading.id);
        expect(heading.textContent).toBe("Allergies and intolerances");
        expect(section.id).toBe("international-patient-summary-allergies");
        expect(section.getAttribute("data-code")).toBe("48765-2");
        expect(section.getAttribute("data-status")).toBe("known");
        expect(section.getAttribute("data-required")).toBe("true");
        expect(section.textContent).toContain("Peanut");
        expect(section.querySelector(".international-patient-summary-section-status")).toBeNull();
    });

    it.each(["none-known", "not-recorded", "unavailable", "omitted"])(
        "shows the status words when the status is %s",
        (status) => {
            const { document } = render("international-patient-summary-section", {
                section: "problems",
                heading: "Problem list",
                status,
                statusLabel: "In words",
            });
            expect(
                document.querySelector(".international-patient-summary-section-status").textContent,
            ).toBe("In words");
        },
    );

    it("an optional section is not required, and the heading level is the one asked for", () => {
        const { document } = render("international-patient-summary-section", {
            section: "results",
            heading: "Results",
            headingLevel: 3,
        });
        expect(document.querySelector("section").hasAttribute("data-required")).toBe(false);
        expect(document.querySelector("h3").textContent).toBe("Results");
    });

    it("the narrative sits in a details, open when asked", () => {
        const { document } = render("international-patient-summary-section", {
            section: "patient-story",
            heading: "Patient story",
            narrative: "<p>Lives alone.</p>",
            narrativeLabel: "Narrative from the document",
            narrativeOpen: true,
        });
        const details = document.querySelector(
            "details.international-patient-summary-section-narrative",
        );
        expect(details.hasAttribute("open")).toBe(true);
        expect(details.querySelector("summary").textContent).toBe("Narrative from the document");
        expect(details.textContent).toContain("Lives alone.");
    });

    describe("statusPlacement (P42-T6)", () => {
        const list = '<ul class="record-list"><li class="record-list-status">In words</li></ul>';
        const mount = (extra) => {
            const { document } = render("international-patient-summary-section", {
                section: "problems",
                heading: "Problem list",
                status: "unavailable",
                statusLabel: "In words",
                html: list,
                ...extra,
            });
            return document.querySelector("section.international-patient-summary-section");
        };
        const words = (el) => el.textContent.split("In words").length - 1;

        it('"list" leaves the words to the record list: they appear once', () => {
            const section = mount({ statusPlacement: "list" });
            expect(words(section)).toBe(1);
            expect(
                section.querySelector(".international-patient-summary-section-status"),
            ).toBeNull();
            expect(section.getAttribute("data-status")).toBe("unavailable");
        });

        it('"heading", the default, still prints the status line', () => {
            const section = mount({});
            expect(
                section.querySelector(".international-patient-summary-section-status").textContent,
            ).toBe("In words");
            expect(
                mount({ statusPlacement: "heading" }).querySelector(
                    ".international-patient-summary-section-status",
                ),
            ).not.toBeNull();
        });
    });
    describe("meta, warning and level (P42-T6b)", () => {
        const mount = (extra) => {
            const { document } = render("international-patient-summary-section", {
                section: "allergies",
                heading: "Allergies",
                ...extra,
            });
            return document.querySelector("section.international-patient-summary-section");
        };

        it("data-level is the section's level in the IPS, and level overrides it", () => {
            expect(mount({}).getAttribute("data-level")).toBe("required");
            expect(mount({ section: "immunizations" }).getAttribute("data-level")).toBe(
                "recommended",
            );
            expect(mount({ section: "pregnancy" }).getAttribute("data-level")).toBe("optional");
            expect(mount({ level: "recommended" }).getAttribute("data-level")).toBe("recommended");
            expect(mount({ section: "made-up" }).hasAttribute("data-level")).toBe(false);
        });

        it("meta and warning render nothing when omitted", () => {
            const section = mount({});
            expect(section.querySelector(".international-patient-summary-section-meta")).toBeNull();
            expect(
                section.querySelector(".international-patient-summary-section-warning"),
            ).toBeNull();
        });

        it("meta, then warning, sit after the heading and status and before the entries", () => {
            const section = mount({
                status: "unavailable",
                statusLabel: "In words",
                warning: "<span>Entries not found</span>",
                meta: "<span>Required</span>",
                html: '<ul class="entries"></ul>',
            });
            const order = [...section.children].map((c) => c.className.split(" ")[0]);
            expect(order).toEqual([
                "international-patient-summary-section-heading",
                "international-patient-summary-section-status",
                "international-patient-summary-section-meta",
                "international-patient-summary-section-warning",
                "entries",
            ]);
            expect(
                section.querySelector(".international-patient-summary-section-meta").textContent,
            ).toBe("Required");
        });
    });
});
