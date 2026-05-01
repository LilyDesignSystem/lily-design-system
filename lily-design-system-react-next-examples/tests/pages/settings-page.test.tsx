import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import SettingsPagePage from "../../app/settings-page/page";

describe("SettingsPage", () => {
    test("renders the heading", () => {
        render(<SettingsPagePage />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain("Settings");
    });

    test("renders fieldsets", () => {
        render(<SettingsPagePage />);
        const fieldsets = screen.getAllByRole("group");
        expect(fieldsets.length).toBeGreaterThan(0);
    });

    test("renders save button", () => {
        render(<SettingsPagePage />);
        expect(screen.getByRole("button", { name: "Save Settings" })).toBeTruthy();
    });
});
