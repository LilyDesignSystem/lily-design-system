import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "../../components/AccordionListItem.vue";

describe("AccordionListItem", () => {
    test("renders an li holding a details element", () => {
        render(Subject, {
            props: { "data-testid": "ali" },
            slots: { default: "<summary>Header</summary>" },
        });
        expect(screen.getByTestId("ali").tagName).toBe("LI");
        expect(screen.getByTestId("ali").querySelector(":scope > details")).toBeTruthy();
    });

    test("renders children content", () => {
        render(Subject, { slots: { default: "<summary>Question</summary>" } });
        expect(screen.getByText("Question")).toBeTruthy();
    });

    test("is closed by default", () => {
        render(Subject, {
            props: { "data-testid": "ali" },
            slots: { default: "<summary>Q</summary>" },
        });
        expect(
            (screen.getByTestId("ali").querySelector("details") as HTMLDetailsElement).open,
        ).toBe(false);
    });

    test("supports open prop", () => {
        render(Subject, {
            props: { open: true, "data-testid": "ali" },
            slots: { default: "<summary>Q</summary>" },
        });
        expect(
            (screen.getByTestId("ali").querySelector("details") as HTMLDetailsElement).open,
        ).toBe(true);
    });

    test("toggles on summary click", async () => {
        const user = userEvent.setup();
        render(Subject, {
            props: { "data-testid": "ali" },
            slots: { default: "<summary>Click me</summary>" },
        });
        const summary = screen.getByText("Click me");
        await user.click(summary);
        await vi.waitFor(() => {
            expect(
                (screen.getByTestId("ali").querySelector("details") as HTMLDetailsElement).open,
            ).toBe(true);
        });
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { "data-testid": "item" },
            slots: { default: "<summary>Q</summary>" },
        });
        expect(screen.getByTestId("item")).toBeTruthy();
    });
});
