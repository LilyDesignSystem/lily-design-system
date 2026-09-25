import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./YisraelTeudatZehutView.vue";

describe("YisraelTeudatZehutView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Yisrael Teudat Zehut", value: "test-value" } });

        const el = screen.getByLabelText("Yisrael Teudat Zehut");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("yisrael-teudat-zehut-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Yisrael Teudat Zehut", value: "test-value" } });

        const el = screen.getByLabelText("Yisrael Teudat Zehut");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Yisrael Teudat Zehut" } });

        const el = screen.getByLabelText("Yisrael Teudat Zehut");
        expect(el.getAttribute("aria-label")).toBe("Yisrael Teudat Zehut");
    });
});
