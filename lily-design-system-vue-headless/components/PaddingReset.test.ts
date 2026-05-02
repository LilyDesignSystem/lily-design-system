import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./PaddingReset.vue";

describe("PaddingReset", () => {
    test("renders a div with class padding-reset", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".padding-reset");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        expect(container.textContent).toContain("content");
    });
});
