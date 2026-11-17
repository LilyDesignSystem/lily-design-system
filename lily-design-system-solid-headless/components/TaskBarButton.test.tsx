import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./TaskBarButton";

describe("TaskBarButton", () => {
    test("renders a button", () => {
        render(() => <Subject>New</Subject>);
        expect(screen.getByRole("button")).toBeTruthy();
    });

    test("renders children", () => {
        render(() => <Subject>Open</Subject>);
        expect(screen.getByText("Open")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(() => <Subject disabled>X</Subject>);
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="tbi">X</Subject>);
        expect(screen.getByTestId("tbi")).toBeTruthy();
    });
});
