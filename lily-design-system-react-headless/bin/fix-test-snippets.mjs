#!/usr/bin/env node
/**
 * Fixes remaining Svelte snippet references in React test files
 * by reading the original Svelte test and properly converting render calls.
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, basename } from "path";

const REACT_DIR = join(import.meta.dirname, "../components");
const SVELTE_DIR = join(import.meta.dirname, "../../lily-plus-svelte/components");

const testFiles = readdirSync(REACT_DIR)
    .filter((f) => f.endsWith(".test.tsx"))
    .sort();

let fixed = 0;

for (const file of testFiles) {
    const reactPath = join(REACT_DIR, file);
    let content = readFileSync(reactPath, "utf-8");

    // Skip if no snippet references
    if (!content.includes("Snippet")) continue;

    const componentName = basename(file, ".test.tsx");

    // Read original Svelte test
    let svelteTest;
    try {
        svelteTest = readFileSync(join(SVELTE_DIR, `${componentName}.test.ts`), "utf-8");
    } catch {
        continue;
    }

    // Full rewrite: convert the Svelte test to React
    let result = svelteTest;

    // Fix imports
    result = result.replace(
        /import\s*\{[^}]*\}\s*from\s*["']@testing-library\/svelte["'];?/,
        'import { render, screen } from "@testing-library/react";',
    );
    result = result.replace(
        /import\s+Subject\s+from\s+["'].\/\w+\.svelte["'];?/,
        `import Subject from "./${componentName}";`,
    );

    // Extract snippet function definitions for understanding what they create
    // Then replace render calls with proper JSX

    // Remove all snippet function definitions
    result = result.replace(/\/\/ Helper[\s\S]*?^}\n\n?/gm, "");
    result = result.replace(/^function \w+Snippet[\s\S]*?^}\n\n?/gm, "");

    // Convert render calls with children snippets
    // Pattern: render(Subject, { props: { children: textSnippet("text"), key: val } })
    result = result.replace(
        /render\(Subject,\s*\{\s*props:\s*\{([\s\S]*?)\}\s*\}\)/g,
        (match, propsStr) => {
            let props = propsStr.trim();

            // Extract children from various snippet patterns
            let childContent = null;

            // textSnippet("text")
            const textMatch = props.match(/children:\s*textSnippet\(["']([^"']*)["']\)/);
            if (textMatch) {
                childContent = textMatch[1];
                props = props.replace(/,?\s*children:\s*textSnippet\(["'][^"']*["']\)/, "");
            }

            // trSnippet() - creates a <tr> with cells
            const trMatch = props.match(/children:\s*trSnippet\(\)/);
            if (trMatch) {
                childContent = "<tr><td>Cell</td></tr>";
                props = props.replace(/,?\s*children:\s*trSnippet\(\)/, "");
            }

            // tdSnippet() - creates a <td>
            const tdMatch = props.match(/children:\s*tdSnippet\(\)/);
            if (tdMatch) {
                childContent = "<td>Cell</td>";
                props = props.replace(/,?\s*children:\s*tdSnippet\(\)/, "");
            }

            // treeItemsSnippet() - creates tree items
            const treeMatch = props.match(/children:\s*treeItemsSnippet\(\)/);
            if (treeMatch) {
                childContent =
                    '<li role="treeitem" tabIndex={-1}>Item 1</li><li role="treeitem" tabIndex={-1}>Item 2</li>';
                props = props.replace(/,?\s*children:\s*treeItemsSnippet\(\)/, "");
            }

            // Generic snippet: someSnippet(...)
            const genericMatch = props.match(/children:\s*(\w+Snippet)\(([^)]*)\)/);
            if (genericMatch && !childContent) {
                childContent = "Content";
                props = props.replace(/,?\s*children:\s*\w+Snippet\([^)]*\)/, "");
            }

            // Clean up props
            props = props.trim().replace(/^,\s*/, "").replace(/,\s*$/, "");

            // Build JSX attrs
            const jsxAttrs = [];
            if (props) {
                const regex =
                    /(?:"([^"]+)"|\b(\w+))\s*:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|vi\.fn\(\)|true|false|\d+|[^,}\n]+)/g;
                let m;
                while ((m = regex.exec(props)) !== null) {
                    const key = m[1] || m[2];
                    let val = m[3].trim();
                    if (key === "children") continue;

                    if (val === "true") {
                        jsxAttrs.push(key);
                    } else if (val.startsWith('"') || val.startsWith("'")) {
                        jsxAttrs.push(`${key}=${val}`);
                    } else {
                        jsxAttrs.push(`${key}={${val}}`);
                    }
                }
            }

            const attrStr = jsxAttrs.length > 0 ? " " + jsxAttrs.join(" ") : "";

            if (childContent) {
                return `render(<Subject${attrStr}>${childContent}</Subject>)`;
            } else {
                return `render(<Subject${attrStr} />)`;
            }
        },
    );

    // Clean up any remaining snippet references
    result = result.replace(/textSnippet\(["']([^"']*)["']\)/g, '"$1"');

    writeFileSync(reactPath, result);
    fixed++;
}

console.log(`Fixed ${fixed} test files with snippet references`);
