import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./NorgeFodselsnummerView.vue";

describe("NorgeFodselsnummerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Norwegian Birth Number", value: "test-value" } });

        const el = screen.getByLabelText("Norwegian Birth Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("norge-fodselsnummer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Norwegian Birth Number", value: "test-value" } });

        const el = screen.getByLabelText("Norwegian Birth Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Norwegian Birth Number" } });

        const el = screen.getByLabelText("Norwegian Birth Number");
        expect(el.getAttribute("aria-label")).toBe("Norwegian Birth Number");
    });
});
