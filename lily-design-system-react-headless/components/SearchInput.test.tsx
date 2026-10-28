import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SearchInput";

describe("SearchInput", () => {
    test("renders a search input", () => {
        render(<Subject label="Search" />);
        expect(screen.getByRole("searchbox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Search site" />);
        expect(screen.getByLabelText("Search site")).toBeTruthy();
    });

    test("supports required", () => {
        render(
            <Subject
                label="Search"
                required
            />,
        );
        expect((screen.getByRole("searchbox") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Search"
                disabled
            />,
        );
        expect((screen.getByRole("searchbox") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Search"
                data-testid="si"
            />,
        );
        expect(screen.getByTestId("si")).toBeTruthy();
    });
});
