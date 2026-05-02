import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./MockupTabletLandscape.vue";

describe("MockupTabletLandscape", () => {
    test("renders a div with class mockup-tablet-landscape", () => {
        const { container } = render(Subject, { slots: { default: "screen" } });
        const root = container.querySelector(".mockup-tablet-landscape");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { slots: { default: "my screenshot" } });
        expect(container.textContent).toBe("my screenshot");
    });
});
