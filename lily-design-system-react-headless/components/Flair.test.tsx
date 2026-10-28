import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Flair";

describe("Flair", () => {
    test("renders children text", () => {
        render(<Subject data-testid="fl">New</Subject>);
        expect(screen.getByTestId("fl").textContent).toBe("New");
    });

    test("decorative by default (aria-hidden)", () => {
        render(<Subject data-testid="fl">New</Subject>);
        expect(screen.getByTestId("fl").getAttribute("aria-hidden")).toBe("true");
    });

    test("meaningful when label provided", () => {
        render(
            <Subject
                label="Status: new"
                data-testid="fl"
            >
                New
            </Subject>,
        );
        expect(screen.getByTestId("fl").getAttribute("aria-label")).toBe("Status: new");
        expect(screen.getByTestId("fl").getAttribute("aria-hidden")).toBeNull();
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="fl">X</Subject>);
        expect(screen.getByTestId("fl")).toBeTruthy();
    });
});
