import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./Container.vue";

describe("Container", () => {
    test("renders root with class container", () => {
        const { container } = render(Subject, { slots: { default: "Body" } });
        expect(container.querySelector(".container")).toBeTruthy();
    });
});
