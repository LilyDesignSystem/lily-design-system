import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Header.vue";

describe("Header", () => {
    test("renders as banner landmark", () => {
        render(Subject, { slots: { default: "Title" } });
        expect(screen.getByRole("banner")).toBeTruthy();
    });

    test("supports aria-label", () => {
        render(Subject, { props: { label: "Site header" }, slots: { default: "T" } });
        expect(screen.getByRole("banner").getAttribute("aria-label")).toBe("Site header");
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "My Title" } });
        expect(screen.getByRole("banner").textContent).toContain("My Title");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "hdr" }, slots: { default: "T" } });
        expect(screen.getByTestId("hdr")).toBeTruthy();
    });
});
