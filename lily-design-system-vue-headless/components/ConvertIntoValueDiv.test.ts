import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./ConvertIntoValueDiv.vue";

describe("ConvertIntoValueDiv", () => {
    test("renders a div with the base class", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        expect(container.querySelector("div.convert-into-value-div")).toBeTruthy();
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("has no role and no aria-label", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "x" } });
        const root = container.querySelector(".convert-into-value-div");
        expect(root?.getAttribute("role")).toBeNull();
        expect(root?.getAttribute("aria-label")).toBeNull();
    });
});
