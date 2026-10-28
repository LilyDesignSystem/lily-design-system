import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TabBarButton";

describe("TabBarButton", () => {
    test("renders a tab", () => {
        render(<Subject controls="panel-1">Dashboard</Subject>);
        expect(screen.getByRole("tab")).toBeTruthy();
    });

    test("renders as a button element", () => {
        render(<Subject controls="panel-1">Dashboard</Subject>);
        expect(screen.getByRole("tab").tagName).toBe("BUTTON");
    });

    test("renders children", () => {
        render(<Subject controls="panel-1">Settings</Subject>);
        expect(screen.getByRole("tab").textContent).toContain("Settings");
    });

    test("is not selected by default", () => {
        render(<Subject controls="panel-1">Tab</Subject>);
        expect(screen.getByRole("tab").getAttribute("aria-selected")).toBe("false");
    });

    test("reflects selected state when true", () => {
        render(
            <Subject
                selected
                controls="panel-1"
            >
                Tab
            </Subject>,
        );
        expect(screen.getByRole("tab").getAttribute("aria-selected")).toBe("true");
    });

    test("has aria-controls pointing to panel id", () => {
        render(<Subject controls="settings-panel">Settings</Subject>);
        expect(screen.getByRole("tab").getAttribute("aria-controls")).toBe("settings-panel");
    });

    test("has tabindex 0 when selected", () => {
        render(
            <Subject
                selected
                controls="panel-1"
            >
                Tab
            </Subject>,
        );
        expect(screen.getByRole("tab").getAttribute("tabindex")).toBe("0");
    });

    test("has tabindex -1 when not selected", () => {
        render(<Subject controls="panel-1">Tab</Subject>);
        expect(screen.getByRole("tab").getAttribute("tabindex")).toBe("-1");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                controls="panel-1"
                data-testid="my-tab"
            >
                Tab
            </Subject>,
        );
        expect(screen.getByTestId("my-tab")).toBeTruthy();
    });
});
