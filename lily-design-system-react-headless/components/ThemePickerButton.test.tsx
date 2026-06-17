import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ThemeSelectButton";

describe("ThemeSelectButton", () => {
    test("renders a button with class theme-select-button", () => {
        const { container } = render(<Subject label="Light theme" />);
        const btn = container.querySelector(".theme-select-button");
        expect(btn).toBeTruthy();
        expect(btn?.tagName).toBe("BUTTON");
    });

    test("applies aria-label from label prop", () => {
        render(<Subject label="Light theme" />);
        expect(screen.getByRole("button", { name: "Light theme" })).toBeTruthy();
    });

    test("aria-pressed reflects the pressed prop", () => {
        const { rerender } = render(<Subject label="Light theme" />);
        let btn = screen.getByRole("button");
        expect(btn.getAttribute("aria-pressed")).toBe("false");

        rerender(<Subject label="Light theme" pressed />);
        btn = screen.getByRole("button");
        expect(btn.getAttribute("aria-pressed")).toBe("true");
    });

    test("type defaults to button", () => {
        render(<Subject label="x" />);
        expect(screen.getByRole("button").getAttribute("type")).toBe("button");
    });

    test("disabled prop disables the button", () => {
        render(<Subject label="x" disabled />);
        const btn = screen.getByRole("button") as HTMLButtonElement;
        expect(btn.disabled).toBe(true);
    });

    test("calls onClick when activated", async () => {
        const user: UserEvent = userEvent.setup();
        const onClick = vi.fn();
        render(<Subject label="x" onClick={onClick} />);
        await user.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledOnce();
    });

    test("does not call onClick when disabled", async () => {
        const user: UserEvent = userEvent.setup();
        const onClick = vi.fn();
        render(<Subject label="x" disabled onClick={onClick} />);
        await user.click(screen.getByRole("button"));
        expect(onClick).not.toHaveBeenCalled();
    });
});
