import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./WarningCallout";

describe("WarningCallout", () => {
    test("renders with alert role", () => {
        render(() => <Subject>Warning!</Subject>);
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("renders as aside element", () => {
        render(() => <Subject data-testid="wc">W</Subject>);
        expect(screen.getByTestId("wc").tagName).toBe("ASIDE");
    });

    test("has aria-label when provided", () => {
        render(() => <Subject label="Important warning">W</Subject>);
        expect(screen.getByRole("alert").getAttribute("aria-label")).toBe("Important warning");
    });

    test("renders children", () => {
        render(() => <Subject>Session expiring</Subject>);
        expect(screen.getByRole("alert").textContent).toContain("Session expiring");
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="wc">W</Subject>);
        expect(screen.getByTestId("wc")).toBeTruthy();
    });
});
