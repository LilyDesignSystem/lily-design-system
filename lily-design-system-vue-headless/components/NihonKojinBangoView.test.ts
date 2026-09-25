import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./NihonKojinBangoView.vue";

describe("NihonKojinBangoView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Nihon Kojin Bango", value: "test-value" } });

        const el = screen.getByLabelText("Nihon Kojin Bango");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nihon-kojin-bango-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Nihon Kojin Bango", value: "test-value" } });

        const el = screen.getByLabelText("Nihon Kojin Bango");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Nihon Kojin Bango" } });

        const el = screen.getByLabelText("Nihon Kojin Bango");
        expect(el.getAttribute("aria-label")).toBe("Nihon Kojin Bango");
    });
});
