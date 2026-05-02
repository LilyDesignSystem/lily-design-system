import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./EndNotes.vue";

describe("EndNotes", () => {
    test("renders a section with class end-notes", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".end-notes");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("SECTION");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        expect(container.textContent).toContain("content");
    });

    test("defaults aria-label to 'End notes'", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.querySelector(".end-notes");
        expect(root?.getAttribute("aria-label")).toBe("End notes");
    });

    test("aria-label can be overridden", () => {
        const { container } = render(Subject, { props: { label: "Other" }, slots: { default: "x" } });
        const root = container.querySelector(".end-notes");
        expect(root?.getAttribute("aria-label")).toBe("Other");
    });
});
