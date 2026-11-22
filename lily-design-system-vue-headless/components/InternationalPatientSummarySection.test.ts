import { render, screen } from "@testing-library/vue";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./InternationalPatientSummarySection.vue";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("InternationalPatientSummarySection", () => {
    test("is a section named by its heading, with its key, LOINC code, status and required flag", () => {
        render(Subject, {
            props: { section: "allergies", heading: "Allergies and intolerances" },
            slots: { default: "<p>Peanut</p>" },
        });
        const region = screen.getByRole("region", { name: "Allergies and intolerances" });
        expect(region.id).toBe("international-patient-summary-allergies");
        expect(region.getAttribute("data-code")).toBe("48765-2");
        expect(region.getAttribute("data-status")).toBe("known");
        expect(region.getAttribute("data-required")).toBe("true");
        expect(region.textContent).toContain("Peanut");
    });

    test.each(["none-known", "not-recorded", "unavailable", "omitted"] as const)(
        "shows the status words when the status is %s",
        (status) => {
            render(Subject, {
                props: {
                    section: "problems",
                    heading: "Problem list",
                    status,
                    statusLabel: "In words",
                },
            });
            const region = screen.getByRole("region", { name: "Problem list" });
            expect(
                region
                    .querySelector(".international-patient-summary-section-status")!
                    .textContent!.trim(),
            ).toBe("In words");
        },
    );

    test("an optional section is not required, and the heading level is the one asked for", () => {
        render(Subject, { props: { section: "results", heading: "Results", headingLevel: 3 } });
        expect(screen.getByRole("region", { name: "Results" }).hasAttribute("data-required")).toBe(
            false,
        );
        expect(screen.getByRole("heading", { level: 3, name: "Results" })).toBeTruthy();
    });

    test("the narrative sits in a details, open when asked", () => {
        render(Subject, {
            props: {
                section: "patient-story",
                heading: "Patient story",
                narrativeLabel: "Narrative from the document",
                narrativeOpen: true,
            },
            slots: { narrative: "<p>Lives alone.</p>" },
        });
        const details = document.querySelector("details") as HTMLDetailsElement;
        expect(details.open).toBe(true);
        expect(details.querySelector("summary")!.textContent).toBe("Narrative from the document");
        expect(details.textContent).toContain("Lives alone.");
    });

    test("warns in development when a status that is not known has no words", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, {
            props: { section: "problems", heading: "Problem list", status: "unavailable" },
        });
        expect(warn).toHaveBeenCalled();
    });

    describe("statusPlacement (P42-T6)", () => {
        const words = (region: HTMLElement) =>
            (region.textContent ?? "").split("In words").length - 1;
        const base = { section: "problems", heading: "Problem list", status: "unavailable" };

        test('"list" leaves the words to the record list: they appear once', () => {
            render(Subject, {
                props: { ...base, statusLabel: "In words", statusPlacement: "list" },
                slots: {
                    default:
                        '<ul class="record-list"><li class="record-list-status">In words</li></ul>',
                },
            });
            const region = screen.getByRole("region", { name: "Problem list" });
            expect(words(region)).toBe(1);
            expect(
                region.querySelector(".international-patient-summary-section-status"),
            ).toBeNull();
            expect(region.getAttribute("data-status")).toBe("unavailable");
        });

        test('"heading", the default, still prints the status line', () => {
            render(Subject, { props: { ...base, statusLabel: "In words" } });
            const region = screen.getByRole("region", { name: "Problem list" });
            expect(
                region
                    .querySelector(".international-patient-summary-section-status")!
                    .textContent!.trim(),
            ).toBe("In words");
        });

        test('"list" needs no statusLabel, so there is no development warning', () => {
            const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
            render(Subject, { props: { ...base, statusPlacement: "list" } });
            expect(warn).not.toHaveBeenCalled();
        });
    });
    describe("meta, warning and level (P42-T6b)", () => {
        const base = { section: "allergies", heading: "Allergies" };

        test("data-level is the section's level in the IPS, and level overrides it", () => {
            const level = (props: Record<string, unknown>) => {
                const { unmount } = render(Subject, { props: { ...base, ...props } });
                const value = screen.getByRole("region").getAttribute("data-level");
                unmount();
                return value;
            };
            expect(level({})).toBe("required");
            expect(level({ section: "pregnancy" })).toBe("optional");
            expect(level({ level: "recommended" })).toBe("recommended");
            expect(level({ section: "made-up" })).toBeNull();
        });

        test("meta and warning render nothing when omitted", () => {
            render(Subject, { props: base });
            const region = screen.getByRole("region");
            expect(region.querySelector(".international-patient-summary-section-meta")).toBeNull();
            expect(
                region.querySelector(".international-patient-summary-section-warning"),
            ).toBeNull();
        });

        test("meta, then warning, sit after the heading and status and before the entries", () => {
            render(Subject, {
                props: { ...base, status: "unavailable", statusLabel: "In words" },
                slots: {
                    meta: "<span>Required</span>",
                    warning: "<span>Entries not found</span>",
                    default: '<ul class="entries"></ul>',
                },
            });
            const region = screen.getByRole("region", { name: "Allergies" });
            const order = [...region.children].map((c) => c.className.split(" ")[0]);
            expect(order).toEqual([
                "international-patient-summary-section-heading",
                "international-patient-summary-section-status",
                "international-patient-summary-section-meta",
                "international-patient-summary-section-warning",
                "entries",
            ]);
            expect(
                region.querySelector(".international-patient-summary-section-meta")!.textContent,
            ).toBe("Required");
            expect(
                region.querySelector(".international-patient-summary-section-warning")!.textContent,
            ).toBe("Entries not found");
        });
    });
});
