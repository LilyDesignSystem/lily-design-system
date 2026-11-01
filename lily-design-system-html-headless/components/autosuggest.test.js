// autosuggest.test.js
// Autosuggest component test

const path = require("path");

describe("Autosuggest", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "autosuggest.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.autosuggest");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("autosuggest");
    });

    it("is an input combobox controlling a hidden listbox", async function () {
        const state = await browser.execute(() => {
            const input = document.querySelector(".autosuggest-input");
            const list = document.querySelector(".autosuggest-list");
            return [
                input.getAttribute("role"),
                input.getAttribute("aria-controls") === list.id,
                input.getAttribute("aria-expanded"),
                list.hidden,
            ];
        });
        expect(state).toEqual(["combobox", true, "false", true]);
    });
});

// Keyboard behaviour (P12-T5c): real key presses in a real browser. The page's consumer renders three suggestions
// whenever the input is typed into, and none for "zz".
describe("Autosuggest keyboard", function () {
    async function setup() {
        await browser.url("file://" + path.resolve(__dirname, "autosuggest.html"));
        await browser.execute(() => {
            const input = document.querySelector(".autosuggest-input");
            const list = document.querySelector(".autosuggest-list");
            window.chosen = [];
            document
                .querySelector(".autosuggest")
                .addEventListener("autosuggest-select", (e) => window.chosen.push(e.detail.value));
            input.addEventListener("input", () => {
                list.innerHTML =
                    input.value === "zz"
                        ? ""
                        : ["apple", "apricot", "avocado"]
                              .map(
                                  (v) =>
                                      `<li role="option" data-value="${v}">${v.toUpperCase()}</li>`,
                              )
                              .join("");
            });
            input.focus();
        });
    }
    async function state() {
        return browser.execute(() => {
            const input = document.querySelector(".autosuggest-input");
            const list = document.querySelector(".autosuggest-list");
            const opts = Array.from(list.querySelectorAll('[role="option"]'));
            const activeId = input.getAttribute("aria-activedescendant");
            return {
                expanded: input.getAttribute("aria-expanded"),
                hidden: list.hidden,
                active: activeId ? opts.findIndex((o) => o.id === activeId) : -1,
                selected: opts.findIndex((o) => o.getAttribute("aria-selected") === "true"),
                value: input.value,
                chosen: window.chosen,
            };
        });
    }

    it("typing opens the list once the consumer renders suggestions; none keeps it closed", async function () {
        await setup();
        await browser.keys(["a"]);
        expect(await state()).toMatchObject({ expanded: "true", hidden: false, active: -1 });
        await browser.keys(["z"]);
        await browser.execute(() => {
            const input = document.querySelector(".autosuggest-input");
            input.value = "zz";
            input.dispatchEvent(new Event("input"));
        });
        expect(await state()).toMatchObject({ expanded: "false", hidden: true });
    });

    it("ArrowDown and ArrowUp move the highlight, wrapping", async function () {
        await setup();
        await browser.keys(["a"]);
        await browser.keys("ArrowDown");
        expect(await state()).toMatchObject({ active: 0, selected: 0 });
        await browser.keys("ArrowDown");
        expect((await state()).active).toBe(1);
        await browser.keys("ArrowUp");
        await browser.keys("ArrowUp");
        expect((await state()).active).toBe(2);
        await browser.keys("ArrowDown");
        expect((await state()).active).toBe(0);
    });

    it("Home and End jump to the first and last option", async function () {
        await setup();
        await browser.keys(["a"]);
        await browser.keys("ArrowDown");
        await browser.keys("End");
        expect((await state()).active).toBe(2);
        await browser.keys("Home");
        expect((await state()).active).toBe(0);
    });

    it("Enter chooses the highlighted option, fills the input and closes", async function () {
        await setup();
        await browser.keys(["a"]);
        await browser.keys("ArrowDown");
        await browser.keys("ArrowDown");
        await browser.keys("Enter");
        expect(await state()).toMatchObject({
            expanded: "false",
            active: -1,
            value: "apricot",
            chosen: ["apricot"],
        });
    });

    it("Escape closes without choosing", async function () {
        await setup();
        await browser.keys(["a"]);
        await browser.keys("ArrowDown");
        await browser.keys("Escape");
        expect(await state()).toMatchObject({ expanded: "false", value: "a", chosen: [] });
    });

    it("clicking an option chooses it; blur closes the list", async function () {
        await setup();
        await browser.keys(["a"]);
        await $('.autosuggest-list [data-value="avocado"]').click();
        expect(await state()).toMatchObject({
            value: "avocado",
            chosen: ["avocado"],
            expanded: "false",
        });
        await browser.keys(["x"]);
        expect((await state()).expanded).toBe("true");
        await browser.execute(() => document.querySelector(".autosuggest-input").blur());
        expect((await state()).expanded).toBe("false");
    });
});
