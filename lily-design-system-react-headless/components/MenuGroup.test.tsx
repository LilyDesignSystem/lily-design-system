import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MenuGroup";

describe("MenuGroup", () => {
    test("renders as a group with the required aria-label", () => {
        render(<Subject label="File actions" />);

        const group: HTMLElement = screen.getByRole("group", { name: "File actions" });
        expect(group).toBeTruthy();
        expect(group.getAttribute("aria-label")).toBe("File actions");
    });

    test("applies the menu-group root class", () => {
        render(<Subject label="File actions" />);

        const group: HTMLElement = screen.getByRole("group");
        expect(group.className.includes("menu-group")).toBe(true);
    });

    test("renders a visible heading marked aria-hidden", () => {
        const { container } = render(<Subject label="File actions" />);

        const heading: HTMLElement | null = container.querySelector(".menu-group-heading");
        expect(heading).toBeTruthy();
        expect(heading?.textContent).toBe("File actions");
        expect(heading?.getAttribute("aria-hidden")).toBe("true");
    });

    test("renders children", () => {
        render(
            <Subject label="File actions">
                <div role="menuitem">New</div>
                <div role="menuitem">Open</div>
            </Subject>
        );

        expect(screen.getByRole("menuitem", { name: "New" })).toBeTruthy();
        expect(screen.getByRole("menuitem", { name: "Open" })).toBeTruthy();
    });
});
