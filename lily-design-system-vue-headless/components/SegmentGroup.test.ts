import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./SegmentGroup.vue";

describe("SegmentGroup", () => {
    test("renders a radiogroup", () => {
        render(Subject, { props: { label: "View" }, slots: { default: "content" } });
        expect(screen.getByRole("radiogroup")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "View mode" }, slots: { default: "content" } });
        expect(screen.getByLabelText("View mode")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "View" }, slots: { default: "Grid" } });
        expect(screen.getByText("Grid")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "V", "data-testid": "sg" }, slots: { default: "x" } });
        expect(screen.getByTestId("sg")).toBeTruthy();
    });
});
