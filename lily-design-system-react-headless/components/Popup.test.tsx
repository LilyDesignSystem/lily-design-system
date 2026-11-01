import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Popup";

describe("Popup", () => {
    test("hidden when closed", () => {
        render(
            <Subject
                label="Info"
                open={false}
            >
                C
            </Subject>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
        // Kept in the DOM (so a commandfor trigger can name it), hidden by the fallback.
        expect(screen.getByRole("dialog", { hidden: true }).hasAttribute("hidden")).toBe(true);
    });

    test("visible when open", () => {
        render(
            <Subject
                label="Info"
                open
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("dialog", { name: "Info" })).toBeTruthy();
    });

    test("renders children", () => {
        render(
            <Subject
                label="I"
                open
            >
                Content
            </Subject>,
        );
        expect(screen.getByRole("dialog").textContent).toContain("Content");
    });

    test("has aria-label", () => {
        render(
            <Subject
                label="My Popup"
                open
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("dialog").getAttribute("aria-label")).toBe("My Popup");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="I"
                open
                data-testid="pu"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("pu")).toBeTruthy();
    });
});
