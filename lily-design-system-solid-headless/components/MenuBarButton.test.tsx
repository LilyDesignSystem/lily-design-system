import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./MenuBarButton";

describe("MenuBarButton", () => {
    test("renders a menuitem", () => {
        render(() => <Subject>File</Subject>);
        expect(screen.getByRole("menuitem")).toBeTruthy();
    });

    test("renders as a button element", () => {
        render(() => <Subject>File</Subject>);
        expect(screen.getByRole("menuitem").tagName).toBe("BUTTON");
    });

    test("has type button", () => {
        render(() => <Subject>File</Subject>);
        expect((screen.getByRole("menuitem") as HTMLButtonElement).type).toBe("button");
    });

    test("has tabindex -1", () => {
        render(() => <Subject>File</Subject>);
        expect(screen.getByRole("menuitem").getAttribute("tabindex")).toBe("-1");
    });

    test("renders children", () => {
        render(() => <Subject>Edit</Subject>);
        expect(screen.getByText("Edit")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="mbb">X</Subject>);
        expect(screen.getByTestId("mbb")).toBeTruthy();
    });
});
