import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";
// GoToTop component
//
// A link back to the top of the page. Renders an <a> with the `go-to-top` hook; pass href="#top" (or
// another target) through restProps.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name, rendered as aria-label (it replaces the link text as the name; keep the visible text in it).
//   href — passed through restProps; unlike the Svelte port there is no "#top" default, so always pass one.
//   children — JSX.Element, required. The content.
//   ...restProps — additional HTML attributes spread onto the root <a>.
//
// Syntax:
//   <GoToTop href="…">…</GoToTop>
//
// Examples:
//   <GoToTop href="#top">Back to top</GoToTop>
//
// Keyboard:
//   - Tab: moves focus onto the link
//   - Enter: follows the link (native browser behaviour)
//
// Accessibility:
//   - A native <a>; pass href through restProps
//   - aria-label, when given, replaces the visible text as the accessible name and must contain it (WCAG 2.5.3)
//
// Internationalization:
//   - The link text is the consumer's children; no hardcoded text
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

export interface GoToTopProps {
    class?: string;
    label: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function GoToTop(props: GoToTopProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    warnMissingName("GoToTop", p.label, p["aria-label"], p["aria-labelledby"]);
    return (
        <a
            class={`go-to-top ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </a>
    );
}
