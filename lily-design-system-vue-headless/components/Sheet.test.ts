import { render, screen } from "@testing-library/vue";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Sheet.vue";

describe("Sheet", () => {
    test("not visible when closed", () => {
        render(Subject, {
            props: { label: "Settings", open: false },
            slots: { default: "content" },
        });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open", () => {
        render(Subject, {
            props: { label: "Settings", open: true },
            slots: { default: "content" },
        });
        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Settings", open: true },
            slots: { default: "content" },
        });
        expect(screen.getByLabelText("Settings")).toBeTruthy();
    });

    test("has aria-modal", () => {
        render(Subject, {
            props: { label: "Settings", open: true },
            slots: { default: "content" },
        });
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("has data-side attribute", () => {
        render(Subject, {
            props: { label: "S", open: true, side: "left" },
            slots: { default: "x" },
        });
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("left");
    });

    test("closes on Escape", async () => {
        render(Subject, { props: { label: "S", open: true }, slots: { default: "content" } });
        const dialog = screen.getByRole("dialog");
        dialog.focus();
        dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await vi.waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "S", open: true, "data-testid": "sh" },
            slots: { default: "x" },
        });
        expect(screen.getByTestId("sh")).toBeTruthy();
    });
});
