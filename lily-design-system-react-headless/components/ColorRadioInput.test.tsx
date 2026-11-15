import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ColorRadioInput";

describe("ColorRadioInput", () => {
    test("renders a radio input", () => {
        render(
            <Subject
                color="#005eb8"
                label="Option A"
            />,
        );
        const input = screen.getByLabelText("Option A") as HTMLInputElement;
        expect(input.type).toBe("radio");
    });

    test("has aria-label", () => {
        render(
            <Subject
                color="#005eb8"
                label="Option A"
            />,
        );
        expect(screen.getByLabelText("Option A")).toBeTruthy();
    });

    test("supports name and value", () => {
        render(
            <Subject
                color="#005eb8"
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
                color="#005eb8"
                label="A"
                checked
            />,
        );
        expect((screen.getByRole("radio") as HTMLInputElement).checked).toBe(true);
    });

    test("toggles checked on click", async () => {
        const user: UserEvent = userEvent.setup();
        render(
            <Subject
                color="#005eb8"
                label="A"
            />,
        );
        const radio = screen.getByRole("radio") as HTMLInputElement;
        await user.click(radio);
        expect(radio.checked).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                color="#005eb8"
                label="A"
                disabled
            />,
        );
        expect((screen.getByRole("radio") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                color="#005eb8"
                label="A"
                data-testid="ri"
            />,
        );
        expect(screen.getByTestId("ri")).toBeTruthy();
    });

    test("exposes its colour in data-color and a custom property, and submits it by default", () => {
        render(
            <Subject
                color="#005eb8"
                label="Blue"
                name="colour"
            />,
        );
        const radio = screen.getByRole("radio") as HTMLInputElement;
        expect(radio.getAttribute("data-color")).toBe("#005eb8");
        expect(radio.style.getPropertyValue("--color-radio-input-color")).toBe("#005eb8");
        expect(radio.value).toBe("#005eb8");
    });
});
