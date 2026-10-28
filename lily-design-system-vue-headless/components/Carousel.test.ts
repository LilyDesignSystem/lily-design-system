import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Carousel.vue";

describe("Carousel", () => {
    test("renders a region", () => {
        render(Subject, { props: { label: "Gallery" }, slots: { default: "slide" } });
        expect(screen.getByRole("region")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Photo gallery" }, slots: { default: "slide" } });
        expect(screen.getByLabelText("Photo gallery")).toBeTruthy();
    });

    test("has carousel roledescription", () => {
        render(Subject, { props: { label: "Gallery" }, slots: { default: "slide" } });
        expect(screen.getByRole("region").getAttribute("aria-roledescription")).toBe("carousel");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Gallery" }, slots: { default: "Slide 1" } });
        expect(screen.getByText("Slide 1")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "G", "data-testid": "car" }, slots: { default: "x" } });
        expect(screen.getByTestId("car")).toBeTruthy();
    });
});
