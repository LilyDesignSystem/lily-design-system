// Family: value controls. slider (native range + x-model), dial and
// color-picker (role="slider" divs), splitter (role="separator" with keys and
// drag), scroll-bar (role="scrollbar" with keys), slider-button (slide to confirm), tool-bar (an APG toolbar), tile-map (focusable tiles), resizable and scroll-area
// (named regions the consumer's CSS sizes).

const press = `const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};`;

// The same value-movement tests for any role="slider" div.
const sliderKeys = (slug, readout) => `
  it("Right/Up raise and Left/Down lower by one step", async () => {
    await mount("${slug}");
    el().focus();
    await press(el(), "ArrowRight");
    expect(${readout}).toBe("51");
    await press(el(), "ArrowUp");
    expect(${readout}).toBe("52");
    await press(el(), "ArrowLeft");
    await press(el(), "ArrowDown");
    expect(${readout}).toBe("50");
  });
  it("Shift moves ten steps and the value stays inside the bounds", async () => {
    await mount("${slug}");
    await press(el(), "ArrowRight", { shiftKey: true });
    expect(${readout}).toBe("60");
    await press(el(), "ArrowRight", { shiftKey: true }); await press(el(), "ArrowRight", { shiftKey: true });
    await press(el(), "ArrowRight", { shiftKey: true }); await press(el(), "ArrowRight", { shiftKey: true });
    expect(${readout}).toBe("100");
    await press(el(), "ArrowRight");
    expect(${readout}).toBe("100");
  });
  it("Home and End jump to the bounds", async () => {
    await mount("${slug}");
    await press(el(), "Home");
    expect(${readout}).toBe("0");
    await press(el(), "End");
    expect(${readout}).toBe("100");
  });`;

const splitterTests = `
  const parent = () => el().parentElement;
  const rect = (width, height) => { parent().getBoundingClientRect = () => ({ left: 0, top: 0, width, height }); };
  const fire = (type, init) => document.dispatchEvent(new MouseEvent(type, { bubbles: true, ...init }));
  it("is a focusable separator reporting its position and orientation", async () => {
    await mount("splitter");
    expect(el().getAttribute("role")).toBe("separator");
    expect(el().getAttribute("tabindex")).toBe("0");
    expect(el().getAttribute("aria-orientation")).toBe("vertical");
    expect(["aria-valuenow", "aria-valuemin", "aria-valuemax"].map((a) => el().getAttribute(a))).toEqual(["50", "0", "100"]);
    expect(el().style.getPropertyValue("--splitter-position")).toBe("50%");
  });
  it("Left/Right move a side-by-side splitter; Up/Down do nothing", async () => {
    await mount("splitter");
    await press(el(), "ArrowRight");
    expect(el().getAttribute("aria-valuenow")).toBe("51");
    await press(el(), "ArrowLeft", { shiftKey: true });
    expect(el().getAttribute("aria-valuenow")).toBe("41");
    await press(el(), "ArrowUp");
    expect(el().getAttribute("aria-valuenow")).toBe("41");
    expect(el().style.getPropertyValue("--splitter-position")).toBe("41%");
  });
  it("Up/Down move a stacked splitter; Home and End jump", async () => {
    await mount("splitter", snippet("splitter").replace("'vertical'", "'horizontal'"));
    expect(el().getAttribute("aria-orientation")).toBe("horizontal");
    await press(el(), "ArrowDown");
    expect(el().getAttribute("aria-valuenow")).toBe("51");
    await press(el(), "ArrowLeft");
    expect(el().getAttribute("aria-valuenow")).toBe("51");
    await press(el(), "End");
    expect(el().getAttribute("aria-valuenow")).toBe("100");
    await press(el(), "Home");
    expect(el().getAttribute("aria-valuenow")).toBe("0");
  });
  it("dragging maps the pointer onto the parent and stops on release", async () => {
    await mount("splitter");
    rect(200, 100);
    const seen = vi.fn();
    parent().addEventListener("lily:change", (e) => seen(e.detail));
    el().dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, cancelable: true }));
    fire("pointermove", { clientX: 50 }); await tick();
    expect(el().getAttribute("aria-valuenow")).toBe("25");
    fire("pointermove", { clientX: 400 }); await tick();
    expect(el().getAttribute("aria-valuenow")).toBe("100");
    fire("pointerup", {});
    fire("pointermove", { clientX: 20 }); await tick();
    expect(el().getAttribute("aria-valuenow")).toBe("100");
    expect(seen).toHaveBeenCalledWith({ value: 25 });
  });`;

export default {
    slider: {
        tag: "div",
        keyboard:
            "native range: arrows change by a step, Home/End jump, Page Up/Down change by more",
        aria: "native input type=range named by aria-label; x-model keeps the number in data-value",
        markup: `<input class="slider" type="range" min="0" max="100" aria-label="" x-data="{ value: 50 }" x-model.number="value" :data-value="value">`,
        sel: "input.slider",
        test: `
  it("is a native range input at its initial value", async () => {
    await mount("slider");
    expect(el().type).toBe("range");
    expect(el().value).toBe("50");
    expect(el().getAttribute("data-value")).toBe("50");
  });
  it("two-way binds its value into data-value", async () => {
    await mount("slider");
    el().value = "80";
    el().dispatchEvent(new Event("input", { bubbles: true })); await tick();
    expect(el().getAttribute("data-value")).toBe("80");
  });`,
    },

    dial: {
        tag: "div",
        keyboard:
            "Right/Up raise, Left/Down lower, Shift moves ten steps, Home and End jump to the bounds",
        aria: 'role="slider" with aria-label, aria-valuenow/min/max; tabindex 0 (or -1) and aria-disabled only when disabled',
        markup: `<div class="dial" aria-label="" x-data="lilyDial(50, 0, 100, 1)" x-bind="dial">
  <!-- Consumer provides the dial face -->
</div>`,
        sel: "div.dial",
        extra: `import { snippet } from "../test/mount.js";\n${press}`,
        test: `
  it('is role="slider" reporting value and bounds, focusable', async () => {
    await mount("dial");
    expect(el().getAttribute("role")).toBe("slider");
    expect(["aria-valuenow", "aria-valuemin", "aria-valuemax"].map((a) => el().getAttribute(a))).toEqual(["50", "0", "100"]);
    expect(el().getAttribute("tabindex")).toBe("0");
    expect(el().hasAttribute("aria-disabled")).toBe(false);
  });${sliderKeys("dial", 'el().getAttribute("aria-valuenow")')}
  it("announces each change with lily:change", async () => {
    await mount("dial");
    const seen = vi.fn();
    el().addEventListener("lily:change", (e) => seen(e.detail));
    await press(el(), "ArrowRight");
    expect(seen).toHaveBeenCalledWith({ value: 51 });
  });
  it("when disabled it is not tabbable, says so, and ignores keys", async () => {
    await mount("dial", snippet("dial").replace("lilyDial(50, 0, 100, 1)", "lilyDial(50, 0, 100, 1, true)"));
    expect(el().getAttribute("tabindex")).toBe("-1");
    expect(el().getAttribute("aria-disabled")).toBe("true");
    await press(el(), "ArrowRight");
    expect(el().getAttribute("aria-valuenow")).toBe("50");
  });`,
    },

    "color-picker": {
        tag: "div",
        keyboard:
            "Right/Left change x, Up/Down change y, Shift moves ten, Home/End set x to 0 / 100",
        aria: 'role="slider" with aria-label and aria-valuenow (x) between 0 and 100; data-x and data-y position the cursor',
        markup: `<div class="color-picker" aria-label="" x-data="lilyColorPicker(0, 0)" x-bind="area">
  <!-- Consumer provides the colour area and cursor -->
</div>`,
        sel: "div.color-picker",
        extra: `import { snippet } from "../test/mount.js";\n${press}`,
        test: `
  it('is role="slider" on a 0 to 100 range, focusable', async () => {
    await mount("color-picker");
    expect(el().getAttribute("role")).toBe("slider");
    expect(["aria-valuenow", "aria-valuemin", "aria-valuemax"].map((a) => el().getAttribute(a))).toEqual(["0", "0", "100"]);
    expect(el().getAttribute("tabindex")).toBe("0");
    expect([el().dataset.x, el().dataset.y]).toEqual(["0", "0"]);
  });
  it("Right/Left move x and Down/Up move y, Shift by ten", async () => {
    await mount("color-picker");
    await press(el(), "ArrowRight");
    await press(el(), "ArrowDown");
    await press(el(), "ArrowDown", { shiftKey: true });
    expect([el().dataset.x, el().dataset.y]).toEqual(["1", "11"]);
    expect(el().getAttribute("aria-valuenow")).toBe("1");
    await press(el(), "ArrowUp");
    await press(el(), "ArrowLeft", { shiftKey: true });
    expect([el().dataset.x, el().dataset.y]).toEqual(["0", "10"]);
  });
  it("stays inside 0 to 100; Home and End set x", async () => {
    await mount("color-picker");
    await press(el(), "ArrowUp");
    await press(el(), "ArrowLeft");
    expect([el().dataset.x, el().dataset.y]).toEqual(["0", "0"]);
    await press(el(), "End");
    expect(el().dataset.x).toBe("100");
    await press(el(), "ArrowRight");
    expect(el().dataset.x).toBe("100");
    await press(el(), "Home");
    expect(el().dataset.x).toBe("0");
  });
  it("when disabled it is not tabbable and ignores keys", async () => {
    await mount("color-picker", snippet("color-picker").replace("lilyColorPicker(0, 0)", "lilyColorPicker(0, 0, true)"));
    expect(el().getAttribute("tabindex")).toBe("-1");
    expect(el().getAttribute("aria-disabled")).toBe("true");
    await press(el(), "ArrowRight");
    expect(el().dataset.x).toBe("0");
  });`,
    },

    splitter: {
        tag: "div",
        keyboard:
            "Left/Right (side by side) or Up/Down (stacked) move it, Shift moves ten, Home/End jump; drag with a pointer",
        aria: 'role="separator" with aria-label, aria-orientation and aria-valuenow/min/max as a percentage; tabindex 0',
        markup: `<div x-data="lilySplitter(50, 'vertical')">
  <!-- Consumer provides the first pane -->
  <div class="splitter" aria-label="" x-bind="separator"></div>
  <!-- Consumer provides the second pane -->
</div>`,
        sel: "div.splitter",
        extra: `import { snippet } from "../test/mount.js";\n${press}`,
        test: splitterTests,
    },

    resizable: {
        tag: "div",
        keyboard: "None (passive element)",
        aria: 'role="region" with aria-label; tabindex 0; data-resize says which way the consumer\'s CSS lets it resize',
        markup: `<div class="resizable" role="region" tabindex="0" aria-label="" data-resize="both">
  <!-- Consumer provides content -->
</div>`,
        sel: "div.resizable",
        test: `
  it("is a focusable named region carrying its resize direction", async () => {
    await mount("resizable");
    expect(el().getAttribute("role")).toBe("region");
    expect(el().getAttribute("tabindex")).toBe("0");
    expect(el().hasAttribute("aria-label")).toBe(true);
    expect(el().getAttribute("data-resize")).toBe("both");
  });`,
    },

    "scroll-area": {
        tag: "div",
        keyboard: "Tab focuses it; arrows, Page Up/Down, Home/End scroll natively",
        aria: 'role="region" with aria-label; tabindex 0 so the keyboard can scroll it',
        markup: `<div class="scroll-area" role="region" tabindex="0" aria-label="">
  <!-- Consumer provides content; consumer CSS sets the overflow and size -->
</div>`,
        sel: "div.scroll-area",
        test: `
  it("is a focusable named region", async () => {
    await mount("scroll-area");
    expect(el().getAttribute("role")).toBe("region");
    expect(el().getAttribute("tabindex")).toBe("0");
    expect(el().hasAttribute("aria-label")).toBe(true);
  });`,
    },

    "slider-button": {
        tag: "button",
        keyboard:
            "ArrowRight/ArrowLeft move the slider by step (default 10), Home returns it to 0, End/Enter/Space complete it; reaching 100 dispatches lily:confirm",
        aria: 'role="slider" with aria-label, aria-valuenow (the position), aria-valuemin 0, aria-valuemax 100',
        markup: `<button class="slider-button" aria-label="" x-data="lilySliderButton(10)" x-bind="button">
  <!-- Consumer provides the track and thumb; it hears lily:confirm -->
</button>`,
        sel: "button.slider-button",
        extra: `${press}
const now = () => el().getAttribute("aria-valuenow");`,
        test: `
  it("is a button with role slider at 0 of 100", async () => {
    await mount("slider-button");
    expect(el().getAttribute("type")).toBe("button");
    expect(el().getAttribute("role")).toBe("slider");
    expect([now(), el().getAttribute("aria-valuemin"), el().getAttribute("aria-valuemax")]).toEqual(["0", "0", "100"]);
  });
  it("ArrowRight and ArrowLeft move by the step; Home returns to 0", async () => {
    await mount("slider-button");
    await press(el(), "ArrowRight");
    await press(el(), "ArrowRight");
    expect(now()).toBe("20");
    await press(el(), "ArrowLeft");
    expect(now()).toBe("10");
    await press(el(), "Home");
    expect(now()).toBe("0");
    await press(el(), "ArrowLeft");
    expect(now()).toBe("0");
  });
  it("reaching 100 dispatches lily:confirm once and resets", async () => {
    await mount("slider-button");
    const confirmed = vi.fn();
    el().addEventListener("lily:confirm", confirmed);
    for (let i = 0; i < 9; i++) await press(el(), "ArrowRight");
    expect(confirmed).not.toHaveBeenCalled();
    await press(el(), "ArrowRight");
    expect(confirmed).toHaveBeenCalledTimes(1);
    expect(now()).toBe("0");
  });
  it("End, Enter and Space confirm at once; a disabled button ignores the keys", async () => {
    await mount("slider-button");
    const confirmed = vi.fn();
    el().addEventListener("lily:confirm", confirmed);
    for (const key of ["End", "Enter", " "]) await press(el(), key);
    expect(confirmed).toHaveBeenCalledTimes(3);
    el().disabled = true;
    await press(el(), "End");
    await press(el(), "ArrowRight");
    expect(confirmed).toHaveBeenCalledTimes(3);
    expect(now()).toBe("0");
  });`,
    },

    "tool-bar": {
        tag: "div",
        keyboard:
            "ArrowRight/ArrowLeft move focus among the buttons and wrap, Home/End jump; Tab enters and leaves",
        aria: 'role="toolbar" with aria-label',
        markup: `<div class="tool-bar" aria-label="" x-data="lilyToolBar()" x-bind="bar">
  <!-- Consumer provides tool-bar-button buttons -->
</div>`,
        sel: "div.tool-bar",
        extra: `${press}
const fill = () => {
  el().innerHTML = '<button>Bold</button><button disabled>Italic</button><button>Link</button><span role="button" tabindex="0">More</span>';
};
const focused = () => document.activeElement.textContent;`,
        test: `
  it('is role="toolbar" with an accessible name', async () => {
    await mount("tool-bar");
    expect(el().getAttribute("role")).toBe("toolbar");
    expect(el().hasAttribute("aria-label")).toBe(true);
  });
  it("ArrowRight moves to the next item, skips disabled buttons and wraps", async () => {
    await mount("tool-bar");
    fill();
    el().querySelector("button").focus();
    await press(document.activeElement, "ArrowRight");
    expect(focused()).toBe("Link");
    await press(document.activeElement, "ArrowRight");
    expect(focused()).toBe("More");
    await press(document.activeElement, "ArrowRight");
    expect(focused()).toBe("Bold");
  });
  it("ArrowLeft moves to the previous item and wraps", async () => {
    await mount("tool-bar");
    fill();
    el().querySelector("button").focus();
    await press(document.activeElement, "ArrowLeft");
    expect(focused()).toBe("More");
    await press(document.activeElement, "ArrowLeft");
    expect(focused()).toBe("Link");
  });
  it("Home and End jump; the keys it handles are cancelled, others are not", async () => {
    await mount("tool-bar");
    fill();
    el().querySelector("button").focus();
    await press(document.activeElement, "End");
    expect(focused()).toBe("More");
    await press(document.activeElement, "Home");
    expect(focused()).toBe("Bold");
    const prevented = ["ArrowRight", "ArrowDown", "Tab"].map((key) => {
      const e = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
      document.activeElement.dispatchEvent(e);
      return e.defaultPrevented;
    });
    expect(prevented).toEqual([true, false, false]);
  });`,
    },

    "tile-map": {
        tag: "div",
        keyboard:
            "ArrowRight/ArrowLeft step through the tiles, ArrowDown/ArrowUp go to the nearest tile in the next or previous row, Enter/Space activate (tile-activate), Escape deselects",
        aria: 'role="img" with aria-label and aria-roledescription="tile map"',
        markup: `<div class="tile-map" role="img" aria-label="" aria-roledescription="tile map" x-data="lilyTileMap()" x-bind="map">
  <!-- Consumer provides focusable [data-tile] elements (tabindex="0") and positions them; it hears tile-activate -->
</div>`,
        sel: "div.tile-map",
        extra: `${press}
// A 3 x 2 grid: a b c / d e f. jsdom has no layout, so each tile reports its own box.
const fill = () => {
  el().innerHTML = ["a", "b", "c", "d", "e", "f"].map((t) => '<div data-tile tabindex="0">' + t + "</div>").join("");
  [...el().querySelectorAll("[data-tile]")].forEach((tile, i) => {
    const left = (i % 3) * 10, top = Math.floor(i / 3) * 10;
    tile.getBoundingClientRect = () => ({ left, top, width: 10, height: 10, right: left + 10, bottom: top + 10 });
  });
  el().querySelector("[data-tile]").focus();
};
const tile = (t) => [...el().querySelectorAll("[data-tile]")].find((e) => e.textContent === t);
const focused = () => document.activeElement.textContent;`,
        test: `
  it('is role="img" named as a tile map', async () => {
    await mount("tile-map");
    expect(el().getAttribute("role")).toBe("img");
    expect(el().getAttribute("aria-roledescription")).toBe("tile map");
  });
  it("ArrowRight and ArrowLeft step through the tiles and stop at the ends", async () => {
    await mount("tile-map");
    fill();
    await press(document.activeElement, "ArrowLeft");
    expect(focused()).toBe("a");
    await press(document.activeElement, "ArrowRight");
    await press(document.activeElement, "ArrowRight");
    expect(focused()).toBe("c");
    tile("f").focus();
    await press(document.activeElement, "ArrowRight");
    expect(focused()).toBe("f");
  });
  it("ArrowDown and ArrowUp go to the nearest tile in the next or previous row", async () => {
    await mount("tile-map");
    fill();
    tile("b").focus();
    await press(document.activeElement, "ArrowDown");
    expect(focused()).toBe("e");
    await press(document.activeElement, "ArrowDown");
    expect(focused()).toBe("e");
    tile("f").focus();
    await press(document.activeElement, "ArrowUp");
    expect(focused()).toBe("c");
  });
  it("a nearer row wins over a tile further down that is directly below", async () => {
    await mount("tile-map");
    fill();
    // "b" sits one row down, slightly to the right; "f" sits two rows down, directly below "a".
    const box = (left, top) => () => ({ left, top, width: 10, height: 10, right: left + 10, bottom: top + 10 });
    tile("a").getBoundingClientRect = box(0, 0);
    tile("b").getBoundingClientRect = box(5, 10);
    tile("f").getBoundingClientRect = box(0, 20);
    for (const t of ["c", "d", "e"]) tile(t).getBoundingClientRect = box(100, 0);
    tile("a").focus();
    await press(document.activeElement, "ArrowDown");
    expect(focused()).toBe("b");
  });
  it("Enter and Space dispatch tile-activate on the focused tile", async () => {
    await mount("tile-map");
    fill();
    const seen = [];
    el().addEventListener("tile-activate", (e) => seen.push(e.target.textContent));
    tile("d").focus();
    await press(document.activeElement, "Enter");
    await press(document.activeElement, " ");
    expect(seen).toEqual(["d", "d"]);
  });
  it("Escape deselects the focused tile", async () => {
    await mount("tile-map");
    fill();
    await press(document.activeElement, "Escape");
    expect(document.activeElement).toBe(document.body);
  });`,
    },

    "scroll-bar": {
        tag: "div",
        keyboard:
            "Up/Left lower and Down/Right raise by one step, Page Up/Down move ten steps, Home and End jump to the bounds",
        aria: 'role="scrollbar" with aria-label, aria-orientation, aria-controls (the scrolled element), aria-valuenow/min/max; tabindex 0',
        markup: `<div class="scroll-bar" aria-label="" aria-orientation="vertical" x-data="lilyScrollBar(50, 0, 100, 1, 10)" x-bind="bar">
  <!-- Consumer provides the thumb; it scrolls its content on lily:change -->
</div>`,
        sel: "div.scroll-bar",
        extra: `import { snippet } from "../test/mount.js";\n${press}`,
        test: `
  it('is a focusable role="scrollbar" reporting value and bounds', async () => {
    await mount("scroll-bar");
    expect(el().getAttribute("role")).toBe("scrollbar");
    expect(el().getAttribute("tabindex")).toBe("0");
    expect(el().getAttribute("aria-orientation")).toBe("vertical");
    expect(["aria-valuenow", "aria-valuemin", "aria-valuemax"].map((a) => el().getAttribute(a))).toEqual(["50", "0", "100"]);
  });
  it("Down/Right raise and Up/Left lower by one step", async () => {
    await mount("scroll-bar");
    await press(el(), "ArrowDown");
    expect(el().getAttribute("aria-valuenow")).toBe("51");
    await press(el(), "ArrowRight");
    expect(el().getAttribute("aria-valuenow")).toBe("52");
    await press(el(), "ArrowUp");
    await press(el(), "ArrowLeft");
    await press(el(), "ArrowLeft");
    expect(el().getAttribute("aria-valuenow")).toBe("49");
  });
  it("Page Down/Up move by the page step and stay inside the bounds", async () => {
    await mount("scroll-bar");
    await press(el(), "PageDown");
    expect(el().getAttribute("aria-valuenow")).toBe("60");
    for (let i = 0; i < 5; i++) await press(el(), "PageDown");
    expect(el().getAttribute("aria-valuenow")).toBe("100");
    await press(el(), "PageUp");
    expect(el().getAttribute("aria-valuenow")).toBe("90");
  });
  it("Home and End jump to the bounds", async () => {
    await mount("scroll-bar", snippet("scroll-bar").replace("lilyScrollBar(50, 0, 100, 1, 10)", "lilyScrollBar(50, -20, 150, 1, 10)"));
    await press(el(), "End");
    expect(el().getAttribute("aria-valuenow")).toBe("150");
    await press(el(), "Home");
    expect(el().getAttribute("aria-valuenow")).toBe("-20");
  });
  it("announces each change with lily:change", async () => {
    await mount("scroll-bar");
    const seen = vi.fn();
    el().addEventListener("lily:change", (e) => seen(e.detail));
    await press(el(), "PageUp");
    expect(seen).toHaveBeenCalledWith({ value: 40 });
  });`,
    },
};
