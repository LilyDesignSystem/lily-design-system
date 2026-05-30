import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BarcodeImage";

describe("BarcodeImage", () => {
    test("renders an img element with class barcode-image", () => {
        const { container } = render(<Subject src="/barcode-image.svg" alt="Order 1" />);
        const root = container.querySelector(".barcode-image");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("IMG");
    });

    test("sets the src attribute", () => {
        const { container } = render(<Subject src="/barcode-image.svg" alt="Order 1" />);
        const root = container.querySelector(".barcode-image");
        expect(root?.getAttribute("src")).toBe("/barcode-image.svg");
    });

    test("sets the alt attribute", () => {
        const { container } = render(<Subject src="/barcode-image.svg" alt="Order number 12345" />);
        const root = container.querySelector(".barcode-image");
        expect(root?.getAttribute("alt")).toBe("Order number 12345");
    });

    test("does not set loading when loading is omitted", () => {
        const { container } = render(<Subject src="/barcode-image.svg" alt="Order 1" />);
        const root = container.querySelector(".barcode-image");
        expect(root?.getAttribute("loading")).toBeNull();
    });

    test("applies loading attribute when provided", () => {
        const { container } = render(<Subject src="/barcode-image.svg" alt="Order 1" loading="lazy" />);
        const root = container.querySelector(".barcode-image");
        expect(root?.getAttribute("loading")).toBe("lazy");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Subject src="/barcode-image.svg" alt="Order 1" data-testid="subject" />);
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });
});
