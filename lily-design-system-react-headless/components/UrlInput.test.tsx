import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./UrlInput";

describe("UrlInput", () => {
    test("renders a url input", () => {
        render(<Subject label="Website" />);
        const input = screen.getByLabelText("Website") as HTMLInputElement;
        expect(input.type).toBe("url");
    });

    test("has aria-label", () => {
        render(<Subject label="Website URL" />);
        expect(screen.getByLabelText("Website URL")).toBeTruthy();
    });

    test("supports required", () => {
        render(
            <Subject
                label="URL"
                required
            />,
        );
        expect((screen.getByLabelText("URL") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="URL"
                disabled
            />,
        );
        expect((screen.getByLabelText("URL") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="URL"
                data-testid="ui"
            />,
        );
        expect(screen.getByTestId("ui")).toBeTruthy();
    });
});
