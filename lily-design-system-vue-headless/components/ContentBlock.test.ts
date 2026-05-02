import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./ContentBlock.vue";

describe("ContentBlock", () => {
    test("renders a div with class content-block", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".content-block");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        expect(container.textContent).toContain("content");
    });

    test("data-width defaults to normal", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.querySelector(".content-block");
        expect(root?.getAttribute("data-width")).toBe("normal");
    });

    test("data-width reflects the width prop", () => {
        const { container } = render(Subject, { props: { width: "wide" }, slots: { default: "x" } });
        const root = container.querySelector(".content-block");
        expect(root?.getAttribute("data-width")).toBe("wide");
    });
});
