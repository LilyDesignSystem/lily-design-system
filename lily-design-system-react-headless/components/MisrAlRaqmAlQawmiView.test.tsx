import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MisrAlRaqmAlQawmiView";

describe("MisrAlRaqmAlQawmiView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="National Number (الرقم القومي)" value="test-value" />);

        const el = screen.getByLabelText("National Number (الرقم القومي)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("misr-al-raqm-al-qawmi-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="National Number (الرقم القومي)" value="test-value" />);

        const el = screen.getByLabelText("National Number (الرقم القومي)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="National Number (الرقم القومي)" />);

        const el = screen.getByLabelText("National Number (الرقم القومي)");
        expect(el.getAttribute("aria-label")).toBe("National Number (الرقم القومي)");
    });
});
