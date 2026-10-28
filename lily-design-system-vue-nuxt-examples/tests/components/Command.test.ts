import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Command.vue";

describe("Command", () => {
    test("renders search region", () => {
        render(Subject, { props: { label: "Commands" }, slots: { default: "Items" } });
        expect(screen.getByRole("search", { name: "Commands" })).toBeTruthy();
    });

    test("renders search input", () => {
        render(Subject, { props: { label: "Commands" }, slots: { default: "Items" } });
        expect(screen.getByRole("searchbox")).toBeTruthy();
    });

    test("renders listbox", () => {
        render(Subject, { props: { label: "Commands" }, slots: { default: "Items" } });
        expect(screen.getByRole("listbox")).toBeTruthy();
    });

    test("applies placeholder", () => {
        render(Subject, {
            props: { label: "Cmd", placeholder: "Type..." },
            slots: { default: "Items" },
        });
        expect(screen.getByPlaceholderText("Type...")).toBeTruthy();
    });

    test("input is focusable", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Cmd" }, slots: { default: "Items" } });
        await user.tab();
        expect(document.activeElement).toBe(screen.getByRole("searchbox"));
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "Cmd", "data-testid": "cmd" },
            slots: { default: "Items" },
        });
        expect(screen.getByTestId("cmd")).toBeTruthy();
    });
});
