// ThemeProvider component
//
// Applies a theme object to the consumer's content by flattening the
// object's nested keys into CSS custom properties on a wrapping <div>.
// The wrapper uses display: contents (set inline so consumer doesn't have
// to opt in) so it doesn't affect layout — the children render in place
// but inherit the CSS variables.
//
// Nested ThemeProviders override parent variables only for the keys they
// declare, since CSS custom property inheritance handles the rest.
//
// Props:
//   class — string, optional. CSS class name.
//   theme    — record, required. Theme object with nested keys; flattened
//              into CSS custom properties named --theme-{path}.
//   base     — "light" | "dark", default "light". Reflected as data-theme.
//   children — ReactNode, required. Themed content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Claude rules:
//   - Headless: no CSS, no styles — but applies inline `display: contents`
//     and inline CSS custom properties (the variables themselves)

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface ThemeProviderProps {
    class?: string;
    /** Theme object with nested keys; flattened into CSS custom properties. */
    theme: Record<string, unknown>;
    /** Base theme to merge with. */
    base?: "light" | "dark";
    /** Themed content. */
    children: JSX.Element;
    [key: string]: unknown;
}

function flatten(obj: Record<string, unknown>, prefix: string = "--theme"): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
        const k = `${prefix}-${key}`;
        if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(out, flatten(value as Record<string, unknown>, k));
        } else if (value !== undefined && value !== null) {
            out[k] = String(value);
        }
    }
    return out;
}

export default function ThemeProvider(props: ThemeProviderProps) {
    const p = withDefaults({ class: "" as const, base: "light" as const }, props);
    const restProps = omit(p, "class", "theme", "base", "children");
    const cssVars = () => flatten(p.theme);
    const style = () => ({ display: "contents", ...cssVars() }) as JSX.CSSProperties;
    return (
        <div
            class={`theme-provider ${p.class}`}
            data-theme={attr(p.base)}
            style={style()}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
