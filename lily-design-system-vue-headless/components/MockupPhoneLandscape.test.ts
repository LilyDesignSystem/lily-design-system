import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./MockupPhoneLandscape.vue";

describe("MockupPhoneLandscape", () => {
    test("renders root with class mockup-phone-landscape", () => {
        const { container } = render(Subject, { props: { label: "Test" }, slots: { default: "Body" } });
        expect(container.querySelector(".mockup-phone-landscape")).toBeTruthy();
    });
});
