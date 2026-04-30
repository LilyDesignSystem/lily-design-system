import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./GoToNextSection.vue";

describe("GoToNextSection", () => {
    test("renders root with class go-to-next-section", () => {
        const { container } = render(Subject, { props: { href: "#section", label: "Go" } });
        expect(container.querySelector(".go-to-next-section")).toBeTruthy();
    });
});
