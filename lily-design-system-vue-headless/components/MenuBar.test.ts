import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./MenuBar.vue";

describe("MenuBar", () => {
    test("renders a menubar", () => {
        render(Subject, {
            props: { label: "Main" },
            slots: {
                default:
                    "<div role='menuitem' tabindex='-1'>File</div><div role='menuitem' tabindex='-1'>Edit</div>",
            },
        });
        expect(screen.getByRole("menubar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: { label: "Main menu" },
            slots: {
                default:
                    "<div role='menuitem' tabindex='-1'>File</div><div role='menuitem' tabindex='-1'>Edit</div>",
            },
        });
        expect(screen.getByLabelText("Main menu")).toBeTruthy();
    });

    test("arrow right navigates to next item", async () => {
        render(Subject, {
            props: { label: "Main" },
            slots: {
                default:
                    "<div role='menuitem' tabindex='-1'>File</div><div role='menuitem' tabindex='-1'>Edit</div>",
            },
        });
        const items = screen.getAllByRole("menuitem");
        items[0].focus();
        items[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(items[1]);
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "M", "data-testid": "mb" },
            slots: {
                default:
                    "<div role='menuitem' tabindex='-1'>File</div><div role='menuitem' tabindex='-1'>Edit</div>",
            },
        });
        expect(screen.getByTestId("mb")).toBeTruthy();
    });
});
