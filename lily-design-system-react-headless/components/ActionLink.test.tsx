import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ActionLink";

describe("ActionLink", () => {
    test("renders as a link with href", () => {
        render(<Subject href="/example">Go to example</Subject>);

        const link: HTMLElement = screen.getByRole("link", { name: "Go to example" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/example");
    });

    test("applies aria-label when label prop is provided", () => {
        render(
            <Subject
                href="/next"
                label="Navigate to next section"
            >
                Next
            </Subject>,
        );

        const link: HTMLElement = screen.getByRole("link", { name: "Navigate to next section" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("aria-label")).toBe("Navigate to next section");
    });

    test("does not set aria-label when label prop is not provided", () => {
        render(<Subject href="/test">Test link</Subject>);

        const link: HTMLElement = screen.getByRole("link", { name: "Test link" });
        expect(link.getAttribute("aria-label")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                href="/ext"
                target="_blank"
                rel="noopener noreferrer"
            >
                External
            </Subject>,
        );

        const link: HTMLElement = screen.getByRole("link", { name: "External" });
        expect(link.getAttribute("target")).toBe("_blank");
        expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject href="/keyboard">Keyboard nav</Subject>);

        const link: HTMLElement = screen.getByRole("link", { name: "Keyboard nav" });
        await user.tab();
        expect(document.activeElement).toBe(link);
    });
});
