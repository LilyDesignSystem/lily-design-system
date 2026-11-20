import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./ToolBar";

const buttons = () => (
    <>
        <button>Bold</button>
        <button>Italic</button>
        <button>Underline</button>
    </>
);

const press = (el: Element, key: string) =>
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));

describe("ToolBar", () => {
    test("renders a toolbar", () => {
        render(() => <Subject label="Tools">{buttons()}</Subject>);
        expect(screen.getByRole("toolbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(() => <Subject label="Editor tools">{buttons()}</Subject>);
        expect(screen.getByLabelText("Editor tools")).toBeTruthy();
    });

    test("renders children", () => {
        render(() => <Subject label="Tools">{buttons()}</Subject>);
        expect(screen.getByText("Bold")).toBeTruthy();
    });

    test("arrow right navigates to next item", async () => {
        const user = userEvent.setup();
        render(() => <Subject label="Tools">{buttons()}</Subject>);
        const btns = screen.getAllByRole("button");
        btns[0].focus();
        await user.keyboard("{ArrowRight}");
        expect(document.activeElement).toBe(btns[1]);
    });

    test("passes through attributes", () => {
        render(() => (
            <Subject
                label="T"
                data-testid="tb"
            >
                {buttons()}
            </Subject>
        ));
        expect(screen.getByTestId("tb")).toBeTruthy();
    });

    test("the arrows skip a disabled button, and Home and End jump", () => {
        render(() => (
            <Subject label="Tools">
                <button>Bold</button>
                <button disabled>Italic</button>
                <button>Underline</button>
            </Subject>
        ));
        const [bold, , underline] = screen.getAllByRole("button");
        bold.focus();
        press(bold, "ArrowRight");
        expect(document.activeElement).toBe(underline);
        press(underline, "ArrowLeft");
        expect(document.activeElement).toBe(bold);
        press(bold, "End");
        expect(document.activeElement).toBe(underline);
        press(underline, "Home");
        expect(document.activeElement).toBe(bold);
    });

    test("right-to-left swaps the arrows", () => {
        render(() => (
            <Subject
                label="Tools"
                dir="rtl"
                style={{ direction: "rtl" }}
            >
                {buttons()}
            </Subject>
        ));
        const [bold, italic] = screen.getAllByRole("button");
        bold.focus();
        press(bold, "ArrowLeft");
        expect(document.activeElement).toBe(italic);
    });

    test("one tab stop, which follows focus", () => {
        render(() => <Subject label="Tools">{buttons()}</Subject>);
        const [bold, italic, underline] = screen.getAllByRole("button");
        expect([bold.tabIndex, italic.tabIndex, underline.tabIndex]).toEqual([0, -1, -1]);
        italic.focus();
        expect([bold.tabIndex, italic.tabIndex, underline.tabIndex]).toEqual([-1, 0, -1]);
    });
});
