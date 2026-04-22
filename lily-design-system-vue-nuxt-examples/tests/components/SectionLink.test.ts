import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/SectionLink.vue";

describe("SectionLink", () => {
    test("renders the component", () => {
        render(Subject, { props: { label: "Test" }, slots: { default: "Content" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.classList.contains("section-link")).toBe(true);
    });
});
