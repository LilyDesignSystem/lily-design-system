import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/AspectRatioContainer.vue";

describe("AspectRatioContainer", () => {
    test("renders children content", () => {
        render(Subject, { slots: { default: "Hello" } });

        expect(screen.getByText("Hello")).toBeTruthy();
    });

    test("defaults to ratio 1", () => {
        render(Subject, { props: { "data-testid": "ar" }, slots: { default: "Square" } });

        const container: HTMLElement = screen.getByTestId("ar");
        expect(container.getAttribute("data-aspect-ratio-container")).toBe("1");
    });

    test("applies custom ratio", () => {
        const ratio = 16 / 9;
        render(Subject, {
            props: { ratio, "data-testid": "ar" },
            slots: { default: "Widescreen" },
        });

        const container: HTMLElement = screen.getByTestId("ar");
        expect(container.getAttribute("data-aspect-ratio-container")).toBe(String(ratio));
    });

    test("sets aspect-ratio-container style", () => {
        render(Subject, {
            props: { ratio: 4 / 3, "data-testid": "ar" },
            slots: { default: "Content" },
        });

        const container: HTMLElement = screen.getByTestId("ar");
        expect(container.getAttribute("data-aspect-ratio-container")).toBe(String(4 / 3));
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { id: "my-aspect", "data-testid": "ar" },
            slots: { default: "Content" },
        });

        const container: HTMLElement = screen.getByTestId("ar");
        expect(container.getAttribute("id")).toBe("my-aspect");
    });
});
