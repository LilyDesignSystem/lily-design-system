// @vitest-environment jsdom
// What the toolbar and radio-group contracts do not reach: the module's edges.
import { afterEach, expect, test, vi } from "vitest";

import { attachRadioGroup, attachToolbar } from "./widget-keys";

function mount(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}
const press = (el: Element, key: string, init: KeyboardEventInit = {}): KeyboardEvent => {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    el.dispatchEvent(event);
    return event;
};
const stops = (root: HTMLElement): (string | null)[] =>
    [...root.querySelectorAll<HTMLElement>("[tabindex='0']")].map((el) => el.textContent);

afterEach(() => {
    document.body.innerHTML = "";
});

const BAR = `<div role="toolbar"><button>One</button><button disabled>Off</button><button>Two</button></div>`;

test("a toolbar starts with one tab stop, on its first control", () => {
    const root = mount(BAR);
    const detach = attachToolbar(root);
    expect(stops(root)).toEqual(["One"]);
    detach();
});

test("the arrows skip a disabled control", () => {
    const root = mount(BAR);
    const detach = attachToolbar(root);
    const [one, , two] = root.querySelectorAll("button");
    one.focus();
    press(one, "ArrowRight");
    expect(document.activeElement).toBe(two);
    detach();
});

test("right-to-left swaps the arrows, and aria-orientation turns them", () => {
    const rtl = mount(`<div role="toolbar" style="direction: rtl"><button>A</button><button>B</button></div>`);
    const detachRtl = attachToolbar(rtl);
    const [a, b] = rtl.querySelectorAll("button");
    a.focus();
    press(a, "ArrowLeft");
    expect(document.activeElement).toBe(b);
    detachRtl();
    const tall = mount(`<div role="toolbar" aria-orientation="vertical"><button>A</button><button>B</button></div>`);
    const detachTall = attachToolbar(tall);
    const [c, d] = tall.querySelectorAll("button");
    c.focus();
    expect(press(c, "ArrowRight").defaultPrevented).toBe(false);
    press(c, "ArrowDown");
    expect(document.activeElement).toBe(d);
    detachTall();
});

test("an input keeps its own arrows", () => {
    const root = mount(`<div role="toolbar"><input /><button>A</button></div>`);
    const detach = attachToolbar(root);
    const input = root.querySelector("input")!;
    input.focus();
    expect(press(input, "ArrowRight").defaultPrevented).toBe(false);
    detach();
});

test("a popup is left alone, in both of its forms", () => {
    for (const panel of ['popover="auto"', 'role="menu"']) {
        const root = mount(`<div role="group"><button>A</button><div ${panel}><button>In</button></div></div>`);
        const detach = attachToolbar(root);
        const inner = root.querySelectorAll("button")[1];
        expect(press(inner, "ArrowRight").defaultPrevented).toBe(false);
        expect(stops(root)).toEqual(["A"]);
        detach();
    }
});

test("Escape presses the dismiss button, and is left alone without one", () => {
    const root = mount(`<div role="toolbar"><button>A</button><button class="clear">x</button></div>`);
    const detach = attachToolbar(root, { dismiss: ".clear" });
    const clicked = vi.fn();
    root.querySelector(".clear")!.addEventListener("click", clicked);
    expect(press(root.querySelector("button")!, "Escape").defaultPrevented).toBe(true);
    expect(clicked).toHaveBeenCalledTimes(1);
    detach();
    const bare = mount(`<div role="toolbar"><button>A</button></div>`);
    const detachBare = attachToolbar(bare);
    expect(press(bare.querySelector("button")!, "Escape").defaultPrevented).toBe(false);
    detachBare();
});

const RADIOS = (attrs: string[]) =>
    `<div role="radiogroup">${attrs.map((a, i) => `<button role="radio" ${a}>R${i}</button>`).join("")}</div>`;

test("with none checked, the first enabled radio is the tab stop", () => {
    const root = mount(RADIOS(["disabled", 'aria-checked="false"', 'aria-checked="false"']));
    const detach = attachRadioGroup(root);
    expect(stops(root)).toEqual(["R1"]);
    detach();
});

test("the tab stop starts on the checked radio", () => {
    const root = mount(RADIOS(['aria-checked="false"', 'aria-checked="true"']));
    const detach = attachRadioGroup(root);
    expect(stops(root)).toEqual(["R1"]);
    detach();
});

test("the arrows skip a disabled radio, click the next, and swap in right-to-left", () => {
    const root = mount(RADIOS(['aria-checked="true"', "disabled", 'aria-checked="false"']));
    root.style.direction = "rtl";
    const detach = attachRadioGroup(root);
    const radios = root.querySelectorAll<HTMLElement>("[role='radio']");
    const clicked = vi.fn();
    radios[2].addEventListener("click", clicked);
    radios[0].focus();
    press(radios[0], "ArrowLeft");
    expect(document.activeElement).toBe(radios[2]);
    expect(clicked).toHaveBeenCalledTimes(1);
    detach();
});

test("Space checks a radio that is not a button; a button does it natively", () => {
    const root = mount(`<div role="radiogroup"><div role="radio" tabindex="0" aria-checked="false">A</div></div>`);
    const detach = attachRadioGroup(root);
    const radio = root.querySelector<HTMLElement>("[role='radio']")!;
    radio.focus();
    expect(press(radio, " ").defaultPrevented).toBe(true);
    expect(radio.getAttribute("aria-checked")).toBe("true");
    detach();
    const native = mount(RADIOS(['aria-checked="false"']));
    const detachNative = attachRadioGroup(native);
    const button = native.querySelector("button")!;
    button.focus();
    expect(press(button, " ").defaultPrevented).toBe(false);
    detachNative();
});
