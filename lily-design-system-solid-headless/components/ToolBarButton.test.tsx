import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./ToolBarButton";

describe("ToolBarButton", () => {
    test("renders a button", () => {
        render(() => <Subject>Bold</Subject>);
        expect(screen.getByRole("button")).toBeTruthy();
    });

    test("has type button", () => {
        render(() => <Subject>Bold</Subject>);
        expect((screen.getByRole("button") as HTMLButtonElement).type).toBe("button");
    });

    test("renders children", () => {
        render(() => <Subject>Italic</Subject>);
        expect(screen.getByText("Italic")).toBeTruthy();
    });

    test("is not disabled by default", () => {
        render(() => <Subject>Bold</Subject>);
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(false);
    });

    test("supports disabled", () => {
        render(() => <Subject disabled>Redo</Subject>);
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="tbb">X</Subject>);
        expect(screen.getByTestId("tbb")).toBeTruthy();
    });
});
