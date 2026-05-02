import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./CurrencyInput";

describe("CurrencyInput", () => {
    test("renders an input with class currency-input", () => {
        const { container } = render(<Subject label="Amount" />);
        const input = container.querySelector(".currency-input") as HTMLInputElement;
        expect(input).toBeTruthy();
        expect(input.tagName).toBe("INPUT");
    });

    test("uses type=text and inputmode=decimal", () => {
        render(<Subject label="Amount" />);
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.getAttribute("type")).toBe("text");
        expect(input.getAttribute("inputmode")).toBe("decimal");
    });

    test("applies aria-label from label prop", () => {
        render(<Subject label="Amount" />);
        expect(screen.getByLabelText("Amount")).toBeTruthy();
    });

    test("displays the value prop", () => {
        render(<Subject label="Amount" value={42.5} />);
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.value).toBe("42.5");
    });

    test("displays empty string when value is undefined", () => {
        render(<Subject label="Amount" />);
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.value).toBe("");
    });

    test("calls onChange with parsed number when input changes", async () => {
        const user: UserEvent = userEvent.setup();
        const onChange = vi.fn();
        render(<Subject label="Amount" onChange={onChange} />);
        await user.type(screen.getByLabelText("Amount"), "5");
        expect(onChange).toHaveBeenLastCalledWith(5);
    });

    test("calls onChange with undefined when input is cleared", async () => {
        const user: UserEvent = userEvent.setup();
        const onChange = vi.fn();
        render(<Subject label="Amount" value={5} onChange={onChange} />);
        await user.clear(screen.getByLabelText("Amount"));
        expect(onChange).toHaveBeenLastCalledWith(undefined);
    });

    test("exposes the currencyCode via data attribute", () => {
        render(<Subject label="Amount" currencyCode="EUR" />);
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.getAttribute("data-currency-code")).toBe("EUR");
    });

    test("defaults currencyCode to USD", () => {
        render(<Subject label="Amount" />);
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.getAttribute("data-currency-code")).toBe("USD");
    });

    test("applies disabled attribute", () => {
        render(<Subject label="Amount" disabled />);
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("applies required attribute", () => {
        render(<Subject label="Amount" required />);
        const input = screen.getByLabelText("Amount") as HTMLInputElement;
        expect(input.required).toBe(true);
    });
});
