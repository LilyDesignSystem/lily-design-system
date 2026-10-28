import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/ToggleGroup.vue";

describe("ToggleGroup", () => {
    test("renders a group", () => {
        render(Subject, { props: { label: "Format" }, slots: { default: "content" } });
        expect(screen.getByRole("group")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Format" }, slots: { default: "content" } });
        expect(screen.getByLabelText("Format")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Format" }, slots: { default: "Bold" } });
        expect(screen.getByText("Bold")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "tg" }, slots: { default: "x" } });
        expect(screen.getByTestId("tg")).toBeTruthy();
    });
});
