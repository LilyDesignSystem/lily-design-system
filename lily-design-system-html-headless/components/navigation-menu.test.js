// navigation-menu.test.js
// NavigationMenu component test

const path = require("path");

describe("NavigationMenu", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "navigation-menu.html"));
    });

    it("should render the nav element with correct class", async function () {
        const el = await $("nav.navigation-menu");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("navigation-menu");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("nav.navigation-menu");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});

// Overflow mode keyboard behaviour (P12-T5a): real key presses in a real browser.
describe("NavigationMenu overflow", function () {
    // Replace the page with an overflow-mode nav in a narrow box, then run the snippet's own script over it.
    async function setup(width) {
        await browser.url("file://" + path.resolve(__dirname, "navigation-menu.html"));
        await browser.execute((w) => {
            const script = document.querySelector("script").textContent;
            const links = ["Home", "Appointments", "Messages", "Prescriptions", "Account"]
                .map((name) => `<li style="flex: none"><a href="#${name}">${name}</a></li>`)
                .join("");
            document.body.innerHTML = `
                <nav class="navigation-menu" aria-label="Main" data-overflow="true" style="width: ${w}px">
                  <ul class="navigation-menu-list" style="display: flex; margin: 0; padding: 0; list-style: none">
                    ${links}
                    <li class="navigation-menu-more" hidden style="flex: none">
                      <button class="navigation-menu-more-button" type="button" aria-expanded="false">More</button>
                      <ul class="navigation-menu-more-list" hidden></ul>
                    </li>
                  </ul>
                </nav>
                <p id="outside">Outside</p>`;
            new Function(script)();
        }, width);
    }
    async function state() {
        return browser.execute(() => ({
            more: !document.querySelector(".navigation-menu-more").hidden,
            open: !document.querySelector(".navigation-menu-more-list").hidden,
            expanded: document.querySelector(".navigation-menu-more-button").getAttribute("aria-expanded"),
            moved: Array.from(document.querySelectorAll(".navigation-menu-more-list a")).map((a) => a.textContent),
            focused: document.activeElement.textContent,
        }));
    }
    async function focusMore() {
        await browser.execute(() => document.querySelector(".navigation-menu-more-button").focus());
    }

    it("moves the items that do not fit into the More list, in order", async function () {
        await setup(260);
        const s = await state();
        expect(s.more).toBe(true);
        expect(s.moved.length).toBeGreaterThan(0);
        const all = ["Home", "Appointments", "Messages", "Prescriptions", "Account"];
        expect(s.moved).toEqual(all.slice(all.length - s.moved.length));
        expect(await $(".navigation-menu-more-button").getAttribute("aria-controls")).toBe(
            await $(".navigation-menu-more-list").getAttribute("id"),
        );
    });

    it("keeps everything on the row and the More item hidden when all fit", async function () {
        await setup(2000);
        const s = await state();
        expect(s.more).toBe(false);
        expect(s.moved).toEqual([]);
    });

    it("Enter and Space on the More button toggle the list", async function () {
        await setup(260);
        await focusMore();
        await browser.keys("Enter");
        expect(await state()).toMatchObject({ open: true, expanded: "true" });
        await browser.keys(" ");
        expect(await state()).toMatchObject({ open: false, expanded: "false" });
    });

    it("Escape closes the open list and returns focus to the More button", async function () {
        await setup(260);
        await focusMore();
        await browser.keys("Enter");
        await browser.keys("Tab"); // into the first moved link
        expect((await state()).focused).not.toBe("More");
        await browser.keys("Escape");
        expect(await state()).toMatchObject({ open: false, expanded: "false", focused: "More" });
    });

    it("a click outside closes the open list", async function () {
        await setup(260);
        await focusMore();
        await browser.keys("Enter");
        await $("#outside").click();
        expect(await state()).toMatchObject({ open: false, expanded: "false" });
    });
});
