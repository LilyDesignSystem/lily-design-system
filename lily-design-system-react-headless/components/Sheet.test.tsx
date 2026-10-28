import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Sheet";

describe("Sheet", () => {
    test("not visible when closed", () => {
        render(
            <Subject
                label="Settings"
                open={false}
            >
                content
            </Subject>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open", () => {
        render(
            <Subject
                label="Settings"
                open
            >
                content
            </Subject>,
        );
        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(
            <Subject
                label="Settings"
                open
            >
                content
            </Subject>,
        );
        expect(screen.getByLabelText("Settings")).toBeTruthy();
    });

    test("has aria-modal", () => {
        render(
            <Subject
                label="Settings"
                open
            >
                content
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("has data-side attribute", () => {
        render(
            <Subject
                label="S"
                open
                side="left"
            >
                x
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("left");
    });

    test("closes on Escape", async () => {
        render(
            <Subject
                label="S"
                open
            >
                content
            </Subject>,
        );
        const dialog = screen.getByRole("dialog");
        dialog.focus();
        fireEvent.keyDown(dialog, { key: "Escape" });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="S"
                open
                data-testid="sh"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("sh")).toBeTruthy();
    });
});
