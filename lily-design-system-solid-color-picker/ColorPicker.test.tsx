import { fireEvent, render as rtlRender, screen, within } from "./test-utils";
import { act } from "./test-act";
import { userEvent } from "@testing-library/user-event";
import { createSignal } from "solid-js";
import { describe, expect, test, vi } from "vitest";

import ColorPicker from "./ColorPicker";
import type { Labels, Props } from "./ColorPicker";

const render = (_c: unknown, { props }: { props: Partial<Props> }) =>
    rtlRender(() => (
        <ColorPicker
            labels={labels}
            {...props}
        />
    ));

const labels: Labels = {
    picker: "Text colour",
    recent: "Recent colours",
    palette: "Colours",
    transparent: "Transparent",
    custom: "Custom colour",
    hex: "Hex",
    name: "Colour name",
    hue: "Hue",
    saturation: "Saturation",
    lightness: "Lightness",
    brightness: "Brightness",
    hsl: "HSL",
    hsb: "HSB",
    rgb: "RGB",
    cmyk: "CMYK",
    red: "Red",
    green: "Green",
    blue: "Blue",
    cyan: "Cyan",
    magenta: "Magenta",
    yellow: "Yellow",
    key: "Black",
    invalid: "Not a colour",
};

const palette = () => screen.getByRole("radiogroup", { name: "Colours" });
const recentGroup = () => screen.getByRole("radiogroup", { name: "Recent colours" });

describe("ColorPicker", () => {
    test("is one named group of four areas: recent, palette with Transparent, and entry fields, split by two separators", () => {
        const { container } = render(ColorPicker, { props: { labels } });
        const root = container.querySelector(".color-picker")!;
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Text colour");
        expect(recentGroup()).toBeTruthy();
        expect(palette()).toBeTruthy();
        expect(screen.getByRole("button", { name: "Transparent" })).toBeTruthy();
        expect(screen.getByRole("group", { name: "Custom colour" })).toBeTruthy();
        expect(root.querySelectorAll(":scope > hr.color-picker-separator")).toHaveLength(2);
    });

    test("the palette is 8 rows of 10 native radios, each painted by its custom property", () => {
        const { container } = render(ColorPicker, { props: { labels } });
        const rows = container.querySelectorAll(".color-picker-palette-row");
        expect(rows).toHaveLength(8);
        for (const row of rows) expect(row.querySelectorAll("input[type=radio]")).toHaveLength(10);
        const first = within(palette()).getAllByRole("radio")[0] as HTMLInputElement;
        expect(first.dataset.color).toBe("#000000");
        expect(first.style.getPropertyValue("--color-picker-swatch")).toBe("#000000");
        expect(first.getAttribute("aria-label")).toBe("black");
    });

    test("a swatch is named by colorLabel when given, else its CSS name, else its hex", () => {
        render(ColorPicker, { props: { labels, palette: ["#ff0000", "#005eb8"], columns: 2 } });
        const [red, blue] = within(palette()).getAllByRole("radio");
        expect(red.getAttribute("aria-label")).toBe("red");
        expect(blue.getAttribute("aria-label")).toBe("#005eb8");
    });

    test("choosing a swatch sets the value, adds it to recent and calls onChange once", async () => {
        const onChange = vi.fn();
        const { container } = render(ColorPicker, { props: { labels, onChange } });
        const swatch = within(palette()).getAllByRole("radio")[12] as HTMLInputElement;
        await userEvent.setup().click(swatch);
        expect(onChange).toHaveBeenCalledOnce();
        expect(onChange).toHaveBeenCalledWith(swatch.value);
        expect(container.querySelector(".color-picker")!.getAttribute("data-value")).toBe(
            swatch.value,
        );
        const recent = within(recentGroup()).getAllByRole("radio") as HTMLInputElement[];
        expect(recent.map((r) => r.value)).toEqual([swatch.value]);
        expect(recent[0].checked).toBe(true);
    });

    test("recent keeps the newest first and at most maxRecent", async () => {
        render(ColorPicker, { props: { labels, maxRecent: 3 } });
        const user = userEvent.setup();
        const radios = within(palette()).getAllByRole("radio") as HTMLInputElement[];
        for (const i of [10, 11, 12, 13]) await user.click(radios[i]);
        await user.click(radios[11]);
        const values = (within(recentGroup()).getAllByRole("radio") as HTMLInputElement[]).map(
            (r) => r.value,
        );
        expect(values).toEqual([radios[11].value, radios[13].value, radios[12].value]);
    });

    test("ArrowDown and ArrowUp move a whole row; Left and Right stay the browser's", async () => {
        render(ColorPicker, { props: { labels } });
        const radios = within(palette()).getAllByRole("radio") as HTMLInputElement[];
        radios[3].focus();
        await fireEvent.keyDown(radios[3], { key: "ArrowDown" });
        expect(document.activeElement).toBe(radios[13]);
        expect(radios[13].checked).toBe(true);
        await fireEvent.keyDown(radios[13], { key: "ArrowUp" });
        expect(document.activeElement).toBe(radios[3]);
        // From the top row, ArrowUp goes nowhere.
        await fireEvent.keyDown(radios[3], { key: "ArrowUp" });
        expect(document.activeElement).toBe(radios[3]);
    });

    test("Transparent chooses transparent and says so with aria-pressed", async () => {
        const { container } = render(ColorPicker, { props: { labels } });
        const button = screen.getByRole("button", { name: "Transparent" });
        expect(button.getAttribute("aria-pressed")).toBe("false");
        await userEvent.setup().click(button);
        expect(button.getAttribute("aria-pressed")).toBe("true");
        expect(container.querySelector(".color-picker")!.getAttribute("data-value")).toBe(
            "transparent",
        );
        const icon = button.querySelector("svg")!;
        expect(icon.getAttribute("aria-hidden")).toBe("true");
    });

    test("a hex value is entered on Enter; a wrong one is marked invalid and changes nothing", async () => {
        const onChange = vi.fn();
        render(ColorPicker, { props: { labels, onChange } });
        const user = userEvent.setup();
        const hex = screen.getByLabelText("Hex") as HTMLInputElement;
        await user.type(hex, "#zz{Enter}");
        expect(hex.getAttribute("aria-invalid")).toBe("true");
        expect(screen.getByText("Not a colour")).toBeTruthy();
        expect(onChange).not.toHaveBeenCalled();
        await user.clear(hex);
        await user.type(hex, "#005EB8{Enter}");
        expect(onChange).toHaveBeenCalledWith("#005eb8");
        expect(hex.getAttribute("aria-invalid")).toBeNull();
        expect(hex.value).toBe("#005eb8");
    });

    test("a CSS colour name is entered, offered from a datalist of all 148", async () => {
        const onChange = vi.fn();
        render(ColorPicker, { props: { labels, onChange } });
        const field = screen.getByLabelText("Colour name") as HTMLInputElement;
        const list = document.getElementById(field.getAttribute("list")!)!;
        expect(list.querySelectorAll("option")).toHaveLength(148);
        await userEvent.setup().type(field, "Tomato{Enter}");
        expect(onChange).toHaveBeenCalledWith("#ff6347");
        expect((screen.getByLabelText("Hex") as HTMLInputElement).value).toBe("#ff6347");
    });

    const field = (group: string, name: string) =>
        within(screen.getByRole("group", { name: group })).getByLabelText(name) as HTMLInputElement;

    test("the entry area has HSL, HSB, RGB and CMYK groups, each showing the current value", () => {
        render(ColorPicker, { props: { labels, defaultValue: "#ff0000" } });
        expect([
            field("HSL", "Hue").value,
            field("HSL", "Saturation").value,
            field("HSL", "Lightness").value,
        ]).toEqual(["0", "100", "50"]);
        expect([
            field("HSB", "Hue").value,
            field("HSB", "Saturation").value,
            field("HSB", "Brightness").value,
        ]).toEqual(["0", "100", "100"]);
        expect([
            field("RGB", "Red").value,
            field("RGB", "Green").value,
            field("RGB", "Blue").value,
        ]).toEqual(["255", "0", "0"]);
        expect([
            field("CMYK", "Cyan").value,
            field("CMYK", "Magenta").value,
            field("CMYK", "Yellow").value,
            field("CMYK", "Black").value,
        ]).toEqual(["0", "100", "100", "0"]);
    });

    test("each colour model's fields change the value", async () => {
        const onChange = vi.fn();
        render(ColorPicker, { props: { labels, defaultValue: "#ff0000", onChange } });
        await fireEvent.change(field("HSL", "Hue"), { target: { value: "120" } });
        expect(onChange).toHaveBeenLastCalledWith("#00ff00");
        await fireEvent.change(field("HSB", "Brightness"), { target: { value: "50" } });
        expect(onChange).toHaveBeenLastCalledWith("#008000");
        await fireEvent.change(field("RGB", "Blue"), { target: { value: "255" } });
        expect(onChange).toHaveBeenLastCalledWith("#0080ff");
        await fireEvent.change(field("CMYK", "Black"), { target: { value: "100" } });
        expect(onChange).toHaveBeenLastCalledWith("#000000");
    });

    test("with a name, a hidden input carries the value for the form", async () => {
        const { container } = render(ColorPicker, {
            props: { labels, name: "colour", defaultValue: "#ff0000" },
        });
        const hidden = container.querySelector("input[type=hidden]") as HTMLInputElement;
        expect(hidden.name).toBe("colour");
        expect(hidden.value).toBe("#ff0000");
    });

    test("disabled disables every control", () => {
        render(ColorPicker, { props: { labels, disabled: true } });
        expect(
            (screen.getByRole("button", { name: "Transparent" }) as HTMLButtonElement).disabled,
        ).toBe(true);
        expect((screen.getByLabelText("Hex") as HTMLInputElement).disabled).toBe(true);
        expect((palette() as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("passes other attributes to the root and adds the consumer's class", () => {
        const { container } = render(ColorPicker, {
            props: { labels, class: "mine", "data-testid": "cp" },
        });
        const root = container.querySelector(".color-picker")!;
        expect(root.classList.contains("mine")).toBe(true);
        expect(root.getAttribute("data-testid")).toBe("cp");
    });
    test("a form reset restores the starting colour and tells the consumer", async () => {
        const onChange = vi.fn();
        const { container } = rtlRender(() => (
            <form>
                <ColorPicker
                    labels={labels}
                    name="colour"
                    defaultValue="#ff0000"
                    onChange={onChange}
                />
            </form>
        ));
        const form = container.querySelector("form")!;
        await userEvent.setup().click(screen.getByRole("button", { name: "Transparent" }));
        expect(new FormData(form).get("colour")).toBe("transparent");
        form.reset();
        await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
        expect(new FormData(form).get("colour")).toBe("#ff0000");
        expect(onChange).toHaveBeenLastCalledWith("#ff0000");
    });

    test("controlled: value and recent come from the consumer, with onRecentChange", async () => {
        const onRecentChange = vi.fn();
        const [value, setValue] = createSignal("#ff0000");
        const [recent, setRecent] = createSignal(["#ff0000"]);
        const { container } = rtlRender(() => (
            <ColorPicker
                labels={labels}
                value={value()}
                recent={recent()}
                onRecentChange={onRecentChange}
            />
        ));
        await userEvent.setup().click(screen.getByRole("button", { name: "Transparent" }));
        expect(onRecentChange).toHaveBeenCalledWith(["transparent", "#ff0000"]);
        // The consumer has not taken the change, so the value stays.
        expect(container.querySelector(".color-picker")!.getAttribute("data-value")).toBe(
            "#ff0000",
        );
        act(() => {
            setValue("#00ff00");
            setRecent(["#00ff00"]);
        });
        expect((screen.getByLabelText("Hex") as HTMLInputElement).value).toBe("#00ff00");
    });
});
