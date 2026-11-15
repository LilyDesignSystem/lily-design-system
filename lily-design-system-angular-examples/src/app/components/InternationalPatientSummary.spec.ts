import { Component, input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { InternationalPatientSummary } from "./InternationalPatientSummary";
import type { IpsSectionEntry } from "./ips-sections";

@Component({
    standalone: true,
    imports: [InternationalPatientSummary],
    template: `<lily-international-patient-summary label="Patient summary" [sections]="sections()" [requiredHeadings]="headings" omittedLabel="Section missing from document" [contentsLabel]="contentsLabel()"><p banner>Banner</p><section class="given">Entries</section><p details>Details</p></lily-international-patient-summary>`,
})
class Host {
    readonly sections = input<IpsSectionEntry[]>([]);
    readonly contentsLabel = input<string>("");
    readonly headings = {
        medications: "Medication summary",
        allergies: "Allergies and intolerances",
        problems: "Problem list",
    };
}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

function mount(sections: IpsSectionEntry[], contentsLabel = "") {
    const fixture = TestBed.createComponent(Host);
    fixture.componentRef.setInput("sections", sections);
    fixture.componentRef.setInput("contentsLabel", contentsLabel);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector(
        "article.international-patient-summary",
    ) as HTMLElement;
}

describe("InternationalPatientSummary", () => {
    test("is an article named by its label, with the banner first, the sections, and the details last", () => {
        const article = mount([
            { key: "medications", heading: "Medication summary" },
            { key: "allergies", heading: "Allergies and intolerances" },
            { key: "problems", heading: "Problem list" },
        ]);
        expect(article.getAttribute("aria-label")).toBe("Patient summary");
        const parts = [...article.children].map((c) => c.getAttribute("class"));
        expect(parts[0]).toBe("international-patient-summary-banner");
        expect(parts[parts.length - 1]).toBe("international-patient-summary-details");
        expect(article.querySelector(".international-patient-summary-banner")!.textContent).toBe(
            "Banner",
        );
        expect(
            article.querySelector(".international-patient-summary-sections .given"),
        ).toBeTruthy();
        expect(article.querySelectorAll('section[data-status="omitted"]')).toHaveLength(0);
    });

    test("adds each missing required section, in words, after the given sections", () => {
        const article = mount([{ key: "problems", heading: "Problem list", status: "none-known" }]);
        const added = [...article.querySelectorAll('section[data-status="omitted"]')];
        expect(added.map((s) => s.getAttribute("data-section"))).toEqual([
            "medications",
            "allergies",
        ]);
        for (const s of added) {
            expect(s.getAttribute("data-required")).toBe("true");
            expect(s.textContent).toContain("Section missing from document");
        }
    });

    test("the contents follow the list, then the missing required sections, and only with contentsLabel", () => {
        expect(mount([]).querySelector("nav")).toBeNull();
        const article = mount(
            [
                { key: "allergies", heading: "Allergies and intolerances" },
                { key: "results", heading: "Results", status: "not-recorded" },
            ],
            "Contents",
        );
        const nav = article.querySelector("nav.international-patient-summary-contents")!;
        expect(nav.getAttribute("aria-label")).toBe("Contents");
        const links = [...nav.querySelectorAll("a")];
        expect(links.map((a) => a.textContent)).toEqual([
            "Allergies and intolerances",
            "Results",
            "Medication summary",
            "Problem list",
        ]);
        expect(links[1].getAttribute("href")).toBe("#international-patient-summary-results");
        expect(links[2].closest("li")!.getAttribute("data-status")).toBe("omitted");
    });
});
