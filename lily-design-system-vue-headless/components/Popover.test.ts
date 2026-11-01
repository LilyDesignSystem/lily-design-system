import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./Popover.vue";
// jsdom has no Popover API, so these run the scripted fallback (the `hidden` attribute);
// popover-api.test.ts covers the native path with showPopover/hidePopover stubbed.
describe("Popover", () => {
    test("hidden when closed", () => {
        render(Subject, { props: { label: "Info", open: false }, slots: { default: "C" } });
        expect(screen.queryByRole("dialog")).toBeNull();
        // Kept in the DOM (so a commandfor trigger can name it), hidden by the fallback.
        expect(screen.getByRole("dialog", { hidden: true }).hasAttribute("hidden")).toBe(true);
    });
    test("visible when open", () => {
        render(Subject, { props: { label: "Info", open: true }, slots: { default: "C" } });
        expect(screen.getByRole("dialog", { name: "Info" })).toBeTruthy();
    });
    test("renders children", () => {
        render(Subject, { props: { label: "I", open: true }, slots: { default: "Content" } });
        expect(screen.getByRole("dialog").textContent).toContain("Content");
    });
    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "I", open: true, "data-testid": "po" },
            slots: { default: "C" },
        });
        expect(screen.getByTestId("po")).toBeTruthy();
    });
});
