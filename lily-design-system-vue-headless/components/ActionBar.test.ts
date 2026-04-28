import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ActionBar.vue";


describe("ActionBar", () => {
    test("renders as a toolbar with aria-label", () => {
        render(Subject, {
            props: { label: "Selection", selectedCount: 3, selectedCountLabel: "3 selected" },
        });

        const toolbar: HTMLElement = screen.getByRole("toolbar", { name: "Selection" });
        expect(toolbar).toBeTruthy();
    });

    test("has action-bar class on root", () => {
        render(Subject, {
            props: { label: "Selection", selectedCount: 3, selectedCountLabel: "3 selected" },
        });

        const toolbar: HTMLElement = screen.getByRole("toolbar");
        expect(toolbar.classList.contains("action-bar")).toBe(true);
    });

    test("displays the selectedCountLabel text", () => {
        render(Subject, {
            props: { label: "Selection", selectedCount: 5, selectedCountLabel: "5 selected" },
        });

        expect(screen.getByText("5 selected")).toBeTruthy();
    });

    test("exposes selectedCount via data attribute", () => {
        render(Subject, {
            props: { label: "Selection", selectedCount: 7, selectedCountLabel: "7 selected" },
        });

        const toolbar: HTMLElement = screen.getByRole("toolbar");
        expect(toolbar.getAttribute("data-selected-count")).toBe("7");
    });

    test("renders default slot children", () => {
        render(Subject, {
            props: { label: "Selection", selectedCount: 1, selectedCountLabel: "1 selected" },
            slots: { default: "<span>child</span>" },
        });

        expect(screen.getByText("child")).toBeTruthy();
    });

    test("does not render clear button when clearSelectionLabel is omitted", () => {
        render(Subject, {
            props: { label: "Selection", selectedCount: 1, selectedCountLabel: "1 selected" },
        });

        expect(screen.queryByRole("button")).toBeNull();
    });

    test("renders clear button when clearSelectionLabel is provided", () => {
        render(Subject, {
            props: {
                label: "Selection",
                selectedCount: 1,
                selectedCountLabel: "1 selected",
                clearSelectionLabel: "Clear selection",
            },
        });

        const button: HTMLElement = screen.getByRole("button", { name: "Clear selection" });
        expect(button).toBeTruthy();
        expect(button.classList.contains("action-bar-clear")).toBe(true);
    });

    test("emits clearSelection when the clear button is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const onClearSelection = vi.fn();
        render(Subject, {
            props: {
                label: "Selection",
                selectedCount: 1,
                selectedCountLabel: "1 selected",
                clearSelectionLabel: "Clear selection",
                onClearSelection,
            },
        });

        await user.click(screen.getByRole("button", { name: "Clear selection" }));
        expect(onClearSelection).toHaveBeenCalledOnce();
    });
});
