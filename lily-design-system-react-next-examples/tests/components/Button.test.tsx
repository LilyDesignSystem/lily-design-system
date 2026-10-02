import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import Button from "@lily/Button";

describe("Button", () => {
    test("renders a button element", () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole("button");
        expect(button).toBeTruthy();
        expect(button.textContent).toContain("Click me");
    });

    test("defaults to type button", () => {
        render(<Button>Test</Button>);
        const button = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("can be disabled", () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("calls onClick handler", async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        render(<Button onClick={handleClick}>Click</Button>);
        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("supports submit type", () => {
        render(<Button type="submit">Submit</Button>);
        const button = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("submit");
    });
});
