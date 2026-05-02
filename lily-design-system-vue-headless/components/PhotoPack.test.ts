import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./PhotoPack.vue";

describe("PhotoPack", () => {
    test("renders a div with class photo-pack", () => {
        const { container } = render(Subject, { props: { label: "x" }, slots: { default: "content" } });
        const root = container.querySelector(".photo-pack");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: { label: "x" }, slots: { default: "content" } });
        expect(container.textContent).toContain("content");
    });

    test("applies role=group", () => {
        const { container } = render(Subject, { props: { label: "x" }, slots: { default: "content" } });
        const root = container.querySelector(".photo-pack");
        expect(root?.getAttribute("role")).toBe("group");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(Subject, { props: { label: "Hello" }, slots: { default: "content" } });
        const root = container.querySelector(".photo-pack");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });
});
