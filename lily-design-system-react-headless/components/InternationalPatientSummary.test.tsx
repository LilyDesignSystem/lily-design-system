import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./InternationalPatientSummary";

const requiredHeadings = {
    medications: "Medication summary",
    allergies: "Allergies and intolerances",
    problems: "Problem list",
};
const base = {
    label: "Patient summary",
    requiredHeadings,
    omittedLabel: "Section missing from document",
};

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("InternationalPatientSummary", () => {
    test("is an article named by its label, with the consumer's sections inside", () => {
        render(
            <Subject
                {...base}
                sections={[
                    { key: "medications", heading: "Medication summary" },
                    { key: "allergies", heading: "Allergies and intolerances" },
                    { key: "problems", heading: "Problem list" },
                ]}
            >
                <section>Entries</section>
            </Subject>,
        );
        const article = screen.getByRole("article", { name: "Patient summary" });
        expect(article.getAttribute("class")).toContain("international-patient-summary");
        expect(article.textContent).toContain("Entries");
        expect(article.querySelectorAll('[data-status="omitted"]')).toHaveLength(0);
    });

    test("adds each missing required section, in words, after the given sections", () => {
        const { container } = render(
            <Subject
                {...base}
                sections={[{ key: "problems", heading: "Problem list", status: "none-known" }]}
            />,
        );
        const added = [
            ...container.querySelectorAll(".international-patient-summary-sections > section"),
        ];
        expect(added.map((s) => s.getAttribute("data-section"))).toEqual([
            "medications",
            "allergies",
        ]);
        for (const s of added) {
            expect(s.getAttribute("data-status")).toBe("omitted");
            expect(s.getAttribute("data-required")).toBe("true");
            expect(s.textContent).toContain("Section missing from document");
        }
    });

    test("the contents follow the list, then the missing required sections", () => {
        render(
            <Subject
                {...base}
                contentsLabel="Contents"
                sections={[
                    { key: "allergies", heading: "Allergies and intolerances" },
                    { key: "results", heading: "Results", status: "not-recorded" },
                ]}
            />,
        );
        const links = within(screen.getByRole("navigation", { name: "Contents" })).getAllByRole(
            "link",
        );
        expect(links.map((a) => a.textContent)).toEqual([
            "Allergies and intolerances",
            "Results",
            "Medication summary",
            "Problem list",
        ]);
        expect(links[1].getAttribute("href")).toBe("#international-patient-summary-results");
        expect(links[2].closest("li")!.getAttribute("data-status")).toBe("omitted");
    });

    test("renders the banner first and the details last, and no navigation without contentsLabel", () => {
        const { container } = render(
            <Subject
                {...base}
                banner={<p>Banner</p>}
                details={<p>Details</p>}
            />,
        );
        const parts = [...container.querySelector("article")!.children].map((c) =>
            c.getAttribute("class"),
        );
        expect(parts[0]).toBe("international-patient-summary-banner");
        expect(parts[parts.length - 1]).toBe("international-patient-summary-details");
        expect(screen.queryByRole("navigation")).toBeNull();
    });

    test("warns in development when the label or the omitted words are missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(
            <Subject
                {...base}
                label=""
                omittedLabel=""
            />,
        );
        expect(warn).toHaveBeenCalled();
    });
});
