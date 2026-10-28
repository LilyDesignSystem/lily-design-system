#!/usr/bin/env node
// Svelte 5 → Vue 3 headless component converter
import fs from "fs";
import path from "path";

const srcDir = "/Users/jph/git/lilydesignsystem/lily-plus-svelte/components";
const destDir = "/Users/jph/git/lilydesignsystem/lily-design-system-vue-headless/components";

fs.mkdirSync(destDir, { recursive: true });

// Get all files
const allFiles = fs.readdirSync(srcDir);
const svelteFiles = allFiles.filter((f) => f.endsWith(".svelte"));
const testFiles = allFiles.filter((f) => f.endsWith(".test.ts"));
const mdFiles = allFiles.filter((f) => f.endsWith(".md"));

let successCount = 0;
let errorCount = 0;
const errors = [];

// Convert .svelte → .vue
for (const file of svelteFiles) {
    const name = file.replace(".svelte", "");
    const content = fs.readFileSync(path.join(srcDir, file), "utf8");
    try {
        const vue = convertComponent(content, name);
        fs.writeFileSync(path.join(destDir, `${name}.vue`), vue);
        successCount++;
    } catch (err) {
        errors.push(`${name}: ${err.message}`);
        errorCount++;
    }
}

// Convert .test.ts
for (const file of testFiles) {
    const content = fs.readFileSync(path.join(srcDir, file), "utf8");
    fs.writeFileSync(path.join(destDir, file), convertTest(content, file));
}

// Copy .md
for (const file of mdFiles) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
}

console.log(`Components: ${successCount} ok, ${errorCount} errors`);
console.log(`Tests: ${testFiles.length} converted`);
console.log(`Docs: ${mdFiles.length} copied`);
if (errors.length) {
    console.log("\nErrors:");
    errors.forEach((e) => console.log(`  ${e}`));
}

// ─── Component conversion ───────────────────────────────────────────────

function convertComponent(content, name) {
    // Split into script and template
    const scriptMatch = content.match(/<script lang="ts">([\s\S]*?)<\/script>/);
    if (!scriptMatch) throw new Error("No script tag found");

    const scriptBody = scriptMatch[1];
    const afterScript = content.slice(scriptMatch.index + scriptMatch[0].length).trim();

    // Parse the script
    const parsed = parseScript(scriptBody);

    // Build Vue script
    const vueScript = buildVueScript(parsed, name);

    // Build Vue template
    const vueTemplate = buildVueTemplate(afterScript, parsed, name);

    return `<script setup lang="ts">\n${vueScript}</script>\n\n<template>\n${vueTemplate}\n</template>\n`;
}

// ─── Script parsing ─────────────────────────────────────────────────────

function parseScript(script) {
    const result = {
        commentBlock: "",
        props: [], // { name, type, default, required, comment, optional }
        bindables: [], // { name, type, default, comment }
        stateVars: [], // { name, type, init }
        derivedVars: [], // { name, expr }
        effects: [], // string[]
        functions: [], // { text }
        constants: [], // { text }
        hasChildren: false,
        hasOptionalChildren: false,
        needsPropsVar: false, // true if derived/functions reference props
    };

    const lines = script.split("\n");

    // Extract leading comment block
    let commentEnd = 0;
    for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();
        if (t === "" || t.startsWith("//")) {
            commentEnd = i + 1;
        } else break;
    }
    result.commentBlock = lines.slice(0, commentEnd).join("\n");

    // Rest of script after comments
    const rest = lines.slice(commentEnd).join("\n");

    // Check for children
    result.hasChildren = /\bchildren\b/.test(rest);
    result.hasOptionalChildren =
        /children\s*=\s*undefined/.test(rest) || /children\?\s*:/.test(rest);

    // ── Parse $props() destructuring ──
    // Match the full let { ... }: { ... } = $props();
    const propsBlock = rest.match(
        /let\s*\{([\s\S]*?)\}\s*:\s*\{([\s\S]*?)\}\s*=\s*\$props\(\)\s*;?/,
    );
    if (propsBlock) {
        const destructuring = propsBlock[1];
        const typeBlock = propsBlock[2];

        // Parse type annotations first to build a type map
        const typeMap = {};
        // Match lines like: /** comment */ name?: type;  OR  name: type;  OR  [key: string]: unknown;
        const typeRegex = /(?:\/\*\*\s*(.*?)\s*\*\/\s*\n?\s*)?(\w+)(\??)\s*:\s*(.+?)\s*;?\s*$/gm;
        let tm;
        while ((tm = typeRegex.exec(typeBlock)) !== null) {
            const [, comment, tName, optional, tType] = tm;
            if (tName === "children" || tType.includes("[key:")) continue;
            typeMap[tName] = {
                type: tType.replace(/;$/, "").trim(),
                optional: optional === "?",
                comment: comment?.trim(),
            };
        }

        // Parse destructured props
        // Split by comma, handling multiline
        const propEntries = splitProps(destructuring);

        for (const entry of propEntries) {
            const trimmed = entry.trim();
            if (!trimmed || trimmed === "children" || trimmed.startsWith("...")) continue;

            // class: className = ""
            if (/^class\s*:\s*className/.test(trimmed)) continue;

            // key: alias = default (destructured rename, e.g., for: forProp = undefined)
            const renameMatch = trimmed.match(/^(\w+)\s*:\s*(\w+)\s*=\s*(.+)$/);
            if (renameMatch) {
                const [, origName, aliasName, pDefault] = renameMatch;
                // Skip event handler props
                if (/^on[a-z]/.test(origName)) continue;
                const ti = typeMap[origName] || typeMap[aliasName] || {};
                // In Vue, use the original HTML attribute name
                // For "for" → use "htmlFor" or just keep the alias
                result.props.push({
                    name: aliasName,
                    type: ti.type || "string",
                    default: pDefault.trim().replace(/,$/, ""),
                    required: false,
                    comment: ti.comment,
                    optional: true,
                });
                continue;
            }

            // name = $bindable(default)
            const bindMatch = trimmed.match(/^(\w+)\s*=\s*\$bindable\(([^)]*)\)/);
            if (bindMatch) {
                const [, bName, bDefault] = bindMatch;
                const ti = typeMap[bName] || {};
                result.bindables.push({
                    name: bName,
                    type: ti.type,
                    default: bDefault || undefined,
                    comment: ti.comment,
                });
                continue;
            }

            // name = default
            const defMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
            if (defMatch) {
                const [, pName, pDefault] = defMatch;
                // Skip event handler props — they pass through $attrs in Vue
                if (/^on[a-z]/.test(pName)) continue;
                const ti = typeMap[pName] || {};
                result.props.push({
                    name: pName,
                    type: ti.type,
                    default: pDefault.trim().replace(/,$/, ""),
                    required: false,
                    comment: ti.comment,
                    optional: true,
                });
                continue;
            }

            // name (required, no default)
            const reqMatch = trimmed.match(/^(\w+)$/);
            if (reqMatch) {
                // Skip event handler props
                if (/^on[a-z]/.test(reqMatch[1])) continue;
                const ti = typeMap[reqMatch[1]] || {};
                result.props.push({
                    name: reqMatch[1],
                    type: ti.type,
                    default: undefined,
                    required: true,
                    comment: ti.comment,
                    optional: false,
                });
            }
        }
    }

    // ── Parse $state() variables ──
    const stateRegex = /let\s+(\w+)(?:\s*:\s*([^=]+?))?\s*=\s*\$state\(([\s\S]*?)\)\s*;/g;
    let sm;
    while ((sm = stateRegex.exec(rest)) !== null) {
        result.stateVars.push({
            name: sm[1],
            type: sm[2]?.trim(),
            init: sm[3].trim(),
        });
    }
    // Also: let arr: Type[] = $state([]);
    const stateRegex2 = /let\s+(\w+)(?:\s*:\s*([^=]+?))?\s*=\s*\$state\((\[[\s\S]*?\])\)\s*;/g;
    while ((sm = stateRegex2.exec(rest)) !== null) {
        if (!result.stateVars.find((s) => s.name === sm[1])) {
            result.stateVars.push({
                name: sm[1],
                type: sm[2]?.trim(),
                init: sm[3].trim(),
            });
        }
    }

    // ── Parse $derived() variables ──
    const derivedRegex = /let\s+(\w+)\s*=\s*\$derived\(\s*([\s\S]*?)\s*\)\s*;/g;
    let dm;
    while ((dm = derivedRegex.exec(rest)) !== null) {
        result.derivedVars.push({ name: dm[1], expr: dm[2].trim() });
    }

    // ── Parse $effect() blocks ──
    const effectRegex = /\$effect\(\(\)\s*=>\s*\{([\s\S]*?)\}\)\s*;/g;
    let em;
    while ((em = effectRegex.exec(rest)) !== null) {
        result.effects.push(em[1].trim());
    }

    // ── Parse standalone const and let declarations (not $derived/$state/$props) ──
    // Use proper brace-depth tracking to only capture top-level declarations
    const afterPropsRest = propsBlock ? rest.slice(propsBlock.index + propsBlock[0].length) : rest;
    const declRegex =
        /^(\s*(?:const|let)\s+\w+(?:\s*:\s*[^=]+?)?\s*=\s*(?!.*\$(?:derived|state|bindable|props)).*?;)\s*$/gm;
    let cm;
    while ((cm = declRegex.exec(afterPropsRest)) !== null) {
        // Calculate brace depth at this position by scanning char by char
        let depth = 0;
        const beforeConst = afterPropsRest.slice(0, cm.index);
        for (let ci = 0; ci < beforeConst.length; ci++) {
            const ch = beforeConst[ci];
            if (ch === "{") depth++;
            else if (ch === "}") depth--;
        }
        // Only include if at top level (depth 0)
        if (depth === 0) {
            // Convert let → const for Vue (plain let vars become const in setup)
            let decl = cm[1].trim();
            if (decl.startsWith("let ")) {
                decl = "const " + decl.slice(4);
            }
            result.constants.push(decl);
        }
    }

    // ── Parse function definitions ──
    // Find functions at the top level (indentation of 4 spaces)
    const funcRegex = /^( {4}(?:async )?function \w+\([\s\S]*?)\n {4}\}/gm;
    let fm;
    while ((fm = funcRegex.exec(rest)) !== null) {
        result.functions.push({ text: fm[1] + "\n    }" });
    }

    // Check if derived/functions reference prop names (need props. prefix)
    const allDerivedAndFuncText =
        result.derivedVars.map((d) => d.expr).join(" ") +
        result.functions.map((f) => f.text).join(" ") +
        result.effects.join(" ");
    const allPropNames = [
        ...result.props.map((p) => p.name),
        ...result.bindables.map((b) => b.name),
    ];
    for (const pn of allPropNames) {
        // Check if the prop is referenced in derived/functions (not just as part of another word)
        if (new RegExp(`\\b${pn}\\b`).test(allDerivedAndFuncText)) {
            result.needsPropsVar = true;
            break;
        }
    }

    return result;
}

function splitProps(str) {
    // Split prop destructuring by commas, respecting nested structures
    const results = [];
    let depth = 0;
    let current = "";
    for (const ch of str) {
        if (ch === "(" || ch === "{" || ch === "[") depth++;
        if (ch === ")" || ch === "}" || ch === "]") depth--;
        if (ch === "," && depth === 0) {
            results.push(current);
            current = "";
        } else {
            current += ch;
        }
    }
    if (current.trim()) results.push(current);
    return results;
}

// ─── Vue script generation ──────────────────────────────────────────────

function buildVueScript(parsed, name) {
    const parts = [];

    // Comments (updated for Vue)
    let comments = parsed.commentBlock
        .replace(/Svelte 5/g, "Vue 3")
        .replace(/\.svelte\b/g, ".vue")
        .replace(/\$props\(\)/g, "defineProps()")
        .replace(/\$bindable\([^)]*\)/g, "defineModel()")
        .replace(/\$derived\(\)/g, "computed()")
        .replace(/\$state\([^)]*\)/g, "ref()")
        .replace(/children — Snippet, required\. /g, "default slot. ")
        .replace(/children — Snippet[^.]*\./g, "default slot.")
        .replace(/children snippet/g, "default slot")
        .replace(/\bsnippet\b/g, "slot")
        .replace(/bind:value/g, "v-model")
        .replace(/bind:checked/g, "v-model")
        .replace(/bind:open/g, "v-model:open")
        .replace(/bind:visible/g, "v-model:visible")
        .replace(/bind:editing/g, "v-model:editing")
        .replace(/bind:pressed/g, "v-model:pressed")
        .replace(
            /<Button onclick=\{handleClick\}>Click me<\/Button>/g,
            '<Button @click="handleClick">Click me</Button>',
        )
        .replace(/<(\w+)\s+([^>]*)bind:(\w+)=?\{?(\w*)\}?/g, "<$1 $2v-model:$3")
        .replace(/Svelte/g, "Vue");
    parts.push(comments);

    // Imports
    const needsImports = [];
    if (parsed.derivedVars.length) needsImports.push("computed");
    if (parsed.stateVars.length) needsImports.push("ref");
    if (parsed.effects.length) needsImports.push("watchEffect");

    if (needsImports.length) {
        parts.push(`    import { ${needsImports.join(", ")} } from "vue";\n`);
    }

    // Props interface + defaults
    const allProps = parsed.props;
    if (allProps.length || parsed.bindables.length) {
        const propsAssign =
            parsed.needsPropsVar || parsed.derivedVars.length || parsed.functions.length
                ? "const props = "
                : "";
        const interfaceLines = [];
        const defaultLines = [];

        for (const p of allProps) {
            const commentStr = p.comment ? `/** ${p.comment} */\n        ` : "";
            const optMark = p.required ? "" : "?";
            interfaceLines.push(`${commentStr}${p.name}${optMark}: ${p.type || "string"};`);
            if (!p.required && p.default !== undefined) {
                defaultLines.push(`${p.name}: ${p.default},`);
            }
        }

        if (defaultLines.length > 0) {
            parts.push(`    ${propsAssign}withDefaults(defineProps<{`);
            for (const line of interfaceLines) {
                parts.push(`        ${line}`);
            }
            parts.push(`    }>(), {`);
            for (const line of defaultLines) {
                parts.push(`        ${line}`);
            }
            parts.push(`    });\n`);
        } else if (interfaceLines.length > 0) {
            parts.push(`    ${propsAssign}defineProps<{`);
            for (const line of interfaceLines) {
                parts.push(`        ${line}`);
            }
            parts.push(`    }>();\n`);
        }
    }

    // Bindable props → defineModel
    for (const b of parsed.bindables) {
        const modelName = b.name === "value" ? "" : `"${b.name}", `;
        const typeParam = b.type ? `<${b.type}>` : "";
        const defaultStr =
            b.default !== undefined && b.default !== "" ? `{ default: ${b.default} }` : "{}";
        const varName = b.name === "value" ? "modelValue" : b.name;
        parts.push(`    const ${varName} = defineModel${typeParam}(${modelName}${defaultStr});\n`);
    }

    // State vars → ref
    for (const s of parsed.stateVars) {
        const typeParam = s.type ? `<${s.type}>` : "";
        parts.push(`    const ${s.name} = ref${typeParam}(${s.init});\n`);
    }

    // Derived vars → computed
    for (const d of parsed.derivedVars) {
        let expr = d.expr;
        // Add props. prefix for prop references
        for (const p of parsed.props) {
            expr = expr.replace(new RegExp(`\\b${p.name}\\b`, "g"), `props.${p.name}`);
        }
        // Add .value for ref/model references
        for (const s of parsed.stateVars) {
            expr = expr.replace(new RegExp(`\\b${s.name}\\b`, "g"), `${s.name}.value`);
        }
        for (const b of parsed.bindables) {
            const vn = b.name === "value" ? "modelValue" : b.name;
            expr = expr.replace(new RegExp(`\\b${b.name}\\b`, "g"), `${vn}.value`);
        }
        // Strip trailing comma from the expression (Svelte captures it from $derived)
        expr = expr.replace(/,\s*$/, "");
        parts.push(`    const ${d.name} = computed(() =>\n        ${expr},\n    );\n`);
    }

    // Constants
    for (const c of parsed.constants) {
        parts.push(`    ${c}\n`);
    }

    // Functions
    for (const f of parsed.functions) {
        let text = f.text;
        // Add props. prefix for prop references in functions
        for (const p of parsed.props) {
            // Don't add props. if already prefixed with props. or after a dot (e.g., Math.min)
            text = text.replace(
                new RegExp(`(?<!props\\.)(?<!\\.)\\b${p.name}\\b`, "g"),
                `props.${p.name}`,
            );
        }
        // Convert state/bindable references to .value
        // Use (?!\.value) lookahead to skip already-converted refs
        // but still convert ref.querySelector → ref.value.querySelector
        for (const s of parsed.stateVars) {
            text = text.replace(new RegExp(`\\b${s.name}\\b(?!\\.value)`, "g"), `${s.name}.value`);
        }
        for (const b of parsed.bindables) {
            const vn = b.name === "value" ? "modelValue" : b.name;
            text = text.replace(new RegExp(`\\b${b.name}\\b(?!\\.value)`, "g"), `${vn}.value`);
        }
        // Fix double .value.value
        text = text.replace(/\.value\.value/g, ".value");
        parts.push(`${text}\n`);
    }

    // Effects → watchEffect
    for (const e of parsed.effects) {
        let text = e;
        for (const b of parsed.bindables) {
            const vn = b.name === "value" ? "modelValue" : b.name;
            text = text.replace(new RegExp(`\\b${b.name}\\b(?!\\.value)`, "g"), `${vn}.value`);
        }
        for (const s of parsed.stateVars) {
            text = text.replace(new RegExp(`\\b${s.name}\\b(?!\\.value)`, "g"), `${s.name}.value`);
        }
        text = text.replace(/\.value\.value/g, ".value");
        parts.push(`    watchEffect(() => {\n        ${text}\n    });\n`);
    }

    return parts.join("\n") + "\n";
}

// ─── Vue template generation ────────────────────────────────────────────

function buildVueTemplate(svelteTemplate, parsed, name) {
    let t = svelteTemplate;

    // kebab-case class name from PascalCase component name
    const kebab = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

    // ── Remove Svelte-only constructs ──
    t = t.replace(/\s*\{\.\.\.restProps\}/g, "");

    // ── Convert children rendering ──
    // {#if children}{@render children()}{/if} → <slot />
    t = t.replace(/\{#if children\}\s*\{@render children\(\)\}\s*\{\/if\}/g, "<slot />");
    // {@render children()} → <slot />
    t = t.replace(/\{@render children\(\)\}/g, "<slot />");

    // ── Convert class binding ──
    // class={`name ${className}`} → class="name"
    t = t.replace(/class=\{`([^`]*?)\s*\$\{className\}`\}/g, (_, cls) => `class="${cls.trim()}"`);
    // class={`${className}`} → (remove, let attrs handle it)
    t = t.replace(/\s*class=\{`\$\{className\}`\}/g, "");

    // ── Convert control flow: {#if} / {:else} / {/if} ──
    // {#if condition}\n<element → <element v-if="condition"
    t = t.replace(/\{#if\s+(.+?)\}\s*\n(\s*)<(\w+)/g, '$2<$3 v-if="$1"');
    // Same-line: {#if cond}<element → <element v-if="cond"
    t = t.replace(/\{#if\s+(.+?)\}\s*<(\w+)/g, '<$2 v-if="$1"');
    // {:else}\n<element → <element v-else
    t = t.replace(/\{:else\}\s*\n(\s*)<(\w+)/g, "$1<$2 v-else");
    // Same-line: {:else}<element → <element v-else
    t = t.replace(/\{:else\}\s*<(\w+)/g, "<$1 v-else");
    // Remove standalone {/if} (with or without surrounding whitespace)
    t = t.replace(/^\s*\{\/if\}\s*$/gm, "");
    // Remove inline {/if}
    t = t.replace(/\{\/if\}/g, "");

    // ── Convert {#each} ──
    t = t.replace(
        /\{#each\s+([\s\S]+?)\s+as\s+(\w+)(?:\s*,\s*(\w+))?\}\s*\n(\s*)<(\w+)/g,
        (_, arr, item, idx, indent, tag) => {
            const keyExpr = idx || item;
            if (idx)
                return `${indent}<${tag} v-for="(${item}, ${idx}) in ${arr}" :key="${keyExpr}"`;
            return `${indent}<${tag} v-for="${item} in ${arr}" :key="${keyExpr}"`;
        },
    );
    t = t.replace(/^\s*\{\/each\}\s*$/gm, "");

    // ── Convert bind: directives ──
    t = t.replace(/bind:value=\{draft\}/g, 'v-model="draft"');
    t = t.replace(/bind:value=\{(\w+)\}/g, 'v-model="$1"');
    t = t.replace(/bind:value\b/g, 'v-model="modelValue"');
    t = t.replace(/bind:checked\b/g, 'v-model="checked"');

    // bind:open on <details> needs special handling
    t = t.replace(/bind:open\b/g, ':open="open"');

    // bind:this={ref} → ref="ref"
    // If the variable already ends in Ref, don't add another Ref suffix
    t = t.replace(/bind:this=\{(\w+)\}/g, (_, varName) => {
        return `ref="${varName}"`;
    });

    // ── Convert event handlers ──
    // Handle multiline onclick/onkeydown/etc
    // onclick={() => (expr)} → @click="expr"
    t = t.replace(/on(\w+)=\{\(\)\s*=>\s*\(([^)]+)\)\}/g, '@$1="$2"');
    // onclick={() => { stmts }} → @click="() => { stmts }"
    t = t.replace(/on(\w+)=\{\(\)\s*=>\s*\{([^}]+)\}\}/g, '@$1="() => { $2 }"');
    // onclick={() => expr} → @click="expr"
    t = t.replace(/on(\w+)=\{\(\)\s*=>\s*([^}]+)\}/g, '@$1="$2"');
    // onclick={(e) => handler(idx, e)} → @click="(e: any) => handler(idx, e)"
    t = t.replace(/on(\w+)=\{\((\w+)\)\s*=>\s*([^}]+)\}/g, '@$1="($2: any) => $3"');
    // onclick={handler} → @click="handler"
    t = t.replace(/on(\w+)=\{(\w+)\}/g, '@$1="$2"');

    // ── Convert standalone event handler shorthands ──
    // {onclick} → (remove — let Vue's inheritAttrs pass events through)
    // {onkeydown} → @keydown="onkeydown" if function exists in component
    const funcNames = parsed.functions
        .map((f) => {
            const m = f.text.match(/function\s+(\w+)/);
            return m ? m[1] : "";
        })
        .filter(Boolean);

    t = t.replace(/(\s)\{(on\w+)\}(?=[\s/>])/g, (_, ws, eventProp) => {
        // Convert on* shorthand: {onkeydown} → @keydown="onkeydown"
        const eventName = eventProp.slice(2); // strip "on" prefix
        const isDefinedFunc = funcNames.includes(eventProp);
        if (isDefinedFunc) {
            return `${ws}@${eventName}="${eventProp}"`;
        }
        // Passthrough event — remove, let inheritAttrs handle it
        return "";
    });

    // ── Convert named attributes with expressions ──
    // attr={expr} → :attr="expr"
    // Must come after event handler conversion
    // Replace inner double quotes with single quotes to avoid breaking Vue template
    t = t.replace(/([\w-]+)=\{([^}]+)\}/g, (_, attr, expr) => {
        const safeExpr = expr.replace(/"/g, "'");
        return `:${attr}="${safeExpr}"`;
    });

    // ── Convert standalone attribute shorthands ──
    // {propName} inside a tag → :propName="propName"
    // Match {word} preceded by whitespace (attribute position)
    t = t.replace(/(\s)\{(\w+)\}(?=[\s/>])/g, (_, ws, prop) => {
        return `${ws}:${prop}="${prop}"`;
    });

    // ── Convert text interpolation ──
    // {expr} between > and < → {{ expr }}
    // After all attribute conversions, remaining {expr} in text contexts
    // First pass: convert single-brace text interpolation to double-brace
    t = t.replace(/>([^<]*)</g, (match, textContent) => {
        // Convert all {expr} to {{ expr }} within text nodes
        // But skip already-converted {{ expr }}
        const converted = textContent.replace(/\{([^{}]+?)\}/g, (m, expr) => {
            return `{{ ${expr} }}`;
        });
        return `>${converted}<`;
    });

    // ── Fix bindable prop references in template ──
    // For bindable `value` → renamed to `modelValue` in script, fix template refs
    for (const b of parsed.bindables) {
        if (b.name === "value") {
            // Replace standalone "value" references in attribute bindings
            // :aria-valuenow="value" → :aria-valuenow="modelValue"
            // But NOT :value="digits[index]" (contains more than just "value")
            t = t.replace(/:(\w[\w-]*)="value"/g, ':$1="modelValue"');
            // {{ value }} → {{ modelValue }}
            t = t.replace(/\{\{\s*value\s*\}\}/g, "{{ modelValue }}");
            // But DON'T replace v-model="modelValue" (already correct)
        }
    }

    // ── Fix :on* attributes that slipped through ──
    // :onclick="onclick" → remove (let attrs handle)
    // :onkeydown="onkeydown" → @keydown="onkeydown" if defined function
    t = t.replace(/:on(\w+)="(\w+)"/g, (_, event, handler) => {
        if (funcNames.includes(handler)) {
            return `@${event}="${handler}"`;
        }
        // Remove passthrough event handler attributes
        return "";
    });

    // ── Convert .svelte → .vue in comments ──
    t = t.replace(/\.svelte(\s*-->)/g, ".vue$1");

    // ── Clean up multiple blank lines ──
    t = t.replace(/\n{3,}/g, "\n\n");

    // Ensure proper indentation (add 4 spaces to all lines)
    const lines = t.split("\n").filter((l) => l.trim() !== "");
    const indented = lines.map((l) => `    ${l}`).join("\n");

    return indented;
}

// ─── Test file conversion ───────────────────────────────────────────────

function convertTest(content, filename = "") {
    let t = content;

    // Import changes
    t = t.replace(/@testing-library\/svelte/g, "@testing-library/vue");
    t = t.replace(/\.svelte"/g, '.vue"');

    // Remove ALL snippet-related comments
    t = t.replace(/\/\/ Helper.*?\n/g, "");

    // ── Step 0: Detect snippet function HTML patterns before removing them ──
    // Analyze the snippet function bodies to determine what HTML they create
    const snippetHtmlMap = detectSnippetHtml(content);

    // Remove ALL snippet function definitions using brace-counting
    t = removeSnippetFunctions(t);

    // Remove snippet variable assignments: const multiSnippet = ...;
    t = t.replace(/const\s+\w+Snippet\s*=[\s\S]*?;\s*\n/g, "");

    // ── Step 1: Convert snippet calls to appropriate HTML slot content ──
    // children: textSnippet("text") → children: "text"
    // children: trSnippet("Name") → children: "<tr><th>Name</th></tr>"
    t = t.replace(/children:\s*(\w+)\("([^"]*)"\)/g, (_, fnName, text) => {
        const template = snippetHtmlMap[fnName];
        if (template) {
            return `children: "${template.replace("TEXT", text)}"`;
        }
        return `children: "${text}"`;
    });
    // children: anySnippet() with no args → use the no-arg template
    t = t.replace(/children:\s*(\w+)\(\)/g, (_, fnName) => {
        const template = snippetHtmlMap[fnName + "_noarg"];
        if (template) {
            return `children: "${template}"`;
        }
        return `children: ""`;
    });
    // children: variableSnippet → children: ""
    t = t.replace(/children:\s*\w+Snippet\b/g, 'children: ""');

    // ── Step 2: Move children from props to slots in render() calls ──
    // Handle multiline: render(Subject, { props: {\n  type: "error",\n  children: "text",\n}})
    // Allow optional comma between closing braces: },\n})
    t = t.replace(
        /render\((\w+),\s*\{\s*props:\s*\{([\s\S]*?)\}\s*,?\s*\}\)/g,
        (match, component, propsContent) => {
            const childrenMatch = propsContent.match(/children:\s*"([^"]*)"/);
            if (!childrenMatch) return match;

            const text = childrenMatch[1];
            // Remove children from props
            let cleanProps = propsContent
                .replace(/,?\s*children:\s*"[^"]*"\s*,?/g, (m) => {
                    // If surrounded by commas, keep one
                    const hasCommaBefore = m.trimStart().startsWith(",");
                    const hasCommaAfter = m.trimEnd().endsWith(",");
                    return hasCommaBefore && hasCommaAfter ? "," : "";
                })
                .trim()
                .replace(/^\s*,|,\s*$/g, "")
                .trim();

            if (cleanProps) {
                return `render(${component}, { props: { ${cleanProps} }, slots: { default: "${text}" } })`;
            }
            return `render(${component}, { slots: { default: "${text}" } })`;
        },
    );

    // ── Step 3: Move children from wrapper function calls ──
    // renderInList({ children: "Task" }) → renderInList({}, "Task")
    // renderInList({ children: "Done", checked: true }) → renderInList({ checked: true }, "Done")
    t = t.replace(
        /(\w+)\(\{([^}]*?)children:\s*"([^"]*)"([^}]*?)\}\)/g,
        (match, funcName, before, text, after) => {
            if (funcName === "render") return match; // handled in step 2
            let props = (before + after)
                .trim()
                .replace(/,\s*,/g, ",")
                .replace(/^\s*,|,\s*$/g, "")
                .trim();
            if (props) {
                return `${funcName}({ ${props} }, "${text}")`;
            }
            return `${funcName}({}, "${text}")`;
        },
    );

    // ── Step 4: Rewrite wrapper render functions to accept slot content ──
    // function renderInList(props: Record<string, unknown>) {
    //     ... render(Component, { props, target: ol }) ...
    // }
    // → function renderInList(props: Record<string, unknown>, slotContent?: string) {
    //     ... render(Component, { props, ...(slotContent != null ? { slots: { default: slotContent } } : {}), target: ol }) ...
    // }
    t = t.replace(
        /function (\w+)\(props:\s*Record<string,\s*unknown>\)\s*\{([\s\S]*?)render\((\w+),\s*\{\s*props(,\s*target:\s*\w+)?\s*\}\)/g,
        (match, funcName, body, component, targetStr) => {
            targetStr = targetStr || "";
            return `function ${funcName}(props: Record<string, unknown>, slotContent?: string) {${body}render(${component}, { props, ...(slotContent != null ? { slots: { default: slotContent } } : {})${targetStr} })`;
        },
    );

    // Convert onclick → onClick (Vue convention) for event handler props in tests
    t = t.replace(/\bonclick:/g, "onClick:");
    t = t.replace(/\bonfocus:/g, "onFocus:");
    t = t.replace(/\bonblur:/g, "onBlur:");
    t = t.replace(/\bonchange:/g, "onChange:");
    t = t.replace(/\bonsubmit:/g, "onSubmit:");
    t = t.replace(/\bonkeydown:/g, "onKeydown:");
    t = t.replace(/\boninput:/g, "onInput:");
    t = t.replace(/\bonsuccess:/g, "onSuccess:");
    t = t.replace(/\bonerror:/g, "onError:");

    return t;
}

// Helper: Remove snippet function definitions using brace-counting
function removeSnippetFunctions(text) {
    const lines = text.split("\n");
    const result = [];
    let inSnippet = false;
    let braceDepth = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!inSnippet && /^\s*function\s+\w+Snippet\b/.test(line)) {
            inSnippet = true;
            braceDepth = 0;
            for (const ch of line) {
                if (ch === "{") braceDepth++;
                if (ch === "}") braceDepth--;
            }
            if (braceDepth <= 0) inSnippet = false;
            continue; // skip this line
        }
        if (inSnippet) {
            for (const ch of line) {
                if (ch === "{") braceDepth++;
                if (ch === "}") braceDepth--;
            }
            if (braceDepth <= 0) inSnippet = false;
            continue; // skip this line
        }
        result.push(line);
    }
    return result.join("\n");
}

// Helper: Detect snippet function HTML patterns from source code
function detectSnippetHtml(source) {
    const map = {};
    // Find all snippet function definitions and analyze their DOM creation
    const funcRegex = /function\s+(\w+Snippet)\s*\(([^)]*)\)\s*\{([\s\S]*?)\n\}/g;
    let m;
    while ((m = funcRegex.exec(source)) !== null) {
        const [, name, params, body] = m;
        const hasTextParam = /text/.test(params);

        // Find createElement calls
        const elements = [];
        const createRegex = /createElement\("(\w+)"\)/g;
        let cm;
        while ((cm = createRegex.exec(body)) !== null) {
            elements.push(cm[1]);
        }

        // Find setAttribute calls for role
        const attrRegex = /\.setAttribute\("(\w+)",\s*"([^"]*)"\)/g;
        const attrs = {};
        while ((cm = attrRegex.exec(body)) !== null) {
            attrs[cm[1]] = cm[2];
        }

        if (elements.length === 0) {
            // textSnippet-like: just createTextNode
            map[name] = "TEXT";
        } else if (elements.length === 1) {
            // Single element: <tag>text</tag>
            const tag = elements[0];
            let attrStr = "";
            for (const [k, v] of Object.entries(attrs)) {
                attrStr += ` ${k}=&quot;${v}&quot;`;
            }
            if (hasTextParam) {
                map[name] = `<${tag}${attrStr}>TEXT</${tag}>`;
            } else {
                // No-arg: extract textContent
                const textMatch = body.match(/textContent\s*=\s*"([^"]*)"/);
                const text = textMatch ? textMatch[1] : "";
                map[name + "_noarg"] = `<${tag}${attrStr}>${text}</${tag}>`;
            }
        } else if (elements.length === 2) {
            // Parent + child: <parent><child>text</child></parent>
            // Detect which is parent (has appendChild) and which is child
            const appendMatch = body.match(/(\w+)\.appendChild\((\w+)\)/);
            if (appendMatch) {
                const parentVar = appendMatch[1];
                const childVar = appendMatch[2];
                // Find which element each var refers to
                const varMap = {};
                const assignRegex = /const\s+(\w+)\s*=\s*document\.createElement\("(\w+)"\)/g;
                while ((cm = assignRegex.exec(body)) !== null) {
                    varMap[cm[1]] = cm[2];
                }
                const parentTag = varMap[parentVar] || elements[0];
                const childTag = varMap[childVar] || elements[1];
                if (hasTextParam) {
                    map[name] = `<${parentTag}><${childTag}>TEXT</${childTag}></${parentTag}>`;
                }
            } else {
                // Fallback
                map[name] =
                    `<${elements[0]}><${elements[1]}>TEXT</${elements[1]}></${elements[0]}>`;
            }
        }

        // Handle no-arg snippets that create multiple elements (like menuItemsSnippet)
        if (!hasTextParam && elements.length > 1) {
            // Complex snippet with multiple elements - extract all content
            const items = [];
            const textMatches = body.matchAll(/(\w+)\.textContent\s*=\s*"([^"]*)"/g);
            for (const tm of textMatches) {
                // Find the element tag for this variable
                const varTag = body.match(
                    new RegExp(`const\\s+${tm[1]}\\s*=\\s*document\\.createElement\\("(\\w+)"\\)`),
                );
                const tag = varTag ? varTag[1] : "div";
                let attrStr = "";
                // Find setAttribute for this var
                const attrMatches = body.matchAll(
                    new RegExp(`${tm[1]}\\.setAttribute\\("(\\w+)",\\s*"([^"]*)"\\)`, "g"),
                );
                for (const am of attrMatches) {
                    attrStr += ` ${am[1]}=&quot;${am[2]}&quot;`;
                }
                items.push(`<${tag}${attrStr}>${tm[2]}</${tag}>`);
            }
            if (items.length > 0) {
                map[name + "_noarg"] = items.join("");
            }
        }
    }
    return map;
}

console.log("Conversion complete!");
