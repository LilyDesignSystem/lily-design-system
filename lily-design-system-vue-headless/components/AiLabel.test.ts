import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./AiLabel.vue";

describe("AiLabel", () => {
    test("renders a span", () => {
        render(Subject);
        expect(document.querySelector(".ai-label")).toBeTruthy();
    });

    test("renders default text", () => {
        render(Subject);
        expect(screen.getByText("AI")).toBeTruthy();
    });

    test("renders custom text", () => {
        render(Subject, { props: { text: "AI generated" } });
        expect(screen.getByText("AI generated")).toBeTruthy();
    });

    test("has default aria-label", () => {
        render(Subject);
        expect(screen.getByLabelText("AI")).toBeTruthy();
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
