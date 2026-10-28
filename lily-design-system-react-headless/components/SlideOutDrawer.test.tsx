import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SlideOutDrawer";

describe("SlideOutDrawer", () => {
    test("does not render when open is false", () => {
        render(
            <Subject
                label="Drawer"
                open={false}
            >
                Content
            </Subject>,
        );

        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("renders when open is true", () => {
        render(
            <Subject
                label="Drawer"
                open
            >
                Content
            </Subject>,
        );

        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(
            <Subject
                label="Navigation"
                open
            >
                Content
            </Subject>,
        );

        const el = screen.getByRole("dialog");
        expect(el.getAttribute("aria-label")).toBe("Navigation");
    });

    test("has aria-modal set to true", () => {
        render(
            <Subject
                label="Drawer"
                open
            >
                Content
            </Subject>,
        );

        const el = screen.getByRole("dialog");
        expect(el.getAttribute("aria-modal")).toBe("true");
    });

    test("has tabindex for focus management", () => {
        render(
            <Subject
                label="Drawer"
                open
            >
                Content
            </Subject>,
        );

        const el = screen.getByRole("dialog");
        expect(el.getAttribute("tabindex")).toBe("-1");
    });

    test("renders children content", () => {
        render(
            <Subject
                label="Drawer"
                open
            >
                Drawer content
            </Subject>,
        );

        const el = screen.getByRole("dialog");
        expect(el.textContent).toContain("Drawer content");
    });

    test("closes on Escape key", async () => {
        render(
            <Subject
                label="Drawer"
                open
            >
                Content
            </Subject>,
        );

        const el = screen.getByRole("dialog");
        await fireEvent.keyDown(el, { key: "Escape" });

        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Drawer"
                open
                data-testid="my-drawer"
            >
                Content
            </Subject>,
        );

        expect(screen.getByTestId("my-drawer")).toBeTruthy();
    });

    test("renders as a div element", () => {
        render(
            <Subject
                label="Drawer"
                open
            >
                Content
            </Subject>,
        );

        const el = screen.getByRole("dialog");
        expect(el.tagName).toBe("DIV");
    });
});
