import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./GoToPreviousSection.vue";

describe("GoToPreviousSection", () => {
    test("renders root with class go-to-previous-section", () => {
        const { container } = render(Subject, { props: { href: "#section", label: "Go" } });
        expect(container.querySelector(".go-to-previous-section")).toBeTruthy();
    });
});
