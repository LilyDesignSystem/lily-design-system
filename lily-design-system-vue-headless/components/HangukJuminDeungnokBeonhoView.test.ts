import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./HangukJuminDeungnokBeonhoView.vue";

describe("HangukJuminDeungnokBeonhoView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Hanguk Jumin Deungnok Beonho", value: "test-value" } });

        const el = screen.getByLabelText("Hanguk Jumin Deungnok Beonho");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("hanguk-jumin-deungnok-beonho-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Hanguk Jumin Deungnok Beonho", value: "test-value" } });

        const el = screen.getByLabelText("Hanguk Jumin Deungnok Beonho");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Hanguk Jumin Deungnok Beonho" } });

        const el = screen.getByLabelText("Hanguk Jumin Deungnok Beonho");
        expect(el.getAttribute("aria-label")).toBe("Hanguk Jumin Deungnok Beonho");
    });
});
