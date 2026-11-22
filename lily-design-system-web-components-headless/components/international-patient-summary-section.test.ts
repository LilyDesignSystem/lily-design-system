import { afterEach, describe, expect, test } from "vitest";

import { InternationalPatientSummarySection } from "./international-patient-summary-section.js";

if (!customElements.get("lily-international-patient-summary-section"))
    customElements.define(
        "lily-international-patient-summary-section",
        InternationalPatientSummarySection,
    );

afterEach(() => {
    document.body.innerHTML = "";
});

describe("InternationalPatientSummarySection", () => {
    test("renders a section named by its heading, with its key, LOINC code, status and required flag", () => {
        document.body.innerHTML = `<lily-international-patient-summary-section section="allergies" heading="Allergies and intolerances"><p>Peanut</p></lily-international-patient-summary-section>`;
        const section = document.querySelector(
            "section.international-patient-summary-section",
        ) as HTMLElement;
        const heading = section.querySelector("h2")!;
        expect(section.getAttribute("aria-labelledby")).toBe(heading.id);
        expect(section.id).toBe("international-patient-summary-allergies");
        expect(section.getAttribute("data-code")).toBe("48765-2");
        expect(section.getAttribute("data-status")).toBe("known");
        expect(section.getAttribute("data-required")).toBe("true");
        expect(section.textContent).toContain("Peanut");
    });

    test.each(["none-known", "not-recorded", "unavailable", "omitted"])(
        "shows the status words when the status is %s",
        (status) => {
            document.body.innerHTML = `<lily-international-patient-summary-section section="problems" heading="Problem list" status="${status}" status-label="In words"></lily-international-patient-summary-section>`;
            expect(
                document.querySelector(".international-patient-summary-section-status")!
                    .textContent,
            ).toBe("In words");
        },
    );

    test("an optional section is not required, and the heading level is the one asked for", () => {
        document.body.innerHTML = `<lily-international-patient-summary-section section="results" heading="Results" heading-level="3"></lily-international-patient-summary-section>`;
        expect(document.querySelector("section")!.hasAttribute("data-required")).toBe(false);
        expect(document.querySelector("h3")!.textContent).toBe("Results");
    });

    test("a slot=narrative child sits in a details, open when asked", () => {
        document.body.innerHTML = `<lily-international-patient-summary-section section="patient-story" heading="Patient story" narrative-label="Narrative from the document" narrative-open><p>Entry</p><div slot="narrative"><p>Lives alone.</p></div></lily-international-patient-summary-section>`;
        const details = document.querySelector(
            "details.international-patient-summary-section-narrative",
        ) as HTMLDetailsElement;
        expect(details.open).toBe(true);
        expect(details.querySelector("summary")!.textContent).toBe("Narrative from the document");
        expect(details.textContent).toContain("Lives alone.");
        expect(document.querySelector("section > p")!.textContent).toBe("Entry");
    });

    describe("status-placement (P42-T6)", () => {
        const mount = (attrs: string) => {
            document.body.innerHTML = `<lily-international-patient-summary-section section="problems" heading="Problem list" status="unavailable" ${attrs}><ul class="record-list"><li class="record-list-status">In words</li></ul></lily-international-patient-summary-section>`;
            return document.querySelector(
                "section.international-patient-summary-section",
            ) as HTMLElement;
        };
        const words = (el: HTMLElement) => (el.textContent ?? "").split("In words").length - 1;

        test('"list" leaves the words to the record list: they appear once', () => {
            const section = mount('status-label="In words" status-placement="list"');
            expect(words(section)).toBe(1);
            expect(
                section.querySelector(".international-patient-summary-section-status"),
            ).toBeNull();
            expect(section.getAttribute("data-status")).toBe("unavailable");
            expect(section.hasAttribute("status-placement")).toBe(false);
        });

        test('"heading", the default, still prints the status line (and so repeats the words)', () => {
            const section = mount('status-label="In words"');
            expect(
                section.querySelector(".international-patient-summary-section-status")!.textContent,
            ).toBe("In words");
            expect(words(section)).toBe(2);
        });
    });
    describe("meta, warning and level (P42-T6b)", () => {
        const mount = (attrs: string, inner = "") => {
            document.body.innerHTML = `<lily-international-patient-summary-section section="allergies" heading="Allergies" ${attrs}>${inner}</lily-international-patient-summary-section>`;
            return document.querySelector(
                "section.international-patient-summary-section",
            ) as HTMLElement;
        };

        test("data-level is the section's level in the IPS, and level overrides it", () => {
            expect(mount("").getAttribute("data-level")).toBe("required");
            document.body.innerHTML = `<lily-international-patient-summary-section section="pregnancy" heading="P"></lily-international-patient-summary-section>`;
            expect(document.querySelector("section")!.getAttribute("data-level")).toBe("optional");
            expect(mount('level="recommended"').getAttribute("data-level")).toBe("recommended");
            expect(mount('level="recommended"').hasAttribute("level")).toBe(false);
            document.body.innerHTML = `<lily-international-patient-summary-section section="made-up" heading="Other"></lily-international-patient-summary-section>`;
            expect(document.querySelector("section")!.hasAttribute("data-level")).toBe(false);
        });

        test("meta and warning render nothing when omitted", () => {
            const section = mount("");
            expect(section.querySelector(".international-patient-summary-section-meta")).toBeNull();
            expect(
                section.querySelector(".international-patient-summary-section-warning"),
            ).toBeNull();
        });

        test("meta, then warning, sit after the heading and status and before the entries, whatever order they are written in", () => {
            const section = mount(
                'status="unavailable" status-label="In words"',
                '<ul class="entries"></ul><span slot="warning">Entries not found</span><span slot="meta">Required</span>',
            );
            const order = [...section.children].map((c) => c.className.split(" ")[0]);
            expect(order).toEqual([
                "international-patient-summary-section-heading",
                "international-patient-summary-section-status",
                "international-patient-summary-section-meta",
                "international-patient-summary-section-warning",
                "entries",
            ]);
            expect(
                section.querySelector(".international-patient-summary-section-meta")!.textContent,
            ).toBe("Required");
            expect(section.querySelector("[slot]")).toBeNull();
        });
    });
});
