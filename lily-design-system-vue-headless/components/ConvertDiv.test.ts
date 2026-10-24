import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./ConvertDiv.vue";

describe("ConvertDiv", () => {
    test("renders a div with the base class", () => {
        const { container } = render(Subject, { props: { label: "Currency converter" }, slots: { default: "content" } });
        expect(container.querySelector("div.convert-div")).toBeTruthy();
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: { label: "Currency converter" }, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("is a named group", () => {
        const { getByRole } = render(Subject, { props: { label: "Currency converter" }, slots: { default: "x" } });
        expect(getByRole("group", { name: "Currency converter" })).toBeTruthy();
    });
});
