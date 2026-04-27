import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./GovernmentIdentifier";

describe("GovernmentIdentifier", () => {
    test("renders a section with aria-label", () => {
        const { container } = render(
            <Subject label="Agency identifier" agencyName="GSA" />
        );

        const section: HTMLElement = container.querySelector("section")!;
        expect(section.getAttribute("aria-label")).toBe("Agency identifier");
    });

    test("applies the government-identifier root class", () => {
        const { container } = render(
            <Subject label="Agency" agencyName="GSA" />
        );

        const section: HTMLElement = container.querySelector("section")!;
        expect(section.className.includes("government-identifier")).toBe(true);
    });

    test("renders the agency name inside a span when no agencyHref", () => {
        const { container } = render(
            <Subject label="Agency" agencyName="General Services Administration" />
        );

        const anchor: HTMLElement | null = container.querySelector("a");
        expect(anchor).toBeNull();
        expect(container.textContent).toContain("General Services Administration");
    });

    test("wraps the agency name in an anchor when agencyHref is provided", () => {
        render(
            <Subject
                label="Agency"
                agencyName="GSA"
                agencyHref="https://gsa.gov"
            />
        );

        const link: HTMLElement = screen.getByRole("link", { name: "GSA" });
        expect(link.getAttribute("href")).toBe("https://gsa.gov");
    });

    test("renders a logo image when logoUrl is provided", () => {
        render(
            <Subject
                label="Agency"
                agencyName="GSA"
                logoUrl="/logo.svg"
                logoAlt="GSA logo"
            />
        );

        const img: HTMLElement = screen.getByRole("img", { name: "GSA logo" });
        expect(img.getAttribute("src")).toBe("/logo.svg");
    });

    test("does not render an image when logoUrl is omitted", () => {
        const { container } = render(
            <Subject label="Agency" agencyName="GSA" />
        );

        const img: HTMLElement | null = container.querySelector("img");
        expect(img).toBeNull();
    });

    test("renders the description when provided", () => {
        const { container } = render(
            <Subject
                label="Agency"
                agencyName="GSA"
                description="Official website description"
            />
        );

        expect(container.textContent).toContain("Official website description");
    });

    test("renders required-links nav when children are provided", () => {
        render(
            <Subject label="Agency identifier" agencyName="GSA">
                <ul>
                    <li>
                        <a href="/about">About</a>
                    </li>
                </ul>
            </Subject>
        );

        const nav: HTMLElement = screen.getByRole("navigation", {
            name: "Agency identifier",
        });
        expect(nav).toBeTruthy();
    });

    test("does not render nav when no children are provided", () => {
        const { container } = render(
            <Subject label="Agency" agencyName="GSA" />
        );

        const nav: HTMLElement | null = container.querySelector("nav");
        expect(nav).toBeNull();
    });
});
