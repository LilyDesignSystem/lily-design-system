import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import NavigationAndMenusPage from "../../app/navigation-and-menus/page";

describe("NavigationAndMenus", () => {
    test("renders the heading", () => {
        render(<NavigationAndMenusPage />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain("Navigation and Menu Patterns");
    });

    test("renders navigation landmarks", () => {
        render(<NavigationAndMenusPage />);
        const navs = screen.getAllByRole("navigation");
        expect(navs.length).toBeGreaterThan(0);
    });

    test("renders toolbar", () => {
        render(<NavigationAndMenusPage />);
        expect(screen.getByRole("toolbar")).toBeTruthy();
    });
});
