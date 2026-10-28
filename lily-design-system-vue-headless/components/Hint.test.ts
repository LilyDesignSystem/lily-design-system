import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Hint.vue";

describe("Hint", () => {
    test("renders hint text", () => {
        render(Subject, { slots: { default: "Enter email" } });
        expect(screen.getByText("Enter email")).toBeTruthy();
    });

    test("has id for linking", () => {
        render(Subject, { props: { id: "hint-1" }, slots: { default: "Help" } });
        expect(document.getElementById("hint-1")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "h" }, slots: { default: "H" } });
        expect(screen.getByTestId("h")).toBeTruthy();
    });
});
