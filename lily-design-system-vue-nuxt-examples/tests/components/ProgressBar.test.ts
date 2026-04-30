import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "../../components/ProgressBar.vue";

describe("ProgressBar", () => {
    test("renders root with class progress-bar", () => {
        const { container } = render(Subject, { props: { value: 42, label: "Test" } });
        expect(container.querySelector(".progress-bar")).toBeTruthy();
    });
});
