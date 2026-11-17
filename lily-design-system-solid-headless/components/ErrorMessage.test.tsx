import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./ErrorMessage";

describe("ErrorMessage", () => {
    test("renders with alert role", () => {
        render(() => <Subject>Error occurred</Subject>);
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("displays error text", () => {
        render(() => <Subject>Field is required</Subject>);
        expect(screen.getByRole("alert").textContent).toContain("Field is required");
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="err">E</Subject>);
        expect(screen.getByTestId("err")).toBeTruthy();
    });
});
