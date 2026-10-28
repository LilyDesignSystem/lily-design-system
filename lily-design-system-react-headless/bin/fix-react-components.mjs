#!/usr/bin/env node
/**
 * Post-processing fixes for converted React components.
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const DIR = join(import.meta.dirname, "../components");

const files = readdirSync(DIR)
    .filter((f) => f.endsWith(".tsx"))
    .sort();
let fixed = 0;

for (const file of files) {
    const path = join(DIR, file);
    let content = readFileSync(path, "utf-8");
    const original = content;

    // Fix 1: Remove trailing comma after ...restProps in destructuring
    content = content.replace(/\.\.\.restProps,\n/g, "...restProps\n");

    // Fix 2: Convert for= to htmlFor= in JSX
    content = content.replace(/(<label[^>]*)\bfor=/g, "$1htmlFor=");
    content = content.replace(/(<label)\s+for=/g, "$1 htmlFor=");
    // Handle standalone for= on labels
    content = content.replace(/\bfor=\{/g, "htmlFor={");

    // Fix 3: Fix derived values with trailing comma+semicolon
    content = content.replace(/const\s+(\w+)\s*=\s*([^;]+),;/g, "const $1 = $2;");

    // Fix 4: Fix tabIndex="-1" → tabIndex={-1}
    content = content.replace(/tabIndex="-1"/g, "tabIndex={-1}");
    content = content.replace(/tabIndex="0"/g, "tabIndex={0}");

    // Fix 5: Remove HTML comments that leaked into JSX
    content = content.replace(/<!--[^>]*-->/g, "");

    // Fix 6: Fix onclick → onClick in prop destructuring
    content = content.replace(/(\s+)onclick( =|,|\n)/g, "$1onClick$2");

    // Fix 7: Fix React-incompatible event handler types
    content = content.replace(/event: KeyboardEvent\)/g, "event: React.KeyboardEvent)");
    content = content.replace(/event: MouseEvent\)/g, "event: React.MouseEvent)");

    // Fix 8: Remove legacy HTML comments in JSX (<!-- ... -->)
    content = content.replace(/\{\/\*\s*<!--[^>]*-->\s*\*\/\}/g, "");

    // Fix 9: Fix `<a {href}` → `<a href={href}`
    content = content.replace(/<a\s+\{href\}/g, "<a href={href}");

    if (content !== original) {
        writeFileSync(path, content);
        fixed++;
    }
}

console.log(`Fixed ${fixed}/${files.length} component files`);

// Also fix test files
const testFiles = readdirSync(DIR)
    .filter((f) => f.endsWith(".test.tsx"))
    .sort();
let testFixed = 0;

for (const file of testFiles) {
    const path = join(DIR, file);
    let content = readFileSync(path, "utf-8");
    const original = content;

    // Fix test imports - remove Svelte-specific snippet patterns that leaked through
    content = content.replace(/function \w+Snippet\([^)]*\)\s*\{[\s\S]*?\n\}\n\n?/g, "");

    // Fix render calls that still have Svelte patterns
    // render(Subject, ...) → render(<Subject .../>)
    content = content.replace(/render\(Subject,\s*\{([^}]*)\}\)/g, (match, propsStr) => {
        // Simple case: { label: "..." }
        const props = propsStr.trim();
        const pairs = [];
        const regex = /(\w+):\s*("[^"]*"|'[^']*'|true|false|\d+|vi\.fn\(\)|[^,}]+)/g;
        let m;
        while ((m = regex.exec(props)) !== null) {
            const key = m[1].trim();
            const val = m[2].trim();
            if (val === "true") {
                pairs.push(key);
            } else if (val.startsWith('"') || val.startsWith("'")) {
                pairs.push(`${key}=${val}`);
            } else {
                pairs.push(`${key}={${val}}`);
            }
        }
        return `render(<Subject ${pairs.join(" ")} />)`;
    });

    if (content !== original) {
        writeFileSync(path, content);
        testFixed++;
    }
}

console.log(`Fixed ${testFixed}/${testFiles.length} test files`);
