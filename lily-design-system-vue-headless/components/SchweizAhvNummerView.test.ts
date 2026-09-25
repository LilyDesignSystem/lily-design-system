import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./SchweizAhvNummerView.vue";

describe("SchweizAhvNummerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Schweiz Ahv Nummer", value: "test-value" } });

        const el = screen.getByLabelText("Schweiz Ahv Nummer");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("schweiz-ahv-nummer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Schweiz Ahv Nummer", value: "test-value" } });

        const el = screen.getByLabelText("Schweiz Ahv Nummer");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Schweiz Ahv Nummer" } });

        const el = screen.getByLabelText("Schweiz Ahv Nummer");
        expect(el.getAttribute("aria-label")).toBe("Schweiz Ahv Nummer");
    });
});
