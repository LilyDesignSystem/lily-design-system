import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./AiLabel.vue";

describe("AiLabel", () => {
    test("renders a span", () => {
        render(Subject);
        expect(document.querySelector(".ai-label")).toBeTruthy();
    });

    test("has no English text of its own", () => {
        render(Subject);
        expect(document.querySelector(".ai-label")?.textContent).toBe("");
    });

    test("renders custom text", () => {
        render(Subject, { props: { text: "AI generated" } });
        expect(screen.getByText("AI generated")).toBeTruthy();
    });

    test("has no English aria-label of its own", () => {
        render(Subject);
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
