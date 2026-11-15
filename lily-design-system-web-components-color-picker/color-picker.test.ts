import { fireEvent, screen, within } from "@testing-library/dom";
import { afterEach, describe, expect, test, vi } from "vitest";

import { ColorPicker, type Labels } from "./color-picker.js";

const TAG = "lily-color-picker";
if (!customElements.get(TAG)) customElements.define(TAG, ColorPicker);

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

afterEach(() => {
    document.body.innerHTML = "";
});

function setup(
    attrs: Record<string, string | true> = {},
    props: Partial<Pick<ColorPicker, "palette" | "colorLabel">> = {},
    host: HTMLElement = document.body,
) {
    const picker = document.createElement(TAG) as ColorPicker;
    picker.setAttribute("labels", JSON.stringify(labels));
    for (const [k, v] of Object.entries(attrs)) picker.setAttribute(k, v === true ? "" : v);
    Object.assign(picker, props);
    const valuechange = vi.fn();
    picker.addEventListener("valuechange", (e) => valuechange((e as CustomEvent).detail.value));
    host.appendChild(picker);
    const root = picker.querySelector(".color-picker") as HTMLElement;
    return { picker, root, valuechange };
}

const palette = () => screen.getByRole("radiogroup", { name: "Colours" });
const recentGroup = () => screen.getByRole("radiogroup", { name: "Recent colours" });
const field = (group: string, name: string) =>
    within(screen.getByRole("group", { name: group })).getByLabelText(name) as HTMLInputElement;
const type = (input: HTMLInputElement, text: string) => {
    input.value = text;
    fireEvent.input(input);
    fireEvent.keyDown(input, { key: "Enter" });
};

describe("<lily-color-picker>", () => {
    test("is one named group of four areas: recent, palette with Transparent, and entry fields, split by two separators", () => {
        const { root } = setup();
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Text colour");
        expect(recentGroup()).toBeTruthy();
        expect(palette()).toBeTruthy();
        expect(screen.getByRole("button", { name: "Transparent" })).toBeTruthy();
        expect(screen.getByRole("group", { name: "Custom colour" })).toBeTruthy();
        expect(root.querySelectorAll(":scope > hr.color-picker-separator")).toHaveLength(2);
    });

    test("the palette is 8 rows of 10 native radios, each painted by its custom property", () => {
        const { root } = setup();
        const rows = root.querySelectorAll(".color-picker-palette-row");
        expect(rows).toHaveLength(8);
        for (const row of rows) expect(row.querySelectorAll("input[type=radio]")).toHaveLength(10);
        const first = within(palette()).getAllByRole("radio")[0] as HTMLInputElement;
        expect(first.dataset.color).toBe("#000000");
        expect(first.style.getPropertyValue("--color-picker-swatch")).toBe("#000000");
        expect(first.getAttribute("aria-label")).toBe("black");
    });

    test("a swatch is named by colorLabel when given, else its CSS name, else its hex", () => {
        setup({ palette: "#ff0000 #005eb8", columns: "2" });
        const [red, blue] = within(palette()).getAllByRole("radio");
        expect(red.getAttribute("aria-label")).toBe("red");
        expect(blue.getAttribute("aria-label")).toBe("#005eb8");
        document.body.innerHTML = "";
        setup({}, { palette: ["#ff0000"], colorLabel: (c: string) => `Colour ${c}` });
        expect(within(palette()).getByRole("radio").getAttribute("aria-label")).toBe(
            "Colour #ff0000",
        );
    });

    test("choosing a swatch sets the value, adds it to recent and fires valuechange once", () => {
        const { picker, root, valuechange } = setup();
        const recentchange = vi.fn();
        picker.addEventListener("recentchange", (e) =>
            recentchange((e as CustomEvent).detail.recent),
        );
        const swatch = within(palette()).getAllByRole("radio")[12] as HTMLInputElement;
        swatch.click();
        expect(valuechange).toHaveBeenCalledOnce();
        expect(valuechange).toHaveBeenCalledWith(swatch.value);
        expect(picker.value).toBe(swatch.value);
        expect(root.getAttribute("data-value")).toBe(swatch.value);
        const recent = within(recentGroup()).getAllByRole("radio") as HTMLInputElement[];
        expect(recent.map((r) => r.value)).toEqual([swatch.value]);
        expect(recent[0].checked).toBe(true);
        expect(recentchange).toHaveBeenCalledWith([swatch.value]);
    });

    test("recent keeps the newest first and at most max-recent, and keeps a chosen recent swatch focused", () => {
        const { picker } = setup({ "max-recent": "3" });
        const radios = within(palette()).getAllByRole("radio") as HTMLInputElement[];
        for (const i of [10, 11, 12, 13]) radios[i].click();
        radios[11].click();
        expect(picker.recent).toEqual([radios[11].value, radios[13].value, radios[12].value]);
        const second = within(recentGroup()).getAllByRole("radio")[1] as HTMLInputElement;
        second.focus();
        second.click();
        expect(document.activeElement).toBe(second);
        expect(picker.value).toBe(radios[13].value);
    });

    test("ArrowDown and ArrowUp move a whole row; Left and Right stay the browser's", () => {
        setup();
        const radios = within(palette()).getAllByRole("radio") as HTMLInputElement[];
        radios[3].focus();
        fireEvent.keyDown(radios[3], { key: "ArrowDown" });
        expect(document.activeElement).toBe(radios[13]);
        expect(radios[13].checked).toBe(true);
        fireEvent.keyDown(radios[13], { key: "ArrowUp" });
        expect(document.activeElement).toBe(radios[3]);
        // From the top row, ArrowUp goes nowhere.
        fireEvent.keyDown(radios[3], { key: "ArrowUp" });
        expect(document.activeElement).toBe(radios[3]);
    });

    test("Transparent chooses transparent and says so with aria-pressed", () => {
        const { root } = setup();
        const button = screen.getByRole("button", { name: "Transparent" });
        expect(button.getAttribute("aria-pressed")).toBe("false");
        button.click();
        expect(button.getAttribute("aria-pressed")).toBe("true");
        expect(root.getAttribute("data-value")).toBe("transparent");
        expect(button.querySelector("svg")!.getAttribute("aria-hidden")).toBe("true");
    });

    test("a hex value is entered on Enter; a wrong one is marked invalid and changes nothing", () => {
        const { valuechange } = setup();
        const hex = screen.getByLabelText("Hex") as HTMLInputElement;
        type(hex, "#zz");
        expect(hex.getAttribute("aria-invalid")).toBe("true");
        expect(screen.getByText("Not a colour")).toBeTruthy();
        expect(valuechange).not.toHaveBeenCalled();
        type(hex, "#005EB8");
        expect(valuechange).toHaveBeenCalledWith("#005eb8");
        expect(hex.getAttribute("aria-invalid")).toBeNull();
        expect(hex.value).toBe("#005eb8");
    });

    test("a CSS colour name is entered, offered from a datalist of all 148", () => {
        const { valuechange } = setup();
        const name = screen.getByLabelText("Colour name") as HTMLInputElement;
        const options = document.getElementById(name.getAttribute("list")!)!;
        expect(options.querySelectorAll("option")).toHaveLength(148);
        type(name, "Tomato");
        expect(valuechange).toHaveBeenCalledWith("#ff6347");
        expect((screen.getByLabelText("Hex") as HTMLInputElement).value).toBe("#ff6347");
    });

    test("the entry area has HSL, HSB, RGB and CMYK groups, each showing the current value", () => {
        setup({ value: "#ff0000" });
        expect(["Hue", "Saturation", "Lightness"].map((n) => field("HSL", n).value)).toEqual([
            "0",
            "100",
            "50",
        ]);
        expect(["Hue", "Saturation", "Brightness"].map((n) => field("HSB", n).value)).toEqual([
            "0",
            "100",
            "100",
        ]);
        expect(["Red", "Green", "Blue"].map((n) => field("RGB", n).value)).toEqual([
            "255",
            "0",
            "0",
        ]);
        expect(["Cyan", "Magenta", "Yellow", "Black"].map((n) => field("CMYK", n).value)).toEqual([
            "0",
            "100",
            "100",
            "0",
        ]);
    });

    test("each colour model's fields change the value", () => {
        const { valuechange } = setup({ value: "#ff0000" });
        const change = (input: HTMLInputElement, v: string) =>
            fireEvent.change(input, { target: { value: v } });
        change(field("HSL", "Hue"), "120");
        expect(valuechange).toHaveBeenLastCalledWith("#00ff00");
        change(field("HSB", "Brightness"), "50");
        expect(valuechange).toHaveBeenLastCalledWith("#008000");
        change(field("RGB", "Blue"), "255");
        expect(valuechange).toHaveBeenLastCalledWith("#0080ff");
        change(field("CMYK", "Black"), "100");
        expect(valuechange).toHaveBeenLastCalledWith("#000000");
    });

    test("with a name, a hidden input carries the value for the form", () => {
        const { root } = setup({ name: "colour", value: "#ff0000" });
        const hidden = root.querySelector("input[type=hidden]") as HTMLInputElement;
        expect(hidden.name).toBe("colour");
        expect(hidden.value).toBe("#ff0000");
    });

    test("the value property and attribute update every control", () => {
        const { picker } = setup();
        picker.value = "#00ff00";
        expect((screen.getByLabelText("Hex") as HTMLInputElement).value).toBe("#00ff00");
        picker.setAttribute("value", "#0000ff");
        expect((screen.getByLabelText("Colour name") as HTMLInputElement).value).toBe("blue");
    });

    test("disabled disables every control", () => {
        setup({ disabled: true });
        expect(
            (screen.getByRole("button", { name: "Transparent" }) as HTMLButtonElement).disabled,
        ).toBe(true);
        expect((screen.getByLabelText("Hex") as HTMLInputElement).disabled).toBe(true);
        expect((palette() as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("adds the consumer's class to the root", () => {
        const { root } = setup({ class: "mine" });
        expect(root.classList.contains("mine")).toBe(true);
    });

    test("a form reset restores the starting colour and fires valuechange", async () => {
        const form = document.createElement("form");
        document.body.appendChild(form);
        const { valuechange } = setup({ name: "colour", value: "#ff0000" }, {}, form);
        screen.getByRole("button", { name: "Transparent" }).click();
        expect(new FormData(form).get("colour")).toBe("transparent");
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(new FormData(form).get("colour")).toBe("#ff0000");
        expect(valuechange).toHaveBeenLastCalledWith("#ff0000");
    });
});
