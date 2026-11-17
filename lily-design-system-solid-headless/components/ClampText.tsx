// ClampText component
//
// A headless text container that truncates content to a maximum number of
// visible lines. The full content remains in the DOM and accessible to screen
// readers; the visual line clamp is implemented by consumer CSS reading the
// data-lines attribute or the inline --clamp-text-lines custom property.
//
// Props:
//   class — string, optional. CSS class name.
//   lines     — number, default 2. Maximum number of visible lines.
//   label     — string, optional. aria-label for screen readers.
//   children  — ReactNode, required. The text content to clamp.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <ClampText lines={3}>Long text content...</ClampText>
//
// Examples:
//
//   <ClampText lines={2}>
//     A long description that should be truncated to two visible lines.
//   </ClampText>
//
//
//   <ClampText lines={4} label="Product description">
//     Detailed product description text...
//   </ClampText>
//
// Keyboard: None — passive content container.
//
// Accessibility:
//   - Full text content remains in the DOM (not visually hidden)
//   - Optional aria-label override via label prop
//   - data-lines attribute exposed for consumer CSS
//
// Internationalization:
//   - All text supplied by consumer via children
//   - Optional label prop allows localized aria-label
//
// Claude rules:
//   - Headless: no CSS, no overflow rules — consumer applies line-clamp
//   - Inline style only sets --clamp-text-lines custom property
//
// References:
//   - CSS line-clamp: https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface ClampTextProps {
    class?: string;
    /** Maximum number of visible lines */
    lines?: number;
    /** Accessible label for screen readers */
    label?: string;
    /** Content to clamp */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ClampText(props: ClampTextProps) {
    const p = withDefaults({ class: "" as const, lines: 2 }, props);
    const restProps = omit(p, "class", "lines", "label", "children");
    return (
        <div
            class={`clamp-text ${p.class}`}
            data-lines={attr(p.lines)}
            style={{ "--clamp-text-lines": p.lines } as JSX.CSSProperties}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
