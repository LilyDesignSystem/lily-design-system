import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Menu.vue";

describe("Menu", () => {
    test("renders a menu", () => {
        render(Subject, {
            props: { label: "Actions" },
            slots: {
                default:
                    "<div role='menuitem' tabindex='-1'>Cut</div><div role='menuitem' tabindex='-1'>Copy</div>",
            },
        });
        expect(screen.getByRole("menu")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Edit" },
            slots: {
                default:
                    "<div role='menuitem' tabindex='-1'>Cut</div><div role='menuitem' tabindex='-1'>Copy</div>",
            },
        });
        expect(screen.getByLabelText("Edit")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, {
            props: { label: "Actions" },
            slots: {
                default:
                    "<div role='menuitem' tabindex='-1'>Cut</div><div role='menuitem' tabindex='-1'>Copy</div>",
            },
        });
        expect(screen.getByText("Cut")).toBeTruthy();
        expect(screen.getByText("Copy")).toBeTruthy();
    });

    test("arrow down navigates to next item", async () => {
        render(Subject, {
            props: { label: "Actions" },
            slots: {
                default:
                    "<div role='menuitem' tabindex='-1'>Cut</div><div role='menuitem' tabindex='-1'>Copy</div>",
            },
        });
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        items[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(items[1]);
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "A", "data-testid": "m" },
            slots: {
                default:
                    "<div role='menuitem' tabindex='-1'>Cut</div><div role='menuitem' tabindex='-1'>Copy</div>",
            },
        });
        expect(screen.getByTestId("m")).toBeTruthy();
    });
});
