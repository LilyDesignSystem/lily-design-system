import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./FeaturePhoto";

describe("FeaturePhoto", () => {
    test("renders a figure with class feature-photo", () => {
        const { container } = render(
            <Subject src="/p.jpg" alt="A photo" />
        );
        const fig = container.querySelector(".feature-photo");
        expect(fig).toBeTruthy();
        expect(fig?.tagName).toBe("FIGURE");
    });

    test("renders an img with src and alt", () => {
        const { container } = render(<Subject src="/p.jpg" alt="A photo" />);
        const img = container.querySelector("img.feature-photo-image") as HTMLImageElement;
        expect(img).toBeTruthy();
        expect(img.getAttribute("src")).toBe("/p.jpg");
        expect(img.getAttribute("alt")).toBe("A photo");
    });

    test("defaults loading to lazy", () => {
        const { container } = render(<Subject src="/p.jpg" alt="A" />);
        expect(container.querySelector("img")?.getAttribute("loading")).toBe("lazy");
    });

    test("supports loading=eager", () => {
        const { container } = render(<Subject src="/p.jpg" alt="A" loading="eager" />);
        expect(container.querySelector("img")?.getAttribute("loading")).toBe("eager");
    });

    test("applies width and height attributes", () => {
        const { container } = render(<Subject src="/p.jpg" alt="A" width={1200} height={800} />);
        const img = container.querySelector("img");
        expect(img?.getAttribute("width")).toBe("1200");
        expect(img?.getAttribute("height")).toBe("800");
    });

    test("omits figcaption when neither caption nor credit is provided", () => {
        const { container } = render(<Subject src="/p.jpg" alt="A" />);
        expect(container.querySelector("figcaption")).toBeNull();
    });

    test("renders caption when provided", () => {
        const { container } = render(<Subject src="/p.jpg" alt="A" caption="Sunset over the harbour" />);
        expect(container.querySelector(".feature-photo-caption-text")?.textContent).toBe("Sunset over the harbour");
    });

    test("renders credit when provided", () => {
        const { container } = render(<Subject src="/p.jpg" alt="A" credit="Jane Photographer" />);
        expect(container.querySelector(".feature-photo-credit")?.textContent).toBe("Jane Photographer");
    });

    test("renders both caption and credit inside one figcaption", () => {
        const { container } = render(
            <Subject src="/p.jpg" alt="A" caption="A scene" credit="Jane" />
        );
        const cap = container.querySelector("figcaption");
        expect(cap?.querySelector(".feature-photo-caption-text")?.textContent).toBe("A scene");
        expect(cap?.querySelector(".feature-photo-credit")?.textContent).toBe("Jane");
    });

    test("accepts empty alt for decorative images", () => {
        const { container } = render(<Subject src="/p.jpg" alt="" />);
        expect(container.querySelector("img")?.getAttribute("alt")).toBe("");
    });
});
