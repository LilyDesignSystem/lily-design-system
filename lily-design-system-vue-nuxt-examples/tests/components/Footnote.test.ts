import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Footnote.vue";

describe("Footnote", () => {
    test("renders with note role", () => {
        render(Subject, { props: { id: "fn1" }, slots: { default: "Source info" } });
        expect(screen.getByRole("note")).toBeTruthy();
    });

    test("has correct id", () => {
        render(Subject, { props: { id: "fn1" }, slots: { default: "Source" } });
        expect(document.getElementById("fn1")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { id: "fn1" }, slots: { default: "Citation text" } });
        expect(screen.getByRole("note").textContent).toContain("Citation text");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { id: "fn1", "data-testid": "fn" }, slots: { default: "C" } });
        expect(screen.getByTestId("fn")).toBeTruthy();
    });
});
