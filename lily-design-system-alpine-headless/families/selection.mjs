// Family: selection. lilyListbox (listbox), lilySegmentGroup (segment-group),
// lilyCombobox (combobox), lilyCommand (command), and the five rating /
// status pickers, which are native radios and <select> bound with x-model.

const press = `const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};`;

// A native radio picker: a fieldset of label + radio pairs, two-way bound.
const radioPicker = (slug, values, name, keyboard, tag = "fieldset") => ({
  tag, keyboard,
  aria: 'fieldset with role="radiogroup" and aria-label; native radios share a name; x-model keeps the chosen value in data-value',
  markup: `<fieldset class="${slug}" role="radiogroup" aria-label="" x-data="{ value: '' }" :data-value="value">
${values.map((v) => `  <label class="${slug}-button"><input type="radio" name="${name}" value="${v}" aria-label="${v}" x-model="value"> ${v}</label>`).join("\n")}
</fieldset>`,
  sel: `fieldset.${slug}`,
  test: `
  const radios = () => [...document.querySelectorAll("input[type=radio]")];
  it("renders ${values.length} native radios that share one name", async () => {
    await mount("${slug}");
    expect(el().getAttribute("role")).toBe("radiogroup");
    expect(radios()).toHaveLength(${values.length});
    expect(new Set(radios().map((r) => r.name))).toEqual(new Set(["${name}"]));
    expect(radios().every((r) => !r.checked)).toBe(true);
  });
  it("choosing a radio unchecks the others and updates data-value", async () => {
    await mount("${slug}");
    radios()[2].click(); await tick();
    expect(radios().map((r) => r.checked)).toEqual(radios().map((_, i) => i === 2));
    expect(el().getAttribute("data-value")).toBe("${values[2]}");
    radios()[0].click(); await tick();
    expect(el().getAttribute("data-value")).toBe("${values[0]}");
  });
  it("a disabled fieldset disables every radio", async () => {
    await mount("${slug}");
    el().disabled = true;
    expect(radios().every((r) => r.matches(":disabled"))).toBe(true);
  });`,
});

const selectPicker = (slug, values) => ({
  tag: "select", keyboard: "native select: arrows choose, Enter/Space opens, Escape closes",
  aria: "native select named by aria-label; x-model keeps the chosen value in data-value",
  markup: `<select class="${slug}" aria-label="" x-data="{ value: '${values[0]}' }" x-model="value" :data-value="value">
${values.map((v) => `  <option value="${v}"><!-- Consumer provides label --></option>`).join("\n")}
</select>`,
  sel: `select.${slug}`,
  test: `
  it("offers ${values.length} options, the first selected", async () => {
    await mount("${slug}");
    expect([...el().options].map((o) => o.value)).toEqual(${JSON.stringify(values)});
    expect(el().value).toBe("${values[0]}");
    expect(el().getAttribute("data-value")).toBe("${values[0]}");
  });
  it("choosing an option updates data-value", async () => {
    await mount("${slug}");
    el().value = "${values[2]}";
    el().dispatchEvent(new Event("change", { bubbles: true })); await tick();
    expect(el().getAttribute("data-value")).toBe("${values[2]}");
  });`,
});

const options = (slug, n, attrs) =>
  Array.from({ length: n }, (_, i) => `    <div class="${slug}-option" x-bind="${attrs}('${slug}-option-${i + 1}')"><!-- Consumer provides option --></div>`).join("\n");

export default {
  listbox: {
    tag: "div", keyboard: "ArrowDown/ArrowUp move focus (wrapping), Home/End jump, Enter or Space selects",
    aria: 'role="listbox" with aria-label; options are role="option" with aria-selected and roving tabindex',
    markup: `<div class="listbox" aria-label="" x-data="lilyListbox(false)" x-bind="listbox">
${Array.from({ length: 3 }, (_, i) => `  <div class="listbox-option" x-bind="option('${["one", "two", "three"][i]}')"><!-- Consumer provides option --></div>`).join("\n")}
</div>`,
    sel: "div.listbox",
    extra: `const opts = () => [...document.querySelectorAll(".listbox-option")];\n${press}`,
    test: `
  it('is role="listbox" with role="option" children and one tab stop', async () => {
    await mount("listbox");
    expect(el().getAttribute("role")).toBe("listbox");
    expect(opts().map((o) => o.getAttribute("role"))).toEqual(["option", "option", "option"]);
    expect(opts().map((o) => o.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
    expect(opts().map((o) => o.getAttribute("aria-selected"))).toEqual(["false", "false", "false"]);
  });
  it("arrows wrap and Home/End jump", async () => {
    await mount("listbox");
    opts()[0].focus();
    await press(opts()[0], "ArrowUp");
    expect(document.activeElement).toBe(opts()[2]);
    await press(opts()[2], "ArrowDown");
    expect(document.activeElement).toBe(opts()[0]);
    await press(opts()[0], "End");
    expect(document.activeElement).toBe(opts()[2]);
    await press(opts()[2], "Home");
    expect(document.activeElement).toBe(opts()[0]);
  });
  it("clicking or pressing Enter selects one option at a time", async () => {
    await mount("listbox");
    opts()[1].click(); await tick();
    expect(opts().map((o) => o.getAttribute("aria-selected"))).toEqual(["false", "true", "false"]);
    await press(opts()[2], "Enter");
    expect(opts().map((o) => o.getAttribute("aria-selected"))).toEqual(["false", "false", "true"]);
    expect(opts().map((o) => o.getAttribute("tabindex"))).toEqual(["-1", "-1", "0"]);
  });
  it("announces the selection with lily:select", async () => {
    await mount("listbox");
    const seen = vi.fn();
    el().addEventListener("lily:select", (e) => seen(e.detail));
    opts()[0].click(); await tick();
    expect(seen).toHaveBeenCalledWith({ selected: ["one"] });
  });`,
  },

  "segment-group": {
    tag: "div", keyboard: "ArrowLeft/ArrowRight (and Up/Down) move focus and select, wrapping; Home/End jump; Tab leaves the group",
    aria: 'role="radiogroup" with aria-label; segments are role="radio" buttons with aria-checked and roving tabindex',
    markup: `<div class="segment-group" role="radiogroup" aria-label="" x-data="lilySegmentGroup('one')" x-bind="group">
  <button class="segment-group-item" x-bind="segment('one')"><!-- Consumer provides label --></button>
  <button class="segment-group-item" x-bind="segment('two')"><!-- Consumer provides label --></button>
  <button class="segment-group-item" x-bind="segment('three')"><!-- Consumer provides label --></button>
</div>`,
    sel: "div.segment-group",
    extra: `const segs = () => [...document.querySelectorAll(".segment-group-item")];\n${press}`,
    test: `
  it("starts with the initial segment checked and tabbable", async () => {
    await mount("segment-group");
    expect(el().getAttribute("role")).toBe("radiogroup");
    expect(segs().map((s) => s.getAttribute("role"))).toEqual(["radio", "radio", "radio"]);
    expect(segs().map((s) => s.getAttribute("aria-checked"))).toEqual(["true", "false", "false"]);
    expect(segs().map((s) => s.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
  });
  it("arrows move focus and select, wrapping", async () => {
    await mount("segment-group");
    segs()[0].focus();
    await press(segs()[0], "ArrowRight");
    expect(document.activeElement).toBe(segs()[1]);
    expect(segs().map((s) => s.getAttribute("aria-checked"))).toEqual(["false", "true", "false"]);
    await press(segs()[1], "ArrowLeft");
    await press(segs()[0], "ArrowLeft");
    expect(document.activeElement).toBe(segs()[2]);
    expect(segs()[2].getAttribute("aria-checked")).toBe("true");
    expect(segs().map((s) => s.getAttribute("tabindex"))).toEqual(["-1", "-1", "0"]);
  });
  it("clicking selects and Home/End jump", async () => {
    await mount("segment-group");
    segs()[2].click(); await tick();
    expect(segs()[2].getAttribute("aria-checked")).toBe("true");
    segs()[2].focus();
    await press(segs()[2], "Home");
    expect(segs()[0].getAttribute("aria-checked")).toBe("true");
  });`,
  },

  combobox: {
    tag: "div", keyboard: "type to filter; ArrowDown/ArrowUp open and move (wrapping); Enter chooses; Escape closes",
    aria: 'role="combobox" on the input with aria-expanded, aria-controls, aria-autocomplete="list" and aria-activedescendant; the popup is role="listbox"',
    markup: `<div class="combobox" x-data="lilyCombobox()" x-bind="root">
  <input class="combobox-input" type="text" aria-label="" aria-controls="combobox-listbox-1" x-bind="input">
  <div class="combobox-listbox" id="combobox-listbox-1" aria-label="" x-bind="listbox">
${options("combobox", 3, "option")}
  </div>
</div>`,
    sel: "div.combobox",
    extra: `const input = () => document.querySelector(".combobox-input");
const listbox = () => document.querySelector(".combobox-listbox");
const opts = () => [...document.querySelectorAll(".combobox-option")];
const label = async () => { ["Apple", "Banana", "Cherry"].forEach((t, i) => (opts()[i].textContent = t)); await tick(); };
const type = async (text) => { input().value = text; input().dispatchEvent(new Event("input", { bubbles: true })); await tick(); };
${press}`,
    test: `
  it("starts closed with the combobox contract on the input", async () => {
    await mount("combobox");
    expect(input().getAttribute("role")).toBe("combobox");
    expect(input().getAttribute("aria-expanded")).toBe("false");
    expect(input().getAttribute("aria-autocomplete")).toBe("list");
    expect(input().getAttribute("aria-controls")).toBe(listbox().id);
    expect(listbox().getAttribute("role")).toBe("listbox");
    expect(listbox().hidden).toBe(true);
  });
  it("typing opens the list and filters the options", async () => {
    await mount("combobox"); await label();
    await type("an");
    expect(listbox().hidden).toBe(false);
    expect(input().getAttribute("aria-expanded")).toBe("true");
    expect(opts().map((o) => o.hidden)).toEqual([true, false, true]);
  });
  it("arrows move the active descendant and Enter chooses it", async () => {
    await mount("combobox"); await label();
    await press(input(), "ArrowDown");
    expect(listbox().hidden).toBe(false);
    expect(input().getAttribute("aria-activedescendant")).toBe(opts()[0].id);
    await press(input(), "ArrowUp");
    expect(input().getAttribute("aria-activedescendant")).toBe(opts()[2].id);
    await press(input(), "Enter");
    expect(input().value).toBe("Cherry");
    expect(listbox().hidden).toBe(true);
    expect(input().hasAttribute("aria-activedescendant")).toBe(false);
  });
  it("clicking an option chooses it", async () => {
    await mount("combobox"); await label();
    await press(input(), "ArrowDown");
    opts()[1].click(); await tick();
    expect(input().value).toBe("Banana");
    expect(listbox().hidden).toBe(true);
  });
  it("Escape and an outside click close it", async () => {
    await mount("combobox");
    await press(input(), "ArrowDown");
    await press(input(), "Escape");
    expect(listbox().hidden).toBe(true);
    await press(input(), "ArrowDown");
    document.body.click(); await tick();
    expect(listbox().hidden).toBe(true);
  });`,
  },

  command: {
    tag: "div", keyboard: "type to filter; ArrowDown/ArrowUp move the active result (wrapping); Enter activates it",
    aria: 'role="search" with aria-label; a type="search" input with aria-activedescendant; results are a role="listbox" of role="option"',
    markup: `<div class="command" role="search" aria-label="" x-data="lilyCommand()">
  <input class="command-input" type="search" autocomplete="off" aria-label="" aria-controls="command-listbox-1" x-bind="input">
  <div class="command-listbox" id="command-listbox-1" role="listbox" aria-label="">
${options("command", 3, "option")}
  </div>
</div>`,
    sel: "div.command",
    extra: `const input = () => document.querySelector(".command-input");
const opts = () => [...document.querySelectorAll(".command-option")];
const label = async () => { ["Open file", "Open folder", "Save all"].forEach((t, i) => (opts()[i].textContent = t)); await tick(); };
const type = async (text) => { input().value = text; input().dispatchEvent(new Event("input", { bubbles: true })); await tick(); };
${press}`,
    test: `
  it("is a search landmark holding a search input and a listbox", async () => {
    await mount("command");
    expect(el().getAttribute("role")).toBe("search");
    expect(input().type).toBe("search");
    expect(input().getAttribute("autocomplete")).toBe("off");
    expect(document.querySelector(".command-listbox").getAttribute("role")).toBe("listbox");
    expect(opts().map((o) => o.getAttribute("role"))).toEqual(["option", "option", "option"]);
  });
  it("typing filters the results", async () => {
    await mount("command"); await label();
    await type("open");
    expect(opts().map((o) => o.hidden)).toEqual([false, false, true]);
    await type("save");
    expect(opts().map((o) => o.hidden)).toEqual([true, true, false]);
  });
  it("arrows move the active result among the visible ones, wrapping", async () => {
    await mount("command"); await label();
    await type("open");
    await press(input(), "ArrowDown");
    expect(input().getAttribute("aria-activedescendant")).toBe(opts()[0].id);
    await press(input(), "ArrowDown");
    expect(input().getAttribute("aria-activedescendant")).toBe(opts()[1].id);
    await press(input(), "ArrowDown");
    expect(input().getAttribute("aria-activedescendant")).toBe(opts()[0].id);
    expect(opts()[0].getAttribute("aria-selected")).toBe("true");
  });
  it("Enter activates the active result with a click", async () => {
    await mount("command"); await label();
    const clicked = vi.fn();
    opts()[1].addEventListener("click", clicked);
    await press(input(), "ArrowDown");
    await press(input(), "ArrowDown");
    await press(input(), "Enter");
    expect(clicked).toHaveBeenCalledTimes(1);
  });`,
  },

  "five-star-rating-picker": radioPicker("five-star-rating-picker", [1, 2, 3, 4, 5], "rating",
    "Tab focuses the selected radio; arrows move between radios; Space selects"),
  "five-face-rating-picker": radioPicker("five-face-rating-picker", [1, 2, 3, 4, 5], "satisfaction",
    "Tab focuses the selected radio; arrows move between radios; Space selects"),
  "net-promoter-score-picker": radioPicker("net-promoter-score-picker", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "nps",
    "arrows move between radios (native radio group); Space selects; Tab leaves the group"),
  "red-amber-green-picker": selectPicker("red-amber-green-picker", ["red", "amber", "green"]),
  "red-orange-yellow-green-blue-picker": selectPicker("red-orange-yellow-green-blue-picker", ["red", "orange", "yellow", "green", "blue"]),
};
