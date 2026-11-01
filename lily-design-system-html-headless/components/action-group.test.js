// action-group.test.js
// ActionGroup component test

const path = require("path");

describe("ActionGroup", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "action-group.html"));
    });

    it("should render the group element with correct class", async function () {
        const el = await $("div.action-group");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("action-group");
    });

    it('should have role="group"', async function () {
        const el = await $("div.action-group");
        const role = await el.getAttribute("role");
        expect(role).toBe("group");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.action-group");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should render an overflow trigger with proper ARIA", async function () {
        const trigger = await $("button.action-group-overflow-trigger");
        await expect(trigger).toExist();
        expect(await trigger.getAttribute("aria-haspopup")).toBe("menu");
        expect(await trigger.getAttribute("aria-expanded")).toBe("false");
    });

    function shown() {
        return browser.execute(
            () =>
                getComputedStyle(document.querySelector("div.action-group-overflow-menu"))
                    .display !== "none",
        );
    }

    it("should toggle aria-expanded and the popover=auto panel on overflow trigger click", async function () {
        const trigger = await $("button.action-group-overflow-trigger");
        const panel = await $("div.action-group-overflow-menu");

        // Initially collapsed
        expect(await trigger.getAttribute("aria-expanded")).toBe("false");
        expect(await panel.getAttribute("popover")).toBe("auto");
        expect(await shown()).toBe(false);

        // Click to expand (use waitUntil to allow the inline script's
        // click listener to register before the assertion runs)
        await trigger.click();
        await browser.waitUntil(
            async () => (await trigger.getAttribute("aria-expanded")) === "true",
            { timeout: 5000, timeoutMsg: "aria-expanded did not become true after click" },
        );
        expect(await shown()).toBe(true);

        // Click to collapse
        await trigger.click();
        await browser.waitUntil(
            async () => (await trigger.getAttribute("aria-expanded")) === "false",
            { timeout: 5000, timeoutMsg: "aria-expanded did not become false after second click" },
        );
        expect(await shown()).toBe(false);
    });
});

// Where the Popover API is missing (browsers before Chrome 114, Firefox 125, Safari 17), the script falls back to the
// hidden attribute. Simulated in this Chrome by removing showPopover before the snippet's script runs.
describe("ActionGroup without the Popover API", function () {
    it("toggles the panel's hidden attribute on click", async function () {
        const fs = require("fs");
        const src = fs.readFileSync(path.resolve(__dirname, "action-group.html"), "utf8");
        const markup = src.slice(src.indexOf("\n-->") + 4, src.indexOf("<script>"));
        const script = src.slice(src.indexOf("<script>") + 8, src.indexOf("</script>"));
        await browser.url("file://" + path.resolve(__dirname, "action-group.html"));
        await browser.execute(
            (html, js) => {
                delete HTMLElement.prototype.showPopover;
                document.body.innerHTML = html;
                new Function(js)();
            },
            markup,
            script,
        );
        const state = () =>
            browser.execute(() => {
                const m = document.querySelector(".action-group-overflow-menu");
                return [
                    m.hidden,
                    m.hasAttribute("popover"),
                    document
                        .querySelector(".action-group-overflow-trigger")
                        .getAttribute("aria-expanded"),
                ];
            });
        expect(await state()).toEqual([true, false, "false"]);
        await (await $(".action-group-overflow-trigger")).click();
        expect(await state()).toEqual([false, false, "true"]);
        await (await $(".action-group-overflow-trigger")).click();
        expect(await state()).toEqual([true, false, "false"]);
    });
});
