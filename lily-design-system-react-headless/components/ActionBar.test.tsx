import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ActionBar";

describe("ActionBar", () => {
    test("renders as a toolbar with the required aria-label", () => {
        render(
            <Subject label="Selection actions" selectedCount={3} selectedCountLabel="3 selected" />
        );

        const toolbar: HTMLElement = screen.getByRole("toolbar", { name: "Selection actions" });
        expect(toolbar).toBeTruthy();
        expect(toolbar.getAttribute("aria-label")).toBe("Selection actions");
    });

    test("applies the action-bar root class", () => {
        render(
            <Subject label="Selection actions" selectedCount={1} selectedCountLabel="1 selected" />
        );

        const toolbar: HTMLElement = screen.getByRole("toolbar");
        expect(toolbar.className.includes("action-bar")).toBe(true);
    });

    test("exposes data-selected-count", () => {
        render(
            <Subject label="Selection actions" selectedCount={5} selectedCountLabel="5 selected" />
        );

        const toolbar: HTMLElement = screen.getByRole("toolbar");
        expect(toolbar.getAttribute("data-selected-count")).toBe("5");
    });

    test("renders the selectedCountLabel text", () => {
        render(
            <Subject label="Selection actions" selectedCount={2} selectedCountLabel="2 selected" />
        );

        expect(screen.getByText("2 selected")).toBeTruthy();
    });

    test("renders children", () => {
        render(
            <Subject label="Selection actions" selectedCount={1} selectedCountLabel="1 selected">
                <button type="button">Delete</button>
            </Subject>
        );

        expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy();
    });

    test("does not render clear button when only onClearSelection is provided", () => {
        const handleClear = vi.fn();
        render(
            <Subject
            label="Selection actions"
            selectedCount={1}
            selectedCountLabel="1 selected"
            onClearSelection={handleClear}
            />
        );

        expect(screen.queryByRole("button")).toBeNull();
    });

    test("does not render clear button when only clearSelectionLabel is provided", () => {
        render(
            <Subject
            label="Selection actions"
            selectedCount={1}
            selectedCountLabel="1 selected"
            clearSelectionLabel="Clear selection"
            />
        );

        expect(screen.queryByRole("button")).toBeNull();
    });

    test("renders clear button when both onClearSelection and clearSelectionLabel are provided", () => {
        const handleClear = vi.fn();
        render(
            <Subject
            label="Selection actions"
            selectedCount={1}
            selectedCountLabel="1 selected"
            clearSelectionLabel="Clear selection"
            onClearSelection={handleClear}
            />
        );

        expect(screen.getByRole("button", { name: "Clear selection" })).toBeTruthy();
    });

    test("calls onClearSelection when the clear button is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClear = vi.fn();
        render(
            <Subject
            label="Selection actions"
            selectedCount={1}
            selectedCountLabel="1 selected"
            clearSelectionLabel="Clear selection"
            onClearSelection={handleClear}
            />
        );

        await user.click(screen.getByRole("button", { name: "Clear selection" }));
        expect(handleClear).toHaveBeenCalledOnce();
    });
});
