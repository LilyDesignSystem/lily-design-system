import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./SlovenijaEmsoView.vue";

describe("SlovenijaEmsoView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Unique Master Citizen Number", value: "test-value" } });

        const el = screen.getByLabelText("Unique Master Citizen Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("slovenija-emso-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Unique Master Citizen Number", value: "test-value" } });

        const el = screen.getByLabelText("Unique Master Citizen Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Unique Master Citizen Number" } });

        const el = screen.getByLabelText("Unique Master Citizen Number");
        expect(el.getAttribute("aria-label")).toBe("Unique Master Citizen Number");
    });
});
