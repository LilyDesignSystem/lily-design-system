import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./FileInput";

describe("FileInput", () => {
    test("renders a file input", () => {
        render(<Subject label="Upload" />);
        const input = screen.getByLabelText("Upload") as HTMLInputElement;
        expect(input.type).toBe("file");
    });

    test("supports accept attribute", () => {
        render(
            <Subject
                label="Upload"
                accept="image/*"
            />,
        );
        expect((screen.getByLabelText("Upload") as HTMLInputElement).accept).toBe("image/*");
    });

    test("supports multiple", () => {
        render(
            <Subject
                label="Upload"
                multiple
            />,
        );
        expect((screen.getByLabelText("Upload") as HTMLInputElement).multiple).toBe(true);
    });

    test("supports required", () => {
        render(
            <Subject
                label="Upload"
                required
            />,
        );
        expect((screen.getByLabelText("Upload") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Upload"
                disabled
            />,
        );
        expect((screen.getByLabelText("Upload") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Upload"
                data-testid="fi"
            />,
        );
        expect(screen.getByTestId("fi")).toBeTruthy();
    });
});
