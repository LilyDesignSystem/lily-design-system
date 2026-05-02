import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./BodyText.vue";

describe("BodyText", () => {
    test("renders a div with class body-text", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".body-text");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        expect(container.textContent).toContain("content");
    });
});
