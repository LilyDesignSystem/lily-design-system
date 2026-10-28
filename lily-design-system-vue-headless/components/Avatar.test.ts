import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Avatar.vue";

describe("Avatar", () => {
    test("renders with img role", () => {
        render(Subject, { props: { alt: "Jane Doe" }, slots: { default: "JD" } });
        expect(screen.getByRole("img")).toBeTruthy();
    });

    test("has aria-label from alt prop", () => {
        render(Subject, { props: { alt: "Jane Doe" }, slots: { default: "JD" } });
        expect(screen.getByRole("img", { name: "Jane Doe" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { alt: "Jane Doe" }, slots: { default: "JD" } });
        expect(screen.getByRole("img").textContent).toContain("JD");
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { alt: "User", "data-testid": "avatar" },
            slots: { default: "U" },
        });
        expect(screen.getByTestId("avatar")).toBeTruthy();
    });
});
