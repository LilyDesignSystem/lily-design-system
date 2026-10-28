#!/usr/bin/env node
/**
 * Converts Svelte 5 headless components to React headless components.
 *
 * Reads from ../lily-plus-svelte/components/
 * Writes to ./components/
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, basename } from "path";

const SVELTE_DIR = join(import.meta.dirname, "../../lily-plus-svelte/components");
const REACT_DIR = join(import.meta.dirname, "../components");

mkdirSync(REACT_DIR, { recursive: true });

const svelteFiles = readdirSync(SVELTE_DIR)
    .filter((f) => f.endsWith(".svelte"))
    .sort();

console.log(`Found ${svelteFiles.length} Svelte components to convert`);

function toKebab(name) {
    return name
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .toLowerCase();
}

/**
 * Parse the Svelte component into script content and template.
 */
function parseSvelte(content) {
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    const scriptContent = scriptMatch ? scriptMatch[1] : "";
    const templateStart = content.indexOf("</script>") + "</script>".length;
    const template = content.substring(templateStart).trim();
    return { scriptContent, template };
}

/**
 * Extract the comment block from the top of the script.
 */
function extractCommentBlock(scriptContent) {
    const lines = scriptContent.split("\n");
    const commentLines = [];
    let started = false;

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("//")) {
            started = true;
            commentLines.push(trimmed);
        } else if (started && trimmed === "") {
            // blank line within comment is ok, but stop if non-comment follows
        } else if (started) {
            break;
        }
    }

    let comment = commentLines.join("\n");
    // Convert Svelte references to React
    comment = comment.replace(/Snippet/g, "ReactNode");
    comment = comment.replace(/bind:value/g, "value + onChange");
    comment = comment.replace(/\$bindable\([^)]*\)/g, "controlled");
    comment = comment.replace(/\$props\(\)/g, "props");
    comment = comment.replace(/\$state\([^)]*\)/g, "useState()");
    comment = comment.replace(/\$derived\([^)]*\)/g, "computed");
    comment = comment.replace(/Svelte 5 runes/g, "React hooks");
    comment = comment.replace(/Svelte 5/g, "React");
    comment = comment.replace(/children snippet/g, "children prop");
    return comment;
}

/**
 * Extract props from the $props() destructuring.
 */
function extractProps(scriptContent) {
    const propsMatch = scriptContent.match(
        /let\s*\{([\s\S]*?)\}\s*:\s*\{([\s\S]*?)\}\s*=\s*\$props\(\)/,
    );

    if (!propsMatch) return { entries: [], typeBlock: "", hasChildren: false, hasBindable: [] };

    const destructuring = propsMatch[1];
    const typeBlock = propsMatch[2];
    const hasChildren = typeBlock.includes("children");
    const entries = parseDestructuring(destructuring);
    const hasBindable = entries.filter((e) => e.isBindable);

    return { entries, typeBlock, hasChildren, hasBindable };
}

function parseDestructuring(str) {
    if (!str) return [];
    const entries = [];
    const lines = str.split("\n");

    for (const line of lines) {
        const trimmed = line.trim().replace(/,$/, "");
        if (!trimmed || trimmed.startsWith("...")) continue;

        // class: className = ""
        const aliasMatch = trimmed.match(/^(\w+)\s*:\s*(\w+)\s*=\s*(.+)/);
        if (aliasMatch) {
            entries.push({
                name: aliasMatch[2],
                alias: aliasMatch[1],
                defaultValue: aliasMatch[3],
                isBindable: false,
            });
            continue;
        }

        // value = $bindable("")
        const bindableMatch = trimmed.match(/^(\w+)\s*=\s*\$bindable\(([^)]*)\)/);
        if (bindableMatch) {
            entries.push({
                name: bindableMatch[1],
                defaultValue: bindableMatch[2] || undefined,
                isBindable: true,
            });
            continue;
        }

        // name = defaultValue
        const defaultMatch = trimmed.match(/^(\w+)\s*=\s*(.+)/);
        if (defaultMatch) {
            entries.push({
                name: defaultMatch[1],
                defaultValue: defaultMatch[2],
                isBindable: false,
            });
            continue;
        }

        // bare name
        const nameMatch = trimmed.match(/^(\w+)$/);
        if (nameMatch) {
            entries.push({
                name: nameMatch[1],
                defaultValue: undefined,
                isBindable: false,
            });
        }
    }

    return entries;
}

/**
 * Build the React props interface from the Svelte type block.
 */
function buildPropsInterface(componentName, typeBlock, hasChildren, hasBindable) {
    if (!typeBlock) {
        return `export interface ${componentName}Props {\n    className?: string;\n    children?: React.ReactNode;\n    [key: string]: unknown;\n}`;
    }

    const lines = typeBlock.trim().split("\n");
    const result = [`export interface ${componentName}Props {`, `    className?: string;`];

    for (const line of lines) {
        let trimmed = line.trim();
        if (!trimmed || trimmed.includes("[key: string]")) continue;
        if (trimmed.includes("Snippet")) {
            trimmed = trimmed.replace(/Snippet/g, "React.ReactNode");
        }
        // Convert onclick to onClick in type annotations
        trimmed = trimmed.replace(/\bonclick\b/g, "onClick");
        trimmed = trimmed.replace(/\bonkeydown\b/g, "onKeyDown");
        trimmed = trimmed.replace(/\bonchange\b/g, "onInputChange");
        trimmed = trimmed.replace(/MouseEvent/g, "React.MouseEvent");
        result.push(`    ${trimmed}`);
    }

    // Add onChange for bindable props
    for (const b of hasBindable) {
        const typeMatch = typeBlock.match(new RegExp(`${b.name}\\??:\\s*([^;]+)`));
        let propType = typeMatch
            ? typeMatch[1]
                  .trim()
                  .replace(/;$/, "")
                  .replace(/\/\/.*$/, "")
                  .trim()
            : "unknown";
        result.push(`    /** Callback when ${b.name} changes. */`);
        result.push(`    onChange?: (value: ${propType}) => void;`);
    }

    result.push(`    [key: string]: unknown;`);
    result.push(`}`);
    return result.join("\n");
}

/**
 * Extract additional logic from script (const declarations, derived values, functions).
 * Returns array of code lines (indented with 4 spaces).
 */
function extractLogic(scriptContent, hasBindable) {
    const result = [];

    // Collect $derived values
    const derivedRegex = /let\s+(\w+)\s*=\s*\$derived\(\s*([\s\S]*?)\s*\);/g;
    for (const m of scriptContent.matchAll(derivedRegex)) {
        result.push(`    const ${m[1]} = ${m[2].trim()};`);
    }

    // Collect const declarations that aren't $state/$derived/$props
    // but also aren't inside functions
    const constRegex = /^    (const\s+\w+\s*=\s*(?!\$)[^;]+;)/gm;
    for (const m of scriptContent.matchAll(constRegex)) {
        const line = m[1].trim();
        // Skip if this const is inside a function (check indentation context)
        if (!line.includes("$state") && !line.includes("$derived") && !line.includes("$props")) {
            result.push(`    ${line}`);
        }
    }

    // Collect functions (using a more robust extraction)
    const funcRegex = /^    function\s+(\w+)\s*\(([^)]*)\)\s*\{/gm;
    let funcMatch;
    while ((funcMatch = funcRegex.exec(scriptContent)) !== null) {
        const funcStart = funcMatch.index;
        const funcName = funcMatch[1];
        // Find the matching closing brace
        let braceCount = 0;
        let funcEnd = funcStart;
        let inFunc = false;
        for (let i = funcStart; i < scriptContent.length; i++) {
            if (scriptContent[i] === "{") {
                braceCount++;
                inFunc = true;
            } else if (scriptContent[i] === "}") {
                braceCount--;
                if (inFunc && braceCount === 0) {
                    funcEnd = i + 1;
                    break;
                }
            }
        }

        let funcBody = scriptContent.substring(funcStart, funcEnd).trim();

        // Rename event handlers to React convention
        funcBody = funcBody.replace(/^function onkeydown/, "function handleKeyDown");
        funcBody = funcBody.replace(/^function onclick/, "function handleClick");
        funcBody = funcBody.replace(/^function onchange/, "function handleChange");
        funcBody = funcBody.replace(/^function oninput/, "function handleInput");

        // For bindable props, convert direct assignment to onChange callback
        for (const b of hasBindable) {
            // Convert `open = false` → `onChange?.(false)` etc.
            const assignRegex = new RegExp(`\\b${b.name}\\s*=\\s*([^;]+);`, "g");
            funcBody = funcBody.replace(assignRegex, `onChange?.($1);`);
        }

        // Fix barRef (useRef) - need .current
        funcBody = funcBody.replace(/if\s*\(!(\w+)\)\s*return;/g, (match, refName) => {
            if (
                scriptContent.includes(`${refName}: HTMLElement | undefined = $state(undefined)`) ||
                scriptContent.includes(`${refName} = $state(undefined)`)
            ) {
                return `if (!${refName}.current) return;`;
            }
            return match;
        });
        // Fix ref.querySelectorAll → ref.current.querySelectorAll
        funcBody = funcBody.replace(/(\w+Ref)\.querySelectorAll/g, "$1.current.querySelectorAll");
        funcBody = funcBody.replace(/(\w+Ref)\.querySelector\b/g, "$1.current.querySelector");

        result.push(`    ${funcBody}`);
    }

    return result;
}

/**
 * Convert Svelte template to React JSX with proper formatting.
 */
function convertTemplateToJSX(template, hasBindable) {
    let jsx = template;

    // Remove <!-- Component.svelte --> comments
    jsx = jsx.replace(/<!--\s*\w+\.svelte\s*-->\n?/g, "");

    // Convert class= to className=
    jsx = jsx.replace(/\bclass=\{/g, "className={");
    jsx = jsx.replace(/\bclass="/g, 'className="');

    // Convert bind:this={ref} to ref={ref}
    jsx = jsx.replace(/bind:this=\{(\w+)\}/g, "ref={$1}");

    // Convert bind:value to value={value} onChange handler
    jsx = jsx.replace(/bind:value/g, "value={value} onChange={(e) => onChange?.(e.target.value)}");

    // Convert {#if}...{:else}...{/if} blocks
    jsx = convertIfBlocks(jsx);

    // Convert {#each}...{/each} blocks
    jsx = convertEachBlocks(jsx);

    // Convert {@render children()} to {children}
    jsx = jsx.replace(/\{@render\s+children\(\)\}/g, "{children}");

    // Convert Svelte shorthand attributes {varName} to varName={varName}
    // But NOT inside JSX expressions like {children} or {heading}
    // Match standalone {word} that aren't part of other expressions
    jsx = convertShorthandAttributes(jsx);

    // Convert tabindex to tabIndex
    jsx = jsx.replace(/\btabindex=/g, "tabIndex=");

    // Convert Svelte event handler names to React camelCase
    const eventMap = {
        onclick: "onClick",
        onkeydown: "onKeyDown",
        onkeyup: "onKeyUp",
        onchange: "onChange",
        oninput: "onInput",
        onfocus: "onFocus",
        onblur: "onBlur",
        onsubmit: "onSubmit",
        onreset: "onReset",
        onmousedown: "onMouseDown",
        onmouseup: "onMouseUp",
        onmouseover: "onMouseOver",
        onmouseout: "onMouseOut",
        onmousemove: "onMouseMove",
        onmouseenter: "onMouseEnter",
        onmouseleave: "onMouseLeave",
        ondragstart: "onDragStart",
        ondragover: "onDragOver",
        ondrop: "onDrop",
        ontouchstart: "onTouchStart",
        ontouchmove: "onTouchMove",
        ontouchend: "onTouchEnd",
        onscroll: "onScroll",
        oncontextmenu: "onContextMenu",
    };

    for (const [svelte, react] of Object.entries(eventMap)) {
        // Attribute form: onclick={handler}
        jsx = jsx.replace(new RegExp(`\\b${svelte}=\\{`, "g"), `${react}={`);
        // Shorthand form: {onclick} was already converted, but the name is still svelte
    }

    // Convert {onkeydown} → onKeyDown={handleKeyDown}
    jsx = jsx.replace(/\bonKeyDown=\{onkeydown\}/g, "onKeyDown={handleKeyDown}");
    jsx = jsx.replace(/\bonClick=\{onclick\}/g, "onClick={onClick}");

    // Convert onchange handler inside each/map for bindable radio/checkbox
    for (const b of hasBindable) {
        jsx = jsx.replace(
            new RegExp(`onChange=\\{\\(\\)\\s*=>\\s*\\(${b.name}\\s*=\\s*([^)]+)\\)\\}`, "g"),
            `onChange={() => onChange?.($1)}`,
        );
        jsx = jsx.replace(
            new RegExp(`onChange=\\{\\(\\)\\s*=>\\s*${b.name}\\s*=\\s*([^}]+)\\}`, "g"),
            `onChange={() => onChange?.($1)}`,
        );
    }

    return jsx.trim();
}

/**
 * Convert Svelte shorthand attributes {varName} in HTML tags to varName={varName}.
 * Must be careful not to convert content expressions like {children} or {heading}
 * that appear between tags (not as attributes).
 */
function convertShorthandAttributes(jsx) {
    // In Svelte, {disabled} inside an opening tag means disabled={disabled}.
    // We need to distinguish attributes from content.
    // Strategy: find shorthand {word} that appear inside opening tags.

    // Known attributes that use shorthand in Svelte
    const knownShorthandAttrs = [
        "type",
        "disabled",
        "name",
        "role",
        "required",
        "checked",
        "value",
        "href",
        "src",
        "alt",
        "placeholder",
        "id",
        "hidden",
        "open",
        "method",
        "action",
        "target",
        "autocomplete",
        "autofocus",
        "min",
        "max",
        "step",
        "pattern",
        "multiple",
        "readonly",
        "tabindex",
        "title",
        "lang",
        "dir",
        "cols",
        "rows",
        "width",
        "height",
        "loading",
        "sizes",
    ];

    // Replace {attrName} when it appears as an attribute (after a tag name or another attribute)
    for (const attr of knownShorthandAttrs) {
        // Match {attr} when preceded by whitespace and inside what looks like an opening tag
        // Using a simple replacement: if {attr} appears on a line with < and before >, it's an attribute
        jsx = jsx.replace(new RegExp(`(\\s)\\{${attr}\\}`, "g"), `$1${attr}={${attr}}`);
    }

    // Also handle event handler shorthands: {onclick} {onkeydown} etc.
    jsx = jsx.replace(/(\s)\{onkeydown\}/g, "$1onKeyDown={handleKeyDown}");
    jsx = jsx.replace(/(\s)\{onclick\}/g, "$1onClick={onClick}");
    jsx = jsx.replace(/(\s)\{onchange\}/g, "$1onChange={handleChange}");

    return jsx;
}

function convertIfBlocks(jsx) {
    let result = jsx;
    let maxIterations = 50;

    while (maxIterations-- > 0) {
        // {#if cond}...{:else if cond2}...{:else}...{/if}
        const elseIfMatch = result.match(
            /\{#if\s+([^}]+)\}([\s\S]*?)\{:else\s+if\s+([^}]+)\}([\s\S]*?)\{:else\}([\s\S]*?)\{\/if\}/,
        );
        if (elseIfMatch) {
            const [full, cond1, content1, cond2, content2, content3] = elseIfMatch;
            result = result.replace(
                full,
                `{${cond1.trim()} ? (<>${content1.trim()}</>) : ${cond2.trim()} ? (<>${content2.trim()}</>) : (<>${content3.trim()}</>)}`,
            );
            continue;
        }

        // {#if cond}...{:else}...{/if}
        const ifElseMatch = result.match(/\{#if\s+([^}]+)\}([\s\S]*?)\{:else\}([\s\S]*?)\{\/if\}/);
        if (ifElseMatch) {
            const [full, cond, ifContent, elseContent] = ifElseMatch;
            result = result.replace(
                full,
                `{${cond.trim()} ? (<>${ifContent.trim()}</>) : (<>${elseContent.trim()}</>)}`,
            );
            continue;
        }

        // {#if cond}...{/if}
        const ifMatch = result.match(/\{#if\s+([^}]+)\}([\s\S]*?)\{\/if\}/);
        if (ifMatch) {
            const [full, cond, content] = ifMatch;
            result = result.replace(full, `{${cond.trim()} && (<>${content.trim()}</>)}`);
            continue;
        }

        break;
    }

    return result;
}

function convertEachBlocks(jsx) {
    let result = jsx;
    let maxIterations = 20;

    while (maxIterations-- > 0) {
        const eachMatch = result.match(
            /\{#each\s+(\w+)\s+as\s+(\w+)(?:,\s*(\w+))?\}([\s\S]*?)\{\/each\}/,
        );
        if (eachMatch) {
            const [full, arr, item, index, content] = eachMatch;
            const params = index ? `(${item}, ${index})` : `(${item})`;
            result = result.replace(
                full,
                `{${arr}.map(${params} => (<React.Fragment key={${item}}>${content.trim()}</React.Fragment>))}`,
            );
            continue;
        }
        break;
    }

    return result;
}

/**
 * Build the full React component file.
 */
function buildReactComponent(componentName, svelteContent) {
    const { scriptContent, template } = parseSvelte(svelteContent);
    const { entries, typeBlock, hasChildren, hasBindable } = extractProps(scriptContent);

    const comment = extractCommentBlock(scriptContent);

    // Determine React imports needed
    const hasRef = scriptContent.includes("$state(undefined)") && template.includes("bind:this");
    const hasState =
        scriptContent.includes("$state(") &&
        !template.includes("bind:this") &&
        !(entries.every((e) => !e.isBindable) && scriptContent.match(/\$state\(undefined\)/));
    const hasDerived = scriptContent.includes("$derived(");

    const hooks = [];
    if (hasRef) hooks.push("useRef");
    if (hasState) hooks.push("useState");

    let importLine;
    if (hooks.length > 0) {
        importLine = `import React, { ${hooks.join(", ")} } from "react";`;
    } else {
        importLine = `import React from "react";`;
    }

    // Build props interface
    const propsInterface = buildPropsInterface(componentName, typeBlock, hasChildren, hasBindable);

    // Build component parameter destructuring
    const paramLines = ['    className = ""'];
    for (const entry of entries) {
        if (entry.alias === "class" || entry.name === "className") continue;
        if (entry.name === "children") continue;
        const def = entry.defaultValue !== undefined ? ` = ${entry.defaultValue}` : "";
        paramLines.push(`    ${entry.name}${def}`);
    }
    if (hasBindable.length > 0) {
        paramLines.push("    onChange");
    }
    if (hasChildren) {
        paramLines.push("    children");
    }
    paramLines.push("    ...restProps");

    // Extract additional logic
    const logic = extractLogic(scriptContent, hasBindable);

    // Build ref declaration if needed
    let refDecl = "";
    if (hasRef) {
        const refMatch = scriptContent.match(
            /let\s+(\w+)(?::\s*[^=]+)?\s*=\s*\$state\(undefined\)/,
        );
        if (refMatch) {
            refDecl = `    const ${refMatch[1]} = useRef<HTMLElement>(null);`;
        }
    }

    // Convert template to JSX
    let jsx = convertTemplateToJSX(template, hasBindable);

    // Fix ref usage in JSX (ref already converted from bind:this)

    // Indent JSX properly
    jsx = indentJSX(jsx, 8);

    // Determine if the JSX starts with a conditional (no wrapping element)
    const needsFragmentWrap = jsx.trimStart().startsWith("{");

    // Build the component
    let component = `${comment}

${importLine}

${propsInterface}

export default function ${componentName}({
${paramLines.join(",\n")},
}: ${componentName}Props) {
`;

    if (refDecl) {
        component += `${refDecl}\n\n`;
    }

    if (logic.length > 0) {
        component += logic.join("\n\n") + "\n\n";
    }

    if (needsFragmentWrap) {
        component += `    return (\n        <>\n${jsx}\n        </>\n    );\n`;
    } else {
        component += `    return (\n${jsx}\n    );\n`;
    }

    component += `}\n`;

    return component;
}

/**
 * Indent JSX block to the given base indentation level.
 */
function indentJSX(jsx, baseIndent) {
    const indent = " ".repeat(baseIndent);
    return jsx
        .split("\n")
        .map((line) => (line.trim() ? indent + line.trimStart() : ""))
        .join("\n");
}

/**
 * Build the test file.
 */
function buildReactTest(componentName, svelteTestContent) {
    if (!svelteTestContent) {
        return `import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./${componentName}";

describe("${componentName}", () => {
    test("renders", () => {
        render(<Subject />);
    });
});
`;
    }

    let test = svelteTestContent;

    // Replace svelte testing library import
    test = test.replace(
        /import\s*\{[^}]*\}\s*from\s*["']@testing-library\/svelte["'];?/g,
        'import { render, screen } from "@testing-library/react";',
    );

    // Replace component import
    test = test.replace(
        /import\s+Subject\s+from\s+["']\.\/\w+\.svelte["'];?/g,
        `import Subject from "./${componentName}";`,
    );

    // Remove textSnippet helper and all snippet helpers
    test = test.replace(/\/\/ Helper to create[\s\S]*?\n}\n\n?/g, "");
    test = test.replace(/function textSnippet[\s\S]*?\n}\n\n?/g, "");
    test = test.replace(/function \w+Snippet[\s\S]*?\n}\n\n?/g, "");

    // Convert render(Subject, { props: { ... } }) to render(<Subject ...>...</Subject>)
    test = test.replace(
        /render\(Subject,\s*\{\s*props:\s*\{([\s\S]*?)\}\s*\}\)/g,
        (match, propsStr) => convertRenderCall(propsStr),
    );

    return test;
}

function convertRenderCall(propsStr) {
    let props = propsStr.trim();

    // Extract children from textSnippet("...")
    const childrenMatch = props.match(/children:\s*textSnippet\(["']([^"']*)["']\)/);
    let childContent = null;

    if (childrenMatch) {
        childContent = childrenMatch[1];
        props = props.replace(/,?\s*children:\s*textSnippet\(["'][^"']*["']\)/, "");
    }

    // Check for other snippet children
    const otherSnippetMatch = props.match(/children:\s*(\w+Snippet)\(\)/);
    if (otherSnippetMatch) {
        childContent = "Content";
        props = props.replace(/,?\s*children:\s*\w+Snippet\(\)/, "");
    }

    props = props.trim().replace(/^,\s*/, "").replace(/,\s*$/, "");

    // Parse remaining props into JSX attributes
    const jsxAttrs = [];
    if (props) {
        // Match key: value pairs (handles quoted keys like "data-testid")
        const regex =
            /(?:"([^"]+)"|\b(\w+))\s*:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\{[^}]*\}|vi\.fn\(\)|[^,}\n]+)/g;
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
}

/**
 * Convert the .md documentation.
 */
function convertMd(componentName, svelteMd) {
    if (!svelteMd) return `# ${componentName}\n`;

    let md = svelteMd;
    md = md.replace(/```svelte/g, "```tsx");
    md = md.replace(/<script lang="ts">/g, "");
    md = md.replace(/<\/script>/g, "");
    md = md.replace(/import\s+(\w+)\s+from\s+'\.\/(\w+)\.svelte'/g, "import $1 from './$2'");
    md = md.replace(/\$state\(/g, "useState(");
    md = md.replace(/bind:value=\{(\w+)\}/g, "value={$1} onChange={set$1}");
    md = md.replace(/bind:value/g, "value + onChange");
    md = md.replace(/\bSnippet\b/g, "ReactNode");
    md = md.replace(/\$bindable\([^)]*\)/g, "controlled");
    md = md.replace(/onclick=/g, "onClick=");
    return md;
}

// Main conversion loop
let converted = 0;
const errors = [];

for (const file of svelteFiles) {
    const componentName = basename(file, ".svelte");

    try {
        const svelteContent = readFileSync(join(SVELTE_DIR, file), "utf-8");

        let testContent = null;
        try {
            testContent = readFileSync(join(SVELTE_DIR, `${componentName}.test.ts`), "utf-8");
        } catch {}

        let mdContent = null;
        try {
            mdContent = readFileSync(join(SVELTE_DIR, `${componentName}.md`), "utf-8");
        } catch {}

        const reactComponent = buildReactComponent(componentName, svelteContent);
        const reactTest = buildReactTest(componentName, testContent);
        const reactMd = convertMd(componentName, mdContent);

        writeFileSync(join(REACT_DIR, `${componentName}.tsx`), reactComponent);
        writeFileSync(join(REACT_DIR, `${componentName}.test.tsx`), reactTest);
        writeFileSync(join(REACT_DIR, `${componentName}.md`), reactMd);

        converted++;
    } catch (err) {
        errors.push({ component: componentName, error: err.message });
        console.error(`Error converting ${componentName}: ${err.message}`);
    }
}

console.log(`\nConverted ${converted}/${svelteFiles.length} components`);
if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    for (const e of errors) {
        console.log(`  ${e.component}: ${e.error}`);
    }
}
