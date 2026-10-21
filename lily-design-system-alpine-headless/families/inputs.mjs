// Family: text and form inputs. character-counter, text-area-input-with-
// character-counter, password-input-or-text-input-div, pin-input-div,
// tag-input, currency-input, text-input-with-search, mentions-input,
// editable, editable-form, data-filter-form, newsletter-signup,
// date-time-now-input, time-picker-input.

const press = `const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const type = async (field, text) => {
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  await tick();
};`;

const withSnippet = (extra = "") => `import { snippet } from "../test/mount.js";\n${press}\n${extra}`;

export default {
  "character-counter": {
    tag: "span", keyboard: "None (passive element)",
    aria: 'role="status" with aria-live="polite"; aria-label names what is counted; data-count, data-max, data-remaining, data-over-limit',
    markup: `<input id="character-counter-field-1" type="text" aria-label="">
<span class="character-counter" aria-label="" x-data="lilyCharacterCounter(20, 'character-counter-field-1')" x-bind="counter"></span>`,
    sel: "span.character-counter",
    extra: `${withSnippet()}\nconst field = () => document.getElementById("character-counter-field-1");`,
    test: `
  it("is a polite status that starts at 0 / max", async () => {
    await mount("character-counter");
    expect(el().getAttribute("role")).toBe("status");
    expect(el().getAttribute("aria-live")).toBe("polite");
    expect(el().textContent).toBe("0 / 20");
    expect(el().getAttribute("data-remaining")).toBe("20");
    expect(el().hasAttribute("data-over-limit")).toBe(false);
  });
  it("follows the field it counts", async () => {
    await mount("character-counter");
    await type(field(), "hello");
    expect(el().textContent).toBe("5 / 20");
    expect(el().getAttribute("data-count")).toBe("5");
    expect(el().getAttribute("data-remaining")).toBe("15");
  });
  it("flags data-over-limit only past the maximum", async () => {
    await mount("character-counter");
    await type(field(), "x".repeat(20));
    expect(el().hasAttribute("data-over-limit")).toBe(false);
    await type(field(), "x".repeat(23));
    expect(el().hasAttribute("data-over-limit")).toBe(true);
    expect(el().getAttribute("data-remaining")).toBe("-3");
  });
  it("without a maximum it shows just the count", async () => {
    await mount("character-counter", snippet("character-counter").replace("lilyCharacterCounter(20,", "lilyCharacterCounter(null,"));
    await type(field(), "abc");
    expect(el().textContent).toBe("3");
    expect(el().hasAttribute("data-max")).toBe(false);
    expect(el().hasAttribute("data-over-limit")).toBe(false);
  });`,
  },

  "text-area-input-with-character-counter": {
    tag: "div", keyboard: "native textarea keys; the counter updates as you type",
    aria: "aria-label names the textarea; aria-describedby links it to the counter; the counter is a polite status",
    markup: `<div class="text-area-input-with-character-counter" x-data="lilyCountedTextarea(20)">
  <textarea class="text-area-input-with-character-counter-textarea" aria-label="" aria-describedby="text-area-input-with-character-counter-count-1" x-bind="textarea"></textarea>
  <span class="text-area-input-with-character-counter-count" id="text-area-input-with-character-counter-count-1" aria-label="" x-bind="counter"></span>
</div>`,
    sel: "div.text-area-input-with-character-counter",
    extra: withSnippet(`const area = () => el().querySelector("textarea");\nconst count = () => el().querySelector("span");`),
    test: `
  it("links the textarea to a polite counter", async () => {
    await mount("text-area-input-with-character-counter");
    expect(area().getAttribute("aria-describedby")).toBe(count().id);
    expect(count().getAttribute("aria-live")).toBe("polite");
    expect(count().textContent).toBe("0 / 20");
  });
  it("updates as the user types", async () => {
    await mount("text-area-input-with-character-counter");
    await type(area(), "hello world");
    expect(count().textContent).toBe("11 / 20");
    expect(area().hasAttribute("aria-invalid")).toBe(false);
  });
  it("flags the textarea invalid and the counter over limit past the maximum", async () => {
    await mount("text-area-input-with-character-counter");
    await type(area(), "x".repeat(21));
    expect(area().getAttribute("aria-invalid")).toBe("true");
    expect(count().hasAttribute("data-over-limit")).toBe(true);
    await type(area(), "x".repeat(5));
    expect(area().hasAttribute("aria-invalid")).toBe(false);
  });`,
  },

  "password-input-or-text-input-div": {
    tag: "div", keyboard: "Enter or Space on the toggle button shows or hides the password",
    aria: "the toggle is a button with aria-pressed; aria-label names the input and the button; autocomplete=current-password",
    markup: `<div class="password-input-or-text-input-div" x-data="lilyPasswordToggle()">
  <input class="password-input-or-text-input-div-input" type="password" aria-label="" x-bind="input">
  <button class="password-input-or-text-input-div-toggle" aria-label="" x-bind="toggle"><!-- Consumer provides toggle icon or text --></button>
</div>`,
    sel: "div.password-input-or-text-input-div",
    extra: `const input = () => el().querySelector("input");\nconst toggle = () => el().querySelector("button");`,
    test: `
  it("starts masked with the password-manager hint", async () => {
    await mount("password-input-or-text-input-div");
    expect(input().type).toBe("password");
    expect(input().getAttribute("autocomplete")).toBe("current-password");
    expect(toggle().getAttribute("aria-pressed")).toBe("false");
  });
  it("the toggle switches the input between password and text", async () => {
    await mount("password-input-or-text-input-div");
    input().value = "secret";
    toggle().click(); await tick();
    expect(input().type).toBe("text");
    expect(input().value).toBe("secret");
    expect(toggle().getAttribute("aria-pressed")).toBe("true");
    toggle().click(); await tick();
    expect(input().type).toBe("password");
  });`,
  },

  "pin-input-div": {
    tag: "div", keyboard: "a digit moves on; Backspace on an empty box moves back; ArrowLeft/ArrowRight move; paste fills the boxes",
    aria: 'role="group" with aria-label; one-digit inputs with inputmode="numeric" and maxlength="1"; data-value holds the combined value',
    markup: `<div class="pin-input-div" role="group" aria-label="" x-data="lilyPinInput()">
${[1, 2, 3, 4].map((n) => `  <input class="pin-input-div-digit" aria-label="" x-bind="digit(${n - 1})">`).join("\n")}
</div>`,
    sel: "div.pin-input-div",
    extra: `${press}\nconst boxes = () => [...el().querySelectorAll("input")];
const paste = (box, text) => {
  const event = new Event("paste", { bubbles: true, cancelable: true });
  event.clipboardData = { getData: () => text };
  box.dispatchEvent(event);
};`,
    test: `
  it("is a group of numeric single-character inputs", async () => {
    await mount("pin-input-div");
    expect(el().getAttribute("role")).toBe("group");
    expect(boxes()).toHaveLength(4);
    expect(boxes().every((b) => b.getAttribute("inputmode") === "numeric" && b.getAttribute("maxlength") === "1")).toBe(true);
  });
  it("a digit fills its box and moves focus on", async () => {
    await mount("pin-input-div");
    boxes()[0].focus();
    await type(boxes()[0], "7");
    expect(boxes()[0].value).toBe("7");
    expect(document.activeElement).toBe(boxes()[1]);
    expect(el().dataset.value).toBe("7");
  });
  it("drops anything that is not a digit", async () => {
    await mount("pin-input-div");
    boxes()[0].focus();
    await type(boxes()[0], "a");
    expect(boxes()[0].value).toBe("");
    expect(document.activeElement).toBe(boxes()[0]);
  });
  it("Backspace on an empty box clears and focuses the previous one; arrows move", async () => {
    await mount("pin-input-div");
    boxes()[0].value = "5";
    boxes()[1].focus();
    await press(boxes()[1], "Backspace");
    expect(boxes()[0].value).toBe("");
    expect(document.activeElement).toBe(boxes()[0]);
    await press(boxes()[0], "ArrowRight");
    expect(document.activeElement).toBe(boxes()[1]);
    await press(boxes()[1], "ArrowLeft");
    expect(document.activeElement).toBe(boxes()[0]);
  });
  it("a paste spreads digits across the boxes and announces completion", async () => {
    await mount("pin-input-div");
    const done = vi.fn();
    el().addEventListener("lily:complete", (e) => done(e.detail));
    paste(boxes()[0], "12-34"); await tick();
    expect(boxes().map((b) => b.value)).toEqual(["1", "2", "3", "4"]);
    expect(done).toHaveBeenCalledWith({ value: "1234" });
    expect(document.activeElement).toBe(boxes()[3]);
  });`,
  },

  "tag-input": {
    tag: "div", keyboard: "Enter adds the trimmed text as a tag; Backspace on an empty field removes the last tag",
    aria: 'role="group" with aria-label; the text field has its own aria-label; each remove button needs an aria-label',
    markup: `<div class="tag-input" role="group" aria-label="" x-data="lilyTagInput()">
  <ul class="tag-input-list">
    <template x-for="tag in tags" :key="tag">
      <li class="tag-input-tag">
        <span x-text="tag"></span>
        <button type="button" class="tag-input-remove" aria-label="" @click="remove(tag)"><!-- Consumer provides remove label --></button>
      </li>
    </template>
  </ul>
  <input class="tag-input-control" aria-label="" x-bind="input">
</div>`,
    sel: "div.tag-input",
    extra: `${press}\nconst field = () => el().querySelector("input");
const tags = () => [...el().querySelectorAll(".tag-input-tag span")].map((s) => s.textContent);
const add = async (text) => { field().value = text; await press(field(), "Enter"); };`,
    test: `
  it("starts with no tags", async () => {
    await mount("tag-input");
    expect(tags()).toEqual([]);
  });
  it("Enter adds the trimmed text, clears the field and announces it", async () => {
    await mount("tag-input");
    const seen = vi.fn();
    el().addEventListener("lily:add", (e) => seen(e.detail));
    await add("  red  ");
    expect(tags()).toEqual(["red"]);
    expect(field().value).toBe("");
    expect(seen).toHaveBeenCalledWith({ value: "red", tags: ["red"] });
  });
  it("ignores blank text and duplicates, and does not submit a form", async () => {
    await mount("tag-input");
    const added = vi.fn();
    el().addEventListener("lily:add", added);
    await add("   ");
    await add("red");
    await add("red");
    expect(tags()).toEqual(["red"]);
    expect(added).toHaveBeenCalledTimes(1);
    field().value = "blue";
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    field().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
  it("Backspace on an empty field removes the last tag; a remove button removes its own", async () => {
    await mount("tag-input");
    await add("red"); await add("green"); await add("blue");
    await press(field(), "Backspace");
    expect(tags()).toEqual(["red", "green"]);
    el().querySelectorAll(".tag-input-remove")[0].click(); await tick();
    expect(tags()).toEqual(["green"]);
  });`,
  },

  "currency-input": {
    tag: "input", keyboard: "None (passive element); native text entry",
    aria: 'aria-label names the input; inputmode="decimal"; aria-invalid outside min / max; data-currency-code carries the ISO 4217 code',
    markup: `<input class="currency-input" aria-label="" x-data="lilyCurrencyInput('GBP', 0, 100)" x-bind="input">`,
    sel: "input.currency-input",
    extra: press,
    test: `
  it("is a decimal text field carrying its currency code", async () => {
    await mount("currency-input");
    expect(el().type).toBe("text");
    expect(el().getAttribute("inputmode")).toBe("decimal");
    expect(el().getAttribute("data-currency-code")).toBe("GBP");
  });
  it("keeps only digits and a single decimal point", async () => {
    await mount("currency-input");
    await type(el(), "£1a2,3.4.5");
    expect(el().value).toBe("123.45");
  });
  it("flags aria-invalid outside min and max", async () => {
    await mount("currency-input");
    await type(el(), "150");
    expect(el().getAttribute("aria-invalid")).toBe("true");
    await type(el(), "50");
    expect(el().hasAttribute("aria-invalid")).toBe(false);
  });`,
  },

  "text-input-with-search": {
    tag: "div", keyboard: "Tab between the field and the button; Enter in the field, or Enter/Space on the button, searches",
    aria: 'role="search" with aria-label; the field and the button each have an aria-label',
    markup: `<div class="text-input-with-search" role="search" aria-label="" x-data="lilySearch()">
  <input class="text-input-with-search-input" aria-label="" x-bind="input">
  <button class="text-input-with-search-button" aria-label="" x-bind="button"><!-- Consumer provides icon or text --></button>
</div>`,
    sel: "div.text-input-with-search",
    extra: `${press}\nconst field = () => el().querySelector("input");\nconst button = () => el().querySelector("button");`,
    test: `
  it("is a search landmark with a text field and a button", async () => {
    await mount("text-input-with-search");
    expect(el().getAttribute("role")).toBe("search");
    expect(field().type).toBe("text");
    expect(button().type).toBe("button");
  });
  it("Enter in the field searches with the current value", async () => {
    await mount("text-input-with-search");
    const seen = vi.fn();
    el().addEventListener("lily:search", (e) => seen(e.detail));
    await type(field(), "lily");
    await press(field(), "Enter");
    expect(seen).toHaveBeenCalledWith({ value: "lily" });
  });
  it("the button searches too", async () => {
    await mount("text-input-with-search");
    const seen = vi.fn();
    el().addEventListener("lily:search", (e) => seen(e.detail));
    await type(field(), "design");
    button().click(); await tick();
    expect(seen).toHaveBeenCalledWith({ value: "design" });
  });`,
  },

  "mentions-input": {
    tag: "div", keyboard: "type the trigger character to open; ArrowDown/ArrowUp move; Enter inserts; Escape closes",
    aria: 'the input is role="combobox" with aria-haspopup="listbox", aria-expanded, aria-autocomplete="list", aria-activedescendant; suggestions are a role="listbox" of role="option"',
    markup: `<div class="mentions-input" data-trigger-char="@" x-data="lilyMentions('@')">
  <input class="mentions-input-control" type="text" aria-label="" aria-haspopup="listbox" aria-expanded="false" aria-autocomplete="list" aria-controls="mentions-input-suggestions-1" x-bind="input">
  <div class="mentions-input-suggestions" id="mentions-input-suggestions-1" role="listbox" aria-label="" hidden x-bind="panel">
${[1, 2, 3].map((n) => `    <div class="mentions-input-option" x-bind="option('mentions-input-option-${n}')"><!-- Consumer provides suggestion --></div>`).join("\n")}
  </div>
</div>`,
    sel: "div.mentions-input",
    extra: `${press}\nconst input = () => el().querySelector("input");
const panel = () => el().querySelector(".mentions-input-suggestions");
const opts = () => [...el().querySelectorAll(".mentions-input-option")];
const label = async () => { ["Alice", "Alan", "Bob"].forEach((t, i) => (opts()[i].textContent = t)); await tick(); };`,
    test: `
  it("starts closed with the combobox contract on the input", async () => {
    await mount("mentions-input");
    expect(input().getAttribute("role")).toBe("combobox");
    expect(input().getAttribute("aria-expanded")).toBe("false");
    expect(panel().hidden).toBe(true);
  });
  it("opens when the trigger character is typed and filters by what follows", async () => {
    await mount("mentions-input"); await label();
    await type(input(), "hi");
    expect(panel().hidden).toBe(true);
    await type(input(), "hi @al");
    expect(panel().hidden).toBe(false);
    expect(input().getAttribute("aria-expanded")).toBe("true");
    expect(opts().map((o) => o.hidden)).toEqual([false, false, true]);
  });
  it("closes once the mention is finished by a space", async () => {
    await mount("mentions-input"); await label();
    await type(input(), "hi @al");
    await type(input(), "hi @al ");
    expect(panel().hidden).toBe(true);
  });
  it("arrows move the active option and Enter inserts it in place of the query", async () => {
    await mount("mentions-input"); await label();
    await type(input(), "hi @al");
    await press(input(), "ArrowDown");
    await press(input(), "ArrowDown");
    expect(input().getAttribute("aria-activedescendant")).toBe(opts()[1].id);
    await press(input(), "Enter");
    expect(input().value).toBe("hi @Alan ");
    expect(panel().hidden).toBe(true);
  });
  it("Escape closes the suggestions", async () => {
    await mount("mentions-input"); await label();
    await type(input(), "@");
    await press(input(), "Escape");
    expect(panel().hidden).toBe(true);
    expect(input().getAttribute("aria-expanded")).toBe("false");
  });`,
  },

  editable: {
    tag: "div", keyboard: "Enter, Space or a click edits; Enter confirms; Escape cancels",
    aria: 'the display is role="button" named "value, label"; tabindex 0 (or -1 with aria-disabled when disabled); the field is named by the label',
    markup: `<div class="editable" x-data="lilyEditable('', false, '')">
  <span class="editable-display" x-bind="display"></span>
  <input class="editable-input" x-bind="input" hidden>
</div>`,
    sel: "div.editable",
    extra: withSnippet(`const display = () => el().querySelector(".editable-display");\nconst field = () => el().querySelector("input");
const named = (args) => snippet("editable").replace("lilyEditable('', false, '')", "lilyEditable(" + args + ")");`),
    test: `
  it("shows the display as a button and hides the field", async () => {
    await mount("editable", named("'Joel', false, 'Name'"));
    expect(display().getAttribute("role")).toBe("button");
    expect(display().getAttribute("tabindex")).toBe("0");
    expect(display().textContent).toBe("Joel");
    expect(display().getAttribute("aria-label")).toBe("Joel, Name");
    expect(field().hidden).toBe(true);
  });
  it("the name is the label alone while the value is empty", async () => {
    await mount("editable", named("'', false, 'Name'"));
    expect(display().getAttribute("aria-label")).toBe("Name");
  });
  it("a click or Enter or Space starts editing and focuses the field", async () => {
    for (const start of [() => display().click(), () => press(display(), "Enter"), () => press(display(), " ")]) {
      await mount("editable", named("'Joel', false, 'Name'"));
      await start(); await tick();
      expect(display().hidden).toBe(true);
      expect(field().hidden).toBe(false);
      expect(field().value).toBe("Joel");
      expect(field().getAttribute("aria-label")).toBe("Name");
      expect(document.activeElement).toBe(field());
    }
  });
  it("Enter confirms the draft, announces it and returns focus to the display", async () => {
    await mount("editable", named("'Joel', false, 'Name'"));
    const seen = vi.fn();
    el().addEventListener("lily:change", (e) => seen(e.detail));
    display().click(); await tick();
    await type(field(), "Ada");
    await press(field(), "Enter"); await tick();
    expect(display().textContent).toBe("Ada");
    expect(display().hidden).toBe(false);
    expect(seen).toHaveBeenCalledWith({ value: "Ada" });
    expect(document.activeElement).toBe(display());
  });
  it("Escape discards the draft", async () => {
    await mount("editable", named("'Joel', false, 'Name'"));
    display().click(); await tick();
    await type(field(), "Ada");
    await press(field(), "Escape"); await tick();
    expect(display().textContent).toBe("Joel");
    expect(field().hidden).toBe(true);
  });
  it("when disabled it is not tabbable and does not edit", async () => {
    await mount("editable", named("'Joel', false, 'Name', true"));
    expect(display().getAttribute("tabindex")).toBe("-1");
    expect(display().getAttribute("aria-disabled")).toBe("true");
    display().click(); await tick();
    expect(field().hidden).toBe(true);
  });`,
  },

  "editable-form": {
    tag: "form", keyboard: "Enter submits and leaves edit mode; Escape cancels and leaves edit mode",
    aria: "aria-label names the form; the form is tabindex -1 and takes focus when it opens",
    markup: `<div x-data="lilyEditableForm()">
  <button class="editable-form-edit" x-bind="editButton"><!-- Consumer provides edit label --></button>
  <form class="editable-form" aria-label="" hidden x-bind="form">
    <input name="title" aria-label="">
    <button type="submit"><!-- Consumer provides save label --></button>
  </form>
</div>`,
    sel: "form.editable-form",
    extra: `${press}\nconst edit = () => document.querySelector(".editable-form-edit");`,
    test: `
  it("starts as a hidden form with an edit button", async () => {
    await mount("editable-form");
    expect(el().hidden).toBe(true);
    expect(el().getAttribute("tabindex")).toBe("-1");
    expect(edit().hidden).toBe(false);
  });
  it("the edit button opens the form and moves focus to it", async () => {
    await mount("editable-form");
    edit().click(); await tick(); await tick();
    expect(el().hidden).toBe(false);
    expect(edit().hidden).toBe(true);
    expect(document.activeElement).toBe(el());
  });
  it("submit is prevented, announces the values and leaves edit mode", async () => {
    await mount("editable-form");
    const seen = vi.fn();
    document.body.addEventListener("lily:submit", (e) => seen(e.detail));
    edit().click(); await tick();
    el().querySelector("input").value = "Dr";
    const event = new Event("submit", { bubbles: true, cancelable: true });
    el().dispatchEvent(event); await tick();
    expect(event.defaultPrevented).toBe(true);
    expect(seen).toHaveBeenCalledWith({ values: { title: "Dr" } });
    expect(el().hidden).toBe(true);
  });
  it("Escape cancels and leaves edit mode", async () => {
    await mount("editable-form");
    const cancelled = vi.fn();
    document.body.addEventListener("lily:cancel", cancelled);
    edit().click(); await tick();
    await press(el().querySelector("input"), "Escape");
    expect(el().hidden).toBe(true);
    expect(cancelled).toHaveBeenCalled();
  });`,
  },

  "data-filter-form": {
    tag: "form", keyboard: "None (passive element); native form keys",
    aria: 'role="search" with aria-label',
    markup: `<form class="data-filter-form" role="search" aria-label="" x-data="lilyDataFilterForm()" x-bind="form">
  <!-- Consumer provides form fields -->
  <input name="q" aria-label="">
  <button type="submit"><!-- Consumer provides apply label --></button>
  <button type="reset"><!-- Consumer provides reset label --></button>
</form>`,
    sel: "form.data-filter-form",
    test: `
  it("is a search landmark form", async () => {
    await mount("data-filter-form");
    expect(el().getAttribute("role")).toBe("search");
  });
  it("submit never navigates; it announces the field values", async () => {
    await mount("data-filter-form");
    const seen = vi.fn();
    el().addEventListener("lily:filter", (e) => seen(e.detail));
    el().querySelector("input").value = "tea";
    const event = new Event("submit", { bubbles: true, cancelable: true });
    el().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(seen).toHaveBeenCalledWith({ values: { q: "tea" } });
  });
  it("reset announces lily:reset and clears the fields", async () => {
    await mount("data-filter-form");
    const seen = vi.fn();
    el().addEventListener("lily:reset", seen);
    el().querySelector("input").value = "tea";
    el().reset(); await tick();
    expect(seen).toHaveBeenCalled();
    expect(el().querySelector("input").value).toBe("");
  });`,
  },

  "newsletter-signup": {
    tag: "form", keyboard: "native form keys: Tab through the field and button, Enter submits",
    aria: 'aria-label names the form; data-state mirrors the state; success is role="status" aria-live="polite", error is role="alert"; each hidden outside its state',
    markup: `<form class="newsletter-signup" aria-label="" x-data="lilyNewsletterSignup()" x-bind="form">
  <header class="newsletter-signup-header">
    <h3 class="newsletter-signup-heading"><!-- Consumer provides heading text (optional) --></h3>
    <p class="newsletter-signup-description"><!-- Consumer provides description text (optional) --></p>
  </header>
  <label class="newsletter-signup-label">
    <!-- Consumer provides email label text -->
    <input type="email" class="newsletter-signup-email" placeholder="" x-bind="field">
  </label>
  <button type="submit" class="newsletter-signup-submit" x-bind="submit"><!-- Consumer provides submit button text --></button>
  <p class="newsletter-signup-success" role="status" aria-live="polite" hidden x-bind="success"><!-- Consumer provides success message text --></p>
  <p class="newsletter-signup-error" role="alert" hidden x-bind="error"><!-- Consumer provides error message text --></p>
</form>`,
    sel: "form.newsletter-signup",
    extra: withSnippet(`const email = () => el().querySelector(".newsletter-signup-email");
const submit = () => el().querySelector(".newsletter-signup-submit");
const success = () => el().querySelector(".newsletter-signup-success");
const error = () => el().querySelector(".newsletter-signup-error");
const inState = (state) => snippet("newsletter-signup").replace("lilyNewsletterSignup()", "lilyNewsletterSignup('" + state + "')");`),
    test: `
  it("starts idle with both messages hidden and the controls enabled", async () => {
    await mount("newsletter-signup");
    expect(el().getAttribute("data-state")).toBe("idle");
    expect(success().hidden).toBe(true);
    expect(error().hidden).toBe(true);
    expect(email().disabled).toBe(false);
    expect(submit().disabled).toBe(false);
  });
  it("submitting disables the field and the button", async () => {
    await mount("newsletter-signup", inState("submitting"));
    expect(el().getAttribute("data-state")).toBe("submitting");
    expect(email().disabled).toBe(true);
    expect(submit().disabled).toBe(true);
  });
  it("success shows the polite status only; error shows the alert only", async () => {
    await mount("newsletter-signup", inState("success"));
    expect(success().hidden).toBe(false);
    expect(error().hidden).toBe(true);
    expect(success().getAttribute("role")).toBe("status");
    await mount("newsletter-signup", inState("error"));
    expect(error().hidden).toBe(false);
    expect(success().hidden).toBe(true);
    expect(error().getAttribute("role")).toBe("alert");
  });
  it("submit is prevented and announces the email so the consumer can move the state on", async () => {
    await mount("newsletter-signup");
    const seen = vi.fn();
    el().addEventListener("lily:submit", (e) => seen(e.detail));
    email().value = "a@example.com";
    const event = new Event("submit", { bubbles: true, cancelable: true });
    el().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(seen).toHaveBeenCalledWith({ email: "a@example.com" });
  });`,
  },

  "date-time-now-input": {
    tag: "div", keyboard: "Tab between the date, the time and the Now button; Enter or Space on Now fills both",
    aria: 'role="group" with aria-label; the date input, the time input and the button each have an aria-label',
    markup: `<div class="date-time-now-input" role="group" aria-label="" x-data="lilyDateTimeNow()">
  <input class="date-time-now-input-date" type="date" aria-label="" x-model="date">
  <input class="date-time-now-input-time" type="time" aria-label="" x-model="time">
  <button class="date-time-now-input-now" aria-label="" x-bind="nowButton"><!-- Consumer provides button text --></button>
</div>`,
    sel: "div.date-time-now-input",
    extra: `const date = () => el().querySelector("input[type=date]");\nconst time = () => el().querySelector("input[type=time]");\nconst now = () => el().querySelector("button");`,
    test: `
  it("is a group with a date input, a time input and a Now button", async () => {
    await mount("date-time-now-input");
    expect(el().getAttribute("role")).toBe("group");
    expect(date().value).toBe("");
    expect(time().value).toBe("");
    expect(now().type).toBe("button");
  });
  it("Now fills both fields with the current local date and time", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 21, 8, 5));
    try {
      await mount("date-time-now-input");
      const seen = vi.fn();
      el().addEventListener("lily:change", (e) => seen(e.detail));
      now().click(); await tick();
      expect(date().value).toBe("2026-10-21");
      expect(time().value).toBe("08:05");
      expect(seen).toHaveBeenCalledWith({ date: "2026-10-21", time: "08:05" });
    } finally {
      vi.useRealTimers();
    }
  });`,
  },

  "time-picker-input": {
    tag: "input", keyboard: "native time field: arrows change and move between segments",
    aria: "aria-label names the input; the native time input already carries its semantics",
    markup: `<input class="time-picker-input" type="time" aria-label="" x-data="{ value: '' }" x-model="value" :data-value="value">`,
    sel: "input.time-picker-input",
    test: `
  it("is a native time input", async () => {
    await mount("time-picker-input");
    expect(el().type).toBe("time");
    expect(el().hasAttribute("role")).toBe(false);
  });
  it("two-way binds its value into data-value", async () => {
    await mount("time-picker-input");
    el().value = "09:30";
    el().dispatchEvent(new Event("input", { bubbles: true })); await tick();
    expect(el().getAttribute("data-value")).toBe("09:30");
  });`,
  },
};
