import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Editable";

describe("Editable", () => {
    test("displays value as text by default", () => {
        render(<Subject label="Name" value="Alice" />);
        expect(screen.getByText("Alice")).toBeTruthy();
    });

    test("text element has button role", () => {
        render(<Subject label="Name" value="Alice" />);
        expect(screen.getByRole("button", { name: "Alice, Name" })).toBeTruthy();
    });

    test("the accessible name starts with the visible value (WCAG 2.5.3 label in name)", () => {
        render(<Subject label="Name" value="Alice" />);
        expect(screen.getByRole("button").getAttribute("aria-label")).toBe("Alice, Name");
    });

    test("an empty value names the button by its label alone", () => {
        render(<Subject label="Name" value="" />);
        expect(screen.getByRole("button", { name: "Name" })).toBeTruthy();
    });

    test("clicking activates edit mode", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Name" value="Alice" />);
        await user.click(screen.getByRole("button"));
        expect(screen.getByLabelText("Name").tagName).toBe("INPUT");
    });

    test("Enter confirms edit", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Name" value="Alice" editing />);
        const input = screen.getByLabelText("Name") as HTMLInputElement;
        await user.clear(input);
        await user.type(input, "Bob");
        await user.keyboard("{Enter}");
        expect(screen.getByText("Bob")).toBeTruthy();
    });

    test("Escape cancels edit", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Name" value="Alice" editing />);
        const input = screen.getByLabelText("Name") as HTMLInputElement;
        await user.clear(input);
        await user.type(input, "Bob");
        await user.keyboard("{Escape}");
        expect(screen.getByText("Alice")).toBeTruthy();
    });

    test("disabled prevents editing", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Name" value="Alice" disabled />);
        await user.click(screen.getByRole("button"));
        // Should still be in display mode.
        expect(screen.getByRole("button")).toBeTruthy();
        expect(screen.queryByRole("textbox")).toBeNull();
    });

    test("disabled shows aria-disabled", () => {
        render(<Subject label="Name" value="Alice" disabled />);
        expect(screen.getByRole("button").getAttribute("aria-disabled")).toBe("true");
    });

    test("passes through attributes", () => {
        render(<Subject label="Name" value="A" data-testid="ed" />);
        expect(screen.getByTestId("ed")).toBeTruthy();
    });
});
