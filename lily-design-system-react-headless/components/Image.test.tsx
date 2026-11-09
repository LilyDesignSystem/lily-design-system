import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./Image";
describe("Image", () => {
    test("renders an img", () => {
        render(
            <Subject
                src="/photo.jpg"
                alt="A photo"
            />,
        );
        expect(screen.getByRole("img", { name: "A photo" })).toBeTruthy();
    });
    test("has correct src", () => {
        render(
            <Subject
                src="/img.png"
                alt="Pic"
            />,
        );
        expect(screen.getByRole("img").getAttribute("src")).toBe("/img.png");
    });
    test("renders a bare img, never a figure", () => {
        const { container } = render(
            <Subject
                src="/x.jpg"
                alt="X"
            />,
        );
        expect(container.querySelector("img.image")).toBeTruthy();
        expect(container.querySelector("figure")).toBeNull();
    });
    test("passes through attributes", () => {
        render(
            <Subject
                src="/x.jpg"
                alt="X"
                data-testid="img"
            />,
        );
        expect(screen.getByTestId("img")).toBeTruthy();
    });
});
