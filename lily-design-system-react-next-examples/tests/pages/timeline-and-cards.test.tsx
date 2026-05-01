import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import TimelineAndCardsPage from "../../app/timeline-and-cards/page";

describe("TimelineAndCards", () => {
    test("renders the heading", () => {
        render(<TimelineAndCardsPage />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain("Project History");
    });

    test("renders milestone cards", () => {
        render(<TimelineAndCardsPage />);
        expect(screen.getByText("Project Kickoff")).toBeTruthy();
        expect(screen.getByText("Alpha Release")).toBeTruthy();
        expect(screen.getByText("Beta Launch")).toBeTruthy();
        expect(screen.getByText("General Availability")).toBeTruthy();
    });

    test("renders summary list", () => {
        render(<TimelineAndCardsPage />);
        expect(screen.getByText("Total Milestones")).toBeTruthy();
    });
});
