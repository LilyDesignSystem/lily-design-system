import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./AddressographBox.vue";

describe("AddressographBox", () => {
    test("renders a div element with class addressograph-box", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".addressograph-box");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.querySelector(".addressograph-box");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(Subject, { props: { label: "Patient ID" }, slots: { default: "x" } });
        const root = container.querySelector(".addressograph-box");
        expect(root?.getAttribute("aria-label")).toBe("Patient ID");
    });
});
