// Character component
//
// A headless component for displaying a single character, glyph, symbol, or
// emoji with proper accessibility semantics. When the character conveys meaning
// (like a checkmark for success), it uses role="img" with aria-label. When
// purely decorative, it hides from assistive technologies. Useful for initials,
// status indicators, rating symbols, and decorative flourishes.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Accessible description of the character for screen readers.
//   decorative — boolean, default false. When true, hides the character from assistive technology.
//   children — ReactNode, required. The character to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <Character label="Check mark">✓</Character>
//
// Examples:
//
//   <Character label="Warning symbol">⚠</Character>
//
//
//   <Character decorative>★</Character>
//
// Keyboard:
//   None — this component is a passive display element.
//
// Accessibility:
//   - role="img" when the character is meaningful (decorative is false)
//   - role="presentation" when decorative is true, removing semantic meaning
//   - aria-label provides the accessible name for meaningful characters
//   - aria-hidden="true" when decorative, hiding from the accessibility tree
//
// Internationalization:
//   - Label text comes through the label prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Always provide a label when the character conveys meaning
//   - Use decorative=true for purely visual characters
//
// References:
//   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface CharacterProps {
    class?: string;
    label?: string;
    decorative?: boolean;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Character(props: CharacterProps) {
    const p = withDefaults({ class: "" as const, decorative: false }, props);
    const restProps = omit(p, "class", "label", "decorative", "children");
    return (
        <span
            class={`character ${p.class}`}
            role={p.decorative ? "presentation" : "img"}
            aria-label={p.decorative ? undefined : p.label}
            aria-hidden={attr(p.decorative ? "true" : undefined)}
            {...restProps}
        >
            {p.children}
        </span>
    );
}
