import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/AccordionNav.vue";

describe("AccordionNav", () => {
    test("renders a nav element", () => {
        render(Subject, { props: { label: "FAQ" }, slots: { default: "content" } });
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "FAQ" }, slots: { default: "content" } });
        expect(screen.getByLabelText("FAQ")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "FAQ" }, slots: { default: "Question" } });
        expect(screen.getByText("Question")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "aan" }, slots: { default: "x" } });
        expect(screen.getByTestId("aan")).toBeTruthy();
    });
});
