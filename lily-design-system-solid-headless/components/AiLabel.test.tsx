import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import type { Component as SolidComponent } from "solid-js";
import Component from "./AiLabel";

// Some tests leave a required word out, to show that nothing English fills it in.
const Subject = Component as SolidComponent<Record<string, unknown>>;

describe("AiLabel", () => {
    test("renders a span", () => {
        render(() => <Subject />);
        expect(document.querySelector(".ai-label")).toBeTruthy();
    });

    test("has no English text of its own", () => {
        render(() => <Subject />);
        expect(document.querySelector(".ai-label")?.textContent).toBe("");
    });

    test("renders custom text", () => {
        render(() => <Subject text="AI generated" />);
        expect(screen.getByText("AI generated")).toBeTruthy();
    });

    test("has no English aria-label of its own", () => {
        render(() => <Subject />);
        expect(document.querySelector(".ai-label")?.hasAttribute("aria-label")).toBe(false);
    });

    test("has custom aria-label", () => {
        render(() => <Subject label="AI content" />);
        expect(screen.getByLabelText("AI content")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="ai" />);
        expect(screen.getByTestId("ai")).toBeTruthy();
    });
});
