import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./CareCard.vue";

describe("CareCard", () => {
    test("renders as a region with heading", () => {
        render(Subject, {
            props: { heading: "Speak to a GP" },
            slots: { default: "Advice content" },
        });

        expect(screen.getByRole("region", { name: "Speak to a GP" })).toBeTruthy();
        expect(screen.getByRole("heading", { name: "Speak to a GP" })).toBeTruthy();
    });

    test("defaults to non-urgent type", () => {
        render(Subject, {
            props: { heading: "Advice", "data-testid": "card" },
            slots: { default: "Content" },
        });

        expect(screen.getByTestId("card").getAttribute("data-type")).toBe("non-urgent");
    });

    test("applies urgent type", () => {
        render(Subject, {
            props: { type: "urgent", heading: "Urgent", "data-testid": "card" },
            slots: { default: "Content" },
        });

        expect(screen.getByTestId("card").getAttribute("data-type")).toBe("urgent");
    });

    test("applies immediate type", () => {
        render(Subject, {
            props: { type: "immediate", heading: "Call 999", "data-testid": "card" },
            slots: { default: "Content" },
        });

        expect(screen.getByTestId("card").getAttribute("data-type")).toBe("immediate");
    });

    test("uses label prop for aria-label when provided", () => {
        render(Subject, {
            props: { heading: "GP advice", label: "Non-urgent care advice" },
            slots: { default: "Content" },
        });

        expect(screen.getByRole("region", { name: "Non-urgent care advice" })).toBeTruthy();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { heading: "Test", "data-testid": "care" },
            slots: { default: "Content" },
        });

        expect(screen.getByTestId("care")).toBeTruthy();
    });
});
