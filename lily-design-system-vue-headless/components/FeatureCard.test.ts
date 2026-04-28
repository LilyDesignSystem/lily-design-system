import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./FeatureCard.vue";


describe("FeatureCard", () => {
    test("renders as an article element", () => {
        const { container } = render(Subject, {
            props: { heading: "Privacy first" },
        });

        const el: HTMLElement | null = container.querySelector("article");
        expect(el).toBeTruthy();
    });

    test("has feature-card class on root", () => {
        const { container } = render(Subject, {
            props: { heading: "Privacy first" },
        });

        const el: HTMLElement = container.querySelector("article") as HTMLElement;
        expect(el.classList.contains("feature-card")).toBe(true);
    });

    test("renders heading inside an h3", () => {
        render(Subject, { props: { heading: "Privacy first" } });

        const h3: HTMLElement = screen.getByRole("heading", { level: 3 });
        expect(h3.textContent).toBe("Privacy first");
        expect(h3.classList.contains("feature-card-heading")).toBe(true);
    });

    test("uses heading as aria-label by default", () => {
        const { container } = render(Subject, {
            props: { heading: "Privacy first" },
        });

        const el: HTMLElement = container.querySelector("article") as HTMLElement;
        expect(el.getAttribute("aria-label")).toBe("Privacy first");
    });

    test("uses label override when provided", () => {
        const { container } = render(Subject, {
            props: { heading: "Privacy first", label: "Privacy feature card" },
        });

        const el: HTMLElement = container.querySelector("article") as HTMLElement;
        expect(el.getAttribute("aria-label")).toBe("Privacy feature card");
    });

    test("defaults image-position to start", () => {
        const { container } = render(Subject, {
            props: { heading: "Privacy first" },
        });

        const el: HTMLElement = container.querySelector("article") as HTMLElement;
        expect(el.getAttribute("data-image-position")).toBe("start");
    });

    test("applies image-position when provided", () => {
        const { container } = render(Subject, {
            props: { heading: "Privacy first", imagePosition: "top" },
        });

        const el: HTMLElement = container.querySelector("article") as HTMLElement;
        expect(el.getAttribute("data-image-position")).toBe("top");
    });

    test("renders image when imageUrl is provided", () => {
        const { container } = render(Subject, {
            props: { heading: "Privacy first", imageUrl: "/p.png", imageAlt: "Decorative" },
        });

        const img: HTMLImageElement | null = container.querySelector("img.feature-card-image");
        expect(img).toBeTruthy();
        expect(img?.getAttribute("src")).toBe("/p.png");
        expect(img?.getAttribute("alt")).toBe("Decorative");
    });

    test("does not render image when imageUrl is omitted", () => {
        const { container } = render(Subject, {
            props: { heading: "Privacy first" },
        });

        const img: HTMLElement | null = container.querySelector("img.feature-card-image");
        expect(img).toBeNull();
    });

    test("renders description when provided", () => {
        const { container } = render(Subject, {
            props: { heading: "Privacy first", description: "We protect your data." },
        });

        const p: HTMLElement | null = container.querySelector("p.feature-card-description");
        expect(p).toBeTruthy();
        expect(p?.textContent).toBe("We protect your data.");
    });

    test("does not render description paragraph when omitted", () => {
        const { container } = render(Subject, {
            props: { heading: "Privacy first" },
        });

        const p: HTMLElement | null = container.querySelector("p.feature-card-description");
        expect(p).toBeNull();
    });

    test("renders default slot content", () => {
        render(Subject, {
            props: { heading: "Privacy first" },
            slots: { default: "<a href=\"/p\">Read</a>" },
        });

        expect(screen.getByText("Read")).toBeTruthy();
    });
});
