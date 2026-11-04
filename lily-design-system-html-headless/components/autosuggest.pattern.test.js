const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");
const contracts = require("../../shared/pattern-contracts.json");

const options = contracts.autosuggest.fixture.suggestions
    .map((s) => `<li role="option">${s.label}</li>`)
    .join("");

describe("Autosuggest pattern", function () {
    it("meets the autosuggest contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "autosuggest.html"));
        await runPattern(browser, "autosuggest", ".autosuggest", "autosuggest", null, {
            setup: `root.querySelector("input").setAttribute("aria-label", "Fruit");
                const list = root.querySelector('[role="listbox"]');
                list.setAttribute("aria-label", "Fruit");
                list.innerHTML = '${options}';`,
        });
    });
});
