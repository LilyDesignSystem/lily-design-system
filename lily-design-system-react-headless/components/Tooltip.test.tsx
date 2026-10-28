import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Tooltip";

describe("Tooltip", () => {
    test("hidden when not visible", () => {
        render(
            <Subject
                label="Help text"
                visible={false}
            />,
        );
        expect(screen.queryByRole("tooltip")).toBeNull();
    });

    test("visible when visible is true", () => {
        render(
            <Subject
                label="Help text"
                visible
            />,
        );
        expect(screen.getByRole("tooltip")).toBeTruthy();
    });

    test("displays label text", () => {
        render(
            <Subject
                label="Additional info"
                visible
            />,
        );
        expect(screen.getByRole("tooltip").textContent).toBe("Additional info");
    });

    test("supports id for aria-describedby linking", () => {
        render(
            <Subject
                label="Tip"
                visible
                id="my-tip"
            />,
        );
        expect(screen.getByRole("tooltip").id).toBe("my-tip");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="T"
                visible
                data-testid="tt"
            />,
        );
        expect(screen.getByTestId("tt")).toBeTruthy();
    });
});
