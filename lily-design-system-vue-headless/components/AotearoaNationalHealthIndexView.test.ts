import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./AotearoaNationalHealthIndexView.vue";

describe("AotearoaNationalHealthIndexView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Aotearoa National Health Index", value: "test-value" } });

        const el = screen.getByLabelText("Aotearoa National Health Index");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("aotearoa-national-health-index-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Aotearoa National Health Index", value: "test-value" } });

        const el = screen.getByLabelText("Aotearoa National Health Index");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Aotearoa National Health Index" } });

        const el = screen.getByLabelText("Aotearoa National Health Index");
        expect(el.getAttribute("aria-label")).toBe("Aotearoa National Health Index");
    });
});
