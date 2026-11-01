import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./Popover";

// jsdom has no Popover API, so these run the scripted fallback (the `hidden` attribute);
// popover-api.test.tsx covers the native path with showPopover/hidePopover stubbed.
describe("Popover", () => {
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
    test("passes through attributes", () => {
        render(
            <Subject
                label="I"
                open
                data-testid="po"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("po")).toBeTruthy();
    });
});
