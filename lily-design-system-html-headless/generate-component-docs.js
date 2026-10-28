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

// Extract description from HTML comment
function getDescription(htmlContent) {
    const match = htmlContent.match(/Description:\s*(.+)/);
    return match ? match[1].trim() : "";
}

// Extract tag from HTML comment
function getTag(htmlContent) {
    const match = htmlContent.match(/HTML tag:\s*<(\w+)>/);
    return match ? match[1] : "div";
}

// Extract keyboard from HTML comment
function getKeyboard(htmlContent) {
    const match = htmlContent.match(/Keyboard:\s*(.+)/);
    return match ? match[1].trim() : "None";
}

// Extract role from rendered HTML
function getRole(htmlContent) {
    // Look in the actual element (not the comment)
    const lines = htmlContent.split("\n");
    let inComment = false;
    for (const line of lines) {
        if (line.includes("<!--")) inComment = true;
        if (line.includes("-->")) {
            inComment = false;
            continue;
        }
        if (inComment) continue;
        const roleMatch = line.match(/role="([^"]+)"/);
        if (roleMatch) return roleMatch[1];
    }
    return null;
}

// Check if component has script
function hasScript(htmlContent) {
    return htmlContent.includes("<script>");
}

const htmlFiles = fs.readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".html"));

let count = 0;
for (const file of htmlFiles) {
    const name = file.replace(".html", "");
    const pascal = toPascal(name);
    const htmlPath = path.join(COMPONENTS_DIR, file);
    const htmlContent = fs.readFileSync(htmlPath, "utf8");

    const description = getDescription(htmlContent);
    const tag = getTag(htmlContent);
    const keyboard = getKeyboard(htmlContent);
    const role = getRole(htmlContent);
    const interactive = hasScript(htmlContent);

    // Create component directory
    const compDir = path.join(COMPONENTS_DIR, name);
    if (!fs.existsSync(compDir)) {
        fs.mkdirSync(compDir, { recursive: true });
    }

    // Move .html into directory
    const newHtmlPath = path.join(compDir, file);
    if (!fs.existsSync(newHtmlPath)) {
        fs.renameSync(htmlPath, newHtmlPath);
    }

    // Move .test.js into directory
    const testFile = `${name}.test.js`;
    const testPath = path.join(COMPONENTS_DIR, testFile);
    const newTestPath = path.join(compDir, testFile);
    if (fs.existsSync(testPath) && !fs.existsSync(newTestPath)) {
        fs.renameSync(testPath, newTestPath);
    }

    // Generate AGENTS.md
    const agentsMd = `# ${pascal}

## Metadata

- Component: ${name}
- PascalCase: ${pascal}
- Description: ${description}
- HTML tag: <${tag}>
- CSS class: .${name}${role ? `\n- ARIA role: ${role}` : ""}
- Interactive: ${interactive ? "yes" : "no"}

## Architecture

- Plain HTML with vanilla JavaScript
- Headless: zero CSS, consumers provide all styling
- WCAG 2.2 AAA accessible
- No frameworks, no TypeScript, no build tools

## Files

- ${name}.html — component markup and behavior
- ${name}.test.js — WebDriverIO test

## Keyboard

- ${keyboard}

## Accessibility

- Semantic <${tag}> element${role ? `\n- role="${role}"` : ""}
- aria-label for accessible name
- WCAG 2.2 AAA compliant

## Testing

- WebDriverIO test verifies element exists with correct tag and class${role ? `\n- Verifies ARIA role="${role}"` : ""}
- Verifies aria-label attribute present

## References

- CSS class: .${name} in css-style-sheet-template.css
- Component docs: ../../components/${name}/index.md
`;

    fs.writeFileSync(path.join(compDir, "AGENTS.md"), agentsMd, "utf8");

    // Generate plan.md
    const planMd = `# ${pascal} — Implementation Plan

## Goal

Implement the ${pascal} headless HTML component: ${description}.

## Approach

1. Use semantic <${tag}> element with class="${name}"${role ? `\n2. Add role="${role}" for ARIA semantics` : ""}
${role ? "3" : "2"}. Add aria-label for accessible name${interactive ? `\n${role ? "4" : "3"}. Add vanilla JavaScript IIFE for interactive behavior` : ""}
${interactive ? (role ? "5" : "4") : role ? "4" : "3"}. Create WebDriverIO test to verify structure and accessibility

## Acceptance Criteria

- [ ] Renders <${tag}> element with class="${name}"${role ? `\n- [ ] Has role="${role}"` : ""}
- [ ] Has aria-label attribute
- [ ] Keyboard accessible: ${keyboard}${interactive ? "\n- [ ] JavaScript behavior works correctly" : ""}
- [ ] WebDriverIO test passes
- [ ] Zero CSS — fully headless
`;

    fs.writeFileSync(path.join(compDir, "plan.md"), planMd, "utf8");

    // Generate tasks.md
    const tasksMd = `# ${pascal} — Tasks

## Done

- [x] Create ${name}.html with semantic <${tag}> markup
- [x] Add CSS class "${name}"${role ? `\n- [x] Add role="${role}"` : ""}
- [x] Add aria-label attribute
- [x] Add descriptive comment header${interactive ? "\n- [x] Add vanilla JavaScript behavior" : ""}
- [x] Create ${name}.test.js WebDriverIO test

## Backlog

- [ ] Add more comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
`;

    fs.writeFileSync(path.join(compDir, "tasks.md"), tasksMd, "utf8");

    count++;
}

console.log(`Created directories with AGENTS.md, plan.md, tasks.md for ${count} components`);
