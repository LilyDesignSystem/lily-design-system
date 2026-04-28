import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SectionHeading";

describe("SectionHeading", () => {
    test("renders a header element with the section-heading class", () => {
        const { container } = render(<Subject heading="Title" />);

        const header = container.querySelector("header");
        expect(header).toBeTruthy();
        expect(header!.className.includes("section-heading")).toBe(true);
    });

    test("defaults to an h2", () => {
        render(<Subject heading="Title" />);

        const h2 = screen.getByRole("heading", { level: 2, name: "Title" });
        expect(h2).toBeTruthy();
        expect(h2.className.includes("section-heading-heading")).toBe(true);
    });

    test("respects the level prop for h3", () => {
        render(<Subject heading="Title" level={3} />);

        const h3 = screen.getByRole("heading", { level: 3, name: "Title" });
        expect(h3).toBeTruthy();
    });

    test("respects the level prop for h6", () => {
        render(<Subject heading="Title" level={6} />);

        const h6 = screen.getByRole("heading", { level: 6, name: "Title" });
        expect(h6).toBeTruthy();
    });

    test("renders eyebrow paragraph above the heading when provided", () => {
        const { container } = render(
            <Subject heading="Title" eyebrow="Features" />,
        );

        const eyebrow = container.querySelector("p.section-heading-eyebrow");
        expect(eyebrow).toBeTruthy();
        expect(eyebrow!.textContent).toBe("Features");
    });

    test("does not render eyebrow when omitted", () => {
        const { container } = render(<Subject heading="Title" />);

        expect(container.querySelector("p.section-heading-eyebrow")).toBeNull();
    });

    test("renders subtitle paragraph below the heading when provided", () => {
        const { container } = render(
            <Subject heading="Title" subtitle="Tagline" />,
        );

        const subtitle = container.querySelector("p.section-heading-subtitle");
        expect(subtitle).toBeTruthy();
        expect(subtitle!.textContent).toBe("Tagline");
    });

    test("does not render subtitle when omitted", () => {
        const { container } = render(<Subject heading="Title" />);

        expect(container.querySelector("p.section-heading-subtitle")).toBeNull();
    });

    test("appends consumer className to the root", () => {
        const { container } = render(
            <Subject heading="Title" className="extra" />,
        );

        const header = container.querySelector("header");
        expect(header!.className.includes("section-heading")).toBe(true);
        expect(header!.className.includes("extra")).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject heading="Title" id="sh-1" />);

        const root = document.querySelector('[id="sh-1"]');
        expect(root).toBeTruthy();
    });
});
