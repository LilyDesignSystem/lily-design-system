import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import SearchAndFilterPage from "../../app/search-and-filter/page";

describe("SearchAndFilter", () => {
    test("renders the heading", () => {
        render(<SearchAndFilterPage />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain("Product Search");
    });

    test("renders data grid", () => {
        render(<SearchAndFilterPage />);
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders all products initially", () => {
        render(<SearchAndFilterPage />);
        expect(screen.getByText("Wireless Keyboard")).toBeTruthy();
        expect(screen.getByText("Standing Desk")).toBeTruthy();
    });

    test("filters products by search query", async () => {
        const user = userEvent.setup();
        render(<SearchAndFilterPage />);
        const searchInput = screen.getByLabelText("Search products");
        await user.type(searchInput, "Wireless");
        expect(screen.getByText("Wireless Keyboard")).toBeTruthy();
        expect(screen.queryByText("Standing Desk")).toBeNull();
    });
});
