import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AiLabel.svelte";

describe("AiLabel", () => {
    test("renders a span", () => {
        render(Subject, { props: {} });
        expect(document.querySelector(".ai-label")).toBeTruthy();
    });

    test("has no English text of its own", () => {
        render(Subject, { props: {} });
        expect(document.querySelector(".ai-label")?.textContent).toBe("");
    });

    test("renders custom text", () => {
        render(Subject, { props: { text: "AI generated" } });
        expect(screen.getByText("AI generated")).toBeTruthy();
    });

    test("has no English aria-label of its own", () => {
        render(Subject, { props: {} });
        expect(document.querySelector(".ai-label")?.hasAttribute("aria-label")).toBe(false);
    });

    test("has custom aria-label", () => {
        render(Subject, { props: { label: "AI content" } });
        expect(screen.getByLabelText("AI content")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "ai" } });
        expect(screen.getByTestId("ai")).toBeTruthy();
    });
});
