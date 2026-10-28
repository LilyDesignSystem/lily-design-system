import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Subject from "./TagInput";

describe("TagInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Add tag" />);
        expect((screen.getByLabelText("Add tag") as HTMLInputElement).type).toBe("text");
    });

    test("has aria-label", () => {
        render(<Subject label="New tag" />);
        expect(screen.getByLabelText("New tag")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Add tag"
                disabled
            />,
        );
        expect((screen.getByLabelText("Add tag") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="T"
                data-testid="ti"
            />,
        );
        expect(screen.getByTestId("ti")).toBeTruthy();
    });
});
