import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./OverlayContainer";

describe("OverlayContainer", () => {
    test("applies the overlay-container root class", () => {
        render(<Subject open data-testid="ov">Content</Subject>);

        const el: HTMLElement = screen.getByTestId("ov");
        expect(el.className.includes("overlay-container")).toBe(true);
    });

    test("uses role=presentation", () => {
        render(<Subject open data-testid="ov">Content</Subject>);

        const el: HTMLElement = screen.getByTestId("ov");
        expect(el.getAttribute("role")).toBe("presentation");
    });

    test("is hidden and aria-hidden=true when closed", () => {
        render(<Subject data-testid="ov">Content</Subject>);

        const el: HTMLElement = screen.getByTestId("ov");
        expect(el.hasAttribute("hidden")).toBe(true);
        expect(el.getAttribute("aria-hidden")).toBe("true");
        expect(el.getAttribute("data-open")).toBe("false");
    });

    test("is visible and aria-hidden=false when open", () => {
        render(<Subject open data-testid="ov">Content</Subject>);

        const el: HTMLElement = screen.getByTestId("ov");
        expect(el.hasAttribute("hidden")).toBe(false);
        expect(el.getAttribute("aria-hidden")).toBe("false");
        expect(el.getAttribute("data-open")).toBe("true");
    });

    test("applies aria-label when label provided", () => {
        render(<Subject open label="Backdrop" data-testid="ov">Content</Subject>);

        const el: HTMLElement = screen.getByTestId("ov");
        expect(el.getAttribute("aria-label")).toBe("Backdrop");
    });

    test("calls onClick when clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(
            <Subject open onClick={handleClick} data-testid="ov">
                Content
            </Subject>,
        );

        await user.click(screen.getByTestId("ov"));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject open id="overlay-1" data-testid="ov">C</Subject>);

        const el: HTMLElement = screen.getByTestId("ov");
        expect(el.getAttribute("id")).toBe("overlay-1");
    });
});
