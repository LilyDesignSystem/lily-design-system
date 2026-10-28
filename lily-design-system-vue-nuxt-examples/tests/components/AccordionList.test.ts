import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/AccordionList.vue";

describe("AccordionList", () => {
    test("renders a group", () => {
        render(Subject, { slots: { default: "content" } });
        expect(screen.getByRole("group")).toBeTruthy();
    });

    test("has aria-label when provided", () => {
        render(Subject, { props: { label: "Questions" }, slots: { default: "content" } });
        expect(screen.getByLabelText("Questions")).toBeTruthy();
    });

    test("no aria-label when label is empty", () => {
        render(Subject, { slots: { default: "content" } });
        expect(screen.getByRole("group").getAttribute("aria-label")).toBeNull();
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "Items here" } });
        expect(screen.getByText("Items here")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "al" }, slots: { default: "x" } });
        expect(screen.getByTestId("al")).toBeTruthy();
    });
});
