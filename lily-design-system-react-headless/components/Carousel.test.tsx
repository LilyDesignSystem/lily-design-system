import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Carousel";

describe("Carousel", () => {
    test("renders a region", () => {
        render(<Subject label="Gallery">slide</Subject>);
        expect(screen.getByRole("region")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Photo gallery">slide</Subject>);
        expect(screen.getByLabelText("Photo gallery")).toBeTruthy();
    });

    test("has carousel roledescription", () => {
        render(<Subject label="Gallery">slide</Subject>);
        expect(screen.getByRole("region").getAttribute("aria-roledescription")).toBe("carousel");
    });

    test("renders children", () => {
        render(<Subject label="Gallery">Slide 1</Subject>);
        expect(screen.getByText("Slide 1")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="G"
                data-testid="car"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("car")).toBeTruthy();
    });
});
