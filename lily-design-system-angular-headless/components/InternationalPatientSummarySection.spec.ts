import { Component, input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { InternationalPatientSummarySection } from "./InternationalPatientSummarySection";

@Component({
    standalone: true,
    imports: [InternationalPatientSummarySection],
    template: `<lily-international-patient-summary-section [section]="section()" [heading]="heading()" [status]="status()" [statusLabel]="statusLabel()" [statusPlacement]="statusPlacement()" [headingLevel]="level()" [narrativeLabel]="narrativeLabel()" [narrativeOpen]="true"><p>Peanut</p><ul class="record-list"><li class="record-list-status">In words</li></ul><p narrative>Lives alone.</p></lily-international-patient-summary-section>`,
})
class Host {
    readonly section = input<string>("allergies");
    readonly heading = input<string>("Allergies and intolerances");
    readonly status = input<"known" | "none-known" | "not-recorded" | "unavailable" | "omitted">(
        "known",
    );
    readonly statusLabel = input<string>("");
    readonly statusPlacement = input<"heading" | "list">("heading");
    readonly level = input<2 | 3>(2);
    readonly narrativeLabel = input<string>("");
}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

function mount(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Host);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector(
        "section.international-patient-summary-section",
    ) as HTMLElement;
}

describe("InternationalPatientSummarySection", () => {
    test("is a section named by its heading, with its key, LOINC code, status and required flag", () => {
        const section = mount();
        const heading = section.querySelector("h2")!;
        expect(section.getAttribute("aria-labelledby")).toBe(heading.id);
        expect(heading.textContent).toBe("Allergies and intolerances");
        expect(section.id).toBe("international-patient-summary-allergies");
        expect(section.getAttribute("data-code")).toBe("48765-2");
        expect(section.getAttribute("data-status")).toBe("known");
        expect(section.getAttribute("data-required")).toBe("true");
        expect(section.textContent).toContain("Peanut");
        expect(section.querySelector("details")).toBeNull();
    });

    test("shows the status words for a status that is not known", () => {
        const section = mount({
            section: "problems",
            heading: "Problem list",
            status: "not-recorded",
            statusLabel: "In words",
        });
        expect(
            section.querySelector(".international-patient-summary-section-status")!.textContent,
        ).toBe("In words");
    });

    test("an optional section is not required, and the heading level is the one asked for", () => {
        const section = mount({ section: "results", heading: "Results", level: 3 });
        expect(section.hasAttribute("data-required")).toBe(false);
        expect(section.querySelector("h3")!.textContent).toBe("Results");
    });

    test("the narrative sits in a details, open, when it has a label", () => {
        const section = mount({ narrativeLabel: "Narrative from the document" });
        const details = section.querySelector("details") as HTMLDetailsElement;
        expect(details.open).toBe(true);
        expect(details.querySelector("summary")!.textContent).toBe("Narrative from the document");
        expect(details.textContent).toContain("Lives alone.");
    });

    test("warns in development when a status that is not known has no words", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        mount({ status: "unavailable" });
        expect(warn).toHaveBeenCalled();
    });

    describe("statusPlacement (P42-T6)", () => {
        const words = (region: HTMLElement) =>
            (region.textContent ?? "").split("In words").length - 1;

        test('"list" leaves the words to the record list: they appear once', () => {
            const section = mount({
                status: "unavailable",
                statusLabel: "In words",
                statusPlacement: "list",
            });
            expect(words(section)).toBe(1);
            expect(
                section.querySelector(".international-patient-summary-section-status"),
            ).toBeNull();
            expect(section.getAttribute("data-status")).toBe("unavailable");
        });

        test('"heading", the default, still prints the status line', () => {
            const section = mount({ status: "unavailable", statusLabel: "In words" });
            expect(
                section.querySelector(".international-patient-summary-section-status")!.textContent,
            ).toBe("In words");
        });

        test('"list" needs no statusLabel, so there is no development warning', () => {
            const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
            mount({ status: "unavailable", statusPlacement: "list" });
            expect(warn).not.toHaveBeenCalled();
        });
    });
});
