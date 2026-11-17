import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./InsetText";

describe("InsetText", () => {
    test("renders with note role", () => {
        render(() => <Subject>Important</Subject>);
        expect(screen.getByRole("note")).toBeTruthy();
    });

    test("renders children", () => {
        render(() => <Subject>8 weeks to process</Subject>);
        expect(screen.getByRole("note").textContent).toContain("8 weeks to process");
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="it">C</Subject>);
        expect(screen.getByTestId("it")).toBeTruthy();
    });
});
