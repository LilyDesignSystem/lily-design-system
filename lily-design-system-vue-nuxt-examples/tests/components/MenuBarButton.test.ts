import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/MenuBarButton.vue";

describe("MenuBarButton", () => {
    test("renders a menuitem", () => {
        render(Subject, { slots: { default: "File" } });
        expect(screen.getByRole("menuitem")).toBeTruthy();
    });

    test("renders as a button element", () => {
        render(Subject, { slots: { default: "File" } });
        expect(screen.getByRole("menuitem").tagName).toBe("BUTTON");
    });

    test("has type button", () => {
        render(Subject, { slots: { default: "File" } });
        expect((screen.getByRole("menuitem") as HTMLButtonElement).type).toBe("button");
    });

    test("has tabindex -1", () => {
        render(Subject, { slots: { default: "File" } });
        expect(screen.getByRole("menuitem").getAttribute("tabindex")).toBe("-1");
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "Edit" } });
        expect(screen.getByText("Edit")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "mbb" }, slots: { default: "X" } });
        expect(screen.getByTestId("mbb")).toBeTruthy();
    });
});
