import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./TaskBarButton.vue";

describe("TaskBarButton", () => {
    test("renders a button", () => {
        render(Subject, { slots: { default: "New" } });
        expect(screen.getByRole("button")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "Open" } });
        expect(screen.getByText("Open")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(Subject, { props: { disabled: true }, slots: { default: "X" } });
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "tbi" }, slots: { default: "X" } });
        expect(screen.getByTestId("tbi")).toBeTruthy();
    });
});
