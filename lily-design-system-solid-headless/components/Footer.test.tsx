import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./Footer";

describe("Footer", () => {
    test("renders as contentinfo landmark", () => {
        render(() => <Subject>Copyright</Subject>);
        expect(screen.getByRole("contentinfo")).toBeTruthy();
    });

    test("supports aria-label", () => {
        render(() => <Subject label="Site footer">C</Subject>);
        expect(screen.getByRole("contentinfo").getAttribute("aria-label")).toBe("Site footer");
    });

    test("renders children", () => {
        render(() => <Subject>2024 All rights</Subject>);
        expect(screen.getByRole("contentinfo").textContent).toContain("2024 All rights");
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="ft">C</Subject>);
        expect(screen.getByTestId("ft")).toBeTruthy();
    });
});
