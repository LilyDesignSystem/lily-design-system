import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Pictogram";

describe("Pictogram", () => {
    test("renders as a figure element", () => {
        const { container } = render(<Subject icon={<svg data-id="i" />} />);

        const figure = container.querySelector("figure");
        expect(figure).toBeTruthy();
    });

    test("applies the pictogram root class", () => {
        const { container } = render(<Subject icon={<svg />} />);

        const figure = container.querySelector("figure");
        expect(figure!.className.includes("pictogram")).toBe(true);
    });

    test("defaults layout to centered and exposes data-layout", () => {
        const { container } = render(<Subject icon={<svg />} />);

        const figure = container.querySelector("figure");
        expect(figure!.getAttribute("data-layout")).toBe("centered");
    });

    test("respects layout prop", () => {
        const { container } = render(
            <Subject icon={<svg />} layout="side" />,
        );

        const figure = container.querySelector("figure");
        expect(figure!.getAttribute("data-layout")).toBe("side");
    });

    test("renders the icon inside an aria-hidden wrapper", () => {
        const { container } = render(
            <Subject icon={<svg data-testid="my-icon" />} />,
        );

        const iconWrapper = container.querySelector(".pictogram-icon");
        expect(iconWrapper).toBeTruthy();
        expect(iconWrapper!.getAttribute("aria-hidden")).toBe("true");
        expect(iconWrapper!.querySelector("svg")).toBeTruthy();
    });

    test("renders heading inside figcaption when provided", () => {
        render(<Subject icon={<svg />} heading="Privacy" />);

        const h3 = screen.getByRole("heading", { level: 3, name: "Privacy" });
        expect(h3).toBeTruthy();
        expect(h3.className.includes("pictogram-heading")).toBe(true);
    });

    test("renders description paragraph when provided", () => {
        const { container } = render(
            <Subject icon={<svg />} description="Body text" />,
        );

        const p = container.querySelector("p.pictogram-description");
        expect(p).toBeTruthy();
        expect(p!.textContent).toBe("Body text");
    });

    test("children override description when both provided", () => {
        const { container } = render(
            <Subject icon={<svg />} description="Body text">
                <p data-id="custom">Custom body</p>
            </Subject>,
        );

        const custom = container.querySelector('[data-id="custom"]');
        expect(custom).toBeTruthy();
        expect(container.querySelector("p.pictogram-description")).toBeNull();
    });

    test("applies aria-label when label is provided", () => {
        const { container } = render(
            <Subject icon={<svg />} label="Pictogram label" />,
        );

        const figure = container.querySelector("figure");
        expect(figure!.getAttribute("aria-label")).toBe("Pictogram label");
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject icon={<svg />} id="pic-1" />);

        const figure = document.querySelector('[id="pic-1"]');
        expect(figure).toBeTruthy();
    });
});
