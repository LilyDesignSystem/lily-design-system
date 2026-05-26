import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AlbaCommunityHealthIndexInput";

describe("AlbaCommunityHealthIndexInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Community Health Index" />);

        const input = screen.getByLabelText("Community Health Index") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Community Health Index" />);

        const input = screen.getByLabelText("Community Health Index");
        expect(input.getAttribute("class")).toContain("alba-community-health-index-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Community Health Index" />);

        const input = screen.getByLabelText("Community Health Index");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Community Health Index" />);

        const input = screen.getByLabelText("Community Health Index") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Community Health Index" required />);

        const input = screen.getByLabelText("Community Health Index") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Community Health Index" />);

        const input = screen.getByLabelText("Community Health Index") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Community Health Index" disabled />);

        const input = screen.getByLabelText("Community Health Index") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Community Health Index" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
