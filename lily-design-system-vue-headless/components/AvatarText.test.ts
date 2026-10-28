import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./AvatarText.vue";

describe("AvatarText", () => {
    test("renders a span element", () => {
        render(Subject, { props: { "data-testid": "act" }, slots: { default: "JD" } });
        expect(screen.getByTestId("act").tagName).toBe("SPAN");
    });

    test("renders children text", () => {
        render(Subject, { slots: { default: "AB" } });
        expect(screen.getByText("AB")).toBeTruthy();
    });

    test("is aria-hidden", () => {
        render(Subject, { props: { "data-testid": "act" }, slots: { default: "JD" } });
        expect(screen.getByTestId("act").getAttribute("aria-hidden")).toBe("true");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "initials" }, slots: { default: "X" } });
        expect(screen.getByTestId("initials")).toBeTruthy();
    });
});
