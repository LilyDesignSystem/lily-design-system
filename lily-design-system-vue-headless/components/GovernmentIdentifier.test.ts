import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./GovernmentIdentifier.vue";


const baseProps = {
    label: "Agency identifier",
    agencyName: "General Services Administration",
};


describe("GovernmentIdentifier", () => {
    test("renders as a region landmark with aria-label", () => {
        render(Subject, { props: baseProps });

        const region: HTMLElement = screen.getByRole("region", { name: baseProps.label });
        expect(region).toBeTruthy();
    });

    test("has government-identifier class on root", () => {
        render(Subject, { props: baseProps });

        const region: HTMLElement = screen.getByRole("region");
        expect(region.classList.contains("government-identifier")).toBe(true);
    });

    test("renders the agency name as plain text when no href", () => {
        render(Subject, { props: baseProps });

        expect(screen.getByText(baseProps.agencyName)).toBeTruthy();
    });

    test("wraps agency name in an anchor when agencyHref is provided", () => {
        render(Subject, { props: { ...baseProps, agencyHref: "https://gsa.gov" } });

        const link: HTMLAnchorElement = screen.getByRole("link", { name: baseProps.agencyName }) as HTMLAnchorElement;
        expect(link.getAttribute("href")).toBe("https://gsa.gov");
    });

    test("renders the logo image when logoUrl is provided", () => {
        const { container } = render(Subject, {
            props: { ...baseProps, logoUrl: "/logo.svg", logoAlt: "GSA" },
        });

        const img: HTMLImageElement | null = container.querySelector("img");
        expect(img).toBeTruthy();
        expect(img?.getAttribute("src")).toBe("/logo.svg");
        expect(img?.getAttribute("alt")).toBe("GSA");
    });

    test("does not render image when logoUrl is missing", () => {
        const { container } = render(Subject, { props: baseProps });

        const img: HTMLImageElement | null = container.querySelector("img");
        expect(img).toBeNull();
    });

    test("renders description when provided", () => {
        render(Subject, { props: { ...baseProps, description: "An official agency" } });

        expect(screen.getByText("An official agency")).toBeTruthy();
    });

    test("renders a navigation landmark with aria-label", () => {
        render(Subject, { props: baseProps });

        const nav: HTMLElement = screen.getByRole("navigation", { name: baseProps.label });
        expect(nav).toBeTruthy();
    });

    test("renders default slot content inside nav", () => {
        render(Subject, {
            props: baseProps,
            slots: { default: "<a href='/about'>About</a>" },
        });

        expect(screen.getByText("About")).toBeTruthy();
    });
});
