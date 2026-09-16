#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const COMPONENTS_DIR = path.join(__dirname, "components");
const AGENTS_MD = path.join(__dirname, "AGENTS.md");

// Read the master AGENTS.md to get component descriptions
const agentsMdContent = fs.readFileSync(AGENTS_MD, "utf8");

// Build a map of kebab-name -> { pascal, description }
const componentMap = {};
const compRegex = /^- (\S+) = (\w+) = (.+)$/gm;
let match;
while ((match = compRegex.exec(agentsMdContent)) !== null) {
  componentMap[match[1]] = { pascal: match[2], description: match[3].trim() };
}

function toPascal(kebab) {
  return kebab
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

// Get all component directories (excluding .claude and files)
const dirs = fs.readdirSync(COMPONENTS_DIR).filter((name) => {
  if (name === ".claude") return false;
  const fullPath = path.join(COMPONENTS_DIR, name);
  return fs.statSync(fullPath).isDirectory();
});

let created = 0;

for (const name of dirs) {
  const dir = path.join(COMPONENTS_DIR, name);
  const info = componentMap[name] || {
    pascal: toPascal(name),
    description: `a ${name} component`,
  };
  const pascal = info.pascal;
  const description = info.description;

  // Read index.md first line (heading) for the display name
  let heading = pascal;
  const indexPath = path.join(dir, "index.md");
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, "utf8");
    const headingMatch = indexContent.match(/^# (.+)$/m);
    if (headingMatch) heading = headingMatch[1].trim();
  }

  // AGENTS.md
  const agentsPath = path.join(dir, "AGENTS.md");
  if (!fs.existsSync(agentsPath)) {
    const agentsMd = `# ${heading}

## Metadata

- Component: ${name}
- PascalCase: ${pascal}
- Description: ${description}

## Architecture

- Framework-agnostic component documentation
- Headless: zero CSS, consumers provide all styling
- WCAG 2.2 AAA accessible

## Files

- index.md — component documentation
- README.md — symlink to index.md
- AGENTS.md — AI agent instructions
- CLAUDE.md — Claude instructions
- plan.md — implementation plan
- tasks.md — task tracking

## References

- CSS class: .${name} in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/${name}.html
`;
    fs.writeFileSync(agentsPath, agentsMd, "utf8");
  }

  // CLAUDE.md
  const claudePath = path.join(dir, "CLAUDE.md");
  if (!fs.existsSync(claudePath)) {
    const claudeMd = `@AGENTS.md
`;
    fs.writeFileSync(claudePath, claudeMd, "utf8");
  }

  // plan.md
  const planPath = path.join(dir, "plan.md");
  if (!fs.existsSync(planPath)) {
    const planMd = `# ${heading} — Implementation Plan

## Goal

Implement the ${heading} component: ${description}.

## Approach

1. Create framework-agnostic component documentation in index.md
2. Implement HTML headless component in @lilydesignsystem/html-headless
3. Implement Svelte headless component in @lilydesignsystem/svelte-headless
4. Ensure WCAG 2.2 AAA accessibility compliance
5. Create tests for each implementation

## Acceptance Criteria

- [ ] index.md documents props, usage, keyboard, ARIA, and headless guidance
- [ ] HTML headless implementation exists and passes tests
- [ ] Svelte headless implementation exists and passes tests
- [ ] CSS class .${name} in css-style-sheet-template.css
- [ ] WCAG 2.2 AAA compliant
`;
    fs.writeFileSync(planPath, planMd, "utf8");
  }

  // tasks.md
  const tasksPath = path.join(dir, "tasks.md");
  if (!fs.existsSync(tasksPath)) {
    const tasksMd = `# ${heading} — Tasks

## Done

- [x] Create component directory
- [x] Create index.md documentation
- [x] Create README.md symlink

## In Progress

- [ ] HTML headless implementation
- [ ] Svelte headless implementation

## Backlog

- [ ] Blazor headless implementation
- [ ] React headless implementation
- [ ] Vue headless implementation
- [ ] Add comprehensive tests for each implementation
`;
    fs.writeFileSync(tasksPath, tasksMd, "utf8");
  }

  created++;
}

// Handle .claude directory
const claudeDir = path.join(COMPONENTS_DIR, ".claude");
if (fs.existsSync(claudeDir)) {
  // index.md
  const indexPath = path.join(claudeDir, "index.md");
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(
      indexPath,
      `# Claude Settings

This directory contains Claude Code settings for the components directory.
`,
      "utf8",
    );
  }

  // README.md symlink
  const readmePath = path.join(claudeDir, "README.md");
  if (!fs.existsSync(readmePath)) {
    fs.symlinkSync("index.md", readmePath);
  }

  // AGENTS.md
  const agentsPath = path.join(claudeDir, "AGENTS.md");
  if (!fs.existsSync(agentsPath)) {
    fs.writeFileSync(
      agentsPath,
      `# Claude Settings

This directory contains Claude Code settings for the components directory.
`,
      "utf8",
    );
  }

  // CLAUDE.md
  const claudePath = path.join(claudeDir, "CLAUDE.md");
  if (!fs.existsSync(claudePath)) {
    fs.writeFileSync(
      claudePath,
      `@AGENTS.md
`,
      "utf8",
    );
  }

  // plan.md
  const planPath = path.join(claudeDir, "plan.md");
  if (!fs.existsSync(planPath)) {
    fs.writeFileSync(
      planPath,
      `# Claude Settings — Plan

This directory contains Claude Code settings. No implementation plan needed.
`,
      "utf8",
    );
  }

  // tasks.md
  const tasksPath = path.join(claudeDir, "tasks.md");
  if (!fs.existsSync(tasksPath)) {
    fs.writeFileSync(
      tasksPath,
      `# Claude Settings — Tasks

## Done

- [x] Create settings directory
- [x] Create settings.local.json
`,
      "utf8",
    );
  }
}

console.log(
  `Created docs for ${created} component directories + .claude directory`,
);
