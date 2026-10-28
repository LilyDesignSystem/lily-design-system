import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./AccordionListItem";

describe("AccordionListItem", () => {
    test("renders a details element", () => {
        render(
            <Subject data-testid="ali">
                <summary>Header</summary>
            </Subject>,
        );
        expect(screen.getByTestId("ali").tagName).toBe("DETAILS");
    });

    test("renders children content", () => {
        render(
            <Subject>
                <summary>Question</summary>
            </Subject>,
        );
        expect(screen.getByText("Question")).toBeTruthy();
    });

    test("is closed by default", () => {
        render(
            <Subject data-testid="ali">
                <summary>Q</summary>
            </Subject>,
        );
        expect((screen.getByTestId("ali") as HTMLDetailsElement).open).toBe(false);
    });

    test("supports open prop", () => {
        render(
            <Subject
                open
                data-testid="ali"
            >
                <summary>Q</summary>
            </Subject>,
        );
        expect((screen.getByTestId("ali") as HTMLDetailsElement).open).toBe(true);
    });

    test("toggles on summary click", async () => {
        const user = userEvent.setup();
        render(
            <Subject data-testid="ali">
                <summary>Click me</summary>
            </Subject>,
        );
        const summary = screen.getByText("Click me");
        await user.click(summary);
        await vi.waitFor(() => {
            expect((screen.getByTestId("ali") as HTMLDetailsElement).open).toBe(true);
        });
    });

    test("passes through attributes", () => {
        render(
            <Subject data-testid="item">
                <summary>Q</summary>
            </Subject>,
        );
        expect(screen.getByTestId("item")).toBeTruthy();
    });
});
