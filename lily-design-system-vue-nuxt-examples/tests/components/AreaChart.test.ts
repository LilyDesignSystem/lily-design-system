import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/AreaChart.vue";

describe("AreaChart", () => {
    test("renders the component", () => {
        render(Subject, { props: { label: "Test" }, slots: { default: "Content" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.classList.contains("area-chart")).toBe(true);
    });
});
