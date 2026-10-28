import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./FloatingPanel";

describe("FloatingPanel", () => {
    test("hidden when open is false", () => {
        render(
            <Subject
                label="Panel"
                open={false}
            >
                C
            </Subject>,
        );
        expect(screen.queryByRole("region")).toBeNull();
    });

    test("visible when open is true", () => {
        render(
            <Subject
                label="Panel"
                open
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("region", { name: "Panel" })).toBeTruthy();
    });

    test("renders children", () => {
        render(
            <Subject
                label="Panel"
                open
            >
                Content
            </Subject>,
        );
        expect(screen.getByRole("region").textContent).toContain("Content");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="P"
                open
                data-testid="fp"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("fp")).toBeTruthy();
    });
});
