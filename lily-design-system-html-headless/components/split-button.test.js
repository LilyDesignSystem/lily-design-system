// split-button.test.js
// SplitButton component test

const path = require("path");

describe("SplitButton", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "split-button.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.split-button");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("split-button");
    });

    it('should have role="group" and an aria-label', async function () {
        const el = await $("div.split-button");
        const role = await el.getAttribute("role");
        expect(role).toBe("group");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should contain a primary button", async function () {
        const primary = await $("div.split-button button.split-button-primary");
        await expect(primary).toExist();
        const type = await primary.getAttribute("type");
        expect(type).toBe("button");
    });

    it("should contain a menu trigger with aria-haspopup and aria-expanded", async function () {
        const trigger = await $("div.split-button button.split-button-menu-trigger");
        await expect(trigger).toExist();
        const haspopup = await trigger.getAttribute("aria-haspopup");
        expect(haspopup).toBe("menu");
        const expanded = await trigger.getAttribute("aria-expanded");
        expect(expanded).toBe("false");
    });

    // The menu is popover="auto": the browser's toggle event, which updates aria-expanded, is queued as a task.
    async function expanded(trigger, value) {
        await browser.waitUntil(
            async () => (await trigger.getAttribute("aria-expanded")) === value,
            {
                timeout: 2000,
            },
        );
    }
    function shown() {
        return browser.execute(
            () =>
                getComputedStyle(document.querySelector("div.split-button-menu")).display !==
                "none",
        );
    }

    it("should toggle the menu open when the trigger is clicked", async function () {
        const trigger = await $("div.split-button button.split-button-menu-trigger");
        expect(await shown()).toBe(false);
        await trigger.click();
        await expanded(trigger, "true");
        expect(await shown()).toBe(true);
        await trigger.click();
        await expanded(trigger, "false");
        expect(await shown()).toBe(false);
    });

    it("should close the menu when Escape is pressed", async function () {
        const trigger = await $("div.split-button button.split-button-menu-trigger");
        await trigger.click();
        await expanded(trigger, "true");
        await browser.keys("Escape");
        await expanded(trigger, "false");
        expect(await shown()).toBe(false);
    });

    it("should close the menu on a click outside (light dismiss)", async function () {
        const trigger = await $("div.split-button button.split-button-menu-trigger");
        await browser.execute(() =>
            document.body.insertAdjacentHTML(
                "beforeend",
                '<p id="outside" style="margin-top:200px">outside</p>',
            ),
        );
        await trigger.click();
        await expanded(trigger, "true");
        await (await $("#outside")).click();
        await expanded(trigger, "false");
        expect(await shown()).toBe(false);
    });
});

// Where the Popover API is missing (browsers before Chrome 114, Firefox 125, Safari 17), the script falls back to the
// hidden attribute. Simulated in this Chrome by removing showPopover before the snippet's script runs.
describe("SplitButton without the Popover API", function () {
    it("toggles hidden on click, and closes on Escape and on an outside click", async function () {
        const fs = require("fs");
        const src = fs.readFileSync(path.resolve(__dirname, "split-button.html"), "utf8");
        const markup = src.slice(src.indexOf("\n-->") + 4, src.indexOf("<script>"));
        const script = src.slice(src.indexOf("<script>") + 8, src.indexOf("</script>"));
        await browser.url("file://" + path.resolve(__dirname, "split-button.html"));
        await browser.execute(
            (html, js) => {
                delete HTMLElement.prototype.showPopover;
                document.body.innerHTML = html + '<p id="outside">outside</p>';
                new Function(js)();
            },
            markup,
            script,
        );
        const state = () =>
            browser.execute(() => {
                const m = document.querySelector(".split-button-menu");
                return [
                    m.hidden,
                    m.hasAttribute("popover"),
                    document
                        .querySelector(".split-button-menu-trigger")
                        .getAttribute("aria-expanded"),
                ];
            });
        const trigger = await $(".split-button-menu-trigger");
        expect(await state()).toEqual([true, false, "false"]);
        await trigger.click();
        expect(await state()).toEqual([false, false, "true"]);
        await browser.keys("Escape");
        expect(await state()).toEqual([true, false, "false"]);
        await trigger.click();
        await (await $("#outside")).click();
        expect(await state()).toEqual([true, false, "false"]);
    });
});
