import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ContextMenu.vue";

describe("ContextMenu", () => {
    test("hidden when open is false", () => {
        render(Subject, { props: { label: "Actions", open: false }, slots: { default: "Items" } });
        expect(screen.queryByRole("menu")).toBeNull();
    });

    test("visible when open is true", () => {
        render(Subject, { props: { label: "Actions", open: true }, slots: { default: "Items" } });
        expect(screen.getByRole("menu", { name: "Actions" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, {
            props: { label: "Actions", open: true },
            slots: { default: "Custom Content" },
        });
        expect(screen.getByRole("menu").textContent).toContain("Custom Content");
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "Actions", open: true, "data-testid": "ctx" },
            slots: { default: "Items" },
        });
        expect(screen.getByTestId("ctx")).toBeTruthy();
    });

    test("has correct aria-label", () => {
        render(Subject, {
            props: { label: "File actions", open: true },
            slots: { default: "Items" },
        });
        expect(screen.getByRole("menu").getAttribute("aria-label")).toBe("File actions");
    });

    test("ArrowDown navigates to next item", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, {
            props: { label: "Actions", open: true },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Cut</li><li role='menuitem' tabindex='-1'>Copy</li><li role='menuitem' tabindex='-1'>Paste</li>",
            },
        });
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(items[1]);
    });

    test("ArrowUp navigates to previous item", () => {
        render(Subject, {
            props: { label: "Actions", open: true },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Cut</li><li role='menuitem' tabindex='-1'>Copy</li><li role='menuitem' tabindex='-1'>Paste</li>",
            },
        });
        const items = screen.getAllByRole("menuitem");
        items[1].focus();
        items[1].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });

    test("ArrowDown wraps from last to first", () => {
        render(Subject, {
            props: { label: "Actions", open: true },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Cut</li><li role='menuitem' tabindex='-1'>Copy</li><li role='menuitem' tabindex='-1'>Paste</li>",
            },
        });
        const items = screen.getAllByRole("menuitem");
        items[2].focus();
        items[2].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });

    test("Home moves focus to first item", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, {
            props: { label: "Actions", open: true },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Cut</li><li role='menuitem' tabindex='-1'>Copy</li><li role='menuitem' tabindex='-1'>Paste</li>",
            },
        });
        const items = screen.getAllByRole("menuitem");
        items[2].focus();
        await user.keyboard("{Home}");
        expect(document.activeElement).toBe(items[0]);
    });

    test("End moves focus to last item", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, {
            props: { label: "Actions", open: true },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Cut</li><li role='menuitem' tabindex='-1'>Copy</li><li role='menuitem' tabindex='-1'>Paste</li>",
            },
        });
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        await user.keyboard("{End}");
        expect(document.activeElement).toBe(items[2]);
    });
});
