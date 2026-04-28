import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Blockquote";

describe("Blockquote", () => {
    test("applies the blockquote root class", () => {
        const { container } = render(<Subject>Quote</Subject>);

        const root = container.querySelector("blockquote");
        expect(root).toBeTruthy();
        expect(root!.className.includes("blockquote")).toBe(true);
    });

    test("renders children content", () => {
        const { container } = render(<Subject>Hello world</Subject>);

        const root = container.querySelector("blockquote");
        expect(root!.textContent).toContain("Hello world");
    });

    test("renders the cite attribute on the blockquote", () => {
        const { container } = render(
            <Subject cite="https://example.com/source">Quote</Subject>,
        );

        const root = container.querySelector("blockquote");
        expect(root!.getAttribute("cite")).toBe("https://example.com/source");
    });

    test("renders citationText inside a footer when provided", () => {
        const { container } = render(
            <Subject citationText="— Jane Doe">Quote</Subject>,
        );

        const footer = container.querySelector("blockquote footer");
        expect(footer).toBeTruthy();
        expect(footer!.className.includes("blockquote-citation")).toBe(true);
        expect(footer!.textContent).toBe("— Jane Doe");
    });

    test("does not render a footer when citationText is omitted", () => {
        const { container } = render(<Subject>Quote</Subject>);

        const footer = container.querySelector("blockquote footer");
        expect(footer).toBeNull();
    });

    test("applies aria-label when label is provided", () => {
        const { container } = render(
            <Subject label="Famous quote">Quote</Subject>,
        );

        const root = container.querySelector("blockquote");
        expect(root!.getAttribute("aria-label")).toBe("Famous quote");
    });

    test("appends consumer className to the root", () => {
        const { container } = render(<Subject className="extra">Quote</Subject>);

        const root = container.querySelector("blockquote");
        expect(root!.className.includes("blockquote")).toBe(true);
        expect(root!.className.includes("extra")).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(
            <Subject id="quote-1">Quote</Subject>,
        );

        const root = container.querySelector('[id="quote-1"]');
        expect(root).toBeTruthy();
    });
});
