import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./MockupTabletPortrait.vue";

describe("MockupTabletPortrait", () => {
    test("renders a div with class mockup-tablet-portrait", () => {
        const { container } = render(Subject, { slots: { default: "screen" } });
        const root = container.querySelector(".mockup-tablet-portrait");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { slots: { default: "my screenshot" } });
        expect(container.textContent).toBe("my screenshot");
    });
});
