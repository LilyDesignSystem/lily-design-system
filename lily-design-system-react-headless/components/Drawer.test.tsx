import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Drawer";

describe("Drawer", () => {
    test("hidden when open is false", () => {
        render(
            <Subject
                label="Nav"
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
                label="Nav"
                open
            >
                Content
            </Subject>,
        );
        expect(screen.getByRole("dialog", { name: "Nav" })).toBeTruthy();
    });

    test("has aria-modal", () => {
        render(
            <Subject
                label="Nav"
                open
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("has data-side attribute", () => {
        render(
            <Subject
                label="Nav"
                open
                side="right"
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("right");
    });

    test("defaults to left side", () => {
        render(
            <Subject
                label="Nav"
                open
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("left");
    });

    test("Escape closes the drawer", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="Nav"
                open
            >
                C
            </Subject>,
        );
        screen.getByRole("dialog").focus();
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("renders children", () => {
        render(
            <Subject
                label="Nav"
                open
            >
                Drawer content
            </Subject>,
        );
        expect(screen.getByRole("dialog").textContent).toContain("Drawer content");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Nav"
                open
                data-testid="dr"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("dr")).toBeTruthy();
    });
});
