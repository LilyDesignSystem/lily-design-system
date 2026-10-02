import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import TextInput from "@lily/TextInput";

describe("TextInput", () => {
    test("renders an input element", () => {
        render(<TextInput label="Name" />);
        const input = screen.getByLabelText("Name");
        expect(input).toBeTruthy();
        expect(input.getAttribute("type")).toBe("text");
    });

    test("sets aria-label", () => {
        render(<TextInput label="Full name" />);
        const input = screen.getByLabelText("Full name");
        expect(input.getAttribute("aria-label")).toBe("Full name");
    });

    test("calls onChange with new value", async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();
        render(<TextInput label="Name" onChange={handleChange} />);
        await user.type(screen.getByLabelText("Name"), "A");
        expect(handleChange).toHaveBeenCalledWith("A");
    });

    test("can be disabled", () => {
        render(<TextInput label="Name" disabled />);
        const input = screen.getByLabelText("Name") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("can be required", () => {
        render(<TextInput label="Name" required />);
        const input = screen.getByLabelText("Name") as HTMLInputElement;
        expect(input.required).toBe(true);
    });
});
