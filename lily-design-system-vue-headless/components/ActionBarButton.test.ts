import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ActionBarButton.vue";


describe("ActionBarButton", () => {
    test("renders as a button with aria-label", () => {
        render(Subject, { props: { label: "Delete" }, slots: { default: "Delete" } });

        const button: HTMLElement = screen.getByRole("button", { name: "Delete" });
        expect(button).toBeTruthy();
    });

    test("has action-bar-button class on root", () => {
        render(Subject, { props: { label: "Delete" }, slots: { default: "Delete" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.classList.contains("action-bar-button")).toBe(true);
    });

    test("renders content from default slot", () => {
        render(Subject, { props: { label: "Delete" }, slots: { default: "Delete now" } });

        expect(screen.getByText("Delete now")).toBeTruthy();
    });

    test("defaults to type button", () => {
        render(Subject, { props: { label: "Delete" }, slots: { default: "Delete" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("accepts submit type", () => {
        render(Subject, {
            props: { label: "Submit", type: "submit" },
            slots: { default: "Submit" },
        });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("type")).toBe("submit");
    });

    test("can be disabled", () => {
        render(Subject, { props: { label: "Delete", disabled: true }, slots: { default: "Delete" } });

        const button: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("emits click on activation", async () => {
        const user: UserEvent = userEvent.setup();
        const onClick = vi.fn();
        render(Subject, {
            props: { label: "Delete", onClick },
            slots: { default: "Delete" },
        });

        await user.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledOnce();
    });

    test("applies aria-label", () => {
        render(Subject, { props: { label: "Delete files" }, slots: { default: "Delete" } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-label")).toBe("Delete files");
    });
});
