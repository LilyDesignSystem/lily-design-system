import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Pictogram.vue";


describe("Pictogram", () => {
    test("renders as a figure element", () => {
        const { container } = render(Subject, {
            slots: { icon: "<span>I</span>" },
        });

        const fig: HTMLElement | null = container.querySelector("figure");
        expect(fig).toBeTruthy();
    });

    test("has pictogram class on root", () => {
        const { container } = render(Subject, {
            slots: { icon: "<span>I</span>" },
        });

        const fig: HTMLElement = container.querySelector("figure") as HTMLElement;
        expect(fig.classList.contains("pictogram")).toBe(true);
    });

    test("defaults layout to centered", () => {
        const { container } = render(Subject, {
            slots: { icon: "<span>I</span>" },
        });

        const fig: HTMLElement = container.querySelector("figure") as HTMLElement;
        expect(fig.getAttribute("data-layout")).toBe("centered");
    });

    test("applies layout when provided", () => {
        const { container } = render(Subject, {
            props: { layout: "side" },
            slots: { icon: "<span>I</span>" },
        });

        const fig: HTMLElement = container.querySelector("figure") as HTMLElement;
        expect(fig.getAttribute("data-layout")).toBe("side");
    });

    test("renders icon slot inside aria-hidden wrapper", () => {
        const { container } = render(Subject, {
            slots: { icon: "<span>ICON</span>" },
        });

        const wrapper: HTMLElement = container.querySelector(".pictogram-icon") as HTMLElement;
        expect(wrapper).toBeTruthy();
        expect(wrapper.getAttribute("aria-hidden")).toBe("true");
        expect(wrapper.textContent).toContain("ICON");
    });

    test("renders heading inside figcaption when provided", () => {
        const { container } = render(Subject, {
            props: { heading: "Fast" },
            slots: { icon: "<span>I</span>" },
        });

        const caption: HTMLElement = container.querySelector("figcaption.pictogram-caption") as HTMLElement;
        const h3: HTMLElement | null = caption.querySelector("h3.pictogram-heading");
        expect(h3?.textContent).toBe("Fast");
    });

    test("renders description paragraph when provided and no default slot", () => {
        const { container } = render(Subject, {
            props: { description: "Lightning quick" },
            slots: { icon: "<span>I</span>" },
        });

        const p: HTMLElement | null = container.querySelector("p.pictogram-description");
        expect(p?.textContent).toBe("Lightning quick");
    });

    test("default slot overrides description when both provided", () => {
        const { container } = render(Subject, {
            props: { description: "Lightning quick" },
            slots: { icon: "<span>I</span>", default: "<span>Custom content</span>" },
        });

        const p: HTMLElement | null = container.querySelector("p.pictogram-description");
        expect(p).toBeNull();
        expect(screen.getByText("Custom content")).toBeTruthy();
    });

    test("applies aria-label when label provided", () => {
        const { container } = render(Subject, {
            props: { label: "Performance pictogram" },
            slots: { icon: "<span>I</span>" },
        });

        const fig: HTMLElement = container.querySelector("figure") as HTMLElement;
        expect(fig.getAttribute("aria-label")).toBe("Performance pictogram");
    });

    test("does not apply aria-label when omitted", () => {
        const { container } = render(Subject, {
            slots: { icon: "<span>I</span>" },
        });

        const fig: HTMLElement = container.querySelector("figure") as HTMLElement;
        expect(fig.getAttribute("aria-label")).toBeNull();
    });
});
