import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import TabbedInterfacePage from "../../app/tabbed-interface/page";

describe("TabbedInterface", () => {
    test("renders the heading", () => {
        render(<TabbedInterfacePage />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain("Notifications");
    });

    test("renders tab buttons", () => {
        render(<TabbedInterfacePage />);
        expect(screen.getByRole("tab", { name: /All/i })).toBeTruthy();
    });

    test("renders notification items", () => {
        render(<TabbedInterfacePage />);
        expect(screen.getByText("Welcome")).toBeTruthy();
        expect(screen.getByText("Build failed")).toBeTruthy();
    });
});
