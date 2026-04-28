import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./SectionHeading.vue";


describe("SectionHeading", () => {
    test("renders as a header element", () => {
        const { container } = render(Subject, {
            props: { heading: "Get started" },
        });

        const el: HTMLElement | null = container.querySelector("header");
        expect(el).toBeTruthy();
    });

    test("has section-heading class on root", () => {
        const { container } = render(Subject, {
            props: { heading: "Get started" },
        });

        const el: HTMLElement = container.querySelector("header") as HTMLElement;
        expect(el.classList.contains("section-heading")).toBe(true);
    });

    test("defaults heading level to h2", () => {
        render(Subject, { props: { heading: "Get started" } });

        const h2: HTMLElement = screen.getByRole("heading", { level: 2 });
        expect(h2.textContent).toBe("Get started");
        expect(h2.classList.contains("section-heading-heading")).toBe(true);
    });

    test("renders heading at given level", () => {
        render(Subject, { props: { heading: "Get started", level: 4 } });

        const h4: HTMLElement = screen.getByRole("heading", { level: 4 });
        expect(h4.textContent).toBe("Get started");
    });

    test("renders eyebrow when provided", () => {
        const { container } = render(Subject, {
            props: { heading: "Get started", eyebrow: "SECTION" },
        });

        const p: HTMLElement | null = container.querySelector("p.section-heading-eyebrow");
        expect(p?.textContent).toBe("SECTION");
    });

    test("does not render eyebrow when omitted", () => {
        const { container } = render(Subject, {
            props: { heading: "Get started" },
        });

        const p: HTMLElement | null = container.querySelector("p.section-heading-eyebrow");
        expect(p).toBeNull();
    });

    test("renders subtitle when provided", () => {
        const { container } = render(Subject, {
            props: { heading: "Get started", subtitle: "It's easy" },
        });

        const p: HTMLElement | null = container.querySelector("p.section-heading-subtitle");
        expect(p?.textContent).toBe("It's easy");
    });

    test("does not render subtitle when omitted", () => {
        const { container } = render(Subject, {
            props: { heading: "Get started" },
        });

        const p: HTMLElement | null = container.querySelector("p.section-heading-subtitle");
        expect(p).toBeNull();
    });

    test("renders all parts together in correct order", () => {
        const { container } = render(Subject, {
            props: { heading: "Get started", eyebrow: "SECTION", subtitle: "Easy" },
        });

        const header: HTMLElement = container.querySelector("header") as HTMLElement;
        const children = Array.from(header.children) as HTMLElement[];
        expect(children[0].classList.contains("section-heading-eyebrow")).toBe(true);
        expect(children[1].classList.contains("section-heading-heading")).toBe(true);
        expect(children[2].classList.contains("section-heading-subtitle")).toBe(true);
    });
});
