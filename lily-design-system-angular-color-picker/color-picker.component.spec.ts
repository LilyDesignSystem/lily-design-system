import { TestBed } from "@angular/core/testing";
import { fireEvent, screen, within } from "@testing-library/dom";
import { afterEach, describe, expect, test, vi } from "vitest";

import { ColorPicker, type Labels } from "./color-picker.component";

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

function setup(inputs: Record<string, unknown> = {}, host: HTMLElement = document.body) {
    const fixture = TestBed.createComponent(ColorPicker);
    for (const [k, v] of Object.entries({ labels, ...inputs })) fixture.componentRef.setInput(k, v);
    host.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    const changed = vi.fn();
    fixture.componentInstance.changed.subscribe(changed);
    const root = fixture.nativeElement.querySelector(".color-picker") as HTMLElement;
    const render = () => fixture.detectChanges();
    const act = (fn: () => void) => {
        fn();
        render();
    };
    return { fixture, root, changed, act };
}

const palette = () => screen.getByRole("radiogroup", { name: "Colours" });
const recentGroup = () => screen.getByRole("radiogroup", { name: "Recent colours" });
const field = (group: string, name: string) =>
    within(screen.getByRole("group", { name: group })).getByLabelText(name) as HTMLInputElement;
const type = (el: HTMLInputElement, text: string) => {
    el.value = text;
    fireEvent.input(el);
    fireEvent.keyDown(el, { key: "Enter" });
};

describe("ColorPicker", () => {
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
        expect(first.dataset["color"]).toBe("#000000");
        expect(first.style.getPropertyValue("--color-picker-swatch")).toBe("#000000");
        expect(first.getAttribute("aria-label")).toBe("black");
    });

    test("a swatch is named by colorLabel when given, else its CSS name, else its hex", () => {
        setup({ palette: ["#ff0000", "#005eb8"], columns: 2 });
        const [red, blue] = within(palette()).getAllByRole("radio");
        expect(red!.getAttribute("aria-label")).toBe("red");
        expect(blue!.getAttribute("aria-label")).toBe("#005eb8");
        document.body.innerHTML = "";
        setup({ palette: ["#ff0000"], columns: 1, colorLabel: (c: string) => `Colour ${c}` });
        expect(within(palette()).getByRole("radio").getAttribute("aria-label")).toBe(
            "Colour #ff0000",
        );
    });

    test("choosing a swatch sets the value, adds it to recent and emits changed once", () => {
        const { root, changed, act } = setup();
        const swatch = within(palette()).getAllByRole("radio")[12] as HTMLInputElement;
        act(() => swatch.click());
        expect(changed).toHaveBeenCalledOnce();
        expect(changed).toHaveBeenCalledWith(swatch.value);
        expect(root.getAttribute("data-value")).toBe(swatch.value);
        const recent = within(recentGroup()).getAllByRole("radio") as HTMLInputElement[];
        expect(recent.map((r) => r.value)).toEqual([swatch.value]);
        expect(recent[0]!.checked).toBe(true);
    });

    test("recent keeps the newest first and at most maxRecent", () => {
        const { fixture, act } = setup({ maxRecent: 3 });
        const radios = within(palette()).getAllByRole("radio") as HTMLInputElement[];
        for (const i of [10, 11, 12, 13]) act(() => radios[i]!.click());
        act(() => radios[11]!.click());
        expect(fixture.componentInstance.recent()).toEqual([
            radios[11]!.value,
            radios[13]!.value,
            radios[12]!.value,
        ]);
    });

    test("ArrowDown and ArrowUp move a whole row; Left and Right stay the browser's", () => {
        const { act } = setup();
        const radios = within(palette()).getAllByRole("radio") as HTMLInputElement[];
        radios[3]!.focus();
        act(() => fireEvent.keyDown(radios[3]!, { key: "ArrowDown" }));
        expect(document.activeElement).toBe(radios[13]);
        expect(radios[13]!.checked).toBe(true);
        act(() => fireEvent.keyDown(radios[13]!, { key: "ArrowUp" }));
        expect(document.activeElement).toBe(radios[3]);
        // From the top row, ArrowUp goes nowhere.
        act(() => fireEvent.keyDown(radios[3]!, { key: "ArrowUp" }));
        expect(document.activeElement).toBe(radios[3]);
    });

    test("Transparent chooses transparent and says so with aria-pressed", () => {
        const { root, act } = setup();
        const button = screen.getByRole("button", { name: "Transparent" });
        expect(button.getAttribute("aria-pressed")).toBe("false");
        act(() => button.click());
        expect(button.getAttribute("aria-pressed")).toBe("true");
        expect(root.getAttribute("data-value")).toBe("transparent");
        expect(button.querySelector("svg")!.getAttribute("aria-hidden")).toBe("true");
    });

    test("a hex value is entered on Enter; a wrong one is marked invalid and changes nothing", () => {
        const { changed, act } = setup();
        const hex = screen.getByLabelText("Hex") as HTMLInputElement;
        act(() => type(hex, "#zz"));
        expect(hex.getAttribute("aria-invalid")).toBe("true");
        expect(screen.getByText("Not a colour")).toBeTruthy();
        expect(changed).not.toHaveBeenCalled();
        act(() => type(hex, "#005EB8"));
        expect(changed).toHaveBeenCalledWith("#005eb8");
        expect(hex.getAttribute("aria-invalid")).toBeNull();
        expect(hex.value).toBe("#005eb8");
    });

    test("a CSS colour name is entered, offered from a datalist of all 148", () => {
        const { changed, act } = setup();
        const name = screen.getByLabelText("Colour name") as HTMLInputElement;
        const list = document.getElementById(name.getAttribute("list")!)!;
        expect(list.querySelectorAll("option")).toHaveLength(148);
        act(() => type(name, "Tomato"));
        expect(changed).toHaveBeenCalledWith("#ff6347");
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
        const { changed, act } = setup({ value: "#ff0000" });
        const change = (el: HTMLInputElement, v: string) =>
            act(() => fireEvent.change(el, { target: { value: v } }));
        change(field("HSL", "Hue"), "120");
        expect(changed).toHaveBeenLastCalledWith("#00ff00");
        change(field("HSB", "Brightness"), "50");
        expect(changed).toHaveBeenLastCalledWith("#008000");
        change(field("RGB", "Blue"), "255");
        expect(changed).toHaveBeenLastCalledWith("#0080ff");
        change(field("CMYK", "Black"), "100");
        expect(changed).toHaveBeenLastCalledWith("#000000");
    });

    test("with a name, a hidden input carries the value for the form", () => {
        const { root } = setup({ name: "colour", value: "#ff0000" });
        const hidden = root.querySelector("input[type=hidden]") as HTMLInputElement;
        expect(hidden.name).toBe("colour");
        expect(hidden.value).toBe("#ff0000");
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
        const { root } = setup({ className: "mine" });
        expect(root.classList.contains("mine")).toBe(true);
    });

    test("a form reset restores the starting colour and emits it", async () => {
        const form = document.createElement("form");
        document.body.appendChild(form);
        const { fixture, changed, act } = setup({ name: "colour", value: "#ff0000" }, form);
        await fixture.whenStable();
        act(() => screen.getByRole("button", { name: "Transparent" }).click());
        expect(new FormData(form).get("colour")).toBe("transparent");
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 10));
        fixture.detectChanges();
        expect(new FormData(form).get("colour")).toBe("#ff0000");
        expect(changed).toHaveBeenLastCalledWith("#ff0000");
    });
});
