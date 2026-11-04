// Runs pattern-tester.ts inside a real browser page, for the catalogs tested with WebdriverIO. The tester and its
// contracts are sent to the page as source, so a test file only names the pattern. Spec: spec/testing/index.md#pattern-testers.
const { readFileSync } = require("node:fs");
const { stripTypeScriptTypes } = require("node:module");
const path = require("node:path");

function source() {
    const contracts = readFileSync(path.join(__dirname, "pattern-contracts.json"), "utf8");
    return stripTypeScriptTypes(readFileSync(path.join(__dirname, "pattern-tester.ts"), "utf8"))
        .replace(/^import contracts from .*$/m, `const contracts = ${contracts};`)
        .replace(/^export (async function|function|const)/gm, "$1");
}

/** Run a pattern on the first element matching `selector`, naming it first when `label` is given. */
async function runPattern(browser, pattern, selector, hook, label) {
    const error = await browser.execute(
        async (code, name, css, baseClass, accessibleName) => {
            const root = document.querySelector(css);
            if (accessibleName) root.setAttribute("aria-label", accessibleName);
            const run = new Function(`${code}\nreturn runPattern;`)();
            try {
                await run(name, { root, hook: baseClass });
                return null;
            } catch (failure) {
                return String(failure && failure.message);
            }
        },
        source(),
        pattern,
        selector,
        hook,
        label ?? null,
    );
    if (error) throw new Error(error);
}

module.exports = { runPattern };
