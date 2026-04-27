import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./InputWithMask";

describe("InputWithMask", () => {
    test("renders an input with the required aria-label", () => {
        render(<Subject label="Phone number" mask="(___) ___-____" />);

        const input: HTMLElement = screen.getByRole("textbox", {
            name: "Phone number",
        });
        expect(input.getAttribute("aria-label")).toBe("Phone number");
    });

    test("applies the input-with-mask root class", () => {
        const { container } = render(
            <Subject label="Phone" mask="(___) ___-____" />
        );

        const root: HTMLElement = container.querySelector(".input-with-mask")!;
        expect(root.className.includes("input-with-mask")).toBe(true);
    });

    test("exposes the mask as a data-mask attribute on the root", () => {
        const { container } = render(
            <Subject label="Phone" mask="(___) ___-____" />
        );

        const root: HTMLElement = container.querySelector(".input-with-mask")!;
        expect(root.getAttribute("data-mask")).toBe("(___) ___-____");
    });

    test("renders the mask in an aria-hidden display span", () => {
        const { container } = render(
            <Subject label="Phone" mask="(___) ___-____" />
        );

        const display: HTMLElement = container.querySelector(
            ".input-with-mask-display"
        )!;
        expect(display.getAttribute("aria-hidden")).toBe("true");
        expect(display.textContent).toBe("(___) ___-____");
    });

    test("uses input type text", () => {
        render(<Subject label="Phone" mask="(___) ___-____" />);

        const input: HTMLInputElement = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("reflects the value prop", () => {
        render(
            <Subject label="Phone" mask="(___) ___-____" value="(555) 123-4567" />
        );

        const input: HTMLInputElement = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.value).toBe("(555) 123-4567");
    });

    test("can be disabled", () => {
        render(<Subject label="Phone" mask="(___) ___-____" disabled />);

        const input: HTMLInputElement = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("calls onInput when the user types", async () => {
        const user: UserEvent = userEvent.setup();
        const handleInput = vi.fn();
        render(
            <Subject label="Phone" mask="(___) ___-____" onInput={handleInput} />
        );

        await user.type(screen.getByRole("textbox"), "5");
        expect(handleInput).toHaveBeenCalled();
    });

    test("renders the placeholder", () => {
        render(
            <Subject
                label="Phone"
                mask="(___) ___-____"
                placeholder="Enter phone"
            />
        );

        const input: HTMLInputElement = screen.getByRole("textbox") as HTMLInputElement;
        expect(input.getAttribute("placeholder")).toBe("Enter phone");
    });
});
