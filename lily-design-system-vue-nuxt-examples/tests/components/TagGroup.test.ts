import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/TagGroup.vue";

describe("TagGroup", () => {
    test("renders a group", () => {
        render(Subject, { props: { label: "Tags" }, slots: { default: "content" } });
        expect(screen.getByRole("group")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Technologies" }, slots: { default: "content" } });
        expect(screen.getByLabelText("Technologies")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Tags" }, slots: { default: "Svelte" } });
        expect(screen.getByText("Svelte")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "tg" }, slots: { default: "x" } });
        expect(screen.getByTestId("tg")).toBeTruthy();
    });
});
