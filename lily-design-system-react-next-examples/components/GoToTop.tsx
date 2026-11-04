import { warnMissingName } from "./dev-warning";
// GoToTop component
//
// A link back to the top of the page. Renders an <a> with the `go-to-top` hook; pass href="#top" (or
// another target) through restProps.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name, rendered as aria-label (it replaces the link text as the name; keep the visible text in it).
//   href — passed through restProps; unlike the Svelte port there is no "#top" default, so always pass one.
//   children — React.ReactNode, required. The content.
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
    className?: string;
    label: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function GoToTop({ className = "", label, children, ...restProps }: GoToTopProps) {
    warnMissingName("GoToTop", label, restProps["aria-label"], restProps["aria-labelledby"]);
    return (
        <a
            className={`go-to-top ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </a>
    );
}
