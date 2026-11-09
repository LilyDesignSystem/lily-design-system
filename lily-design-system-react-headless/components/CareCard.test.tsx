import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./CareCard";

describe("CareCard", () => {
    test("renders as a named group with heading", () => {
        render(<Subject heading="Speak to a GP">Advice content</Subject>);

        expect(screen.getByRole("group", { name: "Speak to a GP" })).toBeTruthy();
        expect(screen.getByRole("heading", { name: "Speak to a GP" })).toBeTruthy();
    });

    test("defaults to non-urgent type", () => {
        render(
            <Subject
                heading="Advice"
                data-testid="card"
            >
                Content
            </Subject>,
        );

        expect(screen.getByTestId("card").getAttribute("data-type")).toBe("non-urgent");
    });

    test("applies urgent type", () => {
        render(
            <Subject
                type="urgent"
                heading="Urgent"
                data-testid="card"
            >
                Content
            </Subject>,
        );

        expect(screen.getByTestId("card").getAttribute("data-type")).toBe("urgent");
    });

    test("applies immediate type", () => {
        render(
            <Subject
                type="immediate"
                heading="Call 999"
                data-testid="card"
            >
                Content
            </Subject>,
        );

        expect(screen.getByTestId("card").getAttribute("data-type")).toBe("immediate");
    });

    test("uses label prop for aria-label when provided", () => {
        render(
            <Subject
                heading="GP advice"
                label="Non-urgent care advice"
            >
                Content
            </Subject>,
        );

        expect(screen.getByRole("group", { name: "Non-urgent care advice" })).toBeTruthy();
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                heading="Test"
                data-testid="care"
            >
                Content
            </Subject>,
        );

        expect(screen.getByTestId("care")).toBeTruthy();
    });
});
