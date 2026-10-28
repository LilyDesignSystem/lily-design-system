import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ToolBarButton.vue";

describe("ToolBarButton", () => {
    test("renders a button", () => {
        render(Subject, { slots: { default: "Bold" } });
        expect(screen.getByRole("button")).toBeTruthy();
    });

    test("has type button", () => {
        render(Subject, { slots: { default: "Bold" } });
        expect((screen.getByRole("button") as HTMLButtonElement).type).toBe("button");
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "Italic" } });
        expect(screen.getByText("Italic")).toBeTruthy();
    });

    test("is not disabled by default", () => {
        render(Subject, { slots: { default: "Bold" } });
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(false);
    });

    test("supports disabled", () => {
        render(Subject, { props: { disabled: true }, slots: { default: "Redo" } });
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "tbb" }, slots: { default: "X" } });
        expect(screen.getByTestId("tbb")).toBeTruthy();
    });
});
