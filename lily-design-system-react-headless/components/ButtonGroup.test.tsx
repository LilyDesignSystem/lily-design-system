import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ButtonGroup";

describe("ButtonGroup", () => {
    test("renders as a group with the required aria-label", () => {
        render(
            <Subject label="Actions">
                <button type="button">Save</button>
            </Subject>
        );

        const group: HTMLElement = screen.getByRole("group", { name: "Actions" });
        expect(group).toBeTruthy();
        expect(group.getAttribute("aria-label")).toBe("Actions");
    });

    test("applies the button-group root class", () => {
        render(
            <Subject label="Actions">
                <button type="button">Save</button>
            </Subject>
        );

        const group: HTMLElement = screen.getByRole("group");
        expect(group.className.includes("button-group")).toBe(true);
    });

    test("renders children", () => {
        render(
            <Subject label="Actions">
                <button type="button">Save</button>
                <button type="button">Cancel</button>
            </Subject>
        );

        const buttons: HTMLElement[] = screen.getAllByRole("button");
        expect(buttons.length).toBe(2);
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject label="Actions" id="my-group">
                <button type="button">Save</button>
            </Subject>
        );

        const group: HTMLElement = screen.getByRole("group");
        expect(group.getAttribute("id")).toBe("my-group");
    });

    test("appends consumer className alongside root class", () => {
        render(
            <Subject label="Actions" className="custom">
                <button type="button">Save</button>
            </Subject>
        );

        const group: HTMLElement = screen.getByRole("group");
        expect(group.className.includes("button-group")).toBe(true);
        expect(group.className.includes("custom")).toBe(true);
    });
});
