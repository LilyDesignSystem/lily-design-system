import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Expander";

describe("Expander", () => {
    test("renders toggle button", () => {
        render(<Subject label="More">Content</Subject>);
        expect(screen.getByRole("button", { name: "More" })).toBeTruthy();
    });

    test("collapsed by default", () => {
        render(<Subject label="More">Hidden</Subject>);
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
        expect(screen.queryByRole("region")).toBeNull();
    });

    test("clicking expands content", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="More">Visible</Subject>);
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
        expect(screen.getByRole("region")).toBeTruthy();
    });

    test("region has aria-label", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Details">Info</Subject>);
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("region").getAttribute("aria-label")).toBe("Details");
    });

    test("button has aria-controls", () => {
        render(<Subject label="More">C</Subject>);
        expect(screen.getByRole("button").getAttribute("aria-controls")).toBeTruthy();
    });

    test("clicking again collapses", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                label="More"
                expanded
            >
                C
            </Subject>,
        );
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="M"
                data-testid="exp"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("exp")).toBeTruthy();
    });
});
