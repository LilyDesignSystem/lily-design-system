#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const TOP = __dirname;
const COMPONENTS_DIR = path.join(TOP, "components");
const AGENTS_MD = path.join(TOP, "AGENTS.md");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toPascal(kebab) {
  return kebab
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function toTitle(kebab) {
  return kebab
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Tag suffix mapping from AGENTS.md
const TAG_SUFFIX_MAP = {
  article: "article",
  aside: "aside",
  button: "button",
  dialog: "dialog",
  div: "div",
  fieldset: "fieldset",
  figure: "figure",
  footer: "footer",
  header: "header",
  input: "input",
  kbd: "kbd",
  list: "ol",
  "list-item": "li",
  main: "main",
  meter: "meter",
  nav: "nav",
  option: "option",
  picker: "div",
  progress: "progress",
  table: "table",
  "table-head": "thead",
  "table-body": "tbody",
  "table-foot": "tfoot",
  "table-th": "th",
  "table-row": "tr",
  "table-td": "td",
  select: "select",
  span: "span",
};

// Special overrides where the suffix rule doesn't apply cleanly
const TAG_OVERRIDES = {
  alert: "div",
  badge: "span",
  banner: "div",
  "beach-ball": "div",
  "call-to-action": "div",
  caption: "caption",
  card: "div",
  "care-card": "div",
  carousel: "div",
  "character-counter": "span",
  character: "span",
  "clipboard-copy-button": "button",
  collapsible: "div",
  combobox: "div",
  command: "div",
  "currency-input": "input",
  "data-filter-form": "form",
  "date-range": "span",
  details: "details",
  dial: "div",
  drawer: "div",
  editable: "div",
  "email-link": "a",
  emoji: "span",
  "error-message": "span",
  "error-summary": "div",
  expander: "div",
  field: "div",
  flair: "span",
  "floating-panel": "div",
  footnote: "span",
  form: "form",
  "hamburger-menu": "button",
  hint: "span",
  "hover-card": "div",
  icon: "span",
  image: "img",
  "information-callout": "div",
  "inset-text": "div",
  label: "label",
  listbox: "div",
  "medical-banner-box-for-danger": "div",
  "navigation-menu": "nav",
  notification: "div",
  panel: "div",
  "password-input-or-text-input-div": "div",
  "pin-input-div": "div",
  popover: "div",
  popup: "div",
  "qr-code": "div",
  resizable: "div",
  "review-date": "span",
  "scroll-area": "div",
  "scroll-bar": "div",
  separator: "hr",
  sheet: "div",
  sidebar: "aside",
  "signature-pad": "canvas",
  skeleton: "div",
  "skip-link": "a",
  "slide-out-drawer": "div",
  slider: "div",
  sonner: "div",
  sparkline: "span",
  splitter: "div",
  "switch-button": "button",
  tag: "span",
  "tag-input": "div",
  "tel-link": "a",
  text-area-input: "text-area-input",
  timer: "span",
  toast: "div",
  "toggle-button": "button",
  tooltip: "div",
  tour: "div",
  "tree-menu": "div",
  "warning-callout": "div",
  "action-link": "a",
  "back-link": "a",
  "ai-label": "span",
  "file-upload": "div",
  "file-manager": "div",
  "angle-slider-range-input": "input",
  "aspect-ratio-container": "div",
  avatar: "div",
  "avatar-image": "img",
  "avatar-text": "span",
  "date-field": "div",
  "dropdown-menu": "div",
  "editable-form": "form",
  "context-menu": "div",
  "file-dialog": "dialog",
  "alert-dialog": "dialog",
  "image-file-input": "input",
  "time-picker-input": "div",
  "emoji-character-picker": "div",
  "calendar-range-picker": "div",
  "color-picker": "div",
  "theme-picker": "div",
  "five-face-rating-picker": "div",
  "five-star-rating-picker": "div",
  "net-promoter-score-picker": "div",
  "red-amber-green-picker": "div",
  "red-orange-yellow-green-blue-picker": "div",
  "grail-layout": "div",
  "grail-layout-top-header": "header",
  "grail-layout-left-aside": "aside",
  "grail-layout-center-main": "main",
  "grail-layout-right-aside": "aside",
  "grail-layout-bottom-footer": "footer",
  "progress-circle": "div",
  "progress-spinner": "div",
};

function getTag(name) {
  if (TAG_OVERRIDES[name]) return TAG_OVERRIDES[name];
  // Try suffix matching, longest first
  const suffixes = Object.keys(TAG_SUFFIX_MAP).sort(
    (a, b) => b.length - a.length,
  );
  for (const suffix of suffixes) {
    if (name.endsWith("-" + suffix) || name === suffix) {
      return TAG_SUFFIX_MAP[suffix];
    }
  }
  return "div";
}

// ---------------------------------------------------------------------------
// Build component map from master AGENTS.md
// ---------------------------------------------------------------------------

const agentsMdContent = fs.readFileSync(AGENTS_MD, "utf8");
const componentMap = {};
const compRegex = /^- (\S+) = (\w+) = (.+)$/gm;
let match;
while ((match = compRegex.exec(agentsMdContent)) !== null) {
  componentMap[match[1]] = { pascal: match[2], description: match[3].trim() };
}

// ---------------------------------------------------------------------------
// Composition pattern lookup
// ---------------------------------------------------------------------------

const COMPOSITION_PATTERNS = {};

// Bar/BarButton
for (const prefix of ["menu-bar", "tab-bar", "task-bar", "tool-bar"]) {
  COMPOSITION_PATTERNS[prefix] = {
    pattern: "Bar/BarButton",
    children: [`${prefix}-button`],
  };
  COMPOSITION_PATTERNS[`${prefix}-button`] = {
    pattern: "Bar/BarButton",
    parent: prefix,
  };
}

// Group/GroupItem
COMPOSITION_PATTERNS["segment-group"] = {
  pattern: "Group/GroupItem",
  children: ["segment-group-item"],
};
COMPOSITION_PATTERNS["segment-group-item"] = {
  pattern: "Group/GroupItem",
  parent: "segment-group",
};

// Nav/List/ListItem
for (const prefix of ["accordion-nav", "breadcrumb-nav", "tree-nav"]) {
  const list = `${prefix}-list`;
  const item = `${prefix}-list-item`;
  COMPOSITION_PATTERNS[prefix] = {
    pattern: "Nav/List/ListItem",
    children: [list, item],
  };
  COMPOSITION_PATTERNS[list] = {
    pattern: "Nav/List/ListItem",
    parent: prefix,
    children: [item],
  };
  COMPOSITION_PATTERNS[item] = { pattern: "Nav/List/ListItem", parent: list };
}
// contents-nav / contents-list / contents-list-item
COMPOSITION_PATTERNS["contents-nav"] = {
  pattern: "Nav/List/ListItem",
  children: ["contents-list", "contents-list-item"],
};
COMPOSITION_PATTERNS["contents-list"] = {
  pattern: "Nav/List/ListItem",
  parent: "contents-nav",
  children: ["contents-list-item"],
};
COMPOSITION_PATTERNS["contents-list-item"] = {
  pattern: "Nav/List/ListItem",
  parent: "contents-list",
};
// pagination-nav / pagination-list / pagination-list-item
COMPOSITION_PATTERNS["pagination-nav"] = {
  pattern: "Nav/List/ListItem",
  children: ["pagination-list", "pagination-list-item"],
};
COMPOSITION_PATTERNS["pagination-list"] = {
  pattern: "Nav/List/ListItem",
  parent: "pagination-nav",
  children: ["pagination-list-item"],
};
COMPOSITION_PATTERNS["pagination-list-item"] = {
  pattern: "Nav/List/ListItem",
  parent: "pagination-list",
};

// List/ListItem
for (const prefix of [
  "check-list",
  "do-list",
  "dont-list",
  "summary-list",
  "task-list",
  "timeline-list",
]) {
  COMPOSITION_PATTERNS[prefix] = {
    pattern: "List/ListItem",
    children: [`${prefix}-item`],
  };
  COMPOSITION_PATTERNS[`${prefix}-item`] = {
    pattern: "List/ListItem",
    parent: prefix,
  };
}
// tour / tour-list / tour-list-item
COMPOSITION_PATTERNS["tour"] = {
  pattern: "Tour/List/ListItem",
  children: ["tour-list", "tour-list-item"],
};
COMPOSITION_PATTERNS["tour-list"] = {
  pattern: "Tour/List/ListItem",
  parent: "tour",
  children: ["tour-list-item"],
};
COMPOSITION_PATTERNS["tour-list-item"] = {
  pattern: "Tour/List/ListItem",
  parent: "tour-list",
};

// Menu/MenuItem
COMPOSITION_PATTERNS["context-menu"] = {
  pattern: "Menu/MenuItem",
  children: ["context-menu-item"],
};
COMPOSITION_PATTERNS["context-menu-item"] = {
  pattern: "Menu/MenuItem",
  parent: "context-menu",
};
COMPOSITION_PATTERNS["menu"] = {
  pattern: "Menu/MenuItem",
  children: ["menu-item"],
};
COMPOSITION_PATTERNS["menu-item"] = {
  pattern: "Menu/MenuItem",
  parent: "menu",
};

// Select/SelectOption
COMPOSITION_PATTERNS["theme-select"] = {
  pattern: "Select/SelectOption",
  children: ["theme-select-option"],
};
COMPOSITION_PATTERNS["theme-select-option"] = {
  pattern: "Select/SelectOption",
  parent: "theme-select",
};

// Picker/PickerButton
for (const prefix of [
  "color-picker",
  "five-face-rating-picker",
  "five-star-rating-picker",
  "net-promoter-score-picker",
  "red-amber-green-picker",
  "red-orange-yellow-green-blue-picker",
]) {
  COMPOSITION_PATTERNS[prefix] = {
    pattern: "Picker/PickerButton",
    children: [`${prefix}-button`],
  };
  COMPOSITION_PATTERNS[`${prefix}-button`] = {
    pattern: "Picker/PickerButton",
    parent: prefix,
  };
}

// Table families
for (const prefix of [
  "table",
  "calendar-table",
  "data-table",
  "gantt-table",
  "kanban-table",
]) {
  const parts = [
    `${prefix}-head`,
    `${prefix}-body`,
    `${prefix}-foot`,
    `${prefix}-col`,
    `${prefix}-row`,
    `${prefix}-data`,
  ];
  COMPOSITION_PATTERNS[prefix] = {
    pattern: "Table/Head/Body/Foot/Col/Row/Data",
    children: parts,
  };
  for (const part of parts) {
    COMPOSITION_PATTERNS[part] = {
      pattern: "Table/Head/Body/Foot/Col/Row/Data",
      parent: prefix,
    };
  }
}

// Input/View pairs
const INPUT_VIEW_PAIRS = [
  ["postal-code-input", "postal-code-view"],
  ["measurement-instance-input", "measurement-instance-view"],
  ["measurement-system-input", "measurement-system-view"],
  ["measurement-unit-input", "measurement-unit-view"],
  ["five-face-rating-picker", "five-face-rating-view"],
  ["five-star-rating-picker", "five-star-rating-view"],
  ["net-promoter-score-picker", "net-promoter-score-view"],
  ["red-amber-green-picker", "red-amber-green-view"],
  ["red-orange-yellow-green-blue-picker", "red-orange-yellow-green-blue-view"],
];

// Build companion lookup
const COMPANION = {};
for (const [input, view] of INPUT_VIEW_PAIRS) {
  COMPANION[input] = view;
  COMPANION[view] = input;
}

// Input/Link pairs
COMPANION["tel-input"] = "tel-link";
COMPANION["tel-link"] = "tel-input";
COMPANION["email-input"] = "email-link";
COMPANION["email-link"] = "email-input";

// Grail layout
COMPOSITION_PATTERNS["grail-layout"] = {
  pattern: "GrailLayout",
  children: [
    "grail-layout-top-header",
    "grail-layout-left-aside",
    "grail-layout-center-main",
    "grail-layout-right-aside",
    "grail-layout-bottom-footer",
  ],
};
for (const child of COMPOSITION_PATTERNS["grail-layout"].children) {
  COMPOSITION_PATTERNS[child] = {
    pattern: "GrailLayout",
    parent: "grail-layout",
  };
}

// Checkbox/Radio/Toggle groups
COMPOSITION_PATTERNS["checkbox-group"] = {
  pattern: "Group",
  children: ["checkbox-input"],
};
COMPOSITION_PATTERNS["radio-group"] = {
  pattern: "Group",
  children: ["radio-input"],
};
COMPOSITION_PATTERNS["toggle-group"] = {
  pattern: "Group",
  children: ["toggle-button"],
};
COMPOSITION_PATTERNS["tag-group"] = { pattern: "Group", children: ["tag"] };

// ---------------------------------------------------------------------------
// Section extraction from index.md
// ---------------------------------------------------------------------------

function extractSections(content) {
  const sections = {};
  const lines = content.split("\n");
  let currentSection = "_preamble";
  let currentLines = [];

  for (const line of lines) {
    const headingMatch = line.match(/^## (.+)$/);
    if (headingMatch) {
      sections[currentSection] = currentLines.join("\n").trim();
      currentSection = headingMatch[1].trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  sections[currentSection] = currentLines.join("\n").trim();

  return sections;
}

function extractHeading(content) {
  const m = content.match(/^# (.+)$/m);
  return m ? m[1].trim() : "";
}

function extractDescription(content) {
  // First paragraph after the heading
  const lines = content.split("\n");
  let foundHeading = false;
  let descLines = [];
  for (const line of lines) {
    if (!foundHeading) {
      if (line.startsWith("# ")) foundHeading = true;
      continue;
    }
    if (line.trim() === "") {
      if (descLines.length > 0) break;
      continue;
    }
    descLines.push(line.trim());
  }
  return descLines.join(" ");
}

function extractBullets(sectionContent) {
  if (!sectionContent) return [];
  return sectionContent
    .split("\n")
    .filter((l) => l.match(/^- /))
    .map((l) => l.replace(/^- /, "").trim());
}

// ---------------------------------------------------------------------------
// Determine if component is interactive (needs JS)
// ---------------------------------------------------------------------------

function isInteractive(name, sections) {
  const kb = sections["Keyboard Interactions"] || "";
  if (kb.toLowerCase().includes("none")) return false;
  if (
    kb.includes("Arrow") ||
    kb.includes("Enter") ||
    kb.includes("Space") ||
    kb.includes("Escape")
  )
    return true;
  // Components with behavior scripts
  const interactive = [
    "switch-button",
    "toggle-button",
    "collapsible",
    "details",
    "expander",
    "drawer",
    "sheet",
    "slide-out-drawer",
    "dialog",
    "alert-dialog",
    "file-dialog",
    "combobox",
    "command",
    "listbox",
    "carousel",
    "slider",
    "dial",
    "hamburger-menu",
    "tree-menu",
    "dropdown-menu",
    "popover",
    "popup",
    "tooltip",
    "hover-card",
    "toast",
    "sonner",
    "timer",
    "clipboard-copy-button",
    "signature-pad",
    "pin-input-div",
    "password-input-or-text-input-div",
    "editable",
    "file-upload",
    "file-manager",
    "context-menu",
    "menu",
    "tab-bar",
    "menu-bar",
    "task-bar",
    "tool-bar",
    "navigation-menu",
    "resizable",
    "splitter",
    "scroll-area",
    "character-counter",
    "tag-input",
    "combobox",
    "select-with-extras",
    "time-picker-input",
    "date-field",
    "calendar-range-picker",
    "emoji-character-picker",
    "color-picker",
    "theme-picker",
    "five-face-rating-picker",
    "five-star-rating-picker",
    "net-promoter-score-picker",
    "red-amber-green-picker",
    "red-orange-yellow-green-blue-picker",
    "beach-ball",
  ];
  return interactive.includes(name);
}

// ---------------------------------------------------------------------------
// Generate AGENTS.md
// ---------------------------------------------------------------------------

function generateAgentsMd(name, info, heading, sections, tag) {
  const pascal = info.pascal;
  const description = info.description;
  const composition = COMPOSITION_PATTERNS[name];
  const companion = COMPANION[name];
  const interactive = isInteractive(name, sections);

  // Extract key ARIA details
  const ariaSection = sections["ARIA"] || "";
  const ariaBullets = extractBullets(ariaSection);

  // Extract keyboard
  const kbSection = sections["Keyboard Interactions"] || "";
  const kbBullets = extractBullets(kbSection);

  // Extract props
  const propsSection = sections["Props"] || "";
  const propBullets = extractBullets(propsSection);

  // Extract key implementation notes
  const implSection = sections["Implementation Notes"] || "";
  const implBullets = extractBullets(implSection);

  let md = `# ${heading}

## Metadata

- Component: ${name}
- PascalCase: ${pascal}
- Description: ${description}
- HTML tag: <${tag}>
- CSS class: .${name}
- Interactive: ${interactive ? "yes" : "no"}
`;

  // Composition
  if (composition) {
    md += `\n## Composition\n\n- Pattern: ${composition.pattern}\n`;
    if (composition.parent) {
      md += `- Parent: ${composition.parent}\n`;
    }
    if (composition.children && composition.children.length > 0) {
      md += `- Children: ${composition.children.join(", ")}\n`;
    }
  }

  // Companion
  if (companion) {
    md += `\n## Companion\n\n- ${companion}\n`;
  }

  // Key behaviors (from implementation notes)
  if (implBullets.length > 0) {
    md += `\n## Key Behaviors\n\n`;
    for (const b of implBullets) {
      md += `- ${b}\n`;
    }
  }

  // ARIA
  if (ariaBullets.length > 0) {
    md += `\n## ARIA\n\n`;
    for (const b of ariaBullets) {
      md += `- ${b}\n`;
    }
  }

  // Keyboard
  if (kbBullets.length > 0) {
    md += `\n## Keyboard\n\n`;
    for (const b of kbBullets) {
      md += `- ${b}\n`;
    }
  } else if (kbSection && !kbSection.toLowerCase().includes("none")) {
    md += `\n## Keyboard\n\n${kbSection}\n`;
  }

  // Props summary
  if (propBullets.length > 0) {
    md += `\n## Props\n\n`;
    for (const b of propBullets) {
      md += `- ${b}\n`;
    }
  }

  // Acceptance criteria
  md += `\n## Acceptance Criteria\n\n`;
  md += `- [ ] Renders <${tag}> element with class="${name}"\n`;
  if (ariaBullets.some((b) => b.includes("aria-label"))) {
    md += `- [ ] Has aria-label attribute\n`;
  }
  if (ariaBullets.some((b) => b.includes("role="))) {
    const roleMatch = ariaSection.match(/role="([^"]+)"/);
    if (roleMatch) {
      md += `- [ ] Has role="${roleMatch[1]}"\n`;
    }
  }
  if (kbBullets.length > 0) {
    md += `- [ ] Keyboard navigation works correctly\n`;
  }
  md += `- [ ] WCAG 2.2 AAA compliant\n`;
  md += `- [ ] Zero CSS — fully headless\n`;

  // References
  md += `\n## References\n\n`;
  md += `- Documentation: index.md\n`;
  md += `- CSS class: .${name} in css-style-sheet-template.css\n`;
  md += `- HTML headless: lily-design-system-html-headless/components/${name}.html\n`;
  const refSection = sections["References"] || "";
  const refBullets = extractBullets(refSection);
  for (const b of refBullets) {
    md += `- ${b}\n`;
  }

  return md;
}

// ---------------------------------------------------------------------------
// Generate plan.md
// ---------------------------------------------------------------------------

function generatePlanMd(name, info, heading, sections, tag) {
  const pascal = info.pascal;
  const description = info.description;
  const composition = COMPOSITION_PATTERNS[name];
  const companion = COMPANION[name];
  const interactive = isInteractive(name, sections);

  const kbSection = sections["Keyboard Interactions"] || "";
  const kbBullets = extractBullets(kbSection);
  const ariaBullets = extractBullets(sections["ARIA"] || "");

  let md = `# ${heading} — Implementation Plan

## Goal

Implement the ${heading} component: ${description}.

## HTML Tag and CSS Class

- HTML tag: <${tag}>
- CSS class: .${name}
`;

  // Dependencies
  if (
    composition &&
    (composition.parent ||
      (composition.children && composition.children.length > 0))
  ) {
    md += `\n## Dependencies\n\n`;
    if (composition.parent) {
      md += `- Requires parent: ${composition.parent}\n`;
    }
    if (composition.children) {
      md += `- Requires children: ${composition.children.join(", ")}\n`;
    }
  }
  if (companion) {
    md += `\n## Companion Component\n\n- ${companion} (Input/View or Input/Link pair)\n`;
  }

  // Approach
  md += `\n## Approach\n\n`;
  let step = 1;
  md += `${step++}. Use semantic <${tag}> element with class="${name}"\n`;
  if (ariaBullets.length > 0) {
    md += `${step++}. Add ARIA attributes for accessibility\n`;
  }
  if (kbBullets.length > 0) {
    md += `${step++}. Implement keyboard navigation\n`;
  }
  if (interactive) {
    md += `${step++}. Add vanilla JavaScript for interactive behavior\n`;
  }
  md += `${step++}. Implement in HTML headless (plain HTML + vanilla JS)\n`;
  md += `${step++}. Implement in Svelte headless (Svelte 5 + runes)\n`;
  md += `${step++}. Implement in React, Vue, Blazor headless\n`;
  md += `${step++}. Create tests for each implementation\n`;

  // Acceptance criteria
  md += `\n## Acceptance Criteria\n\n`;
  md += `- [ ] Renders <${tag}> with class="${name}"\n`;
  for (const b of ariaBullets) {
    if (b.includes("role=") || b.includes("aria-")) {
      md += `- [ ] ${b}\n`;
    }
  }
  if (kbBullets.length > 0) {
    for (const b of kbBullets) {
      md += `- [ ] Keyboard: ${b}\n`;
    }
  }
  md += `- [ ] WCAG 2.2 AAA compliant\n`;
  md += `- [ ] Zero CSS — fully headless\n`;
  md += `- [ ] Tests pass in all implementations\n`;

  return md;
}

// ---------------------------------------------------------------------------
// Generate tasks.md
// ---------------------------------------------------------------------------

function generateTasksMd(name, info, heading, sections, tag) {
  const pascal = info.pascal;
  const composition = COMPOSITION_PATTERNS[name];
  const companion = COMPANION[name];

  let md = `# ${heading} — Tasks

## Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .${name} to css-style-sheet-template.css

## In Progress

- [ ] Implement HTML headless component (${name}.html)
- [ ] Implement HTML headless test (${name}.test.js)
`;

  if (composition && composition.children) {
    for (const child of composition.children) {
      md += `- [ ] Implement child component: ${child}\n`;
    }
  }

  md += `
## Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
`;

  if (companion) {
    md += `- [ ] Verify companion component: ${companion}\n`;
  }

  md += `- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
`;

  return md;
}

// ---------------------------------------------------------------------------
// Add missing Styles and Testing sections to index.md
// ---------------------------------------------------------------------------

function upgradeIndexMd(name, content, sections, tag) {
  let modified = false;
  let result = content;

  // Add Styles section if missing
  if (!sections["Styles"]) {
    const stylesSection = `\n## Styles\n\nThe consumer provides all CSS styling. The component renders with a \`.${name}\` class for targeting. No default styles are included — this is a fully headless component.\n`;
    // Insert before Advice or Testing or References
    const insertBefore = [
      "## Advice",
      "## Testing",
      "## Domain Knowledge",
      "## Composition",
      "## References",
    ];
    for (const marker of insertBefore) {
      const idx = result.indexOf(marker);
      if (idx !== -1) {
        result =
          result.slice(0, idx) + stylesSection + "\n" + result.slice(idx);
        modified = true;
        break;
      }
    }
    if (!modified) {
      result = result.trimEnd() + "\n" + stylesSection;
      modified = true;
    }
  }

  // Recalculate sections after possible Styles insertion
  const updatedSections = extractSections(result);

  // Add Testing section if missing
  if (!updatedSections["Testing"]) {
    const ariaBullets = extractBullets(updatedSections["ARIA"] || "");
    const kbBullets = extractBullets(
      updatedSections["Keyboard Interactions"] || "",
    );

    let testingLines = [`\n## Testing\n`];
    testingLines.push(
      `\n- Verify the component renders a \`<${tag}>\` element with class \`${name}\``,
    );
    for (const b of ariaBullets) {
      if (b.includes("aria-label") || b.includes("role=")) {
        testingLines.push(`- Verify ${b.replace(/^`/, "").replace(/`$/, "")}`);
      }
    }
    if (kbBullets.length > 0) {
      testingLines.push(`- Verify keyboard interactions work correctly`);
    }
    testingLines.push(`- Verify pass-through attributes are applied`);
    const testingSection = testingLines.join("\n") + "\n";

    // Insert before Advice or Domain Knowledge or Composition or References
    const insertBefore = [
      "## Advice",
      "## Domain Knowledge",
      "## Composition",
      "## References",
    ];
    let inserted = false;
    for (const marker of insertBefore) {
      const idx = result.indexOf(marker);
      if (idx !== -1) {
        result =
          result.slice(0, idx) + testingSection + "\n" + result.slice(idx);
        inserted = true;
        modified = true;
        break;
      }
    }
    if (!inserted) {
      result = result.trimEnd() + "\n" + testingSection;
      modified = true;
    }
  }

  return { content: result, modified };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const dirs = fs.readdirSync(COMPONENTS_DIR).filter((name) => {
  if (name === ".claude") return false;
  if (name === "AGENTS.md" || name === "CLAUDE.md") return false;
  const fullPath = path.join(COMPONENTS_DIR, name);
  return fs.statSync(fullPath).isDirectory();
});

let agentsCount = 0;
let planCount = 0;
let tasksCount = 0;
let indexCount = 0;

for (const name of dirs) {
  const dir = path.join(COMPONENTS_DIR, name);
  const indexPath = path.join(dir, "index.md");

  if (!fs.existsSync(indexPath)) {
    console.warn(`SKIP ${name}: no index.md`);
    continue;
  }

  const indexContent = fs.readFileSync(indexPath, "utf8");
  const heading = extractHeading(indexContent) || toTitle(name);
  const sections = extractSections(indexContent);
  const info = componentMap[name] || {
    pascal: toPascal(name),
    description: `a ${name} component`,
  };
  const tag = getTag(name);

  // Generate AGENTS.md
  const agentsMd = generateAgentsMd(name, info, heading, sections, tag);
  fs.writeFileSync(path.join(dir, "AGENTS.md"), agentsMd, "utf8");
  agentsCount++;

  // Generate plan.md
  const planMd = generatePlanMd(name, info, heading, sections, tag);
  fs.writeFileSync(path.join(dir, "plan.md"), planMd, "utf8");
  planCount++;

  // Generate tasks.md
  const tasksMd = generateTasksMd(name, info, heading, sections, tag);
  fs.writeFileSync(path.join(dir, "tasks.md"), tasksMd, "utf8");
  tasksCount++;

  // Upgrade index.md (add missing Styles/Testing sections)
  const { content: upgradedIndex, modified } = upgradeIndexMd(
    name,
    indexContent,
    sections,
    tag,
  );
  if (modified) {
    fs.writeFileSync(indexPath, upgradedIndex, "utf8");
    indexCount++;
  }
}

console.log(
  `Upgraded: ${agentsCount} AGENTS.md, ${planCount} plan.md, ${tasksCount} tasks.md, ${indexCount} index.md`,
);
