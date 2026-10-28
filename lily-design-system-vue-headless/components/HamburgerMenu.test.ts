import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./HamburgerMenu.vue";

describe("HamburgerMenu", () => {
    test("renders toggle button", () => {
        render(Subject, { props: { label: "Menu" }, slots: { default: "Nav" } });
        expect(screen.getByRole("button", { name: "Menu" })).toBeTruthy();
    });

    test("button has aria-expanded false when closed", () => {
        render(Subject, { slots: { default: "Nav" } });
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
    });

    test("navigation hidden when closed", () => {
        render(Subject, { slots: { default: "Nav" } });
        expect(screen.queryByRole("navigation")).toBeNull();
    });

    test("clicking opens navigation", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { slots: { default: "Nav items" } });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-expanded true when open", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { slots: { default: "Nav" } });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "hm" }, slots: { default: "Nav" } });
        expect(screen.getByTestId("hm")).toBeTruthy();
    });
});
