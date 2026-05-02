import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./MockupBrowser.vue";

describe("MockupBrowser", () => {
    test("renders a div with class mockup-browser", () => {
        const { container } = render(Subject, { slots: { default: "screen" } });
        const root = container.querySelector(".mockup-browser");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { slots: { default: "my screenshot" } });
        expect(container.textContent).toBe("my screenshot");
    });
});
