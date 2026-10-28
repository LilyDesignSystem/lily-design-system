import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Dialog";

describe("Dialog", () => {
    test("hidden when open is false", () => {
        render(
            <Subject
                label="Confirm"
                open={false}
            >
                Content
            </Subject>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open is true", () => {
        render(
            <Subject
                label="Confirm"
                open
            >
                Content
            </Subject>,
        );
        expect(screen.getByRole("dialog", { name: "Confirm" })).toBeTruthy();
    });

    test("has aria-label", () => {
        render(
            <Subject
                label="Settings"
                open
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("aria-label")).toBe("Settings");
    });

    test("has aria-modal when modal", () => {
        render(
            <Subject
                label="D"
                open
                modal
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("no aria-modal when non-modal", () => {
        render(
            <Subject
                label="D"
                open
                modal={false}
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBeNull();
    });

    test("renders children", () => {
        render(
            <Subject
                label="D"
                open
            >
                Hello dialog
            </Subject>,
        );
        expect(screen.getByRole("dialog").textContent).toContain("Hello dialog");
    });

    test("Escape key closes the dialog", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="D"
                open
            >
                C
            </Subject>,
        );
        const dialog = screen.getByRole("dialog");
        dialog.focus();
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="D"
                open
                data-testid="dlg"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("dlg")).toBeTruthy();
    });
});
