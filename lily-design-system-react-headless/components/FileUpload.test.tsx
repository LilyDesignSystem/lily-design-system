import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./FileUpload";

describe("FileUpload", () => {
    test("renders upload button", () => {
        render(<Subject label="Upload" />);
        expect(screen.getByRole("button", { name: "Upload" })).toBeTruthy();
    });

    test("has hidden file input", () => {
        render(
            <Subject
                label="Upload"
                data-testid="fu"
            />,
        );
        const hidden = screen
            .getByTestId("fu")
            .querySelector("input[type='file']") as HTMLInputElement;
        expect(hidden).toBeTruthy();
        expect(hidden.hidden).toBe(true);
    });

    test("has live region for status", () => {
        render(
            <Subject
                label="Upload"
                data-testid="fu"
            />,
        );
        const live = screen.getByTestId("fu").querySelector("[aria-live='polite']");
        expect(live).toBeTruthy();
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Upload"
                disabled
            />,
        );
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Upload"
                data-testid="fu"
            />,
        );
        expect(screen.getByTestId("fu")).toBeTruthy();
    });
});
