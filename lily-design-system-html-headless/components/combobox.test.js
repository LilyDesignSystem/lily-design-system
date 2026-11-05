// combobox.test.js
// Combobox component test

const path = require("path");

describe("Combobox", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "combobox.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.combobox");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("combobox");
    });

    it("puts role=combobox on the input, linked to a hidden listbox", async function () {
        const input = await $("div.combobox > input");
        expect(await input.getAttribute("role")).toBe("combobox");
        expect(await input.getAttribute("aria-expanded")).toBe("false");
        expect(await input.getAttribute("aria-autocomplete")).toBe("list");
        const id = await input.getAttribute("aria-controls");
        const list = await $(`#${id}`);
        expect(await list.getAttribute("role")).toBe("listbox");
        expect(await browser.execute((el) => el.matches(":popover-open"), await list)).toBe(false);
    });

    it("should have an aria-label attribute on the input and the listbox", async function () {
        expect(await $("div.combobox > input").getAttribute("aria-label")).not.toBeNull();
        expect(await $('div.combobox [role="listbox"]').getAttribute("aria-label")).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T5a): real key presses in a real browser.
describe("Combobox keyboard", function () {
    async function setup(open) {
        await browser.url("file://" + path.resolve(__dirname, "combobox.html"));
        await browser.execute((isOpen) => {
            const input = document.querySelector('.combobox [role="combobox"]');
            const list = document.querySelector('.combobox [role="listbox"]');
            input.setAttribute("aria-expanded", String(isOpen));
            if (isOpen) list.showPopover();
            window.closes = 0;
            window.escapeReachedDocument = 0;
            document
                .querySelector(".combobox")
                .addEventListener("combobox-close", () => (window.closes += 1));
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && !e.defaultPrevented) window.escapeReachedDocument += 1;
            });
            input.focus();
        }, open);
    }
    async function state() {
        return browser.execute(() => ({
            expanded: document
                .querySelector('.combobox [role="combobox"]')
                .getAttribute("aria-expanded"),
            hidden: !document.querySelector('.combobox [role="listbox"]').matches(":popover-open"),
            closes: window.closes,
            uncancelled: window.escapeReachedDocument,
        }));
    }

    it("Escape closes the open list and announces it", async function () {
        await setup(true);
        await browser.keys("Escape");
        expect(await state()).toEqual({
            expanded: "false",
            hidden: true,
            closes: 1,
            uncancelled: 0,
        });
    });

    it("Escape on a closed list does nothing and is not cancelled", async function () {
        await setup(false);
        await browser.keys("Escape");
        expect(await state()).toEqual({
            expanded: "false",
            hidden: true,
            closes: 0,
            uncancelled: 1,
        });
    });

    it("other keys leave the open list alone", async function () {
        await setup(true);
        await browser.keys(["a", "Enter"]);
        expect(await state()).toEqual({
            expanded: "true",
            hidden: false,
            closes: 0,
            uncancelled: 0,
        });
    });

    it("keeps focus in the input", async function () {
        await setup(true);
        await browser.keys("Escape");
        expect(await browser.execute(() => document.activeElement.getAttribute("role"))).toBe(
            "combobox",
        );
    });

    // Real keys and a real mouse: jsdom cannot show that pressing an option leaves focus in the input.
    async function withOptions() {
        await browser.url("file://" + path.resolve(__dirname, "combobox.html"));
        await browser.execute(() => {
            const input = document.querySelector('.combobox [role="combobox"]');
            const list = document.querySelector('.combobox [role="listbox"]');
            input.setAttribute("aria-label", "Fruit");
            list.setAttribute("aria-label", "Fruit");
            list.innerHTML =
                '<div role="option">Apple</div><div role="option">Banana</div><div role="option">Cherry</div>';
            window.selected = [];
            document
                .querySelector(".combobox")
                .addEventListener("combobox-select", (e) => window.selected.push(e.detail.value));
            input.focus();
        });
    }
    const facts = () =>
        browser.execute(() => {
            const input = document.querySelector('.combobox [role="combobox"]');
            return {
                value: input.value,
                expanded: input.getAttribute("aria-expanded"),
                active:
                    document.getElementById(input.getAttribute("aria-activedescendant"))
                        ?.textContent ?? null,
                focused: document.activeElement === input,
                selected: window.selected,
            };
        });

    it("ArrowDown opens and moves, ArrowUp wraps, Enter chooses", async function () {
        await withOptions();
        await browser.keys(["ArrowDown", "ArrowDown"]);
        expect(await facts()).toEqual({
            value: "",
            expanded: "true",
            active: "Banana",
            focused: true,
            selected: [],
        });
        await browser.keys(["ArrowUp", "ArrowUp"]);
        expect((await facts()).active).toBe("Cherry");
        await browser.keys("Enter");
        expect(await facts()).toEqual({
            value: "Cherry",
            expanded: "false",
            active: null,
            focused: true,
            selected: ["Cherry"],
        });
    });

    it("a real click chooses an option and focus stays in the input", async function () {
        await withOptions();
        await browser.keys("ArrowDown");
        await $('.combobox [role="option"]:nth-child(2)').click();
        expect(await facts()).toEqual({
            value: "Banana",
            expanded: "false",
            active: null,
            focused: true,
            selected: ["Banana"],
        });
    });

    it("Tab away closes the list", async function () {
        await withOptions();
        await browser.keys(["ArrowDown", "Tab"]);
        expect((await facts()).expanded).toBe("false");
    });
});
