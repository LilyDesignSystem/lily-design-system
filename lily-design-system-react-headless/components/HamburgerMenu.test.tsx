import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import type { ComponentType } from "react";
import Component from "./HamburgerMenu";

// Some tests leave a required word out, to show that nothing English fills it in.
const Subject = Component as ComponentType<Record<string, unknown>>;

describe("HamburgerMenu", () => {
    test("renders toggle button", () => {
        render(<Subject label="Menu">Nav</Subject>);
        expect(screen.getByRole("button", { name: "Menu" })).toBeTruthy();
    });

    test("button has aria-expanded false when closed", () => {
        render(<Subject>Nav</Subject>);
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
    });

    test("navigation hidden when closed", () => {
        render(<Subject>Nav</Subject>);
        expect(screen.queryByRole("navigation")).toBeNull();
    });

    test("clicking opens navigation", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject>Nav items</Subject>);
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-expanded true when open", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject>Nav</Subject>);
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="hm">Nav</Subject>);
        expect(screen.getByTestId("hm")).toBeTruthy();
    });
});
