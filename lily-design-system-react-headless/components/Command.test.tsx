import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Command";

describe("Command", () => {
    test("renders search region", () => {
        render(<Subject label="Commands">Items</Subject>);
        expect(screen.getByRole("search", { name: "Commands" })).toBeTruthy();
    });

    test("renders search input", () => {
        render(<Subject label="Commands">Items</Subject>);
        expect(screen.getByRole("searchbox")).toBeTruthy();
    });

    test("renders listbox", () => {
        render(<Subject label="Commands">Items</Subject>);
        expect(screen.getByRole("listbox")).toBeTruthy();
    });

    test("applies placeholder", () => {
        render(
            <Subject
                label="Cmd"
                placeholder="Type..."
            >
                Items
            </Subject>,
        );
        expect(screen.getByPlaceholderText("Type...")).toBeTruthy();
    });

    test("input is focusable", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Cmd">Items</Subject>);
        await user.tab();
        expect(document.activeElement).toBe(screen.getByRole("searchbox"));
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Cmd"
                data-testid="cmd"
            >
                Items
            </Subject>,
        );
        expect(screen.getByTestId("cmd")).toBeTruthy();
    });
});
