// listbox.test.js
// Listbox component test

const path = require("path");

describe("Listbox", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "listbox.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.listbox");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("listbox");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.listbox");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("listbox");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.listbox");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Keyboard behaviour (P12-T5a): real key presses in a real browser.
describe("Listbox keyboard", function () {
    async function setup() {
        await browser.url("file://" + path.resolve(__dirname, "listbox.html"));
        await browser.execute(() => {
            const list = document.querySelector(".listbox");
            list.setAttribute("aria-label", "Fruits");
            ["Apple", "Banana", "Cherry"].forEach((name, i) => {
                const option = document.createElement("div");
                option.setAttribute("role", "option");
                option.setAttribute("tabindex", i === 0 ? "0" : "-1");
                option.textContent = name;
                list.appendChild(option);
            });
            list.querySelector('[role="option"]').focus();
        });
    }
    async function focused() {
        return browser.execute(() => document.activeElement.textContent);
    }

    it("ArrowDown moves focus to the next option and wraps from the last to the first", async function () {
        await setup();
        await browser.keys("ArrowDown");
        expect(await focused()).toBe("Banana");
        await browser.keys("ArrowDown");
        expect(await focused()).toBe("Cherry");
        await browser.keys("ArrowDown");
        expect(await focused()).toBe("Apple");
    });

    it("ArrowUp moves focus to the previous option and wraps from the first to the last", async function () {
        await setup();
        await browser.keys("ArrowUp");
        expect(await focused()).toBe("Cherry");
        await browser.keys("ArrowUp");
        expect(await focused()).toBe("Banana");
    });

    it("Home and End move focus to the first and last option", async function () {
        await setup();
        await browser.keys("End");
        expect(await focused()).toBe("Cherry");
        await browser.keys("Home");
        expect(await focused()).toBe("Apple");
    });

    it("cancels the keys it handles and leaves other keys alone", async function () {
        await setup();
        const prevented = await browser.execute(() => {
            const option = document.querySelector('[role="option"]');
            return ["ArrowDown", "ArrowUp", "Home", "End", "a", "Enter"].map((key) => {
                const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
                option.dispatchEvent(event);
                return event.defaultPrevented;
            });
        });
        expect(prevented).toEqual([true, true, true, true, false, false]);
    });

    it("works with options added after the page loaded", async function () {
        await setup();
        await browser.execute(() => {
            const option = document.createElement("div");
            option.setAttribute("role", "option");
            option.setAttribute("tabindex", "-1");
            option.textContent = "Damson";
            document.querySelector(".listbox").appendChild(option);
        });
        await browser.keys("End");
        expect(await focused()).toBe("Damson");
    });
});
