import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Avatar";

describe("Avatar", () => {
    test("renders with img role", () => {
        render(<Subject alt="Jane Doe">JD</Subject>);
        expect(screen.getByRole("img")).toBeTruthy();
    });

    test("has aria-label from alt prop", () => {
        render(<Subject alt="Jane Doe">JD</Subject>);
        expect(screen.getByRole("img", { name: "Jane Doe" })).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject alt="Jane Doe">JD</Subject>);
        expect(screen.getByRole("img").textContent).toContain("JD");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                alt="User"
                data-testid="avatar"
            >
                U
            </Subject>,
        );
        expect(screen.getByTestId("avatar")).toBeTruthy();
    });
});
