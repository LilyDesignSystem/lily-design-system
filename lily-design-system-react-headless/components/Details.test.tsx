import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Details";

describe("Details", () => {
    test("renders summary text", () => {
        render(<Subject summary="Show more">Content</Subject>);
        expect(screen.getByText("Show more")).toBeTruthy();
    });

    test("is collapsed by default", () => {
        render(
            <Subject
                summary="Info"
                data-testid="det"
            >
                Content
            </Subject>,
        );
        expect((screen.getByTestId("det") as HTMLDetailsElement).open).toBe(false);
    });

    test("can be initially open", () => {
        render(
            <Subject
                summary="Info"
                open
                data-testid="det"
            >
                Content
            </Subject>,
        );
        expect((screen.getByTestId("det") as HTMLDetailsElement).open).toBe(true);
    });

    test("toggles on summary click", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                summary="Toggle"
                data-testid="det"
            >
                Content
            </Subject>,
        );
        const details = screen.getByTestId("det") as HTMLDetailsElement;

        await user.click(screen.getByText("Toggle"));
        expect(details.open).toBe(true);

        await user.click(screen.getByText("Toggle"));
        expect(details.open).toBe(false);
    });

    test("renders children content", () => {
        render(
            <Subject
                summary="S"
                data-testid="det"
            >
                Inner text
            </Subject>,
        );
        expect(screen.getByTestId("det").textContent).toContain("Inner text");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                summary="S"
                data-testid="det"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("det")).toBeTruthy();
    });
});
