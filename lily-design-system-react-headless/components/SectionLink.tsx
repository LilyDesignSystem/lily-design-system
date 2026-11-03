// SectionLink component
//
// A link to a section of the page. Renders an <a> with the `section-link` hook; pass the section
// anchor as href through restProps.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Accessible name, rendered as aria-label (it replaces the link text as the name; keep the visible text in it).
//   href — passed through restProps; unlike the Svelte port there is no "#top" default, so always pass one.
//   children — React.ReactNode, required. The content.
//   ...restProps — additional HTML attributes spread onto the root <a>.
//
// Syntax:
//   <SectionLink href="…">…</SectionLink>
//
// Examples:
//   <SectionLink href="#methods">Methods</SectionLink>
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
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog defaults href to "#top" and does not render `label`; this React component does the opposite (the Svelte one is canonical)
//
// References:
//   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

export interface SectionLinkProps {
    className?: string;
    label?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function SectionLink({
    className = "",
    label = undefined,
    children,
    ...restProps
}: SectionLinkProps) {
    return (
        <a
            className={`section-link ${className}`}
            aria-label={label}
            {...restProps}
        >
            {children}
        </a>
    );
}
