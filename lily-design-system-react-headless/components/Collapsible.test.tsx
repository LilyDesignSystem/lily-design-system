import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Collapsible";

describe("Collapsible", () => {
    test("renders summary text", () => {
        render(<Subject summary="Show more">Hidden content</Subject>);

        expect(screen.getByText("Show more")).toBeTruthy();
    });

    test("is collapsed by default", () => {
        render(
            <Subject
                summary="Details"
                data-testid="details"
            >
                Content
            </Subject>,
        );

        const details = screen.getByTestId("details") as HTMLDetailsElement;
        expect(details.open).toBe(false);
    });

    test("can be initially open", () => {
        render(
            <Subject
                summary="Details"
                open
                data-testid="details"
            >
                Visible content
            </Subject>,
        );

        const details = screen.getByTestId("details") as HTMLDetailsElement;
        expect(details.open).toBe(true);
    });

    test("toggles on summary click", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                summary="Toggle me"
                data-testid="details"
            >
                Content
            </Subject>,
        );

        const summary = screen.getByText("Toggle me");
        const details = screen.getByTestId("details") as HTMLDetailsElement;

        await user.click(summary);
        expect(details.open).toBe(true);

        await user.click(summary);
        expect(details.open).toBe(false);
    });

    test("summary element is focusable", () => {
        render(
            <Subject
                summary="Focus me"
                data-testid="det"
            >
                Content
            </Subject>,
        );

        // jsdom doesn't tab to <summary>, so focus it directly.
        const summary = screen.getByTestId("det").querySelector("summary") as HTMLElement;
        summary.focus();
        expect(document.activeElement).toBe(summary);
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                summary="Info"
                data-testid="coll"
            >
                Content
            </Subject>,
        );

        expect(screen.getByTestId("coll")).toBeTruthy();
    });
});
