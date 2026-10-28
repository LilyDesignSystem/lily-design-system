import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Expander.vue";

describe("Expander", () => {
    test("renders toggle button", () => {
        render(Subject, { props: { label: "More" }, slots: { default: "Content" } });
        expect(screen.getByRole("button", { name: "More" })).toBeTruthy();
    });

    test("collapsed by default", () => {
        render(Subject, { props: { label: "More" }, slots: { default: "Hidden" } });
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
        expect(screen.queryByRole("region")).toBeNull();
    });

    test("clicking expands content", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "More" }, slots: { default: "Visible" } });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
        expect(screen.getByRole("region")).toBeTruthy();
    });

    test("region has aria-label", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Details" }, slots: { default: "Info" } });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("region").getAttribute("aria-label")).toBe("Details");
    });

    test("button has aria-controls", () => {
        render(Subject, { props: { label: "More" }, slots: { default: "C" } });
        expect(screen.getByRole("button").getAttribute("aria-controls")).toBeTruthy();
    });

    test("clicking again collapses", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "More", expanded: true }, slots: { default: "C" } });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "M", "data-testid": "exp" }, slots: { default: "C" } });
        expect(screen.getByTestId("exp")).toBeTruthy();
    });
});
