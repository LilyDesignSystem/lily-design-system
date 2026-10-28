import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Emoji";

describe("Emoji", () => {
    test("renders with img role", () => {
        render(
            <Subject
                emoji="👍"
                label="Thumbs up"
            />,
        );
        expect(screen.getByRole("img", { name: "Thumbs up" })).toBeTruthy();
    });

    test("displays the emoji", () => {
        render(
            <Subject
                emoji="🎉"
                label="Party"
            />,
        );
        expect(screen.getByRole("img").textContent).toBe("🎉");
    });

    test("has aria-label", () => {
        render(
            <Subject
                emoji="❤️"
                label="Heart"
            />,
        );
        expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Heart");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                emoji="👍"
                label="Ok"
                data-testid="em"
            />,
        );
        expect(screen.getByTestId("em")).toBeTruthy();
    });
});
