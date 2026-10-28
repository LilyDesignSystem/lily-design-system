import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "../../components/DropdownMenu.vue";

describe("DropdownMenu", () => {
    test("renders a toggle button", () => {
        render(Subject, {
            props: { label: "Options" },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Edit</li><li role='menuitem' tabindex='-1'>Delete</li>",
            },
        });
        expect(screen.getByRole("button", { name: "Options" })).toBeTruthy();
    });

    test("button has aria-haspopup", () => {
        render(Subject, {
            props: { label: "Options" },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Edit</li><li role='menuitem' tabindex='-1'>Delete</li>",
            },
        });
        expect(screen.getByRole("button").getAttribute("aria-haspopup")).toBe("true");
    });

    test("button shows aria-expanded false when closed", () => {
        render(Subject, {
            props: { label: "Options" },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Edit</li><li role='menuitem' tabindex='-1'>Delete</li>",
            },
        });
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
    });

    test("menu hidden when closed", () => {
        render(Subject, {
            props: { label: "Options" },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Edit</li><li role='menuitem' tabindex='-1'>Delete</li>",
            },
        });
        expect(screen.queryByRole("menu")).toBeNull();
    });

    test("clicking button opens menu", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, {
            props: { label: "Options" },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Edit</li><li role='menuitem' tabindex='-1'>Delete</li>",
            },
        });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("menu")).toBeTruthy();
    });

    test("button shows aria-expanded true when open", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, {
            props: { label: "Options" },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Edit</li><li role='menuitem' tabindex='-1'>Delete</li>",
            },
        });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
    });

    test("ArrowDown navigates items", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, {
            props: { label: "Options", open: true },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Edit</li><li role='menuitem' tabindex='-1'>Delete</li>",
            },
        });
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        await user.keyboard("{ArrowDown}");
        expect(document.activeElement).toBe(items[1]);
    });

    test("ArrowUp navigates items", () => {
        render(Subject, {
            props: { label: "Options", open: true },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Edit</li><li role='menuitem' tabindex='-1'>Delete</li>",
            },
        });
        const items = screen.getAllByRole("menuitem");
        items[1].focus();
        items[1].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });

    test("Escape closes menu", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, {
            props: { label: "Options", open: true },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Edit</li><li role='menuitem' tabindex='-1'>Delete</li>",
            },
        });
        screen.getByRole("menu").focus();
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("menu")).toBeNull();
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "Options", "data-testid": "dd" },
            slots: {
                default:
                    "<li role='menuitem' tabindex='-1'>Edit</li><li role='menuitem' tabindex='-1'>Delete</li>",
            },
        });
        expect(screen.getByTestId("dd")).toBeTruthy();
    });
});
