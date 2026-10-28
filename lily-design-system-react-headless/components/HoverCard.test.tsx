import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./HoverCard";

describe("HoverCard", () => {
    test("hidden when closed", () => {
        render(
            <Subject
                label="Info"
                open={false}
            >
                C
            </Subject>,
        );
        expect(screen.queryByRole("tooltip")).toBeNull();
    });

    test("visible when open", () => {
        render(
            <Subject
                label="Info"
                open
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("tooltip", { name: "Info" })).toBeTruthy();
    });

    test("renders children", () => {
        render(
            <Subject
                label="Info"
                open
            >
                Details
            </Subject>,
        );
        expect(screen.getByRole("tooltip").textContent).toContain("Details");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="I"
                open
                data-testid="hc"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("hc")).toBeTruthy();
    });
});
