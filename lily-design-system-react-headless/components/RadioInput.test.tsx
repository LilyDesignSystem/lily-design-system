import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./RadioInput";

describe("RadioInput", () => {
    test("renders a radio input", () => {
        render(<Subject label="Option A" />);
        const input = screen.getByLabelText("Option A") as HTMLInputElement;
        expect(input.type).toBe("radio");
    });

    test("has aria-label", () => {
        render(<Subject label="Option A" />);
        expect(screen.getByLabelText("Option A")).toBeTruthy();
    });

    test("supports name and value", () => {
        render(
            <Subject
                label="A"
                name="grp"
                value="a"
            />,
        );
        const radio = screen.getByRole("radio") as HTMLInputElement;
        expect(radio.name).toBe("grp");
        expect(radio.value).toBe("a");
    });

    test("supports checked prop", () => {
        render(
            <Subject
                label="A"
                checked
            />,
        );
        expect((screen.getByRole("radio") as HTMLInputElement).checked).toBe(true);
    });

    test("toggles checked on click", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="A" />);
        const radio = screen.getByRole("radio") as HTMLInputElement;
        await user.click(radio);
        expect(radio.checked).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="A"
                disabled
            />,
        );
        expect((screen.getByRole("radio") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="A"
                data-testid="ri"
            />,
        );
        expect(screen.getByTestId("ri")).toBeTruthy();
    });
});
