import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import type { ComponentType } from "react";
import Component from "./AiLabel";

// Some tests leave a required word out, to show that nothing English fills it in.
const Subject = Component as ComponentType<Record<string, unknown>>;

describe("AiLabel", () => {
    test("renders a span", () => {
        render(<Subject />);
        expect(document.querySelector(".ai-label")).toBeTruthy();
    });

    test("has no English text of its own", () => {
        render(<Subject />);
        expect(document.querySelector(".ai-label")?.textContent).toBe("");
    });

    test("renders custom text", () => {
        render(<Subject text="AI generated" />);
        expect(screen.getByText("AI generated")).toBeTruthy();
    });

    test("has no English aria-label of its own", () => {
        render(<Subject />);
        expect(document.querySelector(".ai-label")?.hasAttribute("aria-label")).toBe(false);
    });

    test("has custom aria-label", () => {
        render(<Subject label="AI content" />);
        expect(screen.getByLabelText("AI content")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="ai" />);
        expect(screen.getByTestId("ai")).toBeTruthy();
    });
});
