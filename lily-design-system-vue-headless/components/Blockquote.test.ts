import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Blockquote.vue";


describe("Blockquote", () => {
    test("renders as a blockquote element", () => {
        const { container } = render(Subject, { slots: { default: "A quote" } });

        const el: HTMLElement | null = container.querySelector("blockquote");
        expect(el).toBeTruthy();
    });

    test("has blockquote class on root", () => {
        const { container } = render(Subject, { slots: { default: "A quote" } });

        const el: HTMLElement = container.querySelector("blockquote") as HTMLElement;
        expect(el.classList.contains("blockquote")).toBe(true);
    });

    test("renders quote content from default slot", () => {
        render(Subject, { slots: { default: "Hello world" } });

        expect(screen.getByText("Hello world")).toBeTruthy();
    });

    test("applies cite attribute when provided", () => {
        const { container } = render(Subject, {
            props: { cite: "https://example.com/source" },
            slots: { default: "A quote" },
        });

        const el: HTMLElement = container.querySelector("blockquote") as HTMLElement;
        expect(el.getAttribute("cite")).toBe("https://example.com/source");
    });

    test("does not apply cite when omitted", () => {
        const { container } = render(Subject, { slots: { default: "A quote" } });

        const el: HTMLElement = container.querySelector("blockquote") as HTMLElement;
        expect(el.getAttribute("cite")).toBeNull();
    });

    test("renders citation footer when citationText provided", () => {
        const { container } = render(Subject, {
            props: { citationText: "— Ada Lovelace" },
            slots: { default: "A quote" },
        });

        const footer: HTMLElement | null = container.querySelector("footer.blockquote-citation");
        expect(footer).toBeTruthy();
        expect(footer?.textContent).toBe("— Ada Lovelace");
    });

    test("does not render citation footer when omitted", () => {
        const { container } = render(Subject, { slots: { default: "A quote" } });

        const footer: HTMLElement | null = container.querySelector("footer.blockquote-citation");
        expect(footer).toBeNull();
    });

    test("applies aria-label when label is provided", () => {
        const { container } = render(Subject, {
            props: { label: "Famous quote" },
            slots: { default: "A quote" },
        });

        const el: HTMLElement = container.querySelector("blockquote") as HTMLElement;
        expect(el.getAttribute("aria-label")).toBe("Famous quote");
    });

    test("does not apply aria-label when omitted", () => {
        const { container } = render(Subject, { slots: { default: "A quote" } });

        const el: HTMLElement = container.querySelector("blockquote") as HTMLElement;
        expect(el.getAttribute("aria-label")).toBeNull();
    });
});
