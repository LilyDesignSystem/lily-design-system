import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./MisrAlRaqmAlQawmiView.vue";

describe("MisrAlRaqmAlQawmiView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "National Number", value: "test-value" } });

        const el = screen.getByLabelText("National Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("misr-al-raqm-al-qawmi-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "National Number", value: "test-value" } });

        const el = screen.getByLabelText("National Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Number" } });

        const el = screen.getByLabelText("National Number");
        expect(el.getAttribute("aria-label")).toBe("National Number");
    });
});
