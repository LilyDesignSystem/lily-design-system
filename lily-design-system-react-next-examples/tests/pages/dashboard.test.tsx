import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import DashboardPage from "../../app/dashboard/page";

describe("Dashboard", () => {
    test("renders the dashboard heading", () => {
        render(<DashboardPage />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain("Project Dashboard");
    });

    test("renders task grid", () => {
        render(<DashboardPage />);
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("displays task data", () => {
        render(<DashboardPage />);
        expect(screen.getByText("Design landing page")).toBeTruthy();
    });

    test("renders progress indicators", () => {
        render(<DashboardPage />);
        const progressBars = screen.getAllByRole("progressbar");
        expect(progressBars.length).toBeGreaterThan(0);
    });
});
