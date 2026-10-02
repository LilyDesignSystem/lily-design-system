import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Alert from "@lily/Alert";

describe("Alert", () => {
    test("renders with alert role", () => {
        render(<Alert>Something happened.</Alert>);
        const alert = screen.getByRole("alert");
        expect(alert).toBeTruthy();
        expect(alert.textContent).toContain("Something happened.");
    });

    test("renders heading when provided", () => {
        render(<Alert heading="Error">Details here.</Alert>);
        const alert = screen.getByRole("alert");
        expect(alert.textContent).toContain("Error");
        expect(alert.textContent).toContain("Details here.");
    });

    test("sets data-type attribute", () => {
        render(<Alert type="error">Oops</Alert>);
        const alert = screen.getByRole("alert");
        expect(alert.getAttribute("data-type")).toBe("error");
    });

    test("defaults to info type", () => {
        render(<Alert>Info message</Alert>);
        const alert = screen.getByRole("alert");
        expect(alert.getAttribute("data-type")).toBe("info");
    });
});
