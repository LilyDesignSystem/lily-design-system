import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./Skeleton";

describe("Skeleton", () => {
    test("renders a div", () => {
        render(() => <Subject data-testid="sk" />);
        expect(screen.getByTestId("sk").tagName).toBe("DIV");
    });

    test("has aria-hidden true", () => {
        render(() => <Subject data-testid="sk" />);
        expect(screen.getByTestId("sk").getAttribute("aria-hidden")).toBe("true");
    });

    test("has aria-busy true", () => {
        render(() => <Subject data-testid="sk" />);
        expect(screen.getByTestId("sk").getAttribute("aria-busy")).toBe("true");
    });

    test("renders children", () => {
        render(() => <Subject data-testid="sk">Loading...</Subject>);
        expect(screen.getByTestId("sk").textContent).toContain("Loading...");
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="sk" />);
        expect(screen.getByTestId("sk")).toBeTruthy();
    });
});
