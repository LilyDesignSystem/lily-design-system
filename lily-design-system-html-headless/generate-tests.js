#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const COMPONENTS_DIR = path.join(__dirname, "components");

function toPascal(kebab) {
    return kebab
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
}

// Read each .html file, extract tag and class, generate test
const htmlFiles = fs.readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".html"));

let count = 0;
for (const file of htmlFiles) {
    const name = file.replace(".html", "");
    const pascal = toPascal(name);
    const content = fs.readFileSync(path.join(COMPONENTS_DIR, file), "utf8");

    // Extract the main tag from the HTML (first non-comment element)
    const tagMatch = content.match(/^<(\w+)\s/m);
    const tag = tagMatch ? tagMatch[1] : "div";

    // Extract role if present
    const roleMatch = content.match(/role="([^"]+)"/);
    const role = roleMatch ? roleMatch[1] : null;

    // Check if it has aria-label
    const hasAriaLabel = content.includes("aria-label=");

    // Check if it has a script
    const hasScript = content.includes("<script>");

    const testContent = `// ${name}.test.js
// ${pascal} component test

const path = require('path');

describe('${pascal}', function() {
  beforeEach(async function() {
    await browser.url('file://' + path.resolve(__dirname, '${name}.html'));
  });

  it('should render the ${tag} element with correct class', async function() {
    const el = await $('${tag}.${name}');
    await expect(el).toExist();
    const className = await el.getAttribute('class');
    expect(className).toContain('${name}');
  });
${
    role
        ? `
  it('should have the correct ARIA role', async function() {
    const el = await $('${tag}.${name}');
    const roleAttr = await el.getAttribute('role');
    expect(roleAttr).toBe('${role}');
  });
`
        : ""
}${
        hasAriaLabel
            ? `
  it('should have an aria-label attribute', async function() {
    const el = await $('${tag}.${name}');
    const label = await el.getAttribute('aria-label');
    expect(label).not.toBeNull();
  });
`
            : ""
    }});
`;

    fs.writeFileSync(path.join(COMPONENTS_DIR, `${name}.test.js`), testContent, "utf8");
    count++;
}

console.log(`Generated ${count} test files in ${COMPONENTS_DIR}`);
