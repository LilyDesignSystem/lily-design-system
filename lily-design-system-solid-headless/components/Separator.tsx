// Separator component
//
// A headless visual and semantic divider that renders an <hr> element with
// an explicit role="separator". Used between sections of a page, groups of
// menu items, or distinct areas of a form to organize content into logical
// groups and improve visual hierarchy.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, default undefined. Optional accessible label describing the separation.
//   ...restProps — additional HTML attributes spread onto the <hr>.
//
// Syntax:
//   <Separator />
//
// Examples:
//
//   <Separator label="End of introduction" />
//
//
//   <Separator label="Section break" data-section="divider" />
//
// Keyboard:
//   - None — the <hr> element is not focusable and does not receive keyboard input.
//
// Accessibility:
//   - role="separator" explicitly identifies the element as a section divider
//   - aria-label provides optional descriptive context for screen readers
//
// Internationalization:
//   - The optional label prop externalizes the separator description for localization
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - The <hr> is a void element — no children or closing tag
//   - Label is optional; when undefined, aria-label is not rendered
//
// References:
//   - WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator
//   - MDN hr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr

import { merge, omit } from "solid-js";
export interface SeparatorProps {
    class?: string;
    /** Optional accessible label. */
    label?: string;
    [key: string]: unknown;
}

export default function Separator(props: SeparatorProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label");
    return (
        <hr
            class={`separator ${p.class}`}
            role="separator"
            aria-label={p.label}
            {...restProps}
        />
    );
}
